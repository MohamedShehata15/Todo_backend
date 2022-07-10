import { Router, IRouter } from 'express';

import TodoController from '../controllers/todoController';
import AuthMiddleware from '../middlewares/authMiddleware';

const todoController = new TodoController();

const todoRoutes: IRouter = Router();

todoRoutes.use(new AuthMiddleware().protect);

todoRoutes.route('/').post(todoController.add).get(todoController.getAll);

// Restrict Routes for owner only

todoRoutes
   .route('/:id')
   .get(new AuthMiddleware().authorize, todoController.getOne)
   .delete(new AuthMiddleware().authorize, todoController.delete)
   .patch(new AuthMiddleware().authorize, todoController.update);

export default todoRoutes;
