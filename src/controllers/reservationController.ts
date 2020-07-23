import IReservation from '../status/IReservation';

import superagent from 'superagent';

export const getReservations = async (date: Date): Promise<IReservation[]> => {
  const result = await superagent.get('/api/reservations/').query({
    date: date.toISOString(),
  });
  return result.body as IReservation[];
};

export const getReservationById = async (id: string): Promise<IReservation> => {
  const result = await superagent.get('/api/reservations/' + id);
  return result.body as IReservation;
};

export const postReservation = async (
  data: IReservation,
): Promise<IReservation> => {
  const result = await superagent.post('/api/reservations/').send(data);
  return result.body as IReservation;
};

export const putReservation = async (
  data: Partial<IReservation>,
): Promise<IReservation> => {
  const result = await superagent
    .put('/api/reservations/' + (data.id || ''))
    .send(data);
  return result.body as IReservation;
};

export const deleteReservation = async (id: string): Promise<void> => {
  await superagent.delete('/api/reservations/' + id);
};
