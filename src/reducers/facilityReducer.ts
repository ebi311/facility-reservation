import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {
  clearFacilityAction,
  loadFacilityAction,
  saveFacilityAction,
  deleteFacilityAction,
} from '../actions/facilityActions';
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
  errorMessage: '',
};

const facilityReducer = reducerWithInitialState<IFacilityPage>(init)
  .case(loadFacilityAction.started, (state, _payload) => ({
    ...state,
    loading: true,
    errorMessage: '',
  }))
  .case(loadFacilityAction.done, (state, payload) => ({
    ...state,
    loading: false,
    facility: payload.result,
    errorMessage: '',
  }))
  .case(loadFacilityAction.failed, state => ({
    ...state,
    loading: false,
    errorMessage: 'データの取得に失敗しました',
  }))
  .case(saveFacilityAction.started, state => ({
    ...state,
    loading: true,
    errorMessage: '',
  }))
  .case(saveFacilityAction.done, state => ({
    ...state,
    loading: false,
    errorMessage: '',
  }))
  .case(saveFacilityAction.failed, state => ({
    ...state,
    loading: false,
    errorMessage: '保存に失敗しました。',
  }))
  .case(deleteFacilityAction.started, state => ({
    ...state,
    loading: true,
    errorMessage: '',
  }))
  .case(deleteFacilityAction.done, state => ({
    ...state,
    loading: false,
    errorMessage: '',
  }))
  .case(deleteFacilityAction.failed, state => ({
    ...state,
    loading: false,
    errorMessage: '削除に失敗しました',
  }))
  .case(clearFacilityAction, () => ({
    ...init,
  }))
  .build();

export default facilityReducer;
