import React from 'react';
import { Switch, Route } from 'react-router';
import ReservationDetail from './components/LV3/ReservationDetail';
import ReservationList from './components/LV3/ReservationList';
import FacilityDetail from './components/LV3/FacilityDetail';

const Router: React.FC = () => {
  return (
    <>
      <Switch>
        <Route exact path="/" component={ReservationList} />
        <Route exact path="/reservations/:id" component={ReservationDetail} />
        <Route exact path="/facilities/:id" component={FacilityDetail} />
      </Switch>
    </>
  );
};

export default Router;
