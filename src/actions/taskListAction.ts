import actionCreatorFactory from 'typescript-fsa';
import ITask from '../status/ITask';
import { Dispatch } from 'redux';

const actionCreator = actionCreatorFactory('task-list');

export const loadTaskListAction = actionCreator.async<{}, ITask[], {}>(
  'load-task-list',
);

const testData: ITask[] = [
  {
    complete: false,
    details: 'detail',
    id: '001',
    name: 'task001',
    period: new Date(),
  },
  {
    complete: true,
    details: 'detail',
    id: '002',
    name: 'task002',
    period: new Date(),
  },
];
export const loadTaskList = async (dispatch: Dispatch) => {
  loadTaskListAction.started({});
  // setTimeout で読み込みをシミュレート
  setTimeout(() => {
    loadTaskListAction.done({ result: testData, params: {} });
  }, 1000);
};
