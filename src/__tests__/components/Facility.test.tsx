/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, waitFor } from '@testing-library/react';
import dayjs from 'dayjs';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Facility } from '../../components/Facility';
import { IFacility } from '../../models/IFacility';
import mockdate from 'mockdate';
import { mocked } from 'ts-jest/utils';
import {
  deleteFacility,
  getFacility,
  postFacility,
  putFacility,
} from '../../controllers/facilityController';

mockdate.set(new Date('2021-07-01T00:00:00'));

jest.mock('../../auth', () => ({
  getCurrentUser: () => ({
    displayName: 'test001',
    email: 'test001@example.com',
    photoURL: 'https://example.com/face/001',
  }),
}));

jest.mock('../../controllers/facilityController');

const history = {
  push: jest.fn(),
  replace: jest.fn(),
};

jest.mock('react-router-dom', () => ({
  useHistory: () => history,
  useParams: jest.fn(() => ({})),
}));

const createFacility = () => ({
  id: 'f001',
  name: '設備001',
  note: '説明001',
  system: {
    createDate: new Date('2021-06-01T00:00:00'),
    createUser: {
      displayName: 'test001',
      email: 'test001@example.com',
    },
    lastUpdateUser: {
      displayName: 'test002',
      email: 'test002@example.com',
    },
    lastUpdate: new Date('2021-06-02T00:00:00'),
  },
});

beforeEach(() => {
  mocked(useParams).mockReturnValue({});
});

describe('初期表示', () => {
  test('新規作成表示', () => {
    // テスト実行
    const { asFragment, getByTestId, queryByTestId } = render(<Facility />);
    // スナップショットの確認
    expect(asFragment()).toMatchSnapshot();
    // 各項目の初期値が表示されているか
    const facilityNameTextbox = getByTestId('facility-name').querySelector(
      'input',
    );
    expect(facilityNameTextbox?.value).toBe('');
    const noteTextbox = getByTestId('note').querySelector('textarea');
    expect(noteTextbox?.value).toBe('');
    const create = getByTestId('create');
    expect(create.textContent).toBe('test0012021-07-01 00:00');
    const update = getByTestId('update');
    expect(update.textContent).toBe('test0012021-07-01 00:00');
    const deleteButton = queryByTestId('delete-button');
    expect(!!deleteButton).toBeFalsy();
  });
  test('既存データ表示', async () => {
    // モック
    mocked(useParams).mockReturnValue({ id: '001' });
    mocked(getFacility).mockResolvedValueOnce(createFacility());
    // テスト実行
    const { getByTestId, queryByTestId } = render(<Facility />);
    await waitFor(() => {
      const facilityNameTextbox = getByTestId('facility-name').querySelector(
        'input',
      );
      return expect(facilityNameTextbox?.value).toBe('設備001');
    });
    const noteTextbox = getByTestId('note').querySelector('textarea');
    expect(noteTextbox?.value).toBe('説明001');
    const create = getByTestId('create');
    expect(create.textContent).toBe('test0012021-06-01 00:00');
    const update = getByTestId('update');
    expect(update.textContent).toBe('test0022021-06-02 00:00');
    const deleteButton = queryByTestId('delete-button');
    expect(!!deleteButton).toBeTruthy();
  });
});

describe('イベント処理', () => {
  test('設備名・説明変更', () => {
    const { getByTestId } = render(<Facility />);
    // イベントを発行するたびに getByXXX で取り直す必要があるので、関数とする
    const facilityNameTextbox = () =>
      getByTestId('facility-name').querySelector('input') as HTMLInputElement;
    const noteTextbox = () =>
      getByTestId('note').querySelector('textarea') as HTMLTextAreaElement;
    // テキストボックスの変更
    fireEvent.change(facilityNameTextbox(), { target: { value: '設備000' } });
    fireEvent.change(noteTextbox(), { target: { value: '説明000' } });
    expect(facilityNameTextbox().value).toBe('設備000');
    expect(noteTextbox().value).toBe('説明000');
  });
  test('削除ボタン クリック', async () => {
    // モック
    mocked(useParams).mockReturnValue({ id: '001' });
    mocked(getFacility).mockResolvedValueOnce(createFacility());
    // テスト実行
    const { getByTestId } = render(<Facility />);
    const deleteButton = getByTestId('delete-button');
    fireEvent.click(deleteButton);
    expect(deleteFacility).toBeCalledWith('001');
    await waitFor(() => expect(history.push).toBeCalledWith('/'));
  });
  test('新規 保存ボタン クリック', async () => {
    // モック
    mocked(postFacility).mockResolvedValueOnce('999');
    const { getByTestId } = render(<Facility />);
    // 保存ボタンクリック
    const saveButton = () => getByTestId('save-button') as HTMLButtonElement;
    fireEvent.click(saveButton());
    // 入力エラーになり、保存処理は実行されない
    expect(postFacility).not.toBeCalled();
    expect(putFacility).not.toBeCalled();
    // 入力して、再度保存する
    const facilityNameTextbox = getByTestId('facility-name').querySelector(
      'input',
    ) as HTMLInputElement;
    const noteTextbox = getByTestId('note').querySelector(
      'textarea',
    ) as HTMLTextAreaElement;
    fireEvent.change(facilityNameTextbox, { target: { value: '設備999' } });
    fireEvent.change(noteTextbox, { target: { value: '説明999' } });
    fireEvent.click(saveButton());
    expect(postFacility).not.toBeCalledWith({
      name: '設備999',
      note: '説明999',
    });
    await waitFor(() =>
      expect(history.replace).toBeCalledWith('/facility/999'),
    );
  });
  test('更新 保存ボタン クリック', async () => {
    // モック
    mocked(useParams).mockReturnValue({ id: '001' });
    mocked(getFacility).mockResolvedValueOnce(createFacility());
    mocked(postFacility).mockResolvedValueOnce('999');
    // テスト実行
    const { getByTestId } = render(<Facility />);
    // 読み込みが終わるまで待つ
    await waitFor(() => {
      const facilityNameTextbox = getByTestId('facility-name').querySelector(
        'input',
      );
      return expect(facilityNameTextbox?.value).toBe('設備001');
    });
    const saveButton = () => getByTestId('save-button') as HTMLButtonElement;
    // 入力して、再度保存する
    const facilityNameTextbox = getByTestId('facility-name').querySelector(
      'input',
    ) as HTMLInputElement;
    const noteTextbox = getByTestId('note').querySelector(
      'textarea',
    ) as HTMLTextAreaElement;
    fireEvent.change(facilityNameTextbox, { target: { value: '設備999' } });
    fireEvent.change(noteTextbox, { target: { value: '説明999' } });
    fireEvent.click(saveButton());
    expect(putFacility).not.toBeCalledWith({
      name: '設備999',
      note: '説明999',
    });
  });
});
