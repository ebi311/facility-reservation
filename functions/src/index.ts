import express from 'express';
import * as functions from 'firebase-functions';
// import auth from './auth';
import facilities from './facilities';
import reservations from './reservations';
import samples from './samples';
import { Timestamp } from '@google-cloud/firestore';
import morgan from 'morgan';

// import session from 'express-session';

const app = express();

app.use(morgan('dev'));

app.set('json replacer', (key: string, value: never) => {
  if (typeof value['toDate'] !== 'function') return value;
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
// app.use(auth);
app.use('/api/facilities/', facilities);
app.use('/api/reservations/', reservations);
app.get('/api/version/', (req, res) => {
  res.send('1.0.0');
});
app.use('/api/samples/', samples);

export const fn = functions.https.onRequest(app);
