import IFacility from '../status/IFacility';

const dummyData: IFacility[] = [
  {
    description: '',
    id: 'f001',
    name: 'f-001',
    system: {
      createDate: new Date(),
      createUser: 'user001',
      lastUpdate: new Date(),
      latUpdateUser: 'user002',
    },
  },
  {
    description: '',
    id: 'f002',
    name: 'f-002',
    system: {
      createDate: new Date(),
      createUser: 'user001',
      lastUpdate: new Date(),
      latUpdateUser: 'user002',
    },
  },
];

export const loadFacilities = (): Promise<IFacility[]> => {
  // シミュレート
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve(dummyData);
    }, 1000);
  });
};
