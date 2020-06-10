import React from 'react';
import { Switch, Route } from 'react-router';
import Task from './components/Task';
import TaskList from './components/TaskList';

const Router: React.FC = () => {
  return (
    <>
      <Switch>
        <Route exact path="/" component={TaskList} />
        <Route exact path="/task/:id" component={Task} />
      </Switch>
    </>
  );
};

export default Router;
