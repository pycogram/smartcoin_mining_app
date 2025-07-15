import express from 'express';
import { authUser } from '../middlewares/auth-user';
import { getWalletDetail, receiveSc, sendSc,  } from '../controllers/wallet';

const router = express.Router();

router.post('/send-sc', authUser, sendSc);
router.get('/receive-sc', authUser, receiveSc);
router.get('', authUser, getWalletDetail); 

export {router as walletRoutes}