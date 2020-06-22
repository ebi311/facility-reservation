import { Dispatch } from 'redux';
import actionCreatorFactory from 'typescript-fsa';
import IReservation from '../status/IReservation';

const actionCreator = actionCreatorFactory('reservation-detail');

export const loadReservationAction = actionCreator.async<{}, IReservation, {}>(
  'load-reservation',
);

export const loadTask = async (id: string, dispatch: Dispatch) => {
  // 読み込みの開始
  dispatch(loadReservationAction.started({}));
  // 非同期での読み込み
  // setTimeout でシミュレート
  setTimeout(() => {
    const task: IReservation = {
      id: '001',
      subject: '',
      facilityId: '',
      startDate: new Date('2020-08-01T11:00:00Z'),
      endDate: new Date('2020-08-01T12:00:00Z'),
      description: '',
      system: {
        createDate: new Date(),
        createUser: '',
        lastUpdate: new Date(),
        latUpdateUser: '',
      },
    };
    dispatch(loadReservationAction.done({ params: {}, result: task }));
  }, 1000);
};
