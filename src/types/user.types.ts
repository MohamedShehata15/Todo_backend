import { Types } from 'mongoose';

type UserTypes = {
   name: string;
   email: string;
   password: string;
   passwordConfirmation?: string;
   todo?: Types.ObjectId;
};

export default UserTypes;
