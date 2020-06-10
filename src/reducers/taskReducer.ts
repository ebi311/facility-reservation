import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { loadTaskAction } from '../actions/taskActions';
import ITask from '../status/ITaskPage';

const init: ITask = {
  task: {
    complete: false,
    details: '',
    id: '',
    name: '',
    period: undefined,
  },
  laoding: false,
};

const taskReducer = reducerWithInitialState<ITask>(init)
  .case(loadTaskAction.started, (state, payload) => ({
    ...state,
    laoding: true,
  }))
  .case(loadTaskAction.done, (state, payload) => ({
    ...state,
    task: payload.result,
    laoding: false,
  }))
  .build();

export default taskReducer;
