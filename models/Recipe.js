import mongoose from "mongoose";


const recipeSchema = new mongoose.Schema({
    createdBy: {
        type: String,
        required: true
    },
    title: {type:String, required: true},
    prep: String,
    cook: String,
    desc: String,
    ingredients: [String],
    instructions: [String],
    image: String,
    isFav: {type:Boolean, default: false}, 
},{timestamps: true});

export default mongoose.model('Recipe',recipeSchema);