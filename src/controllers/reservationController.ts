import IReservation from '../status/IReservation';

import superagent from 'superagent';

export const getReservations = async (date: Date): Promise<IReservation[]> => {
  const result = await superagent.get('/api/reservations/').query({
    date: date.toISOString(),
  });
  console.log(result.body);
  return result.body as IReservation[];
};
