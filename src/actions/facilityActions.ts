import { Dispatch } from 'redux';
import { actionCreatorFactory } from 'typescript-fsa';
import {
  deleteFacility as deleteFacilityById,
  getFacility,
  postFacility,
  putFacility,
} from '../controllers/facilityController';
import IFacility from '../status/IFacility';

const actionCreator = actionCreatorFactory('facility');

export const clearFacilityAction = actionCreator('clear-facility');

export const loadFacilityAction = actionCreator.async<null, IFacility, unknown>(
  'load-facility',
);
export const loadFacility = async (
  id: string,
  dispatch: Dispatch,
): Promise<void> => {
  dispatch(loadFacilityAction.started(null));
  const facility = await getFacility(id).catch(_e => {
    dispatch(loadFacilityAction.failed({ params: null, error: {} }));
  });
  if (!facility) return;
  dispatch(loadFacilityAction.done({ params: null, result: facility }));
};

export const saveFacilityAction = actionCreator.async<null, null, unknown>(
  'save-facility',
);
export const saveFacility = async (
  facility: IFacility,
  dispatch: Dispatch,
): Promise<boolean> => {
  dispatch(saveFacilityAction.started(null));
  const promise = !facility.id ? postFacility(facility) : putFacility(facility);
  return promise
    .then(() => {
      dispatch(saveFacilityAction.done({ params: null, result: null }));
      return true;
    })
    .catch(() => {
      dispatch(saveFacilityAction.failed({ params: null, error: {} }));
      return false;
    });
};

export const deleteFacilityAction = actionCreator.async<null, null, unknown>(
  'delete-facility',
);

export const deleteFacility = async (
  id: string,
  dispatch: Dispatch,
): Promise<boolean> => {
  dispatch(deleteFacilityAction.started(null));
  return deleteFacilityById(id)
    .then(() => {
      dispatch(deleteFacilityAction.done({ params: null, result: null }));
      return true;
    })
    .catch(() => {
      dispatch(deleteFacilityAction.failed({ params: null, error: {} }));
      return false;
    });
};
