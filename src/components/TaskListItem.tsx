import { push } from 'connected-react-router';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import IReservation from '../status/IReservation';

const Container = styled.div`
  border-bottom: 1px solid #ccc;
  margin: 1em;
  cursor: pointer;
  &:hover {
    background-color: #ddddff;
  }
`;

const CheckCircle = styled.div<{ complete: boolean }>`
  border-radius: 50%;
  border: 1px solid #999;
  width: 30px;
  height: 30px;
  text-align: center;
  font-size: 24px;
  background-color: ${p => (p.complete ? '#33aa66' : '#ffffff')};
  color: #ffffff;
`;

const TaskListItem: React.FC<IReservation> = props => {
  const dispatch = useDispatch();
  const onClickRow = useCallback(() => {
    dispatch(push(`task/${props.id}`));
  }, [props.id]);
  return (
    <Container onClick={onClickRow}>
      <span>{props.subject}</span>
    </Container>
  );
};

export default TaskListItem;
