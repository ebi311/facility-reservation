import superagent from 'superagent';

type AgentType = superagent.SuperAgentStatic & superagent.Request;
let agent: AgentType;
export const getAgent = (): AgentType => {
  if (!agent) {
    throw new Error(
      'agent がセットされていません。先に `setAgent`を実行してください。',
    );
  }
  return agent;
};

export const setAgent = (_token: string): void => {
  agent = superagent.agent().set('authorization', `Bearer ${_token}`);
};
