import ISystem from './ISystem';
import { Dayjs } from 'dayjs';

export default interface IReservation<T = Dayjs | Date> {
  id: string;
  subject: string;
  facilityId: string;
  description?: string;
  startDate: T;
  endDate: T;
  system: ISystem<T>;
}
