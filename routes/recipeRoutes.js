import express from 'express';
import { upload } from '../config/upload.js';
import { requireAuth } from '../middleware/auth.js';
import {
    getAllRecipes,
    getRecipeById,
    createRecipe,
    favoriteRecipe,
    editRecipe,
    delRecipe
} from '../controllers/recipeController.js'

const router = express.Router();

// All recipe routes belong to the logged in user
router.use(requireAuth);

router.get('/',getAllRecipes);
router.get('/:id',getRecipeById);
router.post('/',upload.single('image'), createRecipe);
router.put('/:id/favorite',favoriteRecipe);
router.patch('/:id',upload.single('image'), editRecipe)
router.delete('/:id',delRecipe);



export default router;
