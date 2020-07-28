import { Dispatch } from 'redux';
import actionCreatorFactory from 'typescript-fsa';
import { getFacilities } from '../controllers/facilityController';
import { getReservations } from '../controllers/reservationController';
import IFacility from '../status/IFacility';
import IReservation from '../status/IReservation';

const actionCreator = actionCreatorFactory('task-list');

export const changeDate = actionCreator<Date>('change-date');

export const loadReservationListAction = actionCreator.async<
  null,
  IReservation[],
  null
>('load-task-list');

export const loadReservationList = async (
  date: Date,
  dispatch: Dispatch,
): Promise<void> => {
  dispatch(loadReservationListAction.started(null));
  const data = await getReservations(date).catch(e => {
    console.error(e);
    dispatch(loadReservationListAction.failed({ params: null, error: null }));
  });
  if (!data) return;
  const action = loadReservationListAction.done({
    result: data,
    params: null,
  });
  dispatch(action);
};

export const loadFacilityAction = actionCreator.async<null, IFacility[], null>(
  'load-facilities',
);

export const loadFacilityList = async (dispatch: Dispatch): Promise<void> => {
  dispatch(loadFacilityAction.started(null));
  const facilities = await getFacilities().catch(() => {
    dispatch(loadFacilityAction.failed({ params: null, error: null }));
  });
  if (!facilities) return;
  dispatch(loadFacilityAction.done({ result: facilities, params: null }));
};
