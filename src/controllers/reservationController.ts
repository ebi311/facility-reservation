import IReservation from '../status/IReservation';

const dummyData: IReservation[] = [
  {
    id: '001',
    subject: 'reservation-1',
    description: '',
    startDate: new Date('2020-08-01T01:00:00Z'),
    endDate: new Date('2020-08-01T02:00:00Z'),
    facilityId: 'f-001',
    system: {
      createDate: new Date(),
      createUser: '',
      lastUpdate: new Date(),
      latUpdateUser: '',
    },
  },
  {
    id: '002',
    subject: 'reservation-2',
    description: '',
    startDate: new Date('2020-08-01T03:30:00Z'),
    endDate: new Date('2020-08-01T04:30:00Z'),
    facilityId: 'f-002',
    system: {
      createDate: new Date(),
      createUser: '',
      lastUpdate: new Date(),
      latUpdateUser: '',
    },
  },
];

export const loadReservations = (_date: Date): Promise<IReservation[]> => {
  // setTimeout で読み込みをシミュレート
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve(dummyData);
    }, 1000);
  });
};
