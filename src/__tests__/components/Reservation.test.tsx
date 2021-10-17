/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Utils from '@date-io/dayjs';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { fireEvent, render, waitFor } from '@testing-library/react';
import dayjs from 'dayjs';
import MockDate from 'mockdate';
import React from 'react';
import { Reservation } from '../../components/Reservation';
import { getFacilities } from '../../controllers/facilityController';
import { IFacility } from '../../models/IFacility';
import { IReservation } from '../../models/IReservation';
import { IUser } from '../../models/IUser';

MockDate.set(new Date('2021-07-01T11:00:00+0900'));

jest.mock('../../controllers/facilityController', () => ({
  getFacilities: jest.fn().mockImplementation(
    async () =>
      [
        {
          id: 'f001',
          name: '設備001',
          system: {} as any,
        },
        {
          id: 'f002',
          name: '設備002',
          system: {} as any,
        },
      ] as IFacility[],
  ),
}));

jest.mock('../../controllers/reservationController', () => ({
  getReservation: jest.fn().mockImplementation(
    async () =>
      ({
        id: 'r001',
        subject: '予約1',
        description: 'r001-説明',
        startDate: dayjs('2021-07-01T10:00:00+0900'),
        endDate: dayjs('2021-07-01T11:00:00+0900'),
        facilityId: 'f001',
        system: {
          createDate: new Date('2021-07-01T08:00:00+0900'),
          createUser: {
            displayName: 'ebihara kenji',
            email: 'ebihara@example.com',
            face: 'http://example.com/face.png',
          },
          lastUpdate: new Date('2021-07-01T09:00:00+0900'),
          lastUpdateUser: {
            displayName: 'ebihara kenji',
            email: 'ebihara@example.com',
            face: 'http://example.com/face.png',
          },
        },
      } as IReservation),
  ),
  postReservation: jest.fn().mockImplementation(async () => 'r999'),
  putReservation: jest.fn().mockImplementation(async () => ({})),
}));

jest.mock('../../auth', () => ({
  getCurrentUser: () =>
    ({
      displayName: 'ebihara kenji',
      email: 'kenji@example.com',
    } as IUser),
}));

let replace: jest.Mock;

jest.mock(
  'react-router-dom',
  () =>
    ({
      useParams: jest.fn(() => ({ id: '' })),
      useHistory: () => {
        replace = jest.fn();
        return replace;
      },
    } as any),
);

test('新規の画面を開いたとき', async () => {
  const { asFragment, queryByText, getByLabelText } = render(
    <MuiPickersUtilsProvider utils={Utils}>
      <Reservation />
    </MuiPickersUtilsProvider>,
  );
  await waitFor(() => expect(getFacilities).toBeCalledTimes(1));
  const selectFacility = getByLabelText('設備');
  fireEvent.mouseDown(selectFacility);
  expect(!!queryByText('設備001')).toBeTruthy();
  expect(!!queryByText('設備002')).toBeTruthy();
  expect(asFragment()).toMatchSnapshot();
});
