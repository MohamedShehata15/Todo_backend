import bcrypt from 'bcrypt';
import crypto from 'crypto';
import mongoose, { Types } from 'mongoose';
import validator from 'validator';

export type UserDocument = mongoose.Document & {
   name: string;
   email: string;
   password: string;
   passwordConfirmation: string | undefined;
   todo: {
      type: Types.ObjectId;
      ref: string;
   };
   passwordChangedAt: Date;
   passwordResetToken: string;
   passwordResetExpires: Date;

   correctPassword: (
      candidatePassword: string,
      password: string
   ) => Promise<boolean>;
};

const userSchema = new mongoose.Schema<UserDocument>({
   name: {
      type: String,
      required: [true, 'Please enter your name']
   },
   email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please enter a valid email']
   },
   password: {
      type: String,
      required: [true, 'Please enter your password'],
      minLength: 3,
      select: false
   },
   passwordConfirmation: {
      type: String,
      required: [true, 'Please confirm your password'],
      minLength: 3,
      validate: {
         validator: function (el: string): boolean {
            const user = this as unknown as UserDocument;
            return el === user.password;
         },
         message: "passwords don't match"
      }
   },
   todo: {
      type: mongoose.Types.ObjectId,
      ref: 'Todo'
   },
   passwordChangedAt: Date,
   passwordResetToken: String,
   passwordResetExpires: Date
});

// Hash Password
userSchema.pre('save', async function (next) {
   const user = this as unknown as UserDocument;

   if (!user.isModified('password')) return next();

   // Has the password with cost of 12
   user.password = await bcrypt.hash(user.password, 12);

   // Delete the passwordConfirm Field
   user.passwordConfirmation = undefined;

   next();
});

// Password Checker
userSchema.methods.correctPassword = async function (
   candidatePassword: string,
   userPassword: string
): Promise<boolean> {
   const result: boolean = await bcrypt.compare(
      candidatePassword,
      userPassword
   );
   return result;
};

const User = mongoose.model('User', userSchema);

export default User;
