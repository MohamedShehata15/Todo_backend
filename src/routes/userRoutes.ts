import { Router, IRouter } from 'express';

import AuthController from './../controllers/authController';

const authController = new AuthController();

const userRoutes: IRouter = Router();

userRoutes.post('/signup', authController.signUp);
userRoutes.post('/login', authController.login);

userRoutes.post('/forgot-password', authController.forgotPassword);
userRoutes.patch('/reset-password/:token', authController.resetPassword);
userRoutes.patch('/email-verification/:token', authController.verifyEmail);
userRoutes.post(
   '/resent-email-verification',
   authController.resentEmailVerification
);

export default userRoutes;
