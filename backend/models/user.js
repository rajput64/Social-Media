const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim :true,
        required: true
    },
    email:{
        type: String,
        trim :true,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        min:6,
        max: 64
    },
    username:{
        type:String,
        unique:true,
        // required: true,
    },
    resetToken:{
        type:String,
    },
    about:{
        type:String,
    },
    photo: String,
    following: [{type:Schema.ObjectId, ref : "User"}],
    Followers: [{type:Schema.ObjectId, ref : "User"}],

},{timestamps: true})

module.exports= mongoose.model('User',userSchema)