import React, { useCallback } from 'react';
import ITask from '../status/ITask';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';

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

const TaskListItem: React.FC<ITask> = props => {
  const dispatch = useDispatch();
  const onClickRow = useCallback(() => {
    dispatch(push(`task/${props.id}`));
  }, [props.id]);
  return (
    <Container onClick={onClickRow}>
      <CheckCircle complete={props.complete}>
        {props.complete ? '✔' : ''}
      </CheckCircle>
      <div>{props.name}</div>
      <div>{props.details}</div>
      <div>期限: {props.period?.toDateString()}</div>
    </Container>
  );
};

export default TaskListItem;
