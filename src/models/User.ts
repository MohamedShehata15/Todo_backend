import bcrypt from 'bcrypt';
import crypto from 'crypto';
import mongoose from 'mongoose';
import validator from 'validator';

import IUser from '../interfaces/IUser';

const userSchema = new mongoose.Schema<IUser>({
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
            return el === (this as IUser).password;
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

const User = mongoose.model('User', userSchema);

export default User;
