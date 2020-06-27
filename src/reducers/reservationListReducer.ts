import { reducerWithInitialState } from 'typescript-fsa-reducers';
import ITaskListPage from '../status/IReservationListPage';
import {
  loadTaskListAction,
  loadFacilityAction,
} from '../actions/reservationListAction';

const init: ITaskListPage = {
  date: new Date(),
  facilities: [],
  loading: false,
  reservationList: [],
};

const taskListReducer = reducerWithInitialState<ITaskListPage>(init)
  .case(loadTaskListAction.done, (state, _payload) => ({
    ...state,
    loading: true,
  }))
  .case(loadTaskListAction.done, (state, payload) => ({
    ...state,
    loading: false,
    reservationList: payload.result,
  }))
  .case(loadFacilityAction.done, (state, _payload) => ({
    ...state,
    facilities: _payload.result,
  }))
  .build();

export default taskListReducer;
