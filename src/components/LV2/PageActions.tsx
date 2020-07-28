import { Button } from '@material-ui/core';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { clearFacilityAction } from '../../actions/facilityActions';

const Row = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

type PropsType = {
  className?: string;
};

const PageActions: React.FC<PropsType> = props => {
  const history = useHistory();
  const dispatch = useDispatch();
  const onClickAddFacility = useCallback(() => {
    dispatch(clearFacilityAction());
    history.push('/facilities/');
  }, [dispatch, history]);
  return (
    <Row className={props.className}>
      <Button variant="contained" color="primary" onClick={onClickAddFacility}>
        設備の登録
      </Button>
    </Row>
  );
};

export default PageActions;
