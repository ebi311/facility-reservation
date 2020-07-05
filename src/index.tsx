import { ConnectedRouter } from 'connected-react-router';
import moment from 'moment';
import React from 'react';
import reactDom from 'react-dom';
import { Provider } from 'react-redux';
import Router from './router';
import store, { history } from './store';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import momentUtils from '@date-io/moment';
import GlobalStyle from './components/globalStyle';

moment.locale('ja');

momentUtils.prototype.getDateTimePickerHeaderText = date => date.format('M/D');

const component = (
  <Provider store={store}>
    <GlobalStyle />
    <MuiPickersUtilsProvider utils={momentUtils}>
      <ConnectedRouter history={history}>
        <Router />
      </ConnectedRouter>
    </MuiPickersUtilsProvider>
  </Provider>
);

reactDom.render(component, document.getElementById('container'));
