import {
  connectRouter,
  routerMiddleware,
  RouterState,
} from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import taskListReducer from './reducers/taskListReducer';
import taskReducer from './reducers/taskReducer';
import IState from './status/IState';

export const history = createBrowserHistory();

type StateType = IState & {
  router: RouterState;
};

const reducer = combineReducers<StateType>({
  router: connectRouter(history),
  task: taskReducer,
  taskList: taskListReducer,
});

const state = createStore(reducer, applyMiddleware(routerMiddleware(history)));

export default state;
