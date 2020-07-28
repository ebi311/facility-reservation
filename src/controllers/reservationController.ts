import { Moment } from 'moment';
import superagent from 'superagent';
import IReservation from '../status/IReservation';
import moment from 'moment';

export const getReservations = async (date: Date): Promise<IReservation[]> => {
  const mDate = moment(date).startOf('day');
  const result = await superagent
    .get('/api/reservations/')
    .query({
      date: mDate.toISOString(),
    })
    .catch(e => {
      console.error(e);
      throw e;
    });
  return result.body as IReservation[];
};

export const getReservationById = async (id: string): Promise<IReservation> => {
  const result = await superagent.get('/api/reservations/' + id).catch(e => {
    console.error(e);
    throw e;
  });
  return result.body as IReservation;
};

export const postReservation = async (
  data: IReservation,
): Promise<IReservation> => {
  const result = await superagent
    .post('/api/reservation/')
    .send(data)
    .catch(e => {
      console.error(e);
      throw e;
    });
  return result.body as IReservation;
};

export const putReservation = async (
  data: Partial<IReservation>,
): Promise<IReservation> => {
  const result = await superagent
    .put('/api/reservations/' + (data.id || ''))
    .send(data)
    .catch(e => {
      console.error(e);
      throw e;
    });
  return result.body as IReservation;
};

export const deleteReservation = async (id: string): Promise<void> => {
  await superagent.delete('/api/reservations/' + id);
};

export const isVacant = async (
  startDate: Moment,
  endDate: Moment,
  facilityId: string,
  reservationId = '',
): Promise<boolean> => {
  const reservations = await getReservations(startDate.toDate());
  // 重複している他の予約を検索する
  const exist = reservations
    .filter(f => f.facilityId === facilityId)
    .find(f => {
      if (reservationId === f.id) return false;
      if (endDate <= f.startDate) return false;
      if (startDate >= f.endDate) return false;
      return true;
    });
  // 他の予約が見つかったら重複しているので、`false`を返す
  return !exist;
};
