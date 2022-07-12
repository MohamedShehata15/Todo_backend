import mongoose from 'mongoose';

enum Priority {
   Low = 'low',
   Medium = 'medium',
   High = 'high'
}

enum Status {
   todo = 'todo',
   InProgress = 'in progress',
   Rework = 'rework',
   UnderReview = 'under review',
   completed = 'completed'
}

export type TodoDocument = mongoose.Document & {
   todoId: number;
   title: string;
   description: string;
   priority: Priority;
   status: Status;
   startDate: Date;
   endDate: Date;
};

const todoSchema = new mongoose.Schema<TodoDocument>({
   todoId: {
      type: Number,
      default: () => Date.now(),
      immutable: true
   },
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
      required: [true, 'Please enter the priority']
   },
   status: {
      type: String,
      required: [true, 'Please choose a status'],
      enum: {
         values: Object.values(Status),
         message:
            'Status must be one of the following: todo, in progress, under review, rework, completed'
      }
   },
   startDate: {
      type: Date,
      default: Date.now(),
      immutable: true
   },
   endDate: {
      type: Date,
      required: [true, 'Please enter an end date'],
      validate: {
         validator: function (el: Date): boolean {
            return el > (this as unknown as TodoDocument).startDate;
         },
         message: 'End date must be after start date'
      }
   }
});

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;
