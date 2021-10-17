/* eslint-disable @typescript-eslint/no-explicit-any */
import * as target from '../facilities';
// import { validationResult } from 'express-validator';

const collection = {
  get: jest.fn(),
  doc: jest.fn(),
};

jest.mock('@google-cloud/firestore', () => ({
  Firestore: class {
    collection = () => collection;
  },
}));

// jest.mock('express-validator');

const getRequest = () => ({} as any);
const getResponse = () =>
  ({
    json: jest.fn(),
  } as any);
const getNext = () => jest.fn();

let req: any, res: any, next: any;

beforeEach(() => {
  req = getRequest();
  res = getResponse();
  next = getNext();
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
  test('success', async () => {
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
});
