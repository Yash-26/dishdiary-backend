import express from 'express';
import multer from 'multer';
import {
  checkUserExistence,
  registerUser,
  loginUser,
  updateUser
} from '../controllers/userController.js';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage Multer
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname, '../public/uploads'));
    },
    filename: function(req,file,cb){
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({storage:storage});

// Routes

router.get('/check', checkUserExistence);
router.post('/register',registerUser);
router.post('/login',loginUser);
router.patch('/', upload.single('image'),updateUser);



export default router;