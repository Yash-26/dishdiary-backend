import Recipe from '../models/Recipe.js';

// Get all recipes
export const getAllRecipes = async(req,res) => {
    const {uid} = req.query;
    const recipes = uid? await Recipe.find({createdBy:uid}): await Recipe.find();
    res.json({recipes});
}

// Get Recipe by ID
export const getRecipeById = async(req,res) => {
    try{
            const recipe = await Recipe.findById(req.params.id);
            if (!recipe) return res.status(404).json({message:"Not FOund"});
            res.json(recipe);
        }catch(Err){
            res.status(500).json({error:Err.message});
        }
}

// New Recipe
export const createRecipe = async(req,res) => {
    try{
            const newRecipe = new Recipe({
                ...req.body,
                image: req.file ? req.file.filename : null,
                ingredients: Array.isArray(req.body.ingredients) ? req.body.ingredients : [req.body.ingredients],
                instructions: Array.isArray(req.body.instructions) ? req.body.instructions : [req.body.instructions],
                createdBy: req.body.uid,
            });
            await newRecipe.save();
            res.status(201).json({newRecipe});
        }catch(err){
            res.status(400).json({error:err.message})
        }
}

// Favorite Recipe
export const favoriteRecipe = async(req,res) => {
    try{
            const recipe = await Recipe.findById(req.params.id);
            if(!recipe) return res.status(404).json({message:'Recipe Not found'})
            recipe.isFav = !recipe.isFav;
            await recipe.save();
            res.status(200).json({isFav:recipe.isFav});
        }catch(Err){
            res.status(500).json({message:"Error Favorite toggle"});
        }
}

// Edit Recipe
export const editRecipe = async(req,res) => {
    try{
            const recipe = await Recipe.findById(req.params.id);
            if(req.body.title) recipe.title = req.body.title;
            if(req.body.prep) recipe.prep = req.body.prep;
            if(req.body.cook) recipe.cook = req.body.cook;
            if(req.body.desc) recipe.desc = req.body.desc;
            if(req.body.ingredients){
                recipe.ingredients = Array.isArray(req.body.ingredients)?
                req.body.ingredients: [req.body.ingredients]
            }
            if(req.body.instructions){
                recipe.instructions = Array.isArray(req.body.instructions)?
                req.body.instructions: [req.body.instructions]
            }
            if(req.file){
                recipe.image = req.file.filename
            }
    
            await recipe.save();
    
            res.status(200).json({recipe});
        }catch(err){
            res.status(500).json({error:err.message})
        }
}

// Delete Recipe
export const delRecipe = async(req,res) => {
    try{
            const recipe = await Recipe.findByIdAndDelete(req.params.id);
            if(!recipe) return res.status(404).json({message:'Recipe not found'});
            res.status(200).json({message: "Recipe Deleted successfully"})
        }catch(err){
            res.status(500).json({error: err.message})
        }
}