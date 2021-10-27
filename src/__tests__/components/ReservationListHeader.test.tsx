/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Utils from '@date-io/dayjs';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { fireEvent, render } from '@testing-library/react';
import dayjs from 'dayjs';
import React, { createContext } from 'react';
import { ReservationListHeader } from '../../components/ReservationListHeader';

let CurrentDateContext: React.Context<any>;

jest.mock('../../components/ReservationList.tsx', () => {
  CurrentDateContext = createContext<any>({});
  return { CurrentDateContext };
});

const dispatch = jest.fn();

const customRender = () => {
  // React の useContext で返される値を定義する
  return render(
    <CurrentDateContext.Provider
      value={{ currentDate: dayjs('2021-07-01'), dispatch }}
    >
      <MuiPickersUtilsProvider utils={Utils}>
        <ReservationListHeader />
      </MuiPickersUtilsProvider>
    </CurrentDateContext.Provider>,
  );
};

jest.mock('react-router-dom', () => ({
  // eslint-disable-next-line react/display-name
  Link: React.forwardRef(() => <div>Link</div>),
}));

test('初期表示', () => {
  const res = customRender();
  const date = res.getByTestId('main-date');
  console.log(date.outerHTML);
  expect(date.querySelector('input')?.value).toBe('2021-07-01');
});

describe('ボタンクリック処理', () => {
  test('１日前 クリック', () => {
    const res = customRender();
    const prevButton = res.getByTestId('prev-button');
    fireEvent.click(prevButton);
    expect(dispatch).toBeCalledWith({ type: 'PrevDay' });
  });
  test('１日後 クリック', () => {
    const res = customRender();
    const nextButton = res.getByTestId('next-button');
    fireEvent.click(nextButton);
    expect(dispatch).toBeCalledWith({ type: 'NextDay' });
  });
});
