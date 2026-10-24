import { adminAuth } from '../config/firebase.js';

// Reads "Authorization: Bearer <firebase id token>" and sets req.user
export const requireAuth = async(req,res,next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if(!token) return res.status(401).json({message:"Not authenticated"});

    try{
        const decoded = await adminAuth.verifyIdToken(token);
        req.user = {uid: decoded.uid, email: decoded.email, name: decoded.name};
        next();
    }catch(err){
        res.status(401).json({message:"Invalid or expired session"});
    }
}
