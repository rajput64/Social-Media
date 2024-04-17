const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema;
const postSchema = new mongoose.Schema({
    content:{
        //for rich text editor
        type:{},
        required: true,
    },
    postedBy:{
        type: ObjectId,
        ref:"User"
    },
    image:{
        url: String,
        public_id: String
    },
    likes:[{type: ObjectId,ref: "User"}],
    comments:[{
        text:String,
        created:{type:Date,default:Date.now},
        postedBy:{
            type:ObjectId,
            ref: "User",
            select: '-password'
        }
    }]
},{timestamps: true})

module.exports = mongoose.model('Post',postSchema)