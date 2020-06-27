import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { loadReservationList } from '../../actions/reservationListAction';
import ITaskListPage from '../../status/IReservationListPage';
import IState from '../../status/IState';
import DayHeader from '../LV2/DayHeader';
import Actions from '../LV2/Actions';
import TimeLaneHeader from '../LV2/TimeLaneHeader';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3em;
`;

const ListRow = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  box-sizing: border-box;
`;

const ActionsRow = styled(Actions)`
  margin-top: -2em;
`;

const ReservationList: React.FC = () => {
  const dispatch = useDispatch();
  const state = useSelector<IState, ITaskListPage>(s => s.reservationList);
  useEffect(() => {
    loadReservationList(new Date(), dispatch);
  }, []);
  const list = useMemo(() => {
    return state.reservationList.map(reservation => (
      <div key={reservation.id}>{reservation.subject}</div>
    ));
  }, [state.reservationList]);
  return (
    <Container>
      <div>Reservation List Page</div>
      <DayHeader date={state.date} />
      <ActionsRow />
      <TimeLaneHeader />
      <ListRow>{list}</ListRow>
    </Container>
  );
};

export default ReservationList;
