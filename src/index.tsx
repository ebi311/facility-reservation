import Utils from '@date-io/dayjs';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ja';
import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Routing } from './components/Routing';
import superagent from 'superagent';
import firebase from 'firebase';
import { Login } from './components/Login';

const firebaseConfig = {
  apiKey: 'AIzaSyCcagJWImWElMcwMpbrnAB9bsMYL2z3yXY',
  authDomain: 'facility-reservations-ffca6.firebaseapp.com',
  projectId: 'facility-reservations-ffca6',
  storageBucket: 'facility-reservations-ffca6.appspot.com',
  messagingSenderId: '257696009148',
  appId: '1:257696009148:web:5e4d2efd00f0aef61739b9',
};
firebase.initializeApp(firebaseConfig);

dayjs.locale('ja');

class ExtendedUtils extends Utils {
  getCalendarHeaderText(date: Dayjs) {
    return date.format('YYYY年 MMM');
  }

  getDateTimePickerHeaderText(date: Dayjs) {
    return date.format('M/D');
  }
}

superagent.parse['application/json'] = (text: string) => {
  const obj = JSON.parse(text, (key, value) => {
    if (typeof value?._seconds === 'number') {
      return dayjs.unix(value._seconds);
    }
    if (value?._path?.segments?.[1]) {
      return value._path.segments[1];
    }
    return value;
  });
  return obj;
};

firebase.auth().onAuthStateChanged((user) => {
  ReactDom.render(
    <MuiPickersUtilsProvider utils={ExtendedUtils} locale="ja">
      {!!user ? (
        <BrowserRouter>
          <Routing />
        </BrowserRouter>
      ) : (
        <Login />
      )}
    </MuiPickersUtilsProvider>,
    document.getElementById('container'),
  );
});
