import express, { NextFunction, Request, Response } from 'express';
import { DocumentReference, Firestore } from '@google-cloud/firestore';
import { IReservation } from './models/IReservation';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';
import { ISystem } from './models/ISystem';
import { IFacility } from './models/IFacility';
import { body, param, validationResult } from 'express-validator';
import { CustomReqType } from './models/CustomReqType';

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.tz.setDefault('Asia/Tokyo');

const firestore = new Firestore();
const getCollection = () => firestore.collection('reservations');

const app = express();

app.get('/', async (req, res, next) => {
  const dateString = req.query.date as string;
  const date = dayjs(dateString);
  if (!date.isValid()) {
    res.status(400).json({ message: 'date が必要です' });
    return;
  }
  const begin = date.tz().startOf('day');
  const end = date.tz().add(1, 'day').startOf('day');

  const snapshot = await getCollection()
    .where('startDate', '>=', begin.toDate())
    .where('startDate', '<=', end.toDate())
    .get()
    .catch((e) => {
      next(e);
    });
  if (!snapshot) return;
  const reservations = snapshot.docs.map((doc) => {
    const data = doc.data() as IReservation;
    data.id = doc.id;
    return data;
  });
  res.json(reservations);
});

app.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  const docRef = getCollection().doc(id);
  const snapshot = await docRef.get().catch((e) => {
    next(e);
  });
  if (!snapshot) return;
  if (!snapshot.exists) {
    res.status(404).send();
    return;
  }
  const data = snapshot.data() as IReservation;
  data.id = docRef.id;
  res.json(data);
});

// 日付型は JSON にないので、文字列で受け取り変換する必要がある。
// これは、リクエストで受け取る 予約 JSON の型を定義している。
type RequestReservation = Omit<IReservation, 'startDate' | 'endDate'> & {
  startDate: string;
  endDate: string;
};

// DB に入っている型と、モデルの型には差異がある。
// これは、DBに入っている型を定義している。
type DbReservation = Omit<
  IReservation,
  'facilityId' | 'startDate' | 'endDate'
> & {
  facilityId: DocumentReference;
  startDate: Date;
  endDate: Date;
};

// リクエストのJSONを DB の型に変換する
const convertToDbType = (reqBody: RequestReservation): DbReservation => {
  const facility = firestore.doc('facilities/' + reqBody.facilityId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (reqBody as any).id;
  return {
    ...reqBody,
    facilityId: facility,
    startDate: new Date(reqBody.startDate),
    endDate: new Date(reqBody.endDate),
  };
};

app.post(
  '/',
  [
    body('subject').isString().trim().notEmpty(),
    body('description').isString(),
    body('startDate').notEmpty().isISO8601(),
    body('endDate').notEmpty().isISO8601(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const valid = validationResult(req);
    if (!valid.isEmpty()) {
      res.status(400).json({ errors: valid.array() });
      return;
    }
    const data = convertToDbType(req.body);
    const now = new Date();
    const { user } = req as CustomReqType;
    const addData = {
      ...data,
      system: {
        createDate: now,
        createUser: user,
        lastUpdate: now,
        lastUpdateUser: user,
      } as ISystem,
    };
    const docRef = await getCollection()
      .add(addData)
      .catch((e) => {
        next(e);
      });
    if (!docRef) return;
    const snapshot = await docRef.get().catch((e) => {
      next(e);
    });
    if (!snapshot) return;
    res.json({ id: snapshot.id });
  },
);

app.put(
  '/:id',
  [
    param('id').notEmpty(),
    body('subject').isString().trim().notEmpty(),
    body('description').isString(),
    body('startDate').notEmpty().isISO8601(),
    body('endDate').notEmpty().isISO8601(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const valid = validationResult(req);
    if (!valid.isEmpty()) {
      res.status(400).json({ errors: valid.array() });
      return;
    }

    const id = req.params.id;
    const data = convertToDbType(req.body);

    const docRef = getCollection().doc(id);
    const snapshot = await docRef.get().catch((e) => {
      next(e);
    });
    if (!snapshot) return;
    if (!snapshot.exists) {
      res.status(404).send();
      return;
    }
    const oldData = snapshot.data() as IFacility;
    const { user } = req as CustomReqType;
    const newData = {
      ...oldData,
      ...data,
      system: {
        ...oldData.system,
        lastUpdate: new Date(),
        lastUpdateUser: user,
      } as ISystem,
    };
    const result = await docRef.update(newData).catch((e) => {
      next(e);
    });
    if (!result) return;
    res.status(204).send().end();
  },
);

app.delete('/:id', async (req, res, next) => {
  const id = req.params.id;
  const docRef = getCollection().doc(id);
  const result = await docRef.delete().catch((e) => {
    next(e);
  });
  if (!result) return;
  res.status(204).send();
});

export default app;
