import express from 'express';
import { authUser } from '../middlewares/auth-user.js';
import { historySc } from '../controllers/history.js';

const router = express.Router();

router.get('/', authUser, historySc);

export {router as historyRoutes}