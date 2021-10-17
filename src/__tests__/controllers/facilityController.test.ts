/* eslint-disable @typescript-eslint/no-explicit-any */
import * as target from '../../controllers/facilityController';
import { getAgent } from '../../agent';
import { mocked } from 'ts-jest/utils';

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

test('getFacilities', async () => {
  // モック定義
  const response = {
    body: [{ test: 'dummy' }],
  };
  agent.get.mockResolvedValueOnce(response);
  // テスト実行
  const result = await target.getFacilities();
  // 評価
  expect(result).toEqual(response.body);
  expect(agent.get).toHaveBeenCalledWith('/api/facilities');
});

test('getFacility', async () => {
  // モック定義
  const response = {
    body: { test: 'dummy' },
  };
  agent.get.mockResolvedValueOnce(response);
  // テスト実行
  const result = await target.getFacility('001');
  // 評価
  expect(result).toEqual(response.body);
  expect(agent.get).toHaveBeenCalledWith('/api/facilities/001');
});

test('postFacility', async () => {
  // モック定義
  const response = {
    body: { id: '001' },
  };
  const facility = {
    dummy: 'dummy',
  } as any;
  const send = jest.fn().mockResolvedValueOnce(response);
  agent.post.mockReturnValueOnce({ send });
  // テスト実行
  const result = await target.postFacility(facility);
  // 評価
  expect(result).toBe(response.body.id);
  expect(agent.post).toBeCalledWith('/api/facilities/');
  expect(send).toBeCalledWith(facility);
});

test('putFacility', async () => {
  // モック定義
  const facility = {
    id: '001',
  } as any;
  const send = jest.fn().mockResolvedValueOnce({});
  agent.put.mockReturnValueOnce({ send });
  // テスト実行
  await target.putFacility(facility);
  // 評価
  expect(agent.put).toBeCalledWith('/api/facilities/001');
  expect(send).toBeCalledWith(facility);
});

test('deleteFacility', async () => {
  agent.delete.mockResolvedValueOnce({});
  // テスト実行
  await target.deleteFacility('001');
  // 評価
  expect(agent.delete).toBeCalledWith('/api/facilities/001');
});
