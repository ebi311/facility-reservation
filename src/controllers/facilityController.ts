import IFacility from '../status/IFacility';
import superagent from 'superagent';
// import URL from 'url';

export const getFacilities = async (): Promise<IFacility[]> => {
  const result = await superagent.get('/api/facilities/').catch(e => {
    throw e;
  });
  console.log();
  return result.body as IFacility[];
};

export const getFacility = async (id: string): Promise<IFacility | null> => {
  const encId = encodeURI(id);
  const result = await superagent.get(`/api/facilities/${encId}`).catch(e => {
    console.log(e);
  });
  if (!result) return null;
  return result.body as IFacility;
};

export const postFacility = async (
  data: IFacility,
): Promise<IFacility | null> => {
  const result = await superagent
    .post('/api/facilities/')
    .send(data)
    .catch(e => {
      console.log(e);
    });
  if (!result) return null;
  console.log(result.body);
  return result.body as IFacility;
};

export const putFacility = async (
  data: IFacility,
): Promise<IFacility | null> => {
  const id = encodeURI(data.id);
  const result = await superagent.put('/api/facilities/' + id).send(data);
  if (!result) return null;
  return result.body as IFacility;
};
