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
import {
  getReservation,
  postReservation,
} from '../../controllers/reservationController';
import { IFacility } from '../../models/IFacility';
import { IReservation } from '../../models/IReservation';
import { IUser } from '../../models/IUser';
import { useParams } from 'react-router-dom';
import { mocked } from 'ts-jest/utils';

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
  getReservation: jest.fn(
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
  postReservation: jest.fn(async () => 'r999'),
  putReservation: jest.fn(async () => ({})),
}));

jest.mock('../../auth', () => ({
  getCurrentUser: jest.fn(
    () =>
      ({
        displayName: 'ebihara kenji',
        email: 'kenji@example.com',
      } as IUser),
  ),
}));

let replace: jest.Mock;

jest.mock(
  'react-router-dom',
  () =>
    ({
      useParams: jest.fn(() => ({ id: '' })),
      useHistory: () => {
        replace = jest.fn();
        return { replace };
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
  // 設備の選択肢が正しく表示されているか
  fireEvent.mouseDown(selectFacility);
  expect(!!queryByText('設備001')).toBeTruthy();
  expect(!!queryByText('設備002')).toBeTruthy();
  // スナップショットの確認
  expect(asFragment()).toMatchSnapshot();
});

test('既存の画面を開いたとき', async () => {
  mocked(useParams).mockReturnValueOnce({ id: 'r001' });
  const { getByTestId, getByLabelText } = render(
    <MuiPickersUtilsProvider utils={Utils}>
      <Reservation />
    </MuiPickersUtilsProvider>,
  );
  await waitFor(() => expect(getReservation).toBeCalledTimes(1));
  // 読み込んだデータが正しく表示されているか
  const selectFacility = getByLabelText('設備') as HTMLDivElement;
  expect(selectFacility.textContent).toBe('設備001');

  const startDate = getByTestId('start-date').querySelector('input');
  expect(startDate?.value).toBe('2021/07/01 10:00');

  const endDate = getByTestId('end-date').querySelector('input');
  expect(endDate?.value).toBe('2021/07/01 11:00');

  const subject = getByTestId('subject').querySelector('input');
  expect(subject?.value).toBe('予約1');

  const description = getByTestId('description').querySelector('textarea');
  expect(description?.value).toBe('r001-説明');

  const create = getByTestId('create');
  expect(create.textContent).toBe('ebihara kenji2021-07-01 08:00');

  const update = getByTestId('update');
  expect(update.textContent).toBe('ebihara kenji2021-07-01 09:00');
});

test('保存ボタンを押したとき', async () => {
  const { getByText, getByTestId, getByLabelText } = render(
    <MuiPickersUtilsProvider utils={Utils}>
      <Reservation />
    </MuiPickersUtilsProvider>,
  );
  await waitFor(() => expect(getFacilities).toBeCalledTimes(1));
  // 必須項目を入力せずに 保存ボタン を押す
  fireEvent.click(getByText('保存'));
  // 保存関数が呼ばれないこと
  expect(postReservation).not.toBeCalled();
  // 設備を選択する
  const selectFacility = getByLabelText('設備');
  fireEvent.mouseDown(selectFacility);
  fireEvent.click(getByText('設備001'));
  // 目的 のテキストボックスに入力する
  const subject = getByTestId('subject').querySelector(
    'input',
  ) as HTMLInputElement;
  fireEvent.change(subject, { target: { value: '予約テスト' } });
  // 詳細 のテキストアリアに入力する
  const description = getByTestId('description').querySelector(
    'textarea',
  ) as HTMLTextAreaElement;
  fireEvent.change(description, { target: { value: '説明' } });
  // 保存ボタンを押す
  fireEvent.click(getByText('保存'));
  await waitFor(() => expect(postReservation).toBeCalled());
  // 保存処理が正しい値で実行される
  expect(postReservation).toBeCalledWith({
    id: '',
    subject: '予約テスト',
    description: '説明',
    startDate: dayjs('2021-07-01T02:00:00.000Z'),
    endDate: dayjs('2021-07-01T03:00:00.000Z'),
    facilityId: 'f001',
    system: {
      createDate: new Date('2021-07-01T02:00:00.000Z'),
      createUser: {
        displayName: 'ebihara kenji',
        email: 'kenji@example.com',
        face: '',
      },
      lastUpdate: new Date('2021-07-01T02:00:00.000Z'),
      lastUpdateUser: {
        displayName: 'ebihara kenji',
        email: 'kenji@example.com',
        face: '',
      },
    },
  });
});
