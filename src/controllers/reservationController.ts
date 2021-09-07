import { Dayjs } from 'dayjs';
import { getAgent } from '../agent';
import { IReservation } from '../models/IReservation';

export const getReservations = async (date: Dayjs): Promise<IReservation[]> => {
  const agent = await getAgent();
  const result = await agent
    .get('/api/reservations')
    .query({ date: date.toISOString() });
  return result.body as IReservation[];
};

export const getReservation = async (id: string): Promise<IReservation> => {
  const agent = await getAgent();
  const result = await agent.get('/api/reservations/' + encodeURIComponent(id));
  return result.body as IReservation;
};

export const postReservation = async (
  reservation: IReservation,
): Promise<string> => {
  const agent = await getAgent();
  const result = await agent.post('/api/reservations/').send(reservation);
  return result.body.id;
};

export const putReservation = async (
  reservation: IReservation,
): Promise<void> => {
  const agent = await getAgent();
  await agent
    .put('/api/reservations/' + encodeURIComponent(reservation.id))
    .send(reservation);
};

export const deleteReservation = async (id: string): Promise<void> => {
  const agent = await getAgent();
  await agent.delete('/api/reservations/' + encodeURIComponent(id));
};
