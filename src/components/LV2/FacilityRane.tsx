import React, { useMemo } from 'react';
import styled from 'styled-components';
import IFacility from '../../status/IFacility';
import LaneCell from '../Lv1/LaneCell';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

type PropsType = {
  facility: IFacility;
};

const Facility: React.FC<PropsType> = props => {
  const cells = useMemo(() => {
    const cells = [
      <LaneCell width="10em" key="head">
        {props.facility.name}
      </LaneCell>,
    ];
    for (let i = 8; i < 19; i++) {
      cells.push(<LaneCell key={props.facility.id} />);
    }
    return cells;
  }, [props.facility]);
  return <Row>{cells}</Row>;
};

export default Facility;
