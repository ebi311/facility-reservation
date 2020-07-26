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
): Promise<void> => {
  dispatch(saveFacilityAction.started(null));
  const promise = !facility.id ? postFacility(facility) : putFacility(facility);
  promise
    .then(() => {
      dispatch(saveFacilityAction.done({ params: null, result: null }));
    })
    .catch(() => {
      dispatch(saveFacilityAction.failed({ params: null, error: {} }));
    });
};

export const deleteFacilityAction = actionCreator.async<null, null, unknown>(
  'delete-facility',
);

export const deleteFacility = async (
  id: string,
  dispatch: Dispatch,
): Promise<void> => {
  dispatch(deleteFacilityAction.started(null));
  const result = await deleteFacilityById(id);
  if (result) {
    dispatch(deleteFacilityAction.done({ params: null, result: null }));
  } else {
    dispatch(deleteFacilityAction.failed({ params: null, error: {} }));
  }
};
