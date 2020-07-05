import { Container } from '@material-ui/core';
import React, { useCallback, useEffect, useMemo } from 'react';
import ReactLoading from 'react-loading';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import styled from 'styled-components';
import { loadFacility } from '../../actions/facilityActions';
import IFacilityPage from '../../status/IFacilityPage';
import IState from '../../status/IState';
import FacilityForm from '../LV2/FacilityForm';
import FormHeader from '../LV2/FormHeader';

type PropsType = RouteComponentProps<{ id: string }>;

const Loading = styled(ReactLoading)`
  margin: auto auto;
`;

const FacilityDetail: React.FC<PropsType> = props => {
  const storeState = useSelector<IState, IFacilityPage>(s => s.facility);
  const { facility, loading } = storeState;
  const dispatch = useDispatch();

  useEffect(() => {
    loadFacility(props.match.params.id, dispatch);
  }, []);

  const onClose = useCallback(() => {
    props.history.goBack();
  }, []);
  const form = useMemo(
    () => (
      <form>
        <FacilityForm facility={facility} />
      </form>
    ),
    [facility],
  );
  return (
    <Container maxWidth="sm">
      <FormHeader onCloseClick={onClose} />
      {loading ? <Loading type="spin" color="#aaa" /> : form}
    </Container>
  );
};

export default FacilityDetail;
