import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';
import IState from '../status/IState';
import IReservationDetailPage from '../status/IReservationDetailPage';
import { RouteComponentProps } from 'react-router';
import { loadTask } from '../actions/reservationDetailActions';

type Props = RouteComponentProps<{ id: string }>;

const ReservationDetail: React.FC<Props> = props => {
  const taskPage = useSelector<IState, IReservationDetailPage>(
    s => s.reservation,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    loadTask(props.match.params.id, dispatch);
  }, []);
  const loading = useMemo(() => {
    return taskPage.loading ? <div>loading...</div> : null;
  }, [taskPage.loading]);
  return (
    <>
      <div>task page</div>
      {loading}
      <h1>{taskPage.reservation.subject}</h1>
    </>
  );
};

export default ReservationDetail;
