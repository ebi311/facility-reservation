import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import styled from 'styled-components';
import IFacility from '../../status/IFacility';
import IReservation from '../../status/IReservation';
import Cells from './FacilityCells';
import ReservationBar from './ReservationBar';

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

const createReservationRows = (
  element: HTMLDivElement | undefined,
  props: PropsType,
) => {
  const beginDate = dayjs(props.date).hour(8).startOf('hour').toDate();
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
