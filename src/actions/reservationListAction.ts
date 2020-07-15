import { Dispatch } from 'redux';
import actionCreatorFactory from 'typescript-fsa';
import { getReservations } from '../controllers/reservationController';
import IFacility from '../status/IFacility';
import IReservation from '../status/IReservation';
import { getFacilities } from '../controllers/facilityController';

const actionCreator = actionCreatorFactory('task-list');

export const loadReservationListAction = actionCreator.async<
  unknown,
  IReservation[],
  unknown
>('load-task-list');

export const loadFacilityAction = actionCreator.async<
  unknown,
  IFacility[],
  unknown
>('load-facilities');

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

export const loadFacilityList = async (dispatch: Dispatch): Promise<void> => {
  dispatch(loadFacilityAction.started({}));
  const facilities = await getFacilities();
  dispatch(loadFacilityAction.done({ result: facilities, params: {} }));
};
