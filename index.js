import express from "express";
import cors from 'cors';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import multer from 'multer';
import recipeRoutes from './routes/recipeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { uploadDir } from './config/upload.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// CLIENT_ORIGIN can be a comma separated list. Trailing slashes are removed because
// the browser's Origin header never has one, so "https://site.app/" would never match.
const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

// Middlewares
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return cb(null, true);
    // Allow the Vite dev server on any localhost port
    if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) return cb(null, true);
    cb(null, false);
  },
}));
app.use(express.json());

app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // Fixes ORB
  next();
}, express.static(uploadDir));


// Routers
app.use('/api/recipes',recipeRoutes);
app.use('/api/users',userRoutes);

// Health check (503 while the database is not connected)
app.get('/healthz',(req,res)=>{
    const dbConnected = mongoose.connection.readyState === 1;
    res.status(dbConnected ? 200 : 503).send(dbConnected ? "DishDiary Backend is Working" : "DishDiary Backend is up, but the database is not connected");
})

// Unknown API routes
app.use('/api', (req,res) => {
  res.status(404).json({message: "Route not found"});
});

// Error handler (upload errors, unexpected errors)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Image must be smaller than 5 MB' : (err.field || err.message);
    return res.status(400).json({message});
  }
  console.error(err);
  res.status(500).json({message: "Something went wrong"});
});

// Start listening right away so the host sees the app is up and /healthz can report DB problems
app.listen(PORT,()=>{
  console.log(`server running on port ${PORT}`);
})

// Connect to MongoDB, retrying every 10s if it fails
const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI, {serverSelectionTimeoutMS: 10000})
  .then(()=> console.log("MongoDB Atlas Connected"))
  .catch((err)=>{
    console.log("MongoDB connection error:", err.message);
    setTimeout(connectDB, 10000);
  })
}
connectDB();
