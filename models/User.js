import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    username: String,
    email: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        default: ''
    },
    profileImg: {
        type: String,
        default: ''
    },
},{timestamps: true});


export default mongoose.model('User',userSchema);