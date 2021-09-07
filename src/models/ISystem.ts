import { IUser } from './IUser';

export interface ISystem {
  createUser: IUser;
  createDate: Date;
  lastUpdateUser: IUser;
  lastUpdate: Date;
}
