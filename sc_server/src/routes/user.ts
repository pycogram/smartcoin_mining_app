import express from 'express';
import { confirmUser, deleteUser, detailUser, loginUser, registerUser, updateUser, verifyUser } from '../controllers/user.js';
import { authUser } from '../middlewares/auth-user.js';

const router = express.Router();

// create a user routes
router.post('/register', registerUser);
router.post('/verify', verifyUser);
router.post('/confirm', confirmUser);
router.post('/login', loginUser);
router.get('/', authUser, detailUser);
router.patch('/update', authUser, updateUser);
router.delete('/delete', authUser, deleteUser);


export { router as userRoutes };