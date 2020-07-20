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
    startDate: new Date('2020-08-02T05:00:00Z'),
    endDate: new Date('2020-08-02T06:00:00Z'),
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
  .build();

export default reservationDetailReducer;
