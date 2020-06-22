import React from 'react';
import { useSelector } from 'react-redux';
import IState from '../status/IState';

const ReservationList: React.FC = () => {
  const reservationList = useSelector<IState>(s => s.reservationList);

  return (
    <>
      <div>Reservation List Page</div>
    </>
  );
};

export default ReservationList;
