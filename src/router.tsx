import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import FacilityDetail from './components/LV3/FacilityDetail';
import Login from './components/LV3/Login';
import ReservationDetail from './components/LV3/ReservationDetail';
import ReservationList from './components/LV3/ReservationList';
// import { requireAuth } from './requireAuth';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RouteComponentType = RouteComponentProps<any>;

const render = (component: React.FC<RouteComponentType>) => (
  arg: RouteComponentType,
) => {
  // requireAuth();
  const Component = component;
  return <Component {...arg} />;
};

const Router: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/" component={render(ReservationList)} />
      <Route exact path="/login" component={Login} />
      <Route
        exact
        path="/reservations/:id"
        component={render(ReservationDetail)}
      />
      <Route
        exact
        path="/reservations/"
        component={render(ReservationDetail)}
      />
      <Route
        exact
        path="/facilities/"
        strict
        component={render(FacilityDetail)}
      />
      <Route exact path="/facilities/:id" component={render(FacilityDetail)} />
    </Switch>
  );
};

export default Router;
