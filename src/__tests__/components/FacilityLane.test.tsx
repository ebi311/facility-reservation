/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render } from '@testing-library/react';
import dayjs from 'dayjs';
import React from 'react';
import { Link } from 'react-router-dom';
import { FacilityLane } from '../../components/FacilityLane';
import { ReservationBar } from '../../components/ReservationBar';
import { IReservation } from '../../models/IReservation';

jest.mock('react-router-dom', () => ({
  Link: jest.fn(() => <div data-testid="link">Link</div>),
}));

jest.mock('../../components/ReservationBar', () => ({
  ReservationBar: jest.fn(() => (
    <div data-testid="reservation-bar">ReservationBar</div>
  )),
}));

const createFacility = () => ({
  id: 'f001',
  name: '設備001',
  system: {} as any,
});

const createReservations = (): IReservation[] => [
  {
    id: 'r001',
    subject: '予約1',
    description: 'r001-説明',
    startDate: dayjs('2021-07-01T10:00:00+09:00'),
    endDate: dayjs('2021-07-01T11:00:00+09:00'),
    facilityId: 'f001',
    system: {} as any,
  },
  {
    id: 'r002',
    subject: '予約2',
    description: 'r002-説明',
    startDate: dayjs('2021-07-01T14:00:00+09:00'),
    endDate: dayjs('2021-07-01T15:00:00+09:00'),
    facilityId: 'f001',
    system: {} as any,
  },
];

test('初期表示', () => {
  const { queryAllByTestId } = render(
    <FacilityLane
      backgroundColor="#f00"
      cellWidth={200}
      facility={createFacility()}
      reservations={createReservations()}
      date={dayjs('2021-07-01T10:00:00+09:00')}
    />,
  );
  // 予約の数だけ予約バーが表示されている
  const bars = queryAllByTestId('reservation-bar');
  expect(bars.length).toBe(2);
  // 予約バーに正しい引数が渡っていること
  expect(ReservationBar).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      backgroundColor: '#f00',
      beginHour: 8,
      reservation: createReservations()[0],
      hourWidth: 200,
      leftOffset: 100,
    }),
    {},
  );
  // セルのLink に正しい引数が渡っていること
  const link = queryAllByTestId('link');
  expect(link.length).toBe(13);
  expect(Link).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      className: 'timeCell',
      to: `/reservation/?date=${dayjs(
        '2021-07-01T08:00:00.000',
      ).toISOString()}`,
    }),
    {},
  );
  expect(Link).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({
      className: 'timeCell',
      to: `/reservation/?date=${dayjs(
        '2021-07-01T09:00:00.000',
      ).toISOString()}`,
    }),
    {},
  );
});
