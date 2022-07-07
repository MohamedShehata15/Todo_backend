import { Router, IRouter } from 'express';

const userRoutes: IRouter = Router();

userRoutes.get('/', (req, res) => {
   res.json({message: 'user index route'});
})

export default userRoutes;
