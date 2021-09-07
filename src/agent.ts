import superagent, { SuperAgentStatic } from 'superagent';
import { getCurrentUser } from './auth';

let agent: SuperAgentStatic | null = null;

export const getAgent = async (): Promise<SuperAgentStatic> => {
  if (agent) return agent;
  const token = await getCurrentUser()?.getIdToken();
  agent = superagent.agent().set('authorization', 'Bearer ' + token);
  return agent;
};
