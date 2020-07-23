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

// Firebase の初期設定を行う
setupFirebase();

moment.locale('ja');

momentUtils.prototype.getDateTimePickerHeaderText = date => date.format('M/D');

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
