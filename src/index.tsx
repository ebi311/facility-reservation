import { ConnectedRouter } from 'connected-react-router';
import moment from 'moment';
import React from 'react';
import reactDom from 'react-dom';
import { Provider } from 'react-redux';
import Router from './router';
import store, { history } from './store';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import momentUtils from '@date-io/moment';
import GlobalStyle, { theme } from './components/globalStyle';
import { setupFirebase } from './firebaseConfiguration';
import { ThemeProvider } from '@material-ui/core';
import superagent from 'superagent';

// Firebase の初期設定を行う
setupFirebase();

moment.locale('ja');

momentUtils.prototype.getDateTimePickerHeaderText = date => date.format('M/D');
momentUtils.prototype.getDatePickerHeaderText = date => date.format('M/D');

// superagent でのレスポンスのパースを設定する
superagent.parse['application/json'] = (text: string) => {
  const obj = JSON.parse(text, (key, value) => {
    // ISO 8601 形式の文字列から日付に変換する
    if (/^\d{4}(-\d{2}){2}T\d{2}(:\d{2}){2}\.\d{3}Z/.test(value)) {
      return moment(value);
    }
    return value;
  });
  return obj;
};

const component = (
  <Provider store={store}>
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={momentUtils}>
        <ConnectedRouter history={history}>
          <Router />
        </ConnectedRouter>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  </Provider>
);

reactDom.render(component, document.getElementById('container'));
