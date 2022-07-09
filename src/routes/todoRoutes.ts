import { Router, IRouter } from 'express';

import TodoController from '../controllers/todoController';

const todoController = new TodoController();

const todoRoutes: IRouter = Router();

todoRoutes.route('/').post(todoController.add);

export default todoRoutes;
