import ISystem from './ISystem';

export default interface IFacility {
  id: string;
  name: string;
  description: string;
  system: ISystem;
}
