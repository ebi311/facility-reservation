import { Request } from 'express';
import IUser from './models/IUser';

export type CustomReqType = Request & { user: IUser };
