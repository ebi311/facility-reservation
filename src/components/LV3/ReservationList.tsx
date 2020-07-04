import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  loadFacilityList,
  loadReservationList,
} from '../../actions/reservationListAction';
import { resetColor, pickColor } from '../../controllers/colorController';
import ITaskListPage from '../../status/IReservationListPage';
import IState from '../../status/IState';
import Actions from '../LV2/PageActions';
import DayHeader from '../LV2/DayHeader';
import FacilityLane from '../LV2/FacilityLane';
import TimeLaneHeader from '../LV2/TimeLaneHeader';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3em;
`;

const ListRow = styled.div`
  display: flex;
  flex-direction: column;
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
    loadFacilityList(dispatch);
  }, []);

  const list = useMemo(() => {
    resetColor();
    return state.facilities.map(facility => (
      <FacilityLane
        date={state.date}
        key={facility.id}
        facility={facility}
        reservations={state.reservationList}
        color={pickColor()}
      >
        {facility.name}
      </FacilityLane>
    ));
  }, [state.facilities, state.reservationList]);

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
