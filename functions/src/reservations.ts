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
    console.log(req.query.date);
    const startDate = moment(req.query.date);
    if (!startDate.isValid()) {
      console.log('error');
      return res.status(400).end();
    }
    const endDate = moment(startDate);
    startDate.startOf('day');
    endDate.endOf('day');
    console.log(startDate);
    console.log(endDate);
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
};
app.get('/:id', _private.getById);
app.get('/', _private.get);

export default app;
