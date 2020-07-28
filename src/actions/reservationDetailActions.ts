import { Dispatch } from 'redux';
import actionCreatorFactory from 'typescript-fsa';
import {
  deleteReservation as deleteReservationById,
  getReservationById,
  postReservation,
  putReservation,
} from '../controllers/reservationController';
import IReservation from '../status/IReservation';

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
  const reservation = await getReservationById(id).catch(() => {
    dispatch(loadReservationAction.failed({ params: null, error: null }));
  });
  if (!reservation) return;
  dispatch(loadReservationAction.done({ params: null, result: reservation }));
};

export const asyncProcessAction = actionCreator.async<null, null, null>(
  'add-reservation',
);

export const addReservation = async (
  data: IReservation,
  dispatch: Dispatch,
): Promise<boolean> => {
  dispatch(asyncProcessAction.started(null));
  return postReservation(data)
    .then(() => {
      dispatch(asyncProcessAction.done({ params: null, result: null }));
      return true;
    })
    .catch(() => {
      dispatch(asyncProcessAction.failed({ params: null, error: null }));
      return false;
    });
};

export const updateReservation = async (
  data: Partial<IReservation>,
  dispatch: Dispatch,
): Promise<boolean> => {
  dispatch(asyncProcessAction.started(null));
  return putReservation(data)
    .then(() => {
      dispatch(asyncProcessAction.done({ params: null, result: null }));
      return true;
    })
    .catch(() => {
      dispatch(asyncProcessAction.failed({ params: null, error: null }));
      return false;
    });
};

export const deleteReservation = async (
  id: string,
  dispatch: Dispatch,
): Promise<boolean> => {
  dispatch(asyncProcessAction.started(null));
  return deleteReservationById(id)
    .then(() => {
      dispatch(asyncProcessAction.done({ params: null, result: null }));
      return true;
    })
    .catch(() => {
      dispatch(asyncProcessAction.failed({ params: null, error: null }));
      return false;
    });
};

/**
 * 予約詳細画面の初期値をセットする
 */
export const initReservationAction = actionCreator<Partial<IReservation>>(
  'set-reservation',
);
