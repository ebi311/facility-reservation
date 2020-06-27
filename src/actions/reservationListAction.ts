import { Dispatch } from 'redux';
import actionCreatorFactory from 'typescript-fsa';
import { loadReservations } from '../controllers/reservationController';
import IFacility from '../status/IFacility';
import IReservation from '../status/IReservation';
import { loadFacilities } from '../controllers/facilityController';

const actionCreator = actionCreatorFactory('task-list');

export const loadTaskListAction = actionCreator.async<
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
  dispatch(loadTaskListAction.started({}));
  const data = await loadReservations(date);
  const action = loadTaskListAction.done({
    result: data,
    params: {},
  });
  dispatch(action);
};

export const loadFacilityList = async (dispatch: Dispatch): Promise<void> => {
  dispatch(loadFacilityAction.started({}));
  const facilities = await loadFacilities();
  dispatch(loadFacilityAction.done({ result: facilities, params: {} }));
};
