import IFacility from '../status/IFacility';

export const dummyData: IFacility[] = [
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

export const getFacilities = (): Promise<IFacility[]> => {
  // シミュレート
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve(dummyData);
    }, 1000);
  });
};

export const getFacility = (id: string): Promise<IFacility> => {
  return new Promise((resolve, _reject) => {
    const facility = dummyData.find(data => data.id === id);
    setTimeout(() => {
      resolve(facility);
    }, 1000);
  });
};
