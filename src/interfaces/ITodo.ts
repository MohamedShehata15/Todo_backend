export enum Priority {
   Low = 'low',
   Medium = 'medium',
   High = 'high'
}

export enum Status {
   Todo = 'todo',
   InProgress = 'in progress',
   Done = 'done'
}

interface ITodo {
   title: string;
   description: string;
   priority: Priority;
   status: Status;
   startDate: Date;
   endDate: Date;
}

export default ITodo;
