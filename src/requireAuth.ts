import firebase from 'firebase';
const provider = new firebase.auth.GoogleAuthProvider();
export let token: firebase.auth.AuthCredential | null = null;
export const requireAuth = async (): Promise<void> => {
  if (!!token) return;
  return firebase
    .auth()
    .signInWithPopup(provider)
    .then(value => {
      // Serverにトークンを送信
      token = value.credential as firebase.auth.OAuthCredential;
      console.log(token);
    })
    .catch(e => {
      console.error('auth error.');
      console.error(e);
    });
};
