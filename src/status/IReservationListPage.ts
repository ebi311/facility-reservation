import IReservation from './IReservation';
import IFacility from './IFacility';

export default interface ITaskListPage {
  reservationList: IReservation[];
  facilities: IFacility[];
  date: Date;
  loading: boolean;
  errorMessage?: string;
}
