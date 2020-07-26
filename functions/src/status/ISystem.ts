import { Moment } from 'moment';
import moment from 'moment';

export default interface ISystem {
  createDate: Moment;
  lastUpdate: Moment;
  createUser: string;
  lastUpdateUser: string;
}

export const createInitSystem = (): ISystem => ({
  createDate: moment(0),
  createUser: '',
  lastUpdate: moment(0),
  lastUpdateUser: '',
});
