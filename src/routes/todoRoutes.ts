import { Router, IRouter } from 'express';

import TodoController from '../controllers/todoController';
import AuthController from '../controllers/authController';

const todoController = new TodoController();

const todoRoutes: IRouter = Router();

todoRoutes.use(new AuthController().protect);

todoRoutes.route('/').post(todoController.add);

export default todoRoutes;
