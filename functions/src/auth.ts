import express, { Request } from 'express';
import * as admin from 'firebase-admin';

const app = express();

const getIdToken = (req: Request) => {
  let idToken = '';
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else if (req.cookies) {
    console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  }
  return idToken;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type CustomReqType = Request & { user: admin.auth.DecodedIdToken };
app.get('/', async (req: Request, res, next) => {
  console.log('Check if request is authorized with Firebase ID token');
  const idToken = getIdToken(req);
  if (!idToken) {
    console.error(
      'No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>',
      'or by passing a "__session" cookie.',
    );
    res.status(403).send('Unauthorized-1');
    return;
  }

  try {
    console.log('id-token:' + idToken);
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    console.log('ID Token correctly decoded', decodedIdToken);
    (req as CustomReqType).user = decodedIdToken;
    res.cookie('__session', idToken);
    next();
    return;
  } catch (error) {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized-2');
    return;
  }
});

export default app;

// app.use((req, res, next) => {
//   const sessionCookie = req.cookies.__session || '';
//   admin
//     .auth()
//     .verifySessionCookie(sessionCookie, true)
//     .then(() => {
//       next();
//     })
//     .catch(() => {
//       // Session cookie is unavailable or invalid. Force user to login.
//       res.redirect('/login');
//     });
// });

// export default app;
