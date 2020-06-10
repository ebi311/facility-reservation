import { Dispatch } from 'redux';
import actionCreatorFactory from 'typescript-fsa';
import ITask from '../status/ITask';

const actionCreator = actionCreatorFactory('task');

// export const setTaskAction = actionCreator<ITask>('setTask');

export const loadTaskAction = actionCreator.async<{}, ITask, {}>('load-task');

export const loadTask = async (id: string, dispatch: Dispatch) => {
  // 読み込みの開始
  dispatch(loadTaskAction.started({}));
  // 非同期での読み込み
  // setTimeout でシミュレート
  setTimeout(() => {
    const task: ITask = {
      complete: false,
      details: '詳細・・・',
      id: '001',
      name: 'task-001',
      period: new Date(),
    };
    dispatch(loadTaskAction.done({ params: {}, result: task }));
  }, 1000);
};
