import express from 'express';
import { authUser } from '../middlewares/auth-user';
import { historySc } from '../controllers/history';

const router = express.Router();

router.get('', authUser, historySc);

export {router as historyRoutes}