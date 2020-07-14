import ISystem from './ISystem';

export default interface IReservation {
  id: string;
  subject: string;
  facilityId: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  system: ISystem;
}
