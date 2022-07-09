import { Request } from 'express';
import { UserDocument } from '../models/User';

export type UserRequest = Request & {
   user?: UserDocument;
};
