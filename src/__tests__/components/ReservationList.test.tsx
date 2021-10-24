/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Utils from '@date-io/dayjs';
import { createMuiTheme } from '@material-ui/core/styles';
import MuiPickersUtilsProvider from '@material-ui/pickers/MuiPickersUtilsProvider';
import { render, waitFor } from '@testing-library/react';
import dayjs from 'dayjs';
import MockDate from 'mockdate';
import React from 'react';
import * as target from '../../components/ReservationList';
import { getFacilities } from '../../controllers/facilityController';

MockDate.set(new Date('2021-07-01T11:00:00+0900'));

jest.mock('../../controllers/facilityController.ts');
jest.mock('../../controllers/reservationController.ts');

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
      <target.ReservationList></target.ReservationList>
    </MuiPickersUtilsProvider>,
  );
};

describe('Component', () => {
  test('初期処理', async () => {
    const res = customRender();
    await waitFor(() => expect(getFacilities).toBeCalled());
  });
});
