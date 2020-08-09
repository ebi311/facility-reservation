import {
  Firestore,
  FirestoreDataConverter,
  Timestamp,
} from '@google-cloud/firestore';
import dayjs, { Dayjs } from 'dayjs';
import express from 'express';
import { Request, Response } from 'express-serve-static-core';
import { body, CustomValidator, validationResult } from 'express-validator';
import IReservation from './models/IReservation';
import { CustomReqType } from './CustomRequest';

const firestore = new Firestore();

type IdParamType = {
  id: string;
};

type DateQueryType = {
  date: string;
};

const getReservationList = async (_startDate: Dayjs) => {
  const startDate = dayjs(_startDate);
  const endDate = dayjs(startDate).add(24, 'hour');
  const docsRef = getCollection()
    .where('startDate', '>=', startDate.toDate())
    .where('startDate', '<', endDate.toDate());
  const docsSnapshot = await docsRef.get();
  return docsSnapshot.docs.map(a => ({ ...a.data(), id: a.id }));
};

const app = express();

const collectionName = 'reservations';

const converter: FirestoreDataConverter<IReservation> = {
  fromFirestore: data => {
    const fromData = ({ ...data } as unknown) as IReservation;
    fromData.startDate = dayjs((data.startDate as Timestamp).toDate());
    fromData.endDate = dayjs((data.endDate as Timestamp).toDate());
    const system = fromData.system;
    system.createDate = dayjs((data.system.createDate as Timestamp).toDate());
    system.lastUpdate = dayjs((data.system.lastUpdate as Timestamp).toDate());
    return fromData as IReservation;
  },
  toFirestore: obj => {
    const toObj = ({ ...obj } as unknown) as IReservation;
    delete toObj.id;
    return toObj;
  },
};

const getCollection = () =>
  firestore.collection(collectionName).withConverter(converter);

const _private = {
  getById: async (req: Request<IdParamType>, res: Response) => {
    const doc = await getCollection().doc(req.params.id).get();
    const reservation = doc.data();
    if (!reservation) {
      return res.status(404).end();
    }
    reservation.id = doc.id;
    res.send(reservation).end();
  },
  get: async (
    req: Request<never, unknown, unknown, DateQueryType>,
    res: Response,
  ) => {
    const startDate = dayjs(req.query.date);
    if (!startDate.isValid()) {
      return res.status(400).end();
    }
    const docs = await getReservationList(startDate).catch(e => {
      res.status(500).send(e).end();
    });
    if (!docs) return;
    res.send(docs).end();
  },
  post: async (
    req: Request<never, IReservation, IReservation, never>,
    res: Response,
  ) => {
    const user = ((req as unknown) as CustomReqType).user;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() }).end();
    }
    const now = new Date();
    const newDoc = { ...req.body };
    newDoc.startDate = new Date(req.body.startDate as Date);
    newDoc.endDate = new Date(req.body.endDate as Date);
    newDoc.system = {
      createDate: now,
      createUser: user,
      lastUpdate: now,
      lastUpdateUser: user,
    };
    const result = await getCollection().add(newDoc);
    const savedDoc = (await result.get()).data();
    res.send(savedDoc);
  },
  put: async (
    req: Request<IdParamType, IReservation, Partial<IReservation>, never>,
    res: Response,
  ) => {
    const user = ((req as unknown) as CustomReqType).user;
    const { id } = req.params;
    const oldDocSnapshot = await getCollection().doc(id).get();
    const oldDoc = oldDocSnapshot.data();
    delete req.body.id;
    if (!oldDoc) {
      return res.status(404).end();
    }
    const doc: IReservation = {
      ...oldDoc,
      ...req.body,
    };
    doc.startDate = dayjs(doc.startDate);
    doc.endDate = dayjs(doc.endDate);
    doc.system.lastUpdate = dayjs();
    doc.system.lastUpdateUser = user;
    await getCollection().doc(id).set(doc);
    const updatedDocSnapshot = await getCollection().doc(id).get();
    res.send(updatedDocSnapshot.data()).end();
  },
  delete: async (
    req: Request<IdParamType, never, Partial<IReservation>, never>,
    res: Response,
  ) => {
    const { id } = req.params;
    await getCollection().doc(id).delete();
    return res.status(204).send().end();
  },
};

const getDuplicate = (
  reservations: IReservation[],
  facilityId: string,
  reservationId: string,
  endDate: Dayjs,
  startDate: Dayjs,
) => {
  const exist = reservations
    .filter(f => {
      return f.facilityId === facilityId;
    })
    .find(f => {
      if (reservationId === f.id) return false;
      if (endDate <= f.startDate) return false;
      if (startDate >= f.endDate) return false;
      return true;
    });
  return exist;
};

const isVacant: CustomValidator = async (value: string, { req }) => {
  const startDate = dayjs(value);
  const body = req.body as IReservation;
  const endDate = dayjs(body.endDate);
  const reservationId = body.id;
  const facilityId = body.facilityId;
  const reservations = await getReservationList(startDate);
  if (!reservations) return;
  // 重複している他の予約を検索する
  const result = getDuplicate(
    reservations,
    facilityId,
    reservationId,
    endDate,
    startDate,
  );
  // 他の予約が見つかったら重複しているので、`false`を返す
  if (!!result) throw new Error('重複しています。');
};

app.get('/:id', _private.getById);
app.get('/', _private.get);
app.post(
  '/',
  [
    body('subject').notEmpty().withMessage('必須です。'),
    body('facilityId').notEmpty().withMessage('必須です。'),
    body('startDate').isISO8601().custom(isVacant),
    body('endDate').isISO8601(),
  ],
  _private.post,
);
app.put('/:id', _private.put);
app.delete('/:id', _private.delete);

export default app;
