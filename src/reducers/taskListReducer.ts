import { reducerWithInitialState } from 'typescript-fsa-reducers';
import ITaskListPage from '../status/ITaskListPage';

const init: ITaskListPage = {
  loading: false,
  taskList: [],
};

const taskListReducer = reducerWithInitialState<ITaskListPage>(init).build();

export default taskListReducer;
