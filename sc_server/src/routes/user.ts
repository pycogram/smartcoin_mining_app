import express from 'express';
import { registerUser } from '../controllers/user';

const router = express.Router();

// create a user routes
router.post('/register', registerUser);

export { router as userRoutes };