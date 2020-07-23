import { Firestore, FirestoreDataConverter } from '@google-cloud/firestore';
import express from 'express';
import { Request, Response } from 'express-serve-static-core';
import moment from 'moment';
import IReservation from './status/IReservation';

const firestore = new Firestore();

type IdParamType = {
  id: string;
};

type DateQueryType = {
  date: string;
};

const app = express();

const collectionName = 'reservations';

const converter: FirestoreDataConverter<IReservation> = {
  fromFirestore: data => {
    return data as IReservation;
  },
  toFirestore: obj => {
    delete obj.id;
    obj.startDate = new Date(obj.startDate);
    obj.endDate = new Date(obj.endDate);
    return obj;
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
    const startDate = moment(req.query.date);
    if (!startDate.isValid()) {
      return res.status(400).end();
    }
    const endDate = moment(startDate);
    startDate.startOf('day');
    endDate.endOf('day');
    try {
      const docsRef = getCollection()
        .where('startDate', '>=', startDate.toDate())
        .where('startDate', '<=', endDate.toDate());
      const docsSnapshot = await docsRef.get();
      const docs = docsSnapshot.docs.map(a => ({ ...a.data(), id: a.id }));
      res.send(docs).end();
    } catch (e) {
      console.error(e);
      return res.status(500).send(e).end();
    }
  },
  post: async (
    req: Request<never, IReservation, IReservation, never>,
    res: Response,
  ) => {
    const newDoc = req.body;
    newDoc.system = {
      createDate: new Date(),
      createUser: '',
      lastUpdate: new Date(),
      lastUpdateUser: '',
    };
    const result = await getCollection().add(newDoc);
    const savedDoc = (await result.get()).data();
    res.send(savedDoc);
  },
  put: async (
    req: Request<IdParamType, IReservation, Partial<IReservation>, never>,
    res: Response,
  ) => {
    const { id } = req.params;
    const oldDocSnapshot = await getCollection().doc(id).get();
    const oldDoc = oldDocSnapshot.data();
    delete req.body.id;
    if (!oldDoc) {
      return res.status(404).end();
    }
    const doc = {
      ...oldDoc,
      ...req.body,
    };
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
app.get('/:id', _private.getById);
app.get('/', _private.get);
app.post('/', _private.post);
app.put('/:id', _private.put);
app.delete('/:id', _private.delete);

export default app;
