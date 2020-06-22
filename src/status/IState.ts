import IFacilityPage from './IFacilityPage';
import IReservationListPage from './IReservationListPage';
import IReservationDetailPage from './IReservationDetailPage';

export default interface IState {
  reservationList: IReservationListPage;
  reservation: IReservationDetailPage;
  facility: IFacilityPage;
}
