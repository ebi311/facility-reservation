import React, { useMemo } from 'react';
import LaneCell from '../Lv1/LaneCell';
import styled from 'styled-components';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const TimeLaneHeader: React.FC = () => {
  const cells = useMemo(() => {
    const cells = [<LaneCell key="0" text=" " width="10em" />];
    for (let i = 8; i < 19; i++) {
      cells.push(<LaneCell text={i + ''} key={i} />);
    }
    return cells;
  }, []);
  return <Row>{cells}</Row>;
};

export default TimeLaneHeader;
