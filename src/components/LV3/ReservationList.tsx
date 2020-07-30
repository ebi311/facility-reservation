import { Portal, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import moment from 'moment';
import queryString from 'query-string';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  changeDate,
  loadFacilityList,
  loadReservationList,
} from '../../actions/reservationListAction';
import { pickColor, resetColor } from '../../controllers/colorController';
import ITaskListPage from '../../status/IReservationListPage';
import IState from '../../status/IState';
import DayHeader from '../LV2/DayHeader';
import FacilityLane from '../LV2/FacilityLane';
import Actions from '../LV2/PageActions';
import TimeLaneHeader from '../LV2/TimeLaneHeader';

const Container = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 3px 3px 3px 3px rgb(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  padding: 3em;
  position: relative;
`;

const Loading = styled.div`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  height: 100vh;
  justify-content: center;
  left: 0;
  position: absolute;
  top: 0;
  width: 100vw;
  z-index: 100;
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

  // クエリパラメータから、表示日付を設定する
  useEffect(() => {
    const qs = queryString.parse(location.search);
    const m = moment(qs.date).startOf('day');
    if (!qs.date || !m.isValid()) return;
    dispatch(changeDate(m.toDate()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, location.search]);

  // 設備、予約のロードを行う
  const state = useSelector<IState, ITaskListPage>(s => s.reservationList);
  useEffect(() => {
    loadReservationList(state.date, dispatch).then(() => {
      loadFacilityList(dispatch);
    });
  }, [dispatch, state.date]);

  // 設備レーンを作成する
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
  }, [state.date, state.facilities, state.reservationList]);

  const errorMessage = useMemo(() => {
    if (!state.errorMessage) return null;
    return <Alert severity="error">{state.errorMessage}</Alert>;
  }, [state.errorMessage]);

  const loading = useMemo(() => {
    if (!state.loading) return null;
    return (
      <Loading>
        <CircularProgress color="primary" />
      </Loading>
    );
  }, [state.loading]);
  return (
    <Container>
      <DayHeader date={state.date} />
      <ActionsRow />
      <TimeLaneHeader />
      <ListRow>{list}</ListRow>
      {errorMessage}
      <Portal>{loading}</Portal>
    </Container>
  );
};

export default ReservationList;
