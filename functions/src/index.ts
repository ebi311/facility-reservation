import * as functions from 'firebase-functions';
import express, { NextFunction, Request, Response } from 'express';
import facilities from './facilities';
import reservations from './reservations';
import firebase from 'firebase-admin';
import { CustomReqType } from './models/CustomReqType';

firebase.initializeApp();

const app = express();

app.use((req, res, next) => {
  const authorization = req.headers.authorization || '';
  const idToken = authorization.split('Bearer ')[1];
  if (!idToken) {
    res.status(401).send('Authorization ヘッダがないか、正しくありません。');
    return;
  }
  firebase
    .auth()
    .verifyIdToken(idToken)
    .then((decodedIdToken) => {
      (req as CustomReqType).user = {
        displayName: decodedIdToken.name || '',
        email: decodedIdToken.email || '',
        face: decodedIdToken.picture || '',
      };
      next();
    })
    .catch(() => {
      res.status(401).send('トークンの認証に失敗しました。');
    });
});

app.use('/api/facilities', facilities);
app.use('/api/reservations', reservations);
app.get('/error', (req, res, next) => {
  next(new Error('エラーです'));
});
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }
  // エラーメッセージをそのまま返すのは開発時のみとする。
  // 本番環境では、セキュリティリスクとなる。
  res.status(500).send(error.message);
});

export const fn = functions.https.onRequest(app);
