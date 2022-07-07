import { Types } from 'mongoose';

type UserTypes = {
   _id: Types.ObjectId;
   name: string;
   email: string;
   password: string | undefined;
   passwordConfirmation?: string;
   todo?: Types.ObjectId;
   passwordChangedAt?: Date;
   passwordResetToken?: string;
   passwordResetExpires?: Date;
};

export default UserTypes;
