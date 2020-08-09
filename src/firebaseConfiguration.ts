// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export const setupFirebase = (): Promise<string | undefined> => {
  const firebaseConfig = {
    apiKey: 'AIzaSyB3WaxTSthsYhKLM9o1HJhMsySbIpsjmFQ',
    authDomain: 'facilityreservation2020.firebaseapp.com',
    databaseURL: 'https://facilityreservation2020.firebaseio.com',
    projectId: 'facilityreservation2020',
    storageBucket: 'facilityreservation2020.appspot.com',
    messagingSenderId: '700180678306',
    appId: '1:700180678306:web:f52d427df850b6987d79fb',
    measurementId: 'G-LV6TJDYXGY',
  };

  firebase.initializeApp(firebaseConfig);

  return new Promise<firebase.User | null>((resolve, reject) => {
    firebase.auth().onAuthStateChanged(
      user => {
        console.log('on auth state changed.');
        resolve(user);
      },
      () => {
        reject(new Error('Google 認証の取得に失敗しました。'));
      },
    );
  }).then(user => user?.getIdToken());
};
