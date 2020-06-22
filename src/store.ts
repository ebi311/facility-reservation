import {
  connectRouter,
  routerMiddleware,
  RouterState,
} from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import facilityReducer from './reducers/facilityReducer';
import reservationListReducer from './reducers/reservationListReducer';
import reservationReducer from './reducers/reservationReducer';
import IState from './status/IState';

export const history = createBrowserHistory();

type StateType = IState & {
  router: RouterState;
};

const reducer = combineReducers<StateType>({
  facility: facilityReducer,
  reservation: reservationReducer,
  reservationList: reservationListReducer,
  router: connectRouter(history),
});

const state = createStore(reducer, applyMiddleware(routerMiddleware(history)));

export default state;
