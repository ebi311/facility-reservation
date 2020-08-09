import firebase from 'firebase';
// import { history } from './store';

const provider = new firebase.auth.GoogleAuthProvider();

export const auth = async (): Promise<string> => {
  return firebase
    .auth()
    .signInWithPopup(provider)
    .then(() => {
      return firebase.auth().currentUser?.getIdToken();
    })
    .then(idToken => {
      if (!idToken) throw new Error('login failed.');
      return idToken;
    })
    .catch(e => {
      console.error('auth error.');
      console.error(e);
      throw e;
    });
};

export const getCurrentUser = (): firebase.User | null =>
  firebase.auth().currentUser;
