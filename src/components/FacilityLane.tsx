import { makeStyles, Theme } from '@material-ui/core/styles';
import { Property } from 'csstype';
import { Dayjs } from 'dayjs';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { IFacility } from '../models/IFacility';
import { IReservation } from '../models/IReservation';
import { ReservationBar } from './ReservationBar';

type Props = JSX.IntrinsicElements['div'] & {
  facility: IFacility;
  cellWidth: number;
  backgroundColor: Property.BackgroundColor;
  reservations: IReservation[];
  date?: Dayjs;
};

const useStyles = makeStyles<
  Theme,
  {
    backgroundColor: Property.BackgroundColor;
  }
>((theme) => ({
  header: {
    backgroundColor: (p) => p.backgroundColor,
    '& a': {
      color: (p) => theme.palette.getContrastText(p.backgroundColor),
    },
  },
}));

export const FacilityLane: React.FC<Props> = (props) => {
  const {
    cellWidth,
    facility,
    reservations,
    backgroundColor,
    date,
    ...rootAttr
  } = props;
  const styles = useStyles({ backgroundColor });
  const cells = useMemo(() => {
    const r: JSX.Element[] = [];
    for (let i = 0; i <= 11; i++) {
      const toDate = date?.hour(i + 8).startOf('hour');
      r.push(
        <Link
          key={i}
          className="timeCell"
          to={`/reservation/?date=${toDate?.toISOString() || ''}`}
        ></Link>,
      );
    }
    return r;
  }, []);
  const bars = useMemo(() => {
    return reservations.map((r) => {
      return (
        <ReservationBar
          key={r.id}
          backgroundColor={backgroundColor}
          beginHour={8}
          reservation={r}
          hourWidth={cellWidth}
          leftOffset={100}
        />
      );
    });
  }, [reservations, backgroundColor, cellWidth]);
  return (
    <div {...rootAttr}>
      {bars}
      <div className={`laneHeader ${styles.header}`}>
        <Link to={'/facility/' + facility.id}>{facility.name}</Link>
      </div>
      {cells}
    </div>
  );
};
