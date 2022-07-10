import bcrypt from 'bcrypt';
import crypto from 'crypto';
import mongoose, { Types } from 'mongoose';
import validator from 'validator';

export type UserDocument = mongoose.Document & {
   name: string;
   email: string;
   password: string;
   passwordConfirmation: string | undefined;
   todos: {
      type: Types.ObjectId;
      ref: string;
   }[];
   isEmailVerified: boolean;
   emailVerificationToken: string | undefined;
   passwordChangedAt: Date | undefined;
   passwordResetToken: string | undefined;
   passwordResetExpires: number | undefined;

   correctPassword: (
      candidatePassword: string,
      password: string
   ) => Promise<boolean>;

   changedPasswordAfter: (timestamp: number) => boolean;

   createPasswordResetToken: () => string;

   createEmailVerificationToken: () => string;
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
   todos: [
      {
         type: mongoose.Types.ObjectId,
         ref: 'Todo'
      }
   ],
   isEmailVerified: {
      type: Boolean,
      default: false
   },
   emailVerificationToken: String,
   passwordChangedAt: Date,
   passwordResetToken: String,
   passwordResetExpires: Number
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

// Changed Password Checker
userSchema.methods.changedPasswordAfter = function (
   JWTTimestamp: number
): boolean {
   const user = this as unknown as UserDocument;

   if (user.passwordChangedAt) {
      const changedTimestamp: number = user.passwordChangedAt.getTime() / 1000;

      return JWTTimestamp < changedTimestamp;
   }

   return false; // Password doesn't change
};

// Create Rest Password Token
userSchema.methods.createPasswordResetToken = function () {
   const user = this as unknown as UserDocument;

   const resetToken = crypto.randomBytes(32).toString('hex');

   user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

   user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

   return resetToken;
};

// Create Email Verification Token
userSchema.methods.createEmailVerificationToken = function () {
   const user = this as unknown as UserDocument;

   const token = crypto.randomBytes(32).toString('hex');

   user.emailVerificationToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

   return token;
};

const User = mongoose.model('User', userSchema);

export default User;
