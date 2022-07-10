import { Router, IRouter } from 'express';

import TodoController from '../controllers/todoController';
import AuthController from '../controllers/authController';

const todoController = new TodoController();

const todoRoutes: IRouter = Router();

todoRoutes.use(new AuthController().protect);

todoRoutes.route('/').post(todoController.add).get(todoController.getAll);

todoRoutes
   .route('/:id')
   .get(todoController.getOne)
   .delete(todoController.delete)
   .patch(todoController.update);

export default todoRoutes;
