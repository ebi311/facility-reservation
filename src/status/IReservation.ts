import ISystem from './ISystem';
import { Dayjs } from 'dayjs';

export default interface IReservation {
  id: string;
  subject: string;
  facilityId: string;
  description?: string;
  startDate: Dayjs;
  endDate: Dayjs;
  system: ISystem;
}
