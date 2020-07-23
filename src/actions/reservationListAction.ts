import { Dispatch } from 'redux';
import actionCreatorFactory from 'typescript-fsa';
import { getFacilities } from '../controllers/facilityController';
import { getReservations } from '../controllers/reservationController';
import IFacility from '../status/IFacility';
import IReservation from '../status/IReservation';

const actionCreator = actionCreatorFactory('task-list');

export const changeDate = actionCreator<Date>('change-date');

export const loadReservationListAction = actionCreator.async<
  unknown,
  IReservation[],
  unknown
>('load-task-list');

export const loadReservationList = async (
  date: Date,
  dispatch: Dispatch,
): Promise<void> => {
  dispatch(loadReservationListAction.started({}));
  const data = await getReservations(date);
  const action = loadReservationListAction.done({
    result: data,
    params: {},
  });
  dispatch(action);
};

export const loadFacilityAction = actionCreator.async<
  unknown,
  IFacility[],
  unknown
>('load-facilities');

export const loadFacilityList = async (dispatch: Dispatch): Promise<void> => {
  dispatch(loadFacilityAction.started({}));
  const facilities = await getFacilities();
  dispatch(loadFacilityAction.done({ result: facilities, params: {} }));
};
