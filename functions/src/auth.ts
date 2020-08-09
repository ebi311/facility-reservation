import express, { Request } from 'express';
import admin from 'firebase-admin';
import { CustomReqType } from './CustomRequest';

const app = express();

const getIdTokenInHeader = (req: Request) => {
  let idToken = '';
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  }
  return idToken;
};

app.use(async (req: Request, res, next) => {
  console.log('Check if request is authorized with Firebase ID token');
  const idToken = getIdTokenInHeader(req);
  if (!idToken) {
    res.status(403).send('Authorization ヘッダがありません');
    return;
  }
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedIdToken => {
      console.log('verified id token');
      (req as CustomReqType).user = {
        displayName: decodedIdToken.email || '',
        faceUrl: decodedIdToken.picture || '',
      };
      next();
    })
    .catch(error => {
      console.error('Error while verifying Firebase ID token:', error);
      res.status(403).send('id token の認証に失敗しました');
      return;
    });
});

export default app;
