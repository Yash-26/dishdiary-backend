import express from 'express';
import { upload } from '../config/upload.js';
import { requireAuth } from '../middleware/auth.js';
import {
  checkUserExistence,
  registerUser,
  loginUser,
  updateUser
} from '../controllers/userController.js';

const router = express.Router();

router.use(requireAuth);

router.get('/check', checkUserExistence);
router.post('/register',registerUser);
router.post('/login',loginUser);
router.patch('/', upload.single('image'),updateUser);



export default router;
