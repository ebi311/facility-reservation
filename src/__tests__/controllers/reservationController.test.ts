/* eslint-disable @typescript-eslint/no-explicit-any */
import * as target from '../../controllers/reservationController';
import { getAgent } from '../../agent';
import { mocked } from 'ts-jest/utils';
import dayjs from 'dayjs';

jest.mock('../../agent');

const agent = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

mocked(getAgent).mockImplementation(() => {
  return new Promise((resolve) => {
    resolve(agent as any);
  });
});

test('getReservations', async () => {
  // モック定義
  const response = {
    body: [{ test: 'dummy' }],
  };
  const query = jest.fn().mockResolvedValueOnce(response);
  agent.get.mockReturnValueOnce({ query });
  const date = dayjs();
  // テスト実行
  const result = await target.getReservations(date);
  // 評価
  expect(result).toEqual(response.body);
  expect(agent.get).toBeCalledWith('/api/reservations');
  expect(query).toBeCalledWith({ date: date.toISOString() });
});

test('getReservation', async () => {
  // モック定義
  const response = {
    body: { test: 'dummy' },
  };
  agent.get.mockResolvedValueOnce(response);
  // テスト実行
  const result = await target.getReservation('001');
  // 評価
  expect(result).toEqual(response.body);
  expect(agent.get).toHaveBeenCalledWith('/api/reservations/001');
});

test('postReservation', async () => {
  // モック定義
  const response = {
    body: { id: '001' },
  };
  const reservation = {
    dummy: 'dummy',
  } as any;
  const send = jest.fn().mockResolvedValueOnce(response);
  agent.post.mockReturnValueOnce({ send });
  // テスト実行
  const result = await target.postReservation(reservation);
  // 評価
  expect(result).toBe(response.body.id);
  expect(agent.post).toBeCalledWith('/api/reservations/');
  expect(send).toBeCalledWith(reservation);
});

test('putReservation', async () => {
  // モック定義
  const reservation = {
    id: '001',
  } as any;
  const send = jest.fn().mockResolvedValueOnce({});
  agent.put.mockReturnValueOnce({ send });
  // テスト実行
  await target.putReservation(reservation);
  // 評価
  expect(agent.put).toBeCalledWith('/api/reservations/001');
  expect(send).toBeCalledWith(reservation);
});

test('deleteReservation', async () => {
  agent.delete.mockResolvedValueOnce({});
  // テスト実行
  await target.deleteReservation('001');
  // 評価
  expect(agent.delete).toBeCalledWith('/api/reservations/001');
});
