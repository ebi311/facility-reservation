import React from 'react';
import styled from 'styled-components';
import IReservation from '../../status/IReservation';
import moment from 'moment';
import { constraints } from '../../constraints';

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
  height: ${constraints.rowHeight / 2}px;
  background-color: ${p => p.color};
  position: absolute;
  left: ${p => p.offset}px;
  top: ${constraints.rowHeight / 4}px;
  width: ${p => p.width}px;
  z-index: 10;
`;

const ReservationBar: React.FC<PropsType> = props => {
  const endDate = moment(props.reservation.endDate);
  const startDate = moment(props.reservation.startDate);
  const startTime = moment(props.beginTime).startOf('hour');
  const offsetTime = startDate.diff(startTime, 'minutes');
  const offsetPixel =
    (offsetTime / 60) * props.timeWidth + constraints.rowHeaderWidth;
  const diffTime = endDate.diff(startDate, 'minutes');
  const width = (diffTime / 60) * props.timeWidth;
  return (
    <>
      <Bar color={props.color} width={width} offset={offsetPixel}></Bar>
    </>
  );
};

export default ReservationBar;
