import express, { Request, Response } from 'express';
import { Firestore, Timestamp } from '@google-cloud/firestore';
import IFacility from './status/IFacility';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  FirestoreDataConverter,
  Query,
} from '@google-cloud/firestore';

const firestore = new Firestore();

const app = express();

app.set('json replacer', (key: string, value: never) => {
  if (typeof value['toDate'] !== 'function') return value;
  return (value as Timestamp).toDate().toISOString();
});

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

const getDocById = async (
  id: string,
): Promise<
  [
    IFacility | null,
    DocumentSnapshot<DocumentData>,
    DocumentReference<DocumentData>,
  ]
> => {
  const docRef = firestore
    .collection(collectionName)
    .doc(id)
    .withConverter<IFacility>(converter);
  const doc = await docRef.get();
  const data = doc.data();
  if (!doc.exists || !data) {
    return [null, doc, docRef];
  }
  data.id = doc.id;
  return [data, doc, docRef];
};

type IdParamType = {
  id: string;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const __private = {
  getById: async (req: Request<IdParamType>, res: Response): Promise<void> => {
    const [data] = await getDocById(req.params.id);
    if (!data) {
      return res.status(404).send().end();
    }
    res.json(data);
  },
  get: async (req: Request, res: Response): Promise<void> => {
    let query:
      | CollectionReference<IFacility>
      | Query<IFacility> = firestore
      .collection(collectionName)
      .withConverter<IFacility>(converter);
    if (req.query.name) {
      query = query
        .where('name', '>=', req.query.name)
        .where('name', '<=', req.query.name + '\uf8ff');
    }
    const snapshots = await query.get();
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

app.post('/', __private.post);

app.put('/:id', __private.put);

app.delete('/:id', __private.delete);

export default app;
