import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  FirestoreDataConverter,
} from '@google-cloud/firestore';
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import IFacility from './status/IFacility';

const firestore = new Firestore();

type IdParamType = {
  id: string;
};

const app = express();

const collectionName = 'facilities';

const converter: FirestoreDataConverter<IFacility> = {
  fromFirestore: data => {
    return data as IFacility;
  },
  toFirestore: obj => {
    delete obj.id;
    return obj;
  },
};

const getCollection = () =>
  firestore.collection(collectionName).withConverter(converter);

export const getDocById = async (
  id: string,
): Promise<
  [
    IFacility | null,
    DocumentSnapshot<DocumentData>,
    DocumentReference<DocumentData>,
  ]
> => {
  const docRef = getCollection().doc(id);
  const doc = await docRef.get();
  const data = doc.data();
  if (!doc.exists || !data) {
    return [null, doc, docRef];
  }
  data.id = doc.id;
  return [data, doc, docRef];
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const __private = {
  getById: async (req: Request<IdParamType>, res: Response): Promise<void> => {
    const [data] = await getDocById(req.params.id);
    if (!data) {
      return res.status(404).end();
    }
    res.json(data);
  },
  get: async (req: Request, res: Response): Promise<void> => {
    const snapshots = await getCollection().get();
    const result: unknown[] = [];
    snapshots.forEach(snapshot => {
      const data = snapshot.data();
      data.id = snapshot.id;
      result.push(data);
    });
    res.json(result);
  },
  post: async (req: Request, res: Response): Promise<void> => {
    // const user = firebase.auth().currentUser;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() }).end();
    }
    const now = new Date();
    const addData: IFacility = {
      ...req.body,
      system: {
        createUser: '',
        createDate: now,
        lastUpdate: now,
        lastUpdateUser: '',
      },
    };
    const docRef = await firestore
      .collection(collectionName)
      .withConverter<IFacility>(converter)
      .add(addData)
      .catch(e => {
        console.error(e);
        res.status(500);
      });
    if (!docRef) return;
    const doc = await docRef.get();
    res.send(doc.id).end();
  },
  put: async (req: Request<IdParamType>, res: Response): Promise<void> => {
    // const user = firebase.auth().currentUser;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() }).end();
    }
    const now = new Date();
    const [oldData, , docRef] = await getDocById(req.params.id);
    if (!oldData) {
      return res.status(404).send().end();
    }
    const newDate: IFacility = {
      ...oldData,
      ...req.body,
      system: {
        ...oldData.system,
        lastUpdate: now,
        lastUpdateUser: '',
      },
    };
    const result = await docRef.set(newDate).catch(e => {
      console.error(e);
      res.status(500).send().end();
    });
    if (!result) return;
    res.status(204).send().end();
  },
  delete: async (req: Request<IdParamType>, res: Response): Promise<void> => {
    const [, , docRef] = await getDocById(req.params.id);
    const result = await docRef.delete().catch(e => {
      console.error(e);
      res.status(500).send().end();
    });
    if (!result) return;
    res.status(204).send().end();
  },
};

app.get('/:id', __private.getById);

app.get('/', __private.get);

app.post(
  '/',
  [body('name').notEmpty().withMessage('必須です')],
  __private.post,
);

app.put(
  '/:id',
  [body('name').notEmpty().optional().withMessage('必須です。')],
  __private.put,
);

app.delete('/:id', __private.delete);

export default app;
