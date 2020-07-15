import IFacility from './IFacility';

export default interface IFacilityPage {
  facility: IFacility;
  loading: boolean;
  errorMessage?: string;
}
