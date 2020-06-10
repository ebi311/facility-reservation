import React, { useMemo, useEffect } from 'react';
import ITaskListPage from '../status/ITaskListPage';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import IState from '../status/IState';
import TaskListItem from './TaskListItem';
import { loadTaskList } from '../actions/taskListAction';

const Task: React.FC = () => {
  const state = useSelector<IState, ITaskListPage>(state => state.taskList);
  const componentList = useMemo(() => {
    return state.taskList.map(task => {
      return <TaskListItem key={task.id} {...task} />;
      // return <div>{task.name}</div>;
    });
  }, [state.taskList]);
  const dispatch = useDispatch();
  useEffect(() => {
    loadTaskList(dispatch);
  }, []);
  const loading = useMemo(() => {
    return state.loading ? <div>loading...</div> : null;
  }, [state.loading]);
  return (
    <>
      <div>TASK List Page</div>
      {loading}
      {componentList}
    </>
  );
};

export default Task;
