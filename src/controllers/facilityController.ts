import IFacility from '../status/IFacility';
import { getAgent } from './agent';
// import URL from 'url';

export const getFacilities = async (): Promise<IFacility[]> => {
  const result = await getAgent()
    .get('/api/facilities/')
    .catch(e => {
      console.error(e);
      throw e;
    });
  return result.body as IFacility[];
};

export const getFacility = async (id: string): Promise<IFacility | null> => {
  const encId = encodeURI(id);
  const result = await getAgent()
    .get(`/api/facilities/${encId}`)
    .catch(e => {
      console.error(e);
      throw e;
    });
  return result.body as IFacility;
};

export const postFacility = async (
  data: IFacility,
): Promise<IFacility | null> => {
  const result = await getAgent()
    .post('/api/facilities/')
    .send(data)
    .catch(e => {
      console.error(e);
      throw e;
    });
  return result.body as IFacility;
};

export const putFacility = async (
  data: IFacility,
): Promise<IFacility | null> => {
  const id = encodeURI(data.id);
  const result = await getAgent()
    .put('/api/facilities/' + id)
    .send(data)
    .catch(e => {
      console.error(e);
      throw e;
    });
  return result.body as IFacility;
};

export const deleteFacility = async (id: string): Promise<boolean> => {
  await getAgent()
    .delete('/api/facilities/' + id)
    .catch(e => {
      console.error(e);
      throw e;
    });
  return true;
};
