import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

import User, { UserDocument } from '../models/User';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import config from '../config';
import CookieOptionsTypes from './../types/cookieOptions.types';

class UserController {
   signUp = catchAsync(
      async (req: Request, res: Response, _next: NextFunction) => {
         const newUser: UserDocument = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation
         });

         this.createSendToken(newUser, 201, res);
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

         console.log('########################################');
         console.log(user);
         console.log('###########################################');

         if (!user)
            return next(new AppError('Incorrect email or password', 401));

         const correct =
            user?.correctPassword &&
            (await user?.correctPassword(password, userPassword));

         if (!correct)
            return next(new AppError('Incorrect email or password', 401));

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
}

export default UserController;
