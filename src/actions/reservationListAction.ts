import { Dispatch } from 'redux';
import actionCreatorFactory from 'typescript-fsa';
import IReservation from '../status/IReservation';

const actionCreator = actionCreatorFactory('task-list');

export const loadTaskListAction = actionCreator.async<
  unknown,
  IReservation[],
  unknown
>('load-task-list');

const dummyData: IReservation[] = [
  {
    id: '001',
    subject: '',
    description: '',
    startDate: new Date('2020-08-01T01:00:00Z'),
    endDate: new Date('2020-08-01T02:00:00Z'),
    facilityId: '001',
    system: {
      createDate: new Date(),
      createUser: '',
      lastUpdate: new Date(),
      latUpdateUser: '',
    },
  },
  {
    id: '002',
    subject: '',
    description: '',
    startDate: new Date('2020-08-01T04:00:00Z'),
    endDate: new Date('2020-08-01T04:30:00Z'),
    facilityId: '002',
    system: {
      createDate: new Date(),
      createUser: '',
      lastUpdate: new Date(),
      latUpdateUser: '',
    },
  },
];
export const loadTaskList = async (dispatch: Dispatch): Promise<void> => {
  console.log(dispatch);
  loadTaskListAction.started({});
  // setTimeout で読み込みをシミュレート
  setTimeout(() => {
    loadTaskListAction.done({ result: dummyData, params: {} });
  }, 1000);
};
