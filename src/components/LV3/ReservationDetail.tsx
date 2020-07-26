import { Container as ContainerOriginal } from '@material-ui/core';
import moment from 'moment';
import queryString from 'query-string';
import React, { useCallback, useEffect, useMemo } from 'react';
import ReactLoading from 'react-loading';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router';
import styled from 'styled-components';
import {
  initReservationAction,
  loadReservation,
} from '../../actions/reservationDetailActions';
import { loadFacilityList } from '../../actions/reservationListAction';
import IFacility from '../../status/IFacility';
import IReservationPage from '../../status/IReservationDetailPage';
import IState from '../../status/IState';
import FormHeader from '../LV2/FormHeader';
import ReservationForm from '../LV2/ReservationForm';
import IReservation from '../../status/IReservation';

type PropsType = RouteComponentProps<{ id: string }>;

const Loading = styled(ReactLoading)`
  margin: auto auto;
`;

const Container = styled(ContainerOriginal)`
  background-color: white;
  border-radius: 10px;
  box-shadow: 3px 3px 3px 3px rgb(0, 0, 0, 0.3);
  padding: 1em;
`;

const ReservationDetail: React.FC<PropsType> = props => {
  const storeState = useSelector<IState, IReservationPage>(s => s.reservation);
  const facilities = useSelector<IState, IFacility[]>(
    s => s.reservationList.facilities,
  );
  const { reservation, loading } = storeState;

  const queryParams = useMemo<Partial<IReservation>>((): Partial<
    IReservation
  > => {
    const qs = queryString.parse(location.search);
    return {
      startDate: qs.date ? moment(qs.date).startOf('hour') : undefined,
      endDate: qs.date
        ? moment(qs.date).add(1, 'hour').startOf('hour')
        : undefined,
      facilityId: qs.facilityId ? `facilities/${qs.facilityId}` : undefined,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const dispatch = useDispatch();

  const { id } = props.match.params;
  useEffect(() => {
    loadFacilityList(dispatch);
    if (id) {
      loadReservation(id, dispatch);
    } else {
      dispatch(initReservationAction(queryParams));
    }
  }, [dispatch, id, queryParams]);

  const history = useHistory();
  const onClose = useCallback(() => history.goBack(), [history]);

  const form = useMemo(
    () => <ReservationForm reservation={reservation} facilities={facilities} />,
    [reservation, facilities],
  );

  return (
    <Container maxWidth="sm">
      <FormHeader onCloseClick={onClose} />
      {loading ? <Loading type="spin" color="#aaa" /> : form}
    </Container>
  );
};

export default ReservationDetail;
