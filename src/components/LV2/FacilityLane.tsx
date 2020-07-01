import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { constraints } from '../../constraints';
import pickColor from '../../controllers/colorController';
import IFacility from '../../status/IFacility';
import IReservation from '../../status/IReservation';
import LaneCell from '../Lv1/LaneCell';
import ReservationBar from './ReservationBar';
import moment from 'moment';
import ResizeObserver from 'resize-observer-polyfill';

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
};

const createCells = (facility: IFacility, color: string) => {
  const cells = [
    <LaneCell
      width={constraints.rowHeaderWidth + 'px'}
      key="head"
      backgroundColor={color}
      color="white"
    >
      <p>{facility.name}</p>
    </LaneCell>,
  ];
  for (let i = 8; i < 19; i++) {
    cells.push(
      <LaneCell
        key={facility.id + i}
        className={i === 8 ? 'first' : ''}
      ></LaneCell>,
    );
  }
  return cells;
};

const createReservationRows = (
  element: HTMLDivElement,
  props: PropsType,
  color: string,
) => {
  const beginDate = moment(props.date).hour(8).startOf('hour').toDate();
  const cellWidth = (element.querySelector('.first') as HTMLElement)
    .offsetWidth;
  if (!cellWidth) return [];
  const bars = props.reservations.map(r => (
    <ReservationBar
      key={r.id}
      color={color}
      beginTime={beginDate}
      reservation={r}
      timeWidth={cellWidth}
    />
  ));
  return bars;
};

const FacilityLane: React.FC<PropsType> = props => {
  const color = pickColor();
  const cells = useMemo(() => {
    return createCells(props.facility, color);
  }, [props.facility]);
  const [reserveBars, setReserveBars] = useState<JSX.Element[]>([]);
  const ro = useMemo(() => {
    return new ResizeObserver((entries, _observer) => {
      entries.forEach(entry => {
        const bars = createReservationRows(
          entry.target as HTMLDivElement,
          props,
          color,
        );
        setReserveBars(bars);
      });
    });
  }, []);
  const rowRef = useCallback((ref: HTMLDivElement) => {
    const bars = createReservationRows(ref, props, color);
    ro.observe(ref);
    setReserveBars(bars);
  }, []);

  return (
    <Row ref={rowRef}>
      {cells}
      {reserveBars}
    </Row>
  );
};

export default FacilityLane;
