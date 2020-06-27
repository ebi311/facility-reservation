import React, { useMemo } from 'react';
import styled from 'styled-components';

type PropsType = {
  text?: string;
  color?: string;
  width?: string;
};

const Cell = styled.div<PropsType>`
  border: 1px solid #666;
  background-color: ${p => p.color || 'white'};
  text-align: center;
  height: 3em;
  margin-right: -1px;
  flex-basis: ${p => (p.width ? 'auto' : '0')};
  flex-shrink: 0;
  width: ${p => p.width || 'auto'};
  flex-grow: ${p => (p.width ? '0' : '1')};
`;

const LaneCell: React.FC<PropsType> = props => {
  const innerText = useMemo(() => (props.text ? <p>{props.text}</p> : null), [
    props.text,
  ]);
  return (
    <Cell {...props}>
      {innerText}
      {props.children}
    </Cell>
  );
};

export default LaneCell;
