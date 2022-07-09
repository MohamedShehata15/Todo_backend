import { Request, Response, NextFunction } from 'express';

import Todo, { TodoDocument } from '../models/Todo';
import User from '../models/User';
import catchAsync from '../utils/catchAsync';
import { UserRequest } from '../types/userRequest.types';

class TodoController {
   add = catchAsync(
      async (req: UserRequest, res: Response, _next: NextFunction) => {
         const loggedUser = await User.findById(req.user?.id);

         const todo: TodoDocument = await Todo.create(req.body);

         loggedUser?.todos.push(todo._id);
         loggedUser?.save({ validateBeforeSave: false });

         res.status(201).json({
            status: 'success',
            todo
         });
      }
   );

   getAll = catchAsync(
      async (req: UserRequest, res: Response, _next: NextFunction) => {
         const todos = await User.findById(req.user?.id)
            .select('-name -email -_id -__v')
            .populate('todos');

         res.status(200).json({
            status: 'success',
            todos: todos?.todos
         });
      }
   );

   getOne = () => {};

   update = () => {};

   delete = () => {};
}

export default TodoController;
