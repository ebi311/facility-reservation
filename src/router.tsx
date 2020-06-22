import React from 'react';
import { Switch, Route } from 'react-router';
import ReservationDetail from './components/ReservationDetail';
import ReservationList from './components/reservationList';

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
