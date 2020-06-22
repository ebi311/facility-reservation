export default interface ISystem {
  createDate: Date;
  lastUpdate: Date;
  createUser: string;
  latUpdateUser: string;
}

export const createInitSystem = (): ISystem => ({
  createDate: new Date(0),
  createUser: '',
  lastUpdate: new Date(0),
  latUpdateUser: '',
});
