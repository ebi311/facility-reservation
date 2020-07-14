import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { loadFacilityAction } from '../actions/facilityActions';
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
  .case(loadFacilityAction.started, (state, _payload) => ({
    ...state,
    loading: true,
  }))
  .case(loadFacilityAction.done, (state, payload) => ({
    ...state,
    loading: false,
    facility: payload.result,
  }))
  .build();

export default facilityReducer;
