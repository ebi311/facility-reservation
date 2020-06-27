import { push } from 'connected-react-router';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import IReservation from '../../status/IReservation';

const Container = styled.div`
  border-bottom: 1px solid #ccc;
  margin: 1em;
  cursor: pointer;
  &:hover {
    background-color: #ddddff;
  }
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
