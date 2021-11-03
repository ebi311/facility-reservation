import express, { NextFunction, Request, Response } from 'express';
import { Firestore } from '@google-cloud/firestore';
import { ISystem } from './models/ISystem';
import { IFacility } from './models/IFacility';
import { body, param, validationResult } from 'express-validator';
import { CustomReqType } from './models/CustomReqType';

const app = express();

const firestore = new Firestore();
const getCollection = () => firestore.collection('facilities');

export const __private__ = {
  getList: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const snapshot = await getCollection()
      .get()
      .catch((e) => {
        next(e);
      });
    if (!snapshot) return;
    const facilities = snapshot.docs.map((doc) => {
      const data = doc.data() as IFacility;
      data.id = doc.id;
      return data;
    });
    res.json(facilities);
  },
  getById: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
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
    const data = snapshot.data() as IFacility;
    data.id = docRef.id;
    res.json(data);
  },
  post: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const valid = validationResult(req);
    if (!valid.isEmpty()) {
      res.status(400).json({ errors: valid.array() });
      return;
    }
    const data = req.body as IFacility;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (data as any).id;
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
    const snapshot = await docRef.get();
    res.json({ id: snapshot.id });
  },
  put: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const valid = validationResult(req);
    if (!valid.isEmpty()) {
      res.status(400).json({ errors: valid.array() });
      return;
    }
    const id = req.params.id;
    const data = req.body as IFacility;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (data as any).id;

    const docRef = getCollection().doc(id);
    const snapshot = await docRef.get();
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
      },
    };
    await docRef
      .update(newData)
      .then(() => {
        res.status(204).send();
      })
      .catch((e) => next(e));
  },
};

app.get('/', __private__.getList);

app.get('/:id', __private__.getById);

app.post('/', [
  body('name').isString().trim().notEmpty(),
  body('note').isString(),
  __private__.post,
]);

app.put('/:id', [
  body('name').isString().trim().notEmpty(),
  body('note').isString(),
  param('id').notEmpty(),
  __private__.put,
]);

app.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const docRef = getCollection().doc(id);
  await docRef.delete();
  res.status(204).send();
});
export default app;
