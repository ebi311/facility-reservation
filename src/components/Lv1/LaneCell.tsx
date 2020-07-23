import React, { useMemo } from 'react';
import styled from 'styled-components';
import { constraints } from '../../constraints';
import { theme } from '../globalStyle';

type PropsType = {
  backgroundColor?: string;
  className?: string;
  color?: string;
  text?: string;
  width?: string;
  onClick?: () => void;
};

const Cell = styled.div<PropsType>`
  background-color: ${p => p.backgroundColor || 'white'};
  border: 1px solid #666;
  box-sizing: border-box;
  color: ${p => p.color || 'inherit'};
  cursor: ${p => (p.onClick ? 'pointer' : 'inherit')};
  flex-basis: ${p => (p.width ? 'auto' : '0')};
  flex-grow: ${p => (p.width ? '0' : '1')};
  flex-shrink: 0;
  height: ${constraints.rowHeight};
  overflow: visible;
  position: relative;
  text-align: center;
  width: ${p => p.width || 'auto'};
  &:hover {
    background-color: ${p =>
      p.onClick ? theme.palette.primary.light : 'inherit'};
  }
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
