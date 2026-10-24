import User from '../models/User.js';
import { removeUpload } from '../config/upload.js';

const toPublicUser = (user) => ({
    uid: user.uid,
    name: user.name,
    username: user.username,
    email: user.email,
    gender: user.gender,
    profileImg: user.profileImg,
});

export const checkUserExistence = async(req,res)=> {
        try {
            const user = await User.findOne({ uid: req.user.uid });
            res.status(200).json({ exists: !!user });
        } catch (err) {
            res.status(500).json({ message: "Error checking user existence", error: err.message });
        }
}


// POST/ Register (safe to call more than once)
export const registerUser = async(req,res) => {
    const {uid, email} = req.user;
    const name = (req.body.name || req.user.name || '').trim();

        try{
            let existingUser = await User.findOne({uid});
            if(existingUser){
                // Fill in the name if an earlier attempt saved the user without one
                if(!existingUser.name && name){
                    existingUser.name = name;
                    await existingUser.save();
                }
                return res.status(200).json({message:"User Already Registered", user: toPublicUser(existingUser)});
            }

            const newUser = new User({uid, name, username: '', email: email || req.body.email, gender: '', profileImg: ''});
            await newUser.save();
            res.status(201).json({message:"User Registered successfully", user: toPublicUser(newUser)});
        }catch(err){
            res.status(500).json({message:"Error saving user", error:err.message})
        }

}

// login
export const loginUser = async(req,res) => {
        try{
            const registeredUser = await User.findOne({uid: req.user.uid});

            if(!registeredUser) return res.status(404).json({message:"User Not Exist in DB"});

            res.status(200).json({
                message:"User Exist in DB",
                user: toPublicUser(registeredUser)
            });
        }catch(err){
            res.status(500).json({message:"Login Failed", error:err.message});
        }
}


export const updateUser = async(req,res) => {
        try{
            const user = await User.findOne({uid: req.user.uid});
            if(!user){
                if(req.file) removeUpload(req.file.filename);
                return res.status(404).json({message:'User Not Found in DB'});
            }

            // uid and email come from Firebase and are not editable here
            if(req.body.name !== undefined) user.name = req.body.name.trim();
            if(req.body.username !== undefined) user.username = req.body.username.trim();
            if(req.body.gender !== undefined) user.gender = req.body.gender;

            if(req.file){
                removeUpload(user.profileImg);
                user.profileImg = req.file.filename
            }


            await user.save();
            res.status(200).json({user: toPublicUser(user),message:'User Data Successfully Updated'});
        }catch(err){
            res.status(500).json({error:err.message});
        }
}
