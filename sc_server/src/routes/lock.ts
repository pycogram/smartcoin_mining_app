import express from 'express';
import { authUser } from '../middlewares/auth-user';
import { lockSc, unLockSc } from '../controllers/lock';

const router = express.Router();

router.post('/lock', authUser, lockSc);
router.post('/unlock', authUser, unLockSc);

export {router as lockRoutes}