import { Types } from 'mongoose';

interface IUser {
   name: string;
   email: string;
   password: string;
   passwordConfirmation?: string;
   todo?: Types.ObjectId;
   passwordChangedAt?: Date;
   passwordResetToken?: string;
   passwordResetExpires?: Date;
}

export default IUser;
