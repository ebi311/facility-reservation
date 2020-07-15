import { Container as ContainerOriginal } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useCallback, useEffect, useMemo } from 'react';
import ReactLoading from 'react-loading';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router';
import styled from 'styled-components';
import { loadFacility } from '../../actions/facilityActions';
import IFacilityPage from '../../status/IFacilityPage';
import IState from '../../status/IState';
import FacilityForm from '../LV2/FacilityForm';
import FormHeader from '../LV2/FormHeader';

type PropsType = RouteComponentProps<{ id?: string }>;

const Spinner = styled(ReactLoading)`
  margin: auto auto;
`;

const FormContainer = styled.div`
  position: relative;
`;

const SpinnerContainer = styled.div`
  background-color: #00000020;
  display: flex;
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 100;
`;

const Container = styled(ContainerOriginal)`
  background-color: white;
  border-radius: 10px;
  box-shadow: 3px 3px 3px 3px rgb(0, 0, 0, 0.3);
  padding: 1em;
`;

const FacilityDetail: React.FC<PropsType> = props => {
  const storeState = useSelector<IState, IFacilityPage>(s => s.facility);
  const { facility, loading, errorMessage } = storeState;
  const dispatch = useDispatch();

  useEffect(() => {
    const { id } = props.match.params;
    if (!id) return;
    loadFacility(id, dispatch);
  }, [dispatch, props.match.params]);

  const history = useHistory();
  const onClose = useCallback(() => history.push('/'), [history]);

  const form = useMemo(
    () => (
      <form>
        <FacilityForm facility={facility} />
      </form>
    ),
    [facility],
  );

  const loadingScreen = useMemo(() => {
    if (!loading) return null;
    return (
      <SpinnerContainer>
        {loading ? <Spinner type="spin" color="#999" /> : null}
      </SpinnerContainer>
    );
  }, [loading]);

  const alert = useMemo(() => {
    if (!errorMessage) return null;
    return <Alert severity="error">{errorMessage}</Alert>;
  }, [errorMessage]);
  return (
    <Container maxWidth="sm">
      <FormHeader onCloseClick={onClose} />
      <FormContainer>
        {loadingScreen}
        {form}
        {alert}
      </FormContainer>
    </Container>
  );
};

export default FacilityDetail;
