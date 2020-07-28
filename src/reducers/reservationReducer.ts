import moment from 'moment';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {
  asyncProcessAction,
  initReservationAction,
  loadReservationAction,
} from '../actions/reservationDetailActions';
import IReservationPage from '../status/IReservationDetailPage';
import { createInitSystem } from '../status/ISystem';

const init: IReservationPage = {
  reservation: {
    id: '',
    facilityId: '',
    subject: '',
    description: '',
    startDate: moment(),
    endDate: moment(),
    system: createInitSystem(),
  },
  loading: false,
  errorMessage: '',
};

const reservationDetailReducer = reducerWithInitialState<IReservationPage>(init)
  .case(loadReservationAction.started, (state, _payload) => ({
    ...state,
    loading: true,
    errorMessage: '',
  }))
  .case(loadReservationAction.done, (state, payload) => ({
    ...state,
    reservation: payload.result,
    loading: false,
    errorMessage: '',
  }))
  .case(loadReservationAction.failed, state => ({
    ...state,
    loading: false,
    errorMessage: '予約の読み込みに失敗しました。',
  }))
  .case(asyncProcessAction.started, state => ({
    ...state,
    loading: true,
    errorMessage: '',
  }))
  .case(asyncProcessAction.done, state => ({
    ...state,
    loading: false,
    errorMessage: '',
  }))
  .case(asyncProcessAction.failed, state => ({
    ...state,
    loading: false,
    errorMessage: '保存または削除の処理に失敗しました。',
  }))
  .case(initReservationAction, (state, payload) => {
    const reservation = { ...init.reservation, ...payload };
    return {
      reservation: reservation,
      loading: false,
      errorMessage: '',
    };
  })
  .build();

export default reservationDetailReducer;
