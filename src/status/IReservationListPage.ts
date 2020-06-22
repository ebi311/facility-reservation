import IReservation from './IReservation';

export default interface ITaskListPage {
  reservationList: IReservation[];
  loading: boolean;
}
