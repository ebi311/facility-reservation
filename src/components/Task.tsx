import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';
import IState from '../status/IState';
import ITaskPage from '../status/ITaskPage';
import { RouteComponentProps } from 'react-router';
import { loadTask } from '../actions/taskActions';

type Props = RouteComponentProps<{ id: string }>;

const Task: React.FC<Props> = props => {
  const taskPage = useSelector<IState, ITaskPage>(s => s.task);
  const dispatch = useDispatch();
  useEffect(() => {
    loadTask(props.match.params.id, dispatch);
  }, []);
  const loading = useMemo(() => {
    return taskPage.laoding ? <div>loading...</div> : null;
  }, [taskPage.laoding]);
  return (
    <>
      <div>task page</div>
      {loading}
      <h1>{taskPage.task.name}</h1>
    </>
  );
};

export default Task;
