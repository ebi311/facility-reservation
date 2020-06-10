import ITask from './ITask';

export default interface ITaskListPage {
  taskList: ITask[];
  loading: boolean;
}
