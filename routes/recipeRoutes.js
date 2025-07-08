import express from 'express';
import multer from 'multer';
import Recipe from '../models/Recipe.js';
import path from 'path';
import { fileURLToPath } from "url";
import {
    getAllRecipes,
    getRecipeById,
    createRecipe,
    favoriteRecipe,
    editRecipe,
    delRecipe
} from '../controllers/recipeController.js'

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

const upload = multer({storage:storage})

// Routes

router.get('/',getAllRecipes);
router.get('/:id',getRecipeById);
router.post('/',upload.single('image'), createRecipe);
router.put('/:id/favorite',favoriteRecipe);
router.patch('/:id',upload.single('image'), editRecipe)
router.delete('/:id',delRecipe);



export default router;