import { Request } from 'express';
import { IUser } from './IUser';

export type CustomReqType = Request & { user: IUser };
