import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { asyncLoadFacilityAction } from '../actions/facilityActions';
import IFacilityPage from '../status/IFacilityPage';
import { createInitSystem } from '../status/ISystem';

const init: IFacilityPage = {
  facility: {
    description: '',
    id: '',
    name: '',
    system: createInitSystem(),
  },
  loading: false,
};

const facilityReducer = reducerWithInitialState<IFacilityPage>(init)
  .case(asyncLoadFacilityAction.started, (state, _payload) => ({
    ...state,
    loading: true,
  }))
  .case(asyncLoadFacilityAction.done, (state, payload) => ({
    ...state,
    loading: false,
    facility: payload.result,
  }))
  .build();

export default facilityReducer;
