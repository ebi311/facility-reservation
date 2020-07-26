import ISystem from './ISystem';
import { Moment } from 'moment';

export default interface IReservation {
  id: string;
  subject: string;
  facilityId: string;
  description?: string;
  startDate: Moment;
  endDate: Moment;
  system: ISystem;
}
