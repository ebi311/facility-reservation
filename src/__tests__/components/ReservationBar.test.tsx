/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render } from '@testing-library/react';
import dayjs from 'dayjs';
import React from 'react';
import { ReservationBar } from '../../components/ReservationBar';
import { IReservation } from '../../models/IReservation';

let useStyles: jest.Mock;
jest.mock('@material-ui/core/styles', () => {
  useStyles = jest.fn().mockImplementation(() => ({
    root: 'root-classname',
    bar: 'bar-classname',
  }));
  return {
    // eslint-disable-next-line @typescript-eslint/ban-types
    ...(jest.requireActual('@material-ui/core/styles') as Object),
    makeStyles: () => useStyles,
  };
});

const reservation: IReservation = {
  description: '',
  endDate: dayjs('2021-07-01T10:00:00+0900'),
  startDate: dayjs('2021-07-01T09:00:00+0900'),
  facilityId: 'f001',
  id: 'r001',
  subject: '予約1',
  system: {} as any,
};

test('ReservationBar', () => {
  const { asFragment } = render(
    <ReservationBar
      backgroundColor="red"
      reservation={reservation}
      beginHour={8}
      hourWidth={100}
      leftOffset={300}
    />,
  );
  expect(asFragment()).toMatchSnapshot();
  expect(useStyles).toBeCalledWith({
    width: 100,
    left: 300 + 100,
    backgroundColor: 'red',
  });
});
