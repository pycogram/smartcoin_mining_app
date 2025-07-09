import express from 'express';
import { authUser } from '../middlewares/auth-user';
import { mineSc } from '../controllers/miner';

const router = express.Router();

router.post('/mines', authUser, mineSc);

export {router as minerRoutes};