/* eslint-disable @typescript-eslint/no-explicit-any */
import { validationResult } from 'express-validator';
import * as target from '../facilities';
import { mocked } from 'ts-jest/utils';
import { collection, getNext, getRequest, getResponse, now } from './setup';

let req: any, res: any, next: any;

beforeEach(() => {
  req = getRequest();
  res = getResponse();
  next = getNext();
  jest.clearAllMocks();
});

describe('GET: getList', () => {
  test('成功パターン', async () => {
    // モック
    const snapshot = {
      docs: [
        {
          id: '001',
          data: () => ({
            name: 'name001',
          }),
        },
        {
          id: '002',
          data: () => ({
            name: 'name002',
          }),
        },
      ],
    };
    collection.get.mockResolvedValueOnce(snapshot);
    // テスト実行
    await target.__private__.getList(req, res, next);
    // 評価
    expect(res.json).toBeCalledWith([
      { id: '001', name: 'name001' },
      { id: '002', name: 'name002' },
    ]);
    expect(next).not.toBeCalled();
  });
  test('例外発生パターン', async () => {
    // モック
    const error = new Error('dummy');
    collection.get.mockRejectedValueOnce(error);
    // テスト実行
    await target.__private__.getList(req, res, next);
    // 評価
    expect(res.json).not.toBeCalled();
    expect(next).toBeCalledWith(error);
  });
});

describe('GET: /:id', () => {
  test('成功パターン', async () => {
    // モック
    req.params = { id: '001' };
    collection.doc.mockReturnValueOnce({
      id: '001',
      get: collection.get,
    });
    const snapshot = {
      exists: true,
      data: () => ({
        name: 'name001',
      }),
    };
    collection.get.mockResolvedValueOnce(snapshot);
    // テスト実行
    await target.__private__.getById(req, res, next);
    expect(res.json).toBeCalledWith({
      id: '001',
      name: 'name001',
    });
  });
  test('例外パターン', async () => {
    // モック
    req.params = { id: '001' };
    collection.doc.mockReturnValueOnce({
      id: '001',
      get: collection.get,
    });
    const error = new Error('test error');
    collection.get.mockRejectedValueOnce(error);
    // テスト実行
    await target.__private__.getById(req, res, next);
    expect(next).toBeCalledWith(error);
    expect(res.json).not.toBeCalled();
  });
});

describe('add', () => {
  test('成功', async () => {
    mocked(validationResult).mockReturnValueOnce({
      isEmpty: () => true,
    } as any);
    // テスト実行
    req.body = {
      id: '001',
      name: 'test-name',
      note: 'test-note',
      system: {} as any,
    };
    await target.__private__.post(req, res, next);
    expect(collection.add).toBeCalledWith({
      name: 'test-name',
      note: 'test-note',
      system: {
        createDate: now,
        createUser: {
          displayName: 'test user-001',
          email: 'test.user001@example.com',
        },
        lastUpdate: now,
        lastUpdateUser: {
          displayName: 'test user-001',
          email: 'test.user001@example.com',
        },
      },
    });
    expect(next).not.toBeCalled();
    expect(res.json).toBeCalled();
  });
  test('例外発生', async () => {
    mocked(validationResult).mockReturnValueOnce({
      isEmpty: () => true,
    } as any);
    // テスト実行
    req.body = {
      id: '001',
      name: 'test-name',
      note: 'test-note',
      system: {} as any,
    };
    const error = new Error('test error');
    collection.add.mockRejectedValueOnce(error);
    await target.__private__.post(req, res, next);
    expect(next).toBeCalledWith(error);
    expect(res.json).not.toBeCalled();
  });
});

describe('update', () => {
  test('成功パターン', async () => {
    mocked(validationResult).mockReturnValueOnce({
      isEmpty: () => true,
    } as any);
    collection.get.mockReturnValueOnce({
      exists: true,
      data: () => ({
        name: 'name001',
      }),
    });
    const update = jest.fn().mockResolvedValue('');
    collection.doc.mockReturnValueOnce({
      id: '001',
      get: collection.get,
      update,
    });
    // テスト実行
    req.params = '001';
    req.body = {
      id: '001',
      name: 'test-name',
      note: 'test-note',
      system: {} as any,
    };
    await target.__private__.put(req, res, next);
    expect(update).toBeCalledWith({
      name: 'test-name',
      note: 'test-note',
      system: {
        lastUpdate: now,
        lastUpdateUser: {
          displayName: 'test user-001',
          email: 'test.user001@example.com',
        },
      },
    });
    expect(res.status).toBeCalledWith(204);
    expect(next).not.toBeCalledWith();
  });
  test('例外発生パターン', async () => {
    mocked(validationResult).mockReturnValueOnce({
      isEmpty: () => true,
    } as any);
    collection.get.mockReturnValueOnce({
      exists: true,
      data: () => ({
        name: 'name001',
      }),
    });
    const error = new Error('test error');
    const update = jest.fn().mockRejectedValue(error);
    collection.doc.mockReturnValueOnce({
      id: '001',
      get: collection.get,
      update,
    });
    // テスト実行
    req.params = '001';
    req.body = {
      id: '001',
      name: 'test-name',
      note: 'test-note',
      system: {} as any,
    };
    await target.__private__.put(req, res, next);
    expect(update).toBeCalledWith({
      name: 'test-name',
      note: 'test-note',
      system: {
        lastUpdate: now,
        lastUpdateUser: {
          displayName: 'test user-001',
          email: 'test.user001@example.com',
        },
      },
    });
    expect(res.status).not.toBeCalled();
    expect(next).toBeCalledWith(error);
  });
});
