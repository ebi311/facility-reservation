import bodyParser from 'body-parser';
import express from 'express';
import * as functions from 'firebase-functions';
// import auth from './auth';
import facilities from './facilities';
import samples from './samples';

// import session from 'express-session';

const app = express();

app.use(
  bodyParser.json({
    reviver: (key, value) => {
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
        return new Date(value);
      } else {
        return value;
      }
    },
  }),
);
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
app.get('/api/version/', (req, res) => {
  res.send('1.0.0');
});
app.use('/api/samples/', samples);

export const fn = functions.https.onRequest(app);
