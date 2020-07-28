import IFacility from './IFacility';
import IReservation from './IReservation';

export default interface ITaskListPage {
  reservationList: IReservation[];
  facilities: IFacility[];
  date: Date;
  loading: boolean;
  errorMessage?: string;
}
