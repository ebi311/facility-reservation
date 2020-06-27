import React from 'react';
import { Switch, Route } from 'react-router';
import ReservationDetail from './components/LV3/ReservationDetail';
import ReservationList from './components/LV3/ReservationList';

const Router: React.FC = () => {
  return (
    <>
      <Switch>
        <Route exact path="/" component={ReservationList} />
        <Route exact path="/task/:id" component={ReservationDetail} />
      </Switch>
    </>
  );
};

export default Router;
