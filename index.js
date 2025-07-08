import express, { json } from "express";
import cors from 'cors';
import mongoose, { mongo } from "mongoose";
import dotenv from 'dotenv';
import recipeRoutes from './routes/recipeRoutes.js';
import path from 'path';
import { fileURLToPath } from "url";
import userRoutes from './routes/userRoutes.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());

app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // Fixes ORB
  next();
}, express.static(path.join(__dirname, '/public/uploads')));


// Routers
app.use('/api/recipes',recipeRoutes);
app.use('/api/users',userRoutes);

// Health check
app.get('/healthz',(req,res)=>{
    console.log("DishDiary Backend is Working");
})

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(()=> {
  console.log("MongoDB Atlas Connected")
  app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
  })
})
  

.catch((err)=>console.log("Connection error:",err))




