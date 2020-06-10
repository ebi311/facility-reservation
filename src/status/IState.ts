import ITaskListPage from './ITaskListPage';
import ITaskPage from './ITaskPage';

export default interface IState {
  taskList: ITaskListPage;
  task: ITaskPage;
}
