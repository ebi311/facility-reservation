import { ISystem } from './ISystem';

export interface IFacility {
  id: string;
  name: string;
  note?: string;
  system: ISystem;
}
