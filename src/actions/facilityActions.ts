import { actionCreatorFactory } from 'typescript-fsa';
import IFacility from '../status/IFacility';
import { Dispatch } from 'redux';
import { getFacility } from '../controllers/facilityController';

const actionCreator = actionCreatorFactory('facility');

export const asyncLoadFacilityAction = actionCreator.async<
  null,
  IFacility,
  unknown
>('load-facility');

export const loadFacility = async (
  id: string,
  dispatch: Dispatch,
): Promise<void> => {
  dispatch(asyncLoadFacilityAction.started(null));
  const facility = await getFacility(id);
  dispatch(asyncLoadFacilityAction.done({ params: null, result: facility }));
};
