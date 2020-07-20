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
