/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Utils from '@date-io/dayjs';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { render, waitFor } from '@testing-library/react';
import dayjs from 'dayjs';
import MockDate from 'mockdate';
import React from 'react';
import { FacilityLane } from '../../components/FacilityLane';
import * as target from '../../components/ReservationList';
import { getFacilities } from '../../controllers/facilityController';
import { getReservations } from '../../controllers/reservationController';
import { IFacility } from '../../models/IFacility';

MockDate.set(new Date('2021-07-01T11:00:00+0900'));

jest.mock('../../controllers/facilityController.ts', () => ({
  getFacilities: jest.fn(
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
jest.mock('../../controllers/reservationController.ts', () => ({
  getReservations: jest.fn(async () => [
    {
      id: 'r001',
      subject: '予約1',
      description: 'r001-説明',
      startDate: dayjs('2021-07-01T10:00:00+0900'),
      endDate: dayjs('2021-07-01T11:00:00+0900'),
      facilityId: 'f001',
    },
    {
      id: 'r002',
      subject: '予約2',
      description: 'r002-説明',
      startDate: dayjs('2021-07-01T14:00:00+0900'),
      endDate: dayjs('2021-07-01T15:00:00+0900'),
      facilityId: 'f002',
    },
    {
      id: 'r003',
      subject: '予約3',
      description: 'r003-説明',
      startDate: dayjs('2021-07-01T14:00:00+0900'),
      endDate: dayjs('2021-07-01T15:00:00+0900'),
      facilityId: 'f001',
    },
  ]),
}));
jest.mock('../../components/FacilityLane.tsx', () => ({
  FacilityLane: jest.fn(
    () => (<div data-testid="facility-lane">FacilityLane</div>) as any,
  ),
}));
jest.mock('../../components/ReservationListHeader.tsx', () => ({
  ReservationListHeader: () => (<div>ReservationListHeader</div>) as any,
}));

describe('reducerProcesses', () => {
  describe('ChangeDate', () => {
    test('payload 有り', () => {
      const beforeState: target.StateType = {
        currentDate: dayjs('2021-01-01T00:00:00+09:00'),
      };
      const action: target.Action = {
        type: 'ChangeDate',
        payload: dayjs('2021-01-02T00:00:00+09:00'),
      };
      const result = target.reducerProcesses.ChangeDate(beforeState, action);
      expect(result).toEqual({
        currentDate: dayjs('2021-01-02T00:00:00+09:00'),
      });
    });

    test('payload なし', () => {
      const beforState: target.StateType = {
        currentDate: dayjs('2021-01-01T00:00:00+09:00'),
      };
      const action: target.Action = {
        type: 'ChangeDate',
      };
      const result = target.reducerProcesses.ChangeDate(beforState, action);
      expect(result).toBe(beforState);
    });
  });

  test('NextDay', () => {
    const beforeState: target.StateType = {
      currentDate: dayjs('2021-01-01T00:00:00+09:00'),
    };
    const action: target.Action = {
      type: 'NextDay',
    };
    const result = target.reducerProcesses.NextDay(beforeState, action);
    expect(result).toEqual({
      currentDate: dayjs('2021-01-01T00:00:00+09:00').add(1, 'day'),
    });
  });
  test('PrefDay', () => {
    const beforeState: target.StateType = {
      currentDate: dayjs('2021-01-01T00:00:00+09:00'),
    };
    const action: target.Action = {
      type: 'PrevDay',
    };
    const result = target.reducerProcesses.PrevDay(beforeState, action);
    expect(result).toEqual({
      currentDate: dayjs('2021-01-01T00:00:00+09:00').add(-1, 'day'),
    });
  });
});

const customRender = () => {
  return render(
    <MuiPickersUtilsProvider utils={Utils}>
      <target.ReservationList />
    </MuiPickersUtilsProvider>,
  );
};

describe('Component', () => {
  test('初期処理', async () => {
    const { getAllByTestId } = customRender();
    // 初期処理のデータを読み込む関数が呼ばれているか
    await waitFor(() => expect(getFacilities).toBeCalled());
    await waitFor(() => expect(getReservations).toBeCalled());
    // 設備レーンの数があっているか
    const facilityLanes = getAllByTestId('facility-lane');
    expect(facilityLanes.length).toBe(2);
    // 設備レーンのコンポーネントに、適切な値が渡っているか
    // 設備ロード後と予約ロード後の2回レンダリングされるため、2行 x 2 回 = 4回 呼ばれる
    // 予約がロードされた 3,4 回目の値をチェックする。
    expect(FacilityLane).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        facility: {
          id: 'f001',
          name: '設備001',
          system: {} as any,
        },
        reservations: [
          {
            id: 'r001',
            subject: '予約1',
            description: 'r001-説明',
            startDate: dayjs('2021-07-01T10:00:00+0900'),
            endDate: dayjs('2021-07-01T11:00:00+0900'),
            facilityId: 'f001',
          },
          {
            id: 'r003',
            subject: '予約3',
            description: 'r003-説明',
            startDate: dayjs('2021-07-01T14:00:00+0900'),
            endDate: dayjs('2021-07-01T15:00:00+0900'),
            facilityId: 'f001',
          },
        ],
      }),
      {},
    );
    expect(FacilityLane).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        facility: {
          id: 'f002',
          name: '設備002',
          system: {} as any,
        },
        reservations: [
          {
            id: 'r002',
            subject: '予約2',
            description: 'r002-説明',
            startDate: dayjs('2021-07-01T14:00:00+0900'),
            endDate: dayjs('2021-07-01T15:00:00+0900'),
            facilityId: 'f002',
          },
        ],
      }),
      {},
    );
  });
});
