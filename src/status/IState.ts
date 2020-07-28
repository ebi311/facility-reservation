import IFacilityPage from './IFacilityPage';
import IReservationDetailPage from './IReservationDetailPage';
import IReservationListPage from './IReservationListPage';

export default interface IState {
  reservationList: IReservationListPage;
  reservation: IReservationDetailPage;
  facility: IFacilityPage;
}
