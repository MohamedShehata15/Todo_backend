import mongoose from 'mongoose';

import ITodo, { Priority, Status } from '../interfaces/ITodo';

const todoSchema = new mongoose.Schema<ITodo>({
   title: {
      type: String,
      required: [true, 'Please enter the title'],
      minLength: [3, 'Title must be at least 3 characters'],
      trim: true
   },
   description: {
      type: String,
      required: [true, 'Please enter the description']
   },
   priority: {
      type: String,
      enum: {
         values: Object.values(Priority),
         message: 'Priority must be low, medium or high'
      },
      default: Priority.Low,
      required: [true, 'Please enter the priority']
   },
   startDate: {
      type: Date,
      default: Date.now()
   },
   endDate: {
      type: Date,
      required: [true, 'Please enter an end date'],
      validate: {
         validator: function (el: Date): boolean {
            return el > (this as unknown as ITodo).startDate;
         },
         message: 'End date must be after start date'
      },
      status: {
         type: String,
         enum: {
            values: Status,
            message:
               'Status must be one of the following: todo, in progress, done'
         },
         default: Status.Todo
      }
   }
});

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;
