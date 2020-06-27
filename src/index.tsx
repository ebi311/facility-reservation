import { ConnectedRouter } from 'connected-react-router';
import moment from 'moment';
import React from 'react';
import reactDom from 'react-dom';
import { Provider } from 'react-redux';
import Router from './router';
import store, { history } from './store';

moment.locale('ja');

const component = (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Router />
    </ConnectedRouter>
  </Provider>
);

reactDom.render(component, document.getElementById('container'));
