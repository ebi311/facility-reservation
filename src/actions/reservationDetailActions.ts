import { Dispatch } from 'redux';
import actionCreatorFactory from 'typescript-fsa';
import {
  getReservationById,
  postReservation,
  putReservation,
  deleteReservation as deleteReservationById,
} from '../controllers/reservationController';
import IReservation from '../status/IReservation';
import { push } from 'connected-react-router';

const actionCreator = actionCreatorFactory('reservation-detail');

export const loadReservationAction = actionCreator.async<
  null,
  IReservation,
  null
>('load-reservation');

export const loadReservation = async (
  id: string,
  dispatch: Dispatch,
): Promise<void> => {
  // 読み込みの開始
  dispatch(loadReservationAction.started(null));
  // 非同期での読み込み
  const reservation = await getReservationById(id);
  dispatch(loadReservationAction.done({ params: null, result: reservation }));
};

export const asyncProcessAction = actionCreator.async<
  unknown,
  unknown,
  unknown
>('add-reservation');

export const addReservation = async (
  data: IReservation,
  dispatch: Dispatch,
): Promise<void> => {
  dispatch(asyncProcessAction.started({}));
  await postReservation(data);
  dispatch(asyncProcessAction.done({ params: {}, result: {} }));
  dispatch(push('/'));
};

export const updateReservation = async (
  data: Partial<IReservation>,
  dispatch: Dispatch,
): Promise<void> => {
  dispatch(asyncProcessAction.started({}));
  await putReservation(data);
  dispatch(asyncProcessAction.done({ params: {}, result: {} }));
  dispatch(push('/'));
};

export const deleteReservation = async (
  id: string,
  dispatch: Dispatch,
): Promise<void> => {
  dispatch(asyncProcessAction.started({}));
  await deleteReservationById(id);
  dispatch(asyncProcessAction.done({ params: {}, result: {} }));
  dispatch(push('/'));
};

/**
 * 予約詳細画面の初期値をセットする
 */
export const initReservationAction = actionCreator<Partial<IReservation>>(
  'set-reservation',
);
