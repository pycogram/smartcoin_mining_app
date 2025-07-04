import express from 'express';
import { 
    confirmUser, dashboardUser, loginUser, registerUser, 
    verifyUser 
} from '../controllers/user';
import { authUser } from '../middlewares/auth-user';

const router = express.Router();

// create a user routes
router.post('/register', registerUser);
router.post('/verify', verifyUser);
router.post('/confirm', confirmUser);
router.post('/login', loginUser);
router.post('/dashboard', authUser, dashboardUser);

export { router as userRoutes };