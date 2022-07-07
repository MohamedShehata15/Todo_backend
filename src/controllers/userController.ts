import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

import User from '../models/User';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import config from '../config';
import UserTypes from '../types/user.types';
import CookieOptionsTypes from './../types/cookieOptions.types';

class UserController {
   signUp = catchAsync(
      async (req: Request, res: Response, _next: NextFunction) => {
         const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation
         });

         this.createSendToken(newUser, 201, res);
      }
   );

   private createSendToken = (
      user: UserTypes,
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

      // Remove the password from the output
      user.password = undefined;

      return res.status(statusCode).json({
         status: 'success',
         token,
         data: {
            user
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
