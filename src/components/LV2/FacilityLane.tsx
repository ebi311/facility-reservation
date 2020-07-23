import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import ResizeObserver from 'resize-observer-polyfill';
import styled from 'styled-components';
import { constraints } from '../../constraints';
import IFacility from '../../status/IFacility';
import IReservation from '../../status/IReservation';
import LaneCell from '../Lv1/LaneCell';
import ReservationBar from './ReservationBar';
import queryString from 'query-string';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
`;

type PropsType = {
  date: Date;
  facility: IFacility;
  reservations: IReservation[];
  color: string;
};

const FacilityLink = styled(Link)`
  color: white;
  text-decoration: none;
`;

const Cells: React.FC<{
  facility: IFacility;
  color: string;
  date: Date;
}> = props => {
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
    const d = moment(props.date).set('hour', 1).startOf('hour');
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

const createReservationRows = (
  element: HTMLDivElement | undefined,
  props: PropsType,
) => {
  const beginDate = moment(props.date).hour(8).startOf('hour').toDate();
  const cellWidth = (element?.querySelector('.first') as HTMLElement)
    ?.offsetWidth;
  if (!cellWidth) return [];
  const bars = props.reservations
    .filter(r => r.facilityId === `facilities/${props.facility.id}`)
    .map(r => (
      <ReservationBar
        key={r.id}
        color={props.color}
        beginTime={beginDate}
        reservation={r}
        timeWidth={cellWidth}
      />
    ));
  return bars;
};

const FacilityLane: React.FC<PropsType> = props => {
  const [reserveBars, setReserveBars] = useState<JSX.Element[]>([]);
  const [rowRef, setRowRef] = useState<HTMLDivElement | null>(null);
  const resizeObserver = useMemo(() => {
    return new ResizeObserver((entries, _observer) => {
      entries.forEach(entry => {
        const bars = createReservationRows(
          entry.target as HTMLDivElement,
          props,
        );
        setReserveBars(bars);
      });
    });
  }, [props]);
  const rowRefEvent = useCallback(
    (ref: HTMLDivElement) => {
      if (!ref) {
        resizeObserver.disconnect();
        return;
      }
      setRowRef(ref);
      resizeObserver.observe(ref);
      setReserveBars(createReservationRows(ref, props));
    },
    [props, resizeObserver],
  );
  useEffect(() => {
    if (!rowRef) return;
    setReserveBars(createReservationRows(rowRef, props));
    return () => resizeObserver.disconnect();
  }, [props, resizeObserver, rowRef]);
  useEffect(() => {
    return () => {
      resizeObserver.disconnect();
    };
  }, [resizeObserver]);
  return (
    <Row ref={rowRefEvent}>
      <Cells color={props.color} facility={props.facility} date={props.date} />
      {reserveBars}
    </Row>
  );
};

export default FacilityLane;
