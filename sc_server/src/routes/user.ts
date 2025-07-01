import express from 'express';
import { registerUser, verifyUser } from '../controllers/user';

const router = express.Router();

// create a user routes
router.post('/register', registerUser);
router.post('/verify', verifyUser);

export { router as userRoutes };