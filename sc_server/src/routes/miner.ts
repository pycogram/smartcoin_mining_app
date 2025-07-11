import express from 'express';
import { authUser } from '../middlewares/auth-user';
import { dashboard, mineSc } from '../controllers/miner';

const router = express.Router();

router.get('', authUser, dashboard);
router.post('/mine', authUser, mineSc);

export {router as minerRoutes};