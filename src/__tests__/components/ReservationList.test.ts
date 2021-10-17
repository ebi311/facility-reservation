import * as target from '../../components/ReservationList';
import dayjs from 'dayjs';

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
