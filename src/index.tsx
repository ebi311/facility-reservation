import dayjsUtils from '@date-io/dayjs';
import { ThemeProvider } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ConnectedRouter } from 'connected-react-router';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import React from 'react';
import reactDom from 'react-dom';
import { Provider } from 'react-redux';
import superagent from 'superagent';
import GlobalStyle, { theme } from './components/globalStyle';
import { setupFirebase } from './firebaseConfiguration';
import Router from './router';
import store, { history } from './store';
import { setAgent } from './controllers/agent';

// dayjs の設定
dayjs.locale('ja');
dayjsUtils.prototype.getDateTimePickerHeaderText = date => date.format('M/D');
dayjsUtils.prototype.getDatePickerHeaderText = date => date.format('M/D');

// superagent でのレスポンスのパースを設定する
superagent.parse['application/json'] = (text: string) => {
  const obj = JSON.parse(text, (key, value) => {
    // ISO 8601 形式の文字列から日付に変換する
    if (/^\d{4}(-\d{2}){2}T\d{2}(:\d{2}){2}\.\d{3}Z/.test(value)) {
      return dayjs(value);
    }
    return value;
  });
  return obj;
};

const component = (
  <Provider store={store}>
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={dayjsUtils}>
        <ConnectedRouter history={history}>
          <Router />
        </ConnectedRouter>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  </Provider>
);

// Firebase の初期設定を行う
setupFirebase()
  .then(idToken => {
    if (!!idToken) setAgent(idToken);
    reactDom.render(component, document.getElementById('container'));
  })
  .catch((e: Error) => {
    reactDom.render(
      <div>{e.message}</div>,
      document.getElementById('container'),
    );
  });
