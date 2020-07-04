import { Container } from '@material-ui/core';
import React, { useCallback, useEffect, useMemo } from 'react';
import ReactLoading from 'react-loading';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import styled from 'styled-components';
import { loadReservation } from '../../actions/reservationDetailActions';
import IReservationPage from '../../status/IReservationDetailPage';
import IState from '../../status/IState';
import ActionBar from '../LV2/ActionBar';
import FormHeader from '../LV2/FormHeader';
import ReservationForm from '../LV2/ReservationForm';

type PropsType = RouteComponentProps<{ id: string }>;

const Loading = styled(ReactLoading)`
  margin: auto auto;
`;

const ReservationDetail: React.FC<PropsType> = props => {
  const storeState = useSelector<IState, IReservationPage>(s => s.reservation);
  const { reservation, loading, facilityList } = storeState;
  const dispatch = useDispatch();

  useEffect(() => {
    loadReservation(props.match.params.id, dispatch);
  }, []);

  const onSave = useCallback(() => {
    alert('save');
  }, []);

  const onDelete = useCallback(() => {
    confirm('削除して良いですか？');
  }, []);

  const onClose = useCallback(() => {
    props.history.goBack();
  }, []);

  const form = useMemo(
    () => (
      <form>
        <ReservationForm reservation={reservation} facilities={facilityList} />
      </form>
    ),
    [reservation, facilityList],
  );

  return (
    <Container maxWidth="sm">
      <FormHeader onCloseClick={onClose} />
      {loading ? <Loading type="spin" color="#aaa" /> : form}
      <ActionBar onSave={onSave} onDelete={onDelete} />
    </Container>
  );
};

export default ReservationDetail;
