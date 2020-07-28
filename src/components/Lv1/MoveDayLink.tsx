import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

type PropsType = {
  direction: '前' | '後';
  to: string;
};

const LinkButton = styled(Link)`
  cursor: pointer;
`;

const MoveDayLink: React.FC<PropsType> = props => {
  let title = useMemo(() => `1日${props.direction}`, [props.direction]);
  if (props.direction === '前') {
    title = '<<' + title;
  } else {
    title = title + '>>';
  }
  return <LinkButton to={props.to}>{title}</LinkButton>;
};

export default MoveDayLink;
