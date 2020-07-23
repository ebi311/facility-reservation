import { reducerWithInitialState } from 'typescript-fsa-reducers';
import ITaskListPage from '../status/IReservationListPage';
import {
  loadReservationListAction,
  loadFacilityAction,
  changeDate,
} from '../actions/reservationListAction';

const init: ITaskListPage = {
  date: new Date(),
  facilities: [],
  loading: false,
  reservationList: [],
};

const taskListReducer = reducerWithInitialState<ITaskListPage>(init)
  .case(loadReservationListAction.done, (state, _payload) => ({
    ...state,
    loading: true,
  }))
  .case(loadReservationListAction.done, (state, payload) => ({
    ...state,
    loading: false,
    reservationList: payload.result,
  }))
  .case(loadFacilityAction.done, (state, _payload) => ({
    ...state,
    facilities: _payload.result,
  }))
  .case(changeDate, (state, payload) => ({
    ...state,
    date: payload,
  }))
  .build();

export default taskListReducer;
