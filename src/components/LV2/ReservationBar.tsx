import dayjs from 'dayjs';
import { lighten } from 'polished';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { constraints } from '../../constraints';
import IReservation from '../../status/IReservation';

type PropsType = {
  reservation: IReservation;
  beginTime: Date;
  timeWidth: number;
  color: string;
};

type BarType = {
  color: string;
  offset: number;
  width: number;
};

const Bar = styled.div<BarType>`
  background-color: ${p => p.color};
  cursor: pointer;
  height: ${constraints.rowHeight / 2}px;
  left: ${p => p.offset}px;
  position: absolute;
  top: ${constraints.rowHeight / 4}px;
  width: ${p => p.width}px;
  z-index: 10;
  :hover {
    background-color: ${p => lighten(0.2, p.color)};
  }
`;

const ReservationBar: React.FC<PropsType> = props => {
  const endDate = dayjs(props.reservation.endDate);
  const startDate = dayjs(props.reservation.startDate);
  const startTime = dayjs(props.beginTime).startOf('hour');
  const offsetTime = startDate.diff(startTime, 'minute');
  const offsetPixel =
    (offsetTime / 60) * props.timeWidth + constraints.rowHeaderWidth;
  const diffTime = endDate.diff(startDate, 'minute');
  const width = (diffTime / 60) * props.timeWidth;

  const history = useHistory();
  const onClick = useCallback(() => {
    history.push(`/reservations/${props.reservation.id}`);
  }, [history, props.reservation.id]);
  return (
    <>
      <Bar
        color={props.color}
        width={width}
        offset={offsetPixel}
        onClick={onClick}
      />
    </>
  );
};

export default ReservationBar;
