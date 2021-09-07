import express, { Request, Response } from 'express';
import { Firestore } from '@google-cloud/firestore';
import { ISystem } from './models/ISystem';
import { IFacility } from './models/IFacility';
import { body, param, validationResult } from 'express-validator';
import { CustomReqType } from './models/CustomReqType';

const app = express();

const firestore = new Firestore();
const getCollection = () => firestore.collection('facilities');

app.get('/', async (req, res, next) => {
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
  const data = snapshot.data() as IFacility;
  data.id = docRef.id;
  res.json(data);
});

app.post(
  '/',
  [body('name').isString().trim().notEmpty(), body('note').isString()],
  async (req: Request, res: Response) => {
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
    const docRef = await getCollection().add(addData);
    const snapshot = await docRef.get();
    res.json({ id: snapshot.id });
  },
);

app.put(
  '/:id',
  [
    body('name').isString().trim().notEmpty(),
    body('note').isString(),
    param('id').notEmpty(),
  ],
  async (req: Request, res: Response) => {
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
    docRef.update(newData);
    res.status(204).send();
  },
);

app.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const docRef = getCollection().doc(id);
  await docRef.delete();
  res.status(204).send();
});
export default app;
