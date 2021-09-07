import { getAgent } from '../agent';
import { IFacility } from '../models/IFacility';

export const getFacilities = async (): Promise<IFacility[]> => {
  const agent = await getAgent();
  const result = await agent.get('/api/facilities');
  return result.body as IFacility[];
};

export const getFacility = async (id: string): Promise<IFacility> => {
  const agent = await getAgent();
  const result = await agent.get('/api/facilities/' + encodeURIComponent(id));
  return result.body as IFacility;
};

export const postFacility = async (facility: IFacility): Promise<string> => {
  const agent = await getAgent();
  const result = await agent.post('/api/facilities/').send(facility);
  return result.body.id;
};

export const putFacility = async (facility: IFacility): Promise<void> => {
  const agent = await getAgent();
  await agent
    .put('/api/facilities/' + encodeURIComponent(facility.id))
    .send(facility);
};

export const deleteFacility = async (id: string): Promise<void> => {
  const agent = await getAgent();
  await agent.delete('/api/facilities/' + encodeURIComponent(id));
};
