import { Dayjs } from 'dayjs';
import { ISystem } from './ISystem';

export interface IReservation {
  id: string;
  facilityId: string;
  subject: string;
  description: string;
  startDate: Dayjs;
  endDate: Dayjs;
  system: ISystem;
}
