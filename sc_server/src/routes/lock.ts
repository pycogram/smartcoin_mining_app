import express from 'express';
import { authUser } from '../middlewares/auth-user';
import { lockSc } from '../controllers/lock';

const router = express.Router();

router.post('/', authUser, lockSc);

export {router as lockRoutes}