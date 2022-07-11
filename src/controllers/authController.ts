import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

import User, { UserDocument } from '../models/User';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import config from '../config';
import sendEmail from '../utils/email';
import CookieOptionsTypes from './../types/cookieOptions.types';
import { sendMailTypes } from '../types/sendMail.types';

class AuthController {
   signUp = catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
         const newUser: UserDocument = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation
         });

         await this.emailVerification(newUser, req, res, next);

         // this.createSendToken(newUser, 201, res);
      }
   );

   login = catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
         const { email, password } = req.body;

         if (!email || !password)
            return next(new AppError('Please enter email and password!', 400));

         const user: UserDocument | null = await User.findOne({
            email
         }).select('+password');

         const userPassword: string = user?.password ?? '';

         if (!user)
            return next(new AppError('Incorrect email or password', 401));

         const correct =
            user?.correctPassword &&
            (await user?.correctPassword(password, userPassword));

         if (!correct)
            return next(new AppError('Incorrect email or password', 401));

         if(!user.isEmailVerified)
            return next(new AppError('Please verify your email', 401));

         this.createSendToken(user, 200, res);
      }
   );

   private createSendToken = (
      user: UserDocument,
      statusCode: number,
      res: Response
   ) => {
      const token: string = this.signToken(user?._id);
      const jwtCookieExpiresIn: number =
         (config.jwtCookieExpiresIn as unknown as number) ?? 90;

      const cookieOptions: CookieOptionsTypes = {
         expires: new Date(
            Date.now() + jwtCookieExpiresIn * 24 * 60 * 60 * 1000
         ),
         httpOnly: true
      };

      if (config.env === 'production') cookieOptions.secure = true;

      res.cookie('jwt', token, cookieOptions);

      return res.status(statusCode).json({
         status: 'success',
         token,
         user: {
            name: user.name,
            email: user.email
         }
      });
   };

   forgotPassword = catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
         // get user based on email
         const user: UserDocument | null = await User.findOne({
            email: req.body.email
         });

         if (!user)
            return next(new AppError('There is no user with this email', 404));

         // generate random token
         const resetToken = user?.createPasswordResetToken();
         await user.save({ validateBeforeSave: false });

         // send token to user's email
         const resetUrl = `${req.protocol}://${req.get(
            'host'
         )}/users/reset-password/${resetToken}`;

         const message = `Forget Your password: ${resetUrl}`;

         try {
            const sendMailOptions: sendMailTypes = {
               email: user.email,
               subject: 'Your password reset token (valid for 10 minutes)',
               message
            };
            await sendEmail(sendMailOptions);
         } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });

            return next(
               new AppError(
                  'There was an error sending the email. Please, try again later',
                  500
               )
            );
         }

         res.status(200).json({
            status: 'success',
            message: 'Token sent to email. check your spam if you do not see it'
         });
      }
   );

   resetPassword = catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
         // Get use based on token.
         const hashedToken: string = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

         const user: UserDocument | null = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
         });

         // Check user exits and token is valid.
         if (!user)
            return next(new AppError('Token is invalid or has expired', 400));

         // Update User Data
         user.password = req.body.password;
         user.passwordConfirmation = req.body.passwordConfirmation;
         user.passwordResetToken = undefined;
         user.passwordResetExpires = undefined;
         await user.save();

         // Send token
         this.createSendToken(user, 200, res);
      }
   );

   verifyEmail = catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
         // Get use based on token.
         const hashedToken: string = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

         const user: UserDocument | null = await User.findOne({
            emailVerificationToken: hashedToken
         });

         // Check user exits and token is valid.
         if (!user)
            return next(new AppError('Token is invalid or has expired', 400));

         // Update User Data
         user.emailVerificationToken = undefined;
         user.isEmailVerified = true;
         await user.save({ validateBeforeSave: false });

         // Send token
         this.createSendToken(user, 200, res);
      }
   );

   resentEmailVerification = catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
         const user: UserDocument | null = await User.findOne({
            email: req.body.email
         });

         if (!user)
            return next(new AppError('There is no user with this email', 404));

         await this.emailVerification(user, req, res, next);
      }
   );

   private signToken = (id: Types.ObjectId) => {
      const dates = config.jwtExpiresIn;
      const jwtSecret: string = config.jwtSecret ?? '';

      return jwt.sign(
         {
            id: id
         },
         jwtSecret,
         {
            expiresIn: dates
         }
      );
   };

   private emailVerification = async (
      user: UserDocument,
      req: Request,
      res: Response,
      next: NextFunction
   ) => {
      // generate random token
      const token = user?.createEmailVerificationToken();
      await user.save({ validateBeforeSave: false });

      // send token to user's email
      const verifyUrl = `${req.protocol}://${req.get(
         'host'
      )}/users/email-verification/${token}`;

      const message = `Verify Your Email: ${verifyUrl}`;

      try {
         const sendMailOptions: sendMailTypes = {
            email: user.email,
            subject: 'Your email verification token',
            message
         };
         await sendEmail(sendMailOptions);
      } catch (err) {
         return next(
            new AppError(
               'There was an error sending the verification email. Please, try again later',
               500
            )
         );
      }

      res.status(200).json({
         status: 'success',
         message:
            'Please verify your email. check your spam if you do not see it'
      });
   };
}

export default AuthController;
