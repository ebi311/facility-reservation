import dayjs, { Dayjs } from 'dayjs';
import IUser from './IUser';

export default interface ISystem<T = Dayjs | Date> {
  createDate: T;
  lastUpdate: T;
  createUser: IUser;
  lastUpdateUser: IUser;
}

export const createInitSystem = (): ISystem => ({
  createDate: dayjs(0),
  createUser: {
    displayName: '',
    faceUrl: '',
  },
  lastUpdate: dayjs(0),
  lastUpdateUser: {
    displayName: '',
    faceUrl: '',
  },
});
