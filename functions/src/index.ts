import { Timestamp } from '@google-cloud/firestore';
import express from 'express';
import * as functions from 'firebase-functions';
import morgan from 'morgan';
import auth from './auth';
// import auth from './auth';
import facilities from './facilities';
import { setupFirebase } from './firebaseConfiguration';
import reservations from './reservations';
import samples from './samples';
// import session from 'express-session';

setupFirebase();

const app = express();

app.use(morgan('dev'));

app.set('json replacer', (key: string, value: never) => {
  if (!value || typeof value['toDate'] !== 'function') return value;
  return (value as Timestamp).toDate().toISOString();
});

// app.use(
//   session({
//     cookie: {
//       secure: true,
//     },
//     secret: '2020-07-09T23:00:30.409Z',
//     resave: false,
//     saveUninitialized: false,
//   }),
// );
app.use('/api/auth/', auth);
app.use('/api/facilities/', facilities);
app.use('/api/reservations/', reservations);
app.get('/api/version/', (req, res) => {
  res.send('1.0.0');
});
app.use('/api/samples/', samples);

export const fn = functions.https.onRequest(app);
