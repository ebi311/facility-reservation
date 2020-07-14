import express from 'express';
import { auth } from 'firebase';
import * as admin from 'firebase-admin';

const app = express();

const expiresIn = 60 * 60 * 24 * 5 * 1000;

type RequestBodyType = {
  token: string;
};

app.post<never, unknown, RequestBodyType>('/', async (req, res) => {
  const token = req.body.token || '';
  const credential = auth.GoogleAuthProvider.credential(token);
  const userCredential = await auth()
    .signInWithCredential(credential)
    .catch(e => {
      console.error('error in auth');
      console.error(e);
      res.status(401).send().end();
    });
  if (!userCredential) return;
  const sessionCookie = await admin
    .auth()
    .createSessionCookie(token, { expiresIn })
    .catch(e => {
      console.error('error in auth');
      console.error(e);
      res.status(401).send().end();
    });
  if (!sessionCookie) return;
  const options = { maxAge: expiresIn, httpOnly: true, secure: true };
  res.cookie('__session', sessionCookie, options).send({ status: 'success' });
});

export default app;
