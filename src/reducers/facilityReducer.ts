import { reducerWithInitialState } from 'typescript-fsa-reducers';
import IFacilityPage from '../status/IFacilityPage';
import { createInitSystem } from '../status/ISystem';

const init: IFacilityPage = {
  facility: {
    description: '',
    id: '',
    name: '',
    system: createInitSystem(),
  },
  reload: false,
};

const facilityReducer = reducerWithInitialState<IFacilityPage>(init).build();

export default facilityReducer;
