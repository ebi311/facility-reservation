import moment from 'moment';
import queryString from 'query-string';
import React from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { constraints } from '../../constraints';
import IFacility from '../../status/IFacility';
import LaneCell from '../Lv1/LaneCell';

type PropsType = {
  facility: IFacility;
  color: string;
  date: Date;
};

const FacilityLink = styled(Link)`
  color: white;
  text-decoration: none;
`;

const FacilityCell: React.FC<PropsType> = props => {
  const { facility, color } = props;
  const history = useHistory();
  const cells = [
    <LaneCell
      width={constraints.rowHeaderWidth + 'px'}
      key="head"
      backgroundColor={color}
      color="white"
    >
      <p>
        <FacilityLink to={`facilities/${facility.id}`}>
          {facility.name}
        </FacilityLink>
      </p>
    </LaneCell>,
  ];
  for (let i = 8; i < 19; i++) {
    const d = moment(props.date).set('hour', i).startOf('hour');
    const qs = queryString.stringify({
      date: d.toISOString(true),
      facilityId: facility.id,
    });
    cells.push(
      <LaneCell
        key={facility.id + i}
        className={i === 8 ? 'first' : ''}
        onClick={() => history.push('/reservations/?' + qs)}
      ></LaneCell>,
    );
  }
  return <>{cells}</>;
};

export default FacilityCell;
