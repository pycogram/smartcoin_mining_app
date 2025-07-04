import express from 'express';
import { confirmUser, loginUser, registerUser, verifyUser } from '../controllers/user';

const router = express.Router();

// create a user routes
router.post('/register', registerUser);
router.post('/verify', verifyUser);
router.post('/confirm', confirmUser);
router.post('/login', loginUser);

export { router as userRoutes };