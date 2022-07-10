import { Request, Response, NextFunction } from 'express';

import Todo, { TodoDocument } from '../models/Todo';
import User from '../models/User';
import catchAsync from '../utils/catchAsync';
import { UserRequest } from '../types/userRequest.types';
import { AppError } from '../utils/appError';

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

   getOne = catchAsync(
      async (req: UserRequest, res: Response, Next: NextFunction) => {
         const todo = await Todo.findById(req.params.id);

         res.status(200).json({
            status: 'success',
            todo
         });
      }
   );

   update = catchAsync(
      async (req: UserRequest, res: Response, next: NextFunction) => {
         const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
            new: true
         });

         if (!todo)
            return next(new AppError('No todo found with that ID', 404));

         return res.status(200).json({
            status: 'success',
            todo
         });
      }
   );

   delete = catchAsync(
      async (req: UserRequest, res: Response, _next: NextFunction) => {
         await Todo.findByIdAndDelete(req.params.id);

         res.status(204).json({
            status: 'success'
         });
      }
   );
}

export default TodoController;
