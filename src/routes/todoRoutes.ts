import { Router, IRouter } from 'express';

const todoRoutes: IRouter = Router();

todoRoutes.get('/', (req, res) => {
   res.json({
      message: 'Todo Routes index'
   });
});

export default todoRoutes;
