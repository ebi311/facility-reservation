import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Reservation } from './Reservation';
import { Facility } from './Facility';
import { ReservationList } from './ReservationList';

export const Routing: React.FC = () => {
  return (
    <Switch>
      <Route path="/reservation/:id?" component={Reservation} />
      <Route path="/facility/:id?" component={Facility} />
      <Route path="/" exact component={ReservationList} />
    </Switch>
  );
};
