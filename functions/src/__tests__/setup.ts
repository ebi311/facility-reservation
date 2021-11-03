/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import mockdate from 'mockdate';

export const now = new Date('2021-07-01T00:00:00Z');
mockdate.set(now);

export const collection = {
  get: jest.fn(),
  doc: jest.fn(),
  add: jest.fn(async () => ({
    // add は追加したドキュメントを返す
    get: async () => ({
      id: 'id-001',
      name: 'test-name',
      note: 'test-note',
      system: {} as any,
    }),
  })),
  where: jest.fn().mockReturnThis(),
};

jest.mock('@google-cloud/firestore', () => ({
  Firestore: class {
    doc(id: string) {
      return `ref:${id}`;
    }

    collection() {
      return collection;
    }
  },
}));

jest.mock('express-validator', () => ({
  ...jest.requireActual('express-validator'),
  validationResult: jest.fn(() => ({
    isEmpty: () => true,
  })),
}));

export const getRequest = () =>
  ({
    query: {},
    params: {},
    user: {
      displayName: 'test user-001',
      email: 'test.user001@example.com',
    },
  } as any);
export const getResponse = () =>
  ({
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  } as any);
export const getNext = () => jest.fn();
