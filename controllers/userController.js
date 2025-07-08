import User from '../models/User.js';

export const checkUserExistence = async(req,res)=> {
    const { uid } = req.query;
    
        if (!uid) {
            return res.status(400).json({ message: "UID is required" });
        }
    
        try {
            const user = await User.findOne({ uid });
            res.status(200).json({ exists: !!user });
        } catch (err) {
            res.status(500).json({ message: "Error checking user existence", error: err.message });
        }
}


// POST/ Register
export const registerUser = async(req,res) => {
    const {uid, name, username, email, gender, profileImg} = req.body;
    console.log(req.body.name);
    
        try{
            let existingUser = await User.findOne({uid});
            if(existingUser) return res.status(200).json({message:"User Already Registered"});
    
            const newUser = new User({uid, name, username, email, gender, profileImg});

            // console.log(newUser.name);
            await newUser.save();
            console.log(newUser.name);
            console.log("Registered successfully to DB")
            res.status(201).json({message:"User Registered successfully"});
        }catch(err){
            res.status(500).json({message:"Error saving user", error:err.message})
        }

}

// login
export const loginUser = async(req,res) => {
    const {uid} = req.body;
    
        try{
            const registeredUser = await User.findOne({uid});
    
            if(!registeredUser) return res.status(404).json({message:"User Not Exist in DB"});
    
            res.status(200).json({
                message:"User Exist in DB",
                user: {
                    uid: registeredUser.uid,
                    name: registeredUser.name,
                    username: registeredUser.username,
                    email: registeredUser.email,
                    gender: registeredUser.gender,
                    profileImg: registeredUser.profileImg,
                    
                }
            });
        }catch(err){
            res.status(500).json({message:"Login Failed", error:err.message});
        }
}


export const updateUser = async(req,res) => {
    const {uid} = req.query;
        try{
            const user = await User.findOne({uid});
            if(!user) return res.status(404).json({message:'User NOt Found in DB'});
    
            if(req.body.uid) user.uid = req.body.uid;
            if(req.body.name) user.name = req.body.name;
            if(req.body.email) user.email = req.body.email;
            if(req.body.username) user.username = req.body.username;
            if(req.body.gender) user.gender = req.body.gender;
    
            if(req.file){
                user.profileImg = req.file.filename
            }
    
    
            await user.save();
            res.status(200).json({user,message:'User Data Successfully Updated'});
        }catch(err){
            res.status(500).json({error:err.message});
        }
}