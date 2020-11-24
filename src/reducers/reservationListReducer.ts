import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {
  changeDate,
  loadFacilityAction,
  loadReservationListAction,
} from '../actions/reservationListAction';
import ITaskListPage from '../status/IReservationListPage';

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
    errorMessage: '',
  }))
  .case(loadReservationListAction.done, (state, payload) => ({
    ...state,
    loading: false,
    reservationList: payload.result,
    errorMessage: '',
  }))
  .case(loadReservationListAction.failed, state => ({
    ...state,
    loading: false,
    errorMessage: '予約一覧の読み込みに失敗しました。',
  }))
  .case(loadFacilityAction.started, state => ({
    ...state,
    loading: true,
    errorMessage: '',
  }))
  .case(loadFacilityAction.done, (state, _payload) => ({
    ...state,
    loading: false,
    facilities: _payload.result,
    errorMessage: '',
  }))
  .case(loadFacilityAction.failed, state => ({
    ...state,
    loading: false,
    errorMessage: '設備の読み込みに失敗しました。',
  }))
  .case(changeDate, (state, payload) => ({
    ...state,
    date: payload,
  }))
  .build();

export default taskListReducer;
