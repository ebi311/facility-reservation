import { actionCreatorFactory } from 'typescript-fsa';
import IFacility from '../status/IFacility';
import { Dispatch } from 'redux';
import {
  getFacility,
  postFacility,
  putFacility,
  deleteFacility as deleteFacilityById,
} from '../controllers/facilityController';

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
  onComplete: () => void,
): Promise<void> => {
  dispatch(saveFacilityAction.started(null));
  const promise = !facility.id ? postFacility(facility) : putFacility(facility);
  promise
    .then(() => {
      dispatch(saveFacilityAction.done({ params: null, result: null }));
      onComplete();
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
  onComplete: () => void,
): Promise<void> => {
  dispatch(deleteFacilityAction.started(null));
  const result = await deleteFacilityById(id);
  if (result) {
    dispatch(deleteFacilityAction.done({ params: null, result: null }));
    onComplete();
  } else {
    dispatch(deleteFacilityAction.failed({ params: null, error: {} }));
  }
};
