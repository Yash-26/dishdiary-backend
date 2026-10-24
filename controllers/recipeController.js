import mongoose from 'mongoose';
import Recipe from '../models/Recipe.js';
import { removeUpload } from '../config/upload.js';

// Lists arrive from FormData either as a JSON string, repeated fields or a single value
const parseList = (value) => {
    if(value === undefined) return undefined;
    let list = value;
    if(typeof value === 'string'){
        try{
            const parsed = JSON.parse(value);
            list = Array.isArray(parsed) ? parsed : [value];
        }catch{
            list = [value];
        }
    }
    if(!Array.isArray(list)) list = [list];
    return list.map(item => String(item ?? '').trim()).filter(Boolean);
}

const clean = (value) => typeof value === 'string' ? value.trim() : value;

// Finds a recipe owned by the current user, or sends the error response
const findOwnRecipe = async(req,res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(404).json({message:"Recipe Not Found"});
        return null;
    }
    const recipe = await Recipe.findOne({_id: req.params.id, createdBy: req.user.uid});
    if(!recipe) res.status(404).json({message:"Recipe Not Found"});
    return recipe;
}

// Get all recipes of the logged in user
export const getAllRecipes = async(req,res) => {
    try{
        const recipes = await Recipe.find({createdBy: req.user.uid}).sort({createdAt: -1});
        res.json({recipes});
    }catch(err){
        res.status(500).json({message:"Error fetching recipes", error:err.message});
    }
}

// Get Recipe by ID
export const getRecipeById = async(req,res) => {
    try{
            const recipe = await findOwnRecipe(req,res);
            if (!recipe) return;
            res.json(recipe);
        }catch(Err){
            res.status(500).json({error:Err.message});
        }
}

// New Recipe
export const createRecipe = async(req,res) => {
    try{
            const title = clean(req.body.title);
            if(!title){
                if(req.file) removeUpload(req.file.filename);
                return res.status(400).json({message:"Title is required"});
            }

            const newRecipe = new Recipe({
                title,
                prep: clean(req.body.prep),
                cook: clean(req.body.cook),
                desc: clean(req.body.desc),
                image: req.file ? req.file.filename : null,
                ingredients: parseList(req.body.ingredients) || [],
                instructions: parseList(req.body.instructions) || [],
                createdBy: req.user.uid,
            });
            await newRecipe.save();
            res.status(201).json({newRecipe});
        }catch(err){
            if(req.file) removeUpload(req.file.filename);
            res.status(400).json({message:"Error creating recipe", error:err.message})
        }
}

// Favorite Recipe
export const favoriteRecipe = async(req,res) => {
    try{
            const recipe = await findOwnRecipe(req,res);
            if(!recipe) return;
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
            const recipe = await findOwnRecipe(req,res);
            if(!recipe){
                if(req.file) removeUpload(req.file.filename);
                return;
            }

            if(req.body.title !== undefined){
                const title = clean(req.body.title);
                if(!title) return res.status(400).json({message:"Title is required"});
                recipe.title = title;
            }
            // Allow clearing optional fields by sending an empty value
            if(req.body.prep !== undefined) recipe.prep = clean(req.body.prep);
            if(req.body.cook !== undefined) recipe.cook = clean(req.body.cook);
            if(req.body.desc !== undefined) recipe.desc = clean(req.body.desc);

            const ingredients = parseList(req.body.ingredients);
            if(ingredients) recipe.ingredients = ingredients;
            const instructions = parseList(req.body.instructions);
            if(instructions) recipe.instructions = instructions;

            if(req.file){
                removeUpload(recipe.image);
                recipe.image = req.file.filename
            }else if(req.body.removeImage === 'true'){
                removeUpload(recipe.image);
                recipe.image = null;
            }

            await recipe.save();

            res.status(200).json({recipe});
        }catch(err){
            res.status(500).json({message:"Error updating recipe", error:err.message})
        }
}

// Delete Recipe
export const delRecipe = async(req,res) => {
    try{
            const recipe = await findOwnRecipe(req,res);
            if(!recipe) return;
            await recipe.deleteOne();
            removeUpload(recipe.image);
            res.status(200).json({message: "Recipe Deleted successfully"})
        }catch(err){
            res.status(500).json({error: err.message})
        }
}
