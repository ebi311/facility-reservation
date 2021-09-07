import firebase from 'firebase';

const provider = new firebase.auth.GoogleAuthProvider();

export const auth = async (): Promise<firebase.User | null> => {
  return firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      return result.user;
    })
    .catch((e) => {
      console.error('auth error.');
      console.error(e);
      throw e;
    });
};

export const getCurrentUser = (): firebase.User | null =>
  firebase.auth().currentUser;
