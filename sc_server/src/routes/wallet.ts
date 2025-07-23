import express from 'express';
import { authUser } from '../middlewares/auth-user.js';
import { getWalletDetail, receiveSc, sendSc,  } from '../controllers/wallet.js';

const router = express.Router();

router.post('/send-sc', authUser, sendSc);
router.get('/receive-sc', authUser, receiveSc);
router.post('/', authUser, getWalletDetail); 

export {router as walletRoutes}