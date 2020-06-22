import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { loadReservationAction } from '../actions/reservationDetailActions';
import IReservationPage from '../status/IReservationDetailPage';
import { createInitSystem } from '../status/ISystem';

const init: IReservationPage = {
  reservation: {
    id: '',
    facilityId: '',
    subject: '',
    description: '',
    startDate: new Date(0),
    endDate: new Date(0),
    system: createInitSystem(),
  },
  loading: false,
};

const reservationDetailReducer = reducerWithInitialState<IReservationPage>(init)
  .case(loadReservationAction.started, (state, payload) => ({
    ...state,
    loading: true,
  }))
  .case(loadReservationAction.done, (state, payload) => ({
    ...state,
    task: payload.result,
    loading: false,
  }))
  .build();

export default reservationDetailReducer;
