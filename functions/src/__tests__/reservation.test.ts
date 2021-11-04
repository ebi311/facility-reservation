/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, getNext, getRequest, getResponse } from './setup';
import * as target from '../reservations';
import { mocked } from 'ts-jest/utils';
import { IReservation } from '../models/IReservation';
import dayjs from 'dayjs';
import { validationResult } from 'express-validator';

const createFacility = (count: number) => {
  const array = Array.from(new Array(count));
  return array.map((_n, i) => {
    const n = (i + '').padStart(3, '0');
    return {
      id: n,
      data: () => ({
        subject: '予約' + n,
        system: {
          createDate: new Date('2021-06-01T00:00:00.000Z'),
          createUser: {
            displayName: 'test user-002',
            email: 'test.user002@example.com',
          },
          lastUpdate: new Date('2021-06-01T00:00:00.000Z'),
          lastUpdateUser: {
            displayName: 'test user-002',
            email: 'test.user002@example.com',
          },
        },
      }),
    } as { id: string; data: () => IReservation };
  });
};

let req: any, res: any, next: any;

beforeEach(() => {
  req = getRequest();
  res = getResponse();
  next = getNext();
  jest.clearAllMocks();
});

describe('GET: get list', () => {
  test('成功パターン', async () => {
    // モック
    const resData = createFacility(3);
    mocked(collection.get).mockResolvedValueOnce({
      docs: resData,
    });
    req.query = { date: '2021-07-01T09:00:00' };
    // テスト実行
    await target.__private__.get(req, res, next);
    expect(collection.where).nthCalledWith(
      1,
      'startDate',
      '>=',
      dayjs('2021-07-01T00:00:00').toDate(),
    );
    expect(collection.where).nthCalledWith(
      2,
      'startDate',
      '<=',
      dayjs('2021-07-02T00:00:00').toDate(),
    );
    const retData = resData.map((a) => ({
      ...a.data(),
      id: a.id,
    }));
    expect(res.json).toBeCalledWith(retData);
  });
  test('日付なし', async () => {
    // テスト実行
    await target.__private__.get(req, res, next);
    expect(res.status).toBeCalledWith(400);
  });
});

describe('GET: getById', () => {
  test('成功パターン', async () => {
    const resData = createFacility(1)[0];
    mocked(collection.doc).mockReturnValueOnce({
      id: resData.id,
      get: async () => ({
        exists: true,
        data: resData.data,
      }),
    });
    await target.__private__.getById(req, res, next);
    expect(res.json).toBeCalledWith({
      id: '000',
      subject: '予約000',
      system: {
        createDate: new Date('2021-06-01T00:00:00.000Z'),
        createUser: {
          displayName: 'test user-002',
          email: 'test.user002@example.com',
        },
        lastUpdate: new Date('2021-06-01T00:00:00.000Z'),
        lastUpdateUser: {
          displayName: 'test user-002',
          email: 'test.user002@example.com',
        },
      },
    });
  });
  test('存在しないパターン', async () => {
    const resData = createFacility(1)[0];
    mocked(collection.doc).mockReturnValueOnce({
      id: resData.id,
      get: async () => ({
        exists: false,
      }),
    });
    await target.__private__.getById(req, res, next);
    expect(res.status).toBeCalledWith(404);
    expect(res.json).not.toBeCalled();
  });
});

