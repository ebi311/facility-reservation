import React, { useCallback, useMemo } from 'react';
import { IReservation } from '../models/IReservation';
import { Property } from 'csstype';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

type PropsType = {
  reservation: IReservation;
  leftOffset: number;
  beginHour: number;
  hourWidth: number;
  backgroundColor: Property.BackgroundColor;
};

type StyleType = {
  width: number;
  left: number;
  backgroundColor: Property.BackgroundColor;
};

const useStyles = makeStyles<Theme, StyleType>(() => ({
  root: {
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    width: (p) => p.width + 'px',
    left: (p) => p.left + 'px',
  },
  bar: {
    height: '50%',
    width: '100%',
    backgroundColor: (p) => p.backgroundColor,
    cursor: 'pointer',
  },
}));

export const ReservationBar: React.FC<PropsType> = (props) => {
  const {
    leftOffset,
    reservation,
    hourWidth,
    beginHour,
    backgroundColor,
  } = props;
  const { startDate, endDate } = reservation;

  const width = useMemo(() => {
    const hours = endDate.diff(startDate, 'minute') / 60;
    return hourWidth * hours;
  }, [startDate, endDate, hourWidth]);

  const left = useMemo(() => {
    const beginDate = startDate.set('hour', beginHour).startOf('hour');
    const diffStart = startDate.diff(beginDate, 'minute') / 60;
    return leftOffset + diffStart * hourWidth;
  }, [beginHour, hourWidth, leftOffset, startDate]);

  const style = useStyles({
    width,
    left,
    backgroundColor,
  });

  const history = useHistory();
  const click = useCallback(() => {
    history.push('/reservation/' + reservation.id);
  }, [reservation.id]);

  return (
    <div className={style.root}>
      <div className={style.bar} onClick={click}></div>
    </div>
  );
};
