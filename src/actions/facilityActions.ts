import { actionCreatorFactory } from 'typescript-fsa';
import IFacility from '../status/IFacility';
import { Dispatch } from 'redux';
import {
  getFacility,
  postFacility,
  putFacility,
} from '../controllers/facilityController';

const actionCreator = actionCreatorFactory('facility');

export const loadFacilityAction = actionCreator.async<null, IFacility, unknown>(
  'load-facility',
);
export const saveFacilityAction = actionCreator.async<null, null, unknown>(
  'save-facility',
);

export const loadFacility = async (
  id: string,
  dispatch: Dispatch,
): Promise<void> => {
  dispatch(loadFacilityAction.started(null));
  const facility = await getFacility(id).catch(e => {
    dispatch(loadFacilityAction.failed({ params: null, error: {} }));
  });
  if (!facility) return;
  dispatch(loadFacilityAction.done({ params: null, result: facility }));
};

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