describe('Post', () => {
  test('成功パターン', async () => {
    // モック
    const sendData = {
      subject: '予約',
      facilityId: 'f001',
      startDate: '2021-07-01T15:00:00Z',
      endDate: '2021-07-01T16:00:00Z',
    };
    req.body = sendData;

    // テスト実行
    await target.__private__.post(req, res, next);
    expect(collection.add).toBeCalledWith({
      subject: '予約',
      facilityId: 'ref:facilities/f001',
      startDate: new Date('2021-07-01T15:00:00Z'),
      endDate: new Date('2021-07-01T16:00:00Z'),
      system: {
        createDate: new Date('2021-07-01T00:00:00.000Z'),
        createUser: {
          displayName: 'test user-001',
          email: 'test.user001@example.com',
        },
        lastUpdate: new Date('2021-07-01T00:00:00.000Z'),
        lastUpdateUser: {
          displayName: 'test user-001',
          email: 'test.user001@example.com',
        },
      },
    });
    expect(res.json).toBeCalledWith({ id: 'id-001' });
  });
  test('入力値エラー', async () => {
    mocked(validationResult).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => ['test'],
    } as any);
    await target.__private__.post(req, res, next);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({ errors: ['test'] });
  });
  test('例外発生エラー', async () => {
    // モック
    const sendData = {
      subject: '予約',
      facilityId: 'f001',
      startDate: '2021-07-01T15:00:00Z',
      endDate: '2021-07-01T16:00:00Z',
    };
    req.body = sendData;
    const error = new Error('test error');
    collection.add.mockRejectedValueOnce(error);
    // テスト実行
    await target.__private__.post(req, res, next);
    expect(next).toBeCalledWith(error);
  });
});

describe('Put', () => {
  // モック
  const sendData = {
    subject: '予約',
    facilityId: 'f001',
    startDate: '2021-07-01T15:00:00Z',
    endDate: '2021-07-01T16:00:00Z',
  };
  test('成功パターン', async () => {
    req.body = sendData;
    req.params = { id: '001' };
    // 更新前のデータ取得
    const resData = createFacility(1)[0];
    const update = jest.fn().mockResolvedValueOnce(true);
    mocked(collection.doc).mockReturnValueOnce({
      id: resData.id,
      update,
      get: async () => ({
        exists: true,
        data: resData.data,
      }),
    });

    // テスト実行
    await target.__private__.put(req, res, next);
    expect(update).toBeCalledWith({
      subject: '予約',
      facilityId: 'ref:facilities/f001',
      startDate: new Date('2021-07-01T15:00:00Z'),
      endDate: new Date('2021-07-01T16:00:00Z'),
      system: {
        createDate: new Date('2021-06-01T00:00:00.000Z'),
        createUser: {
          displayName: 'test user-002',
          email: 'test.user002@example.com',
        },
        lastUpdate: new Date('2021-07-01T00:00:00.000Z'),
        lastUpdateUser: {
          displayName: 'test user-001',
          email: 'test.user001@example.com',
        },
      },
    });
  });
  test('例外発生パターン', async () => {
    req.body = sendData;
    req.params = { id: '001' };
    const resData = createFacility(1)[0];
    const error = new Error('test error');
    const update = jest.fn().mockRejectedValueOnce(error);
    mocked(collection.doc).mockReturnValueOnce({
      id: resData.id,
      update,
      get: async () => ({
        exists: true,
        data: resData.data,
      }),
    });
    await target.__private__.put(req, res, next);
    expect(next).toBeCalledWith(error);
    expect(res.status).not.toBeCalled();
  });
  test('更新データが見つからないパターン', async () => {
    req.body = sendData;
    req.params = { id: '001' };
    mocked(collection.doc).mockReturnValueOnce({
      id: null,
      get: async () => ({
        exists: false,
      }),
    });
    await target.__private__.put(req, res, next);
    expect(res.status).toBeCalledWith(404);
    expect(res.status).toBeCalledTimes(1);
  });
});

describe('delete', () => {
  test('成功パターン', async () => {
    req.params = { id: '001' };
    const deleteFn = jest.fn().mockResolvedValueOnce({});
    mocked(collection.doc).mockReturnValueOnce({
      delete: deleteFn,
    });
    await target.__private__.delete(req, res, next);
    expect(res.status).toBeCalledWith(204);
  });
  test('例外発生パターン', async () => {
    req.params = { id: '001' };
    const error = new Error('test error');
    const deleteFn = jest.fn().mockRejectedValueOnce(error);
    mocked(collection.doc).mockReturnValueOnce({
      delete: deleteFn,
    });
    await target.__private__.delete(req, res, next);
    expect(next).toBeCalledWith(error);
    expect(res.status).not.toBeCalled();
  });
});
