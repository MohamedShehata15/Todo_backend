import { Request, Response, NextFunction } from 'express';

import Todo, { TodoDocument } from '../models/Todo';
import catchAsync from '../utils/catchAsync';

class TodoController {
   add = catchAsync(
      async (req: Request, res: Response, _next: NextFunction) => {
         const todo: TodoDocument = await Todo.create(req.body);

         res.status(201).json({
            status: 'success',
            todo
         });
      }
   );

   getAll = () => {};

   getOne = () => {};

   update = () => {};

   delete = () => {};
}

export default TodoController;
