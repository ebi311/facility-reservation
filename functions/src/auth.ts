import express from 'express';
import * as admin from 'firebase-admin';

const app = express();

app.use((req, res, next) => {
  const sessionCookie = req.cookies.__session || '';
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true)
    .then(() => {
      next();
    })
    .catch(() => {
      // Session cookie is unavailable or invalid. Force user to login.
      res.redirect('/login');
    });
});

export default app;
