import express from 'express';
import { authUser } from '../middlewares/auth-user.js';
import { refBonusClaim, referralDetail } from '../controllers/referral.js';

const router = express.Router();

router.get('/', authUser, referralDetail);
router.post('/claim-bonus', authUser, refBonusClaim)

export { router as ReferralRoutes}