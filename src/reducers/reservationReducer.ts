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
    startDate: new Date(),
    endDate: new Date(),
    system: createInitSystem(),
  },
  loading: false,
};

const reservationDetailReducer = reducerWithInitialState<IReservationPage>(init)
  .case(loadReservationAction.started, (state, _payload) => ({
    ...state,
    loading: true,
  }))
  .case(loadReservationAction.done, (state, payload) => ({
    ...state,
    reservation: payload.result,
    loading: false,
  }))
  .case(asyncProcessAction.started, state => ({
    ...state,
    loading: true,
  }))
  .case(asyncProcessAction.started, state => ({
    ...state,
    loading: false,
  }))
  .case(initReservationAction, (state, payload) => {
    const reservation = { ...init.reservation, ...payload };
    return {
      reservation: reservation,
      loading: false,
    };
  })
  .build();

export default reservationDetailReducer;
