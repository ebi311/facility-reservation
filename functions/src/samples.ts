import { Firestore } from '@google-cloud/firestore';
import express from 'express';

const firestore = new Firestore();

const createFacility = async (num: number) => {
  const id = ('000' + num).slice(-3);
  return await firestore.collection('facilities').add({
    name: '機材' + id,
    description: `機材${id}の詳細`,
    system: {
      createDate: new Date(),
      lastUpdate: new Date(),
      createUser: 'ebi311@gmail.com',
      lastUpdateUser: 'ebi311@gmail.com',
    },
  });
};

const createReservation = async (num: number, faId: string) => {
  const id = ('000' + num).slice(-3);
  return await firestore.collection('reservations').add({
    subject: '予約' + id,
    facilityId: `facilities/${faId}`,
    description: `機材${id}の詳細`,
    startDate: new Date('2020-08-01T00:00:00Z'),
    endDate: new Date('2020-08-01T01:00:00Z'),
    system: {
      createDate: new Date(),
      lastUpdate: new Date(),
      createUser: 'ebi311@gmail.com',
      lastUpdateUser: 'ebi311@gmail.com',
    },
  });
};

const app = express();

app.get('/', async (req, res) => {
  const fa1 = await createFacility(1);
  const fa2 = await createFacility(2);
  createReservation(1, fa1.id);
  createReservation(2, fa2.id);
  res.send('complete');
});

export default app;
