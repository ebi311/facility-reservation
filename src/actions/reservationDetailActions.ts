import { Dispatch } from 'redux';
import actionCreatorFactory from 'typescript-fsa';
import { getReservationById } from '../controllers/reservationController';
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
  const reservation = await getReservationById(id);
  dispatch(loadReservationAction.done({ params: null, result: reservation }));
};
