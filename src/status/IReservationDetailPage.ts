import IReservation from './IReservation';
import IFacility from './IFacility';

export default interface IReservationDetailPage {
  reservation: IReservation;
  facilityList: IFacility[];
  loading: boolean;
}
