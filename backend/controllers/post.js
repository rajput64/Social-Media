const cloudinary = require("cloudinary")
const Post = require('../models/post');
// const post = require("../models/post");

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

const createPost = async(req,res)=>{
    const {content,image} = req.body;
    console.log("createpost");
    console.log(req.body)
    console.log(req.user);
    if(!content.length){
        return res.json({
            error: "Content is required"
        });
    }
    try {
        const post = await new Post({content:content,image:image,postedBy:req.user._id});
        post.save();
        console.log("data saved",post);
        return res.status(200).send("Post created succesfully!!");
    } catch (error) {
        console.log("Error while creating post");
        res.sendStatus(400);
    }
}

const uploadImage = async(req,res)=>{
    console.log(req.files,"files");
    const result = await cloudinary.uploader.upload(req.files.images.path)
    console.log(result);
    res.json({
        url: result.secure_url,
        public_id: result.public_id
    })
}

const postByUser = async(req,res)=>{
    try {
        // const posts = await post.find({postedBy: req.user._id}).populate(
        // const posts = await Post.find().populate(
        //     "postedBy",
        //     "_id name image").select({ password: 0 })
        //     .populate('comments.postedBy')
        //     .sort({createdAt: -1}).limit(10);
        // console.log(posts,"postpppppppppp");
        // res.json(posts); 

        const posts = await Post.find().populate(
            "postedBy",
            "_id name photo ")
            .populate({
                path: "comments.postedBy",
                select: "_id name email photo "
            })
            .sort({createdAt: -1}).limit(10);
        console.log(posts,"postpppppppppp");
        res.json(posts); 
    } catch (error) {
        console.log(error);
    }
}

const allpostbyuser = async(req,res)=>{
    try {
        const posts = await Post.find({ postedBy: req.user._id})
    .populate(
        "postedBy",
        "_id name photo"
    )
    .populate({
        path: "comments.postedBy",
        select: "_id name email photo"
    })
    .sort({ createdAt: -1 })
    .limit(10);
    res.json(posts); 
    } catch (error) {
        console.log(error);
    }
}

const userSinglePost = async(req,res)=>{
    try {
        console.log(req.params.id)
        const post = await Post.findById(req.params.id);
        res.json(post);
        console.log(post,"post");
    } catch (error) {
        console.log(error);
    }
}

const updatePost = async(req,res)=>{
    console.log(req.params,req.body);
    try {
        const post = await Post.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
        });
        res.json(post);
    } catch (error) {
        console.log(error);
    }
}

const deletePost = async(req,res)=>{
    console.log(req.params.id,req.body,"bbbbbbbb")
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if(post.image && post.image.public_id){
            const image = await cloudinary.uploader.destroy(post.image.public_id)
        }
        res.json({ok:true});
        // const post = await Post.findById(req.params.id);
        // console.log(post,"pppppppppp")
    } catch (error) {
        console.log(error);
    }
}

const likePost = async(req,res)=>{
    try {
        const post = await Post.findByIdAndUpdate(req.body._id,{
            $addToSet: {likes:req.user._id}
        },{new:true});
        res.json(post);
    } catch (error) {
        console.log(error);
    }
}
const dislikePost = async(req,res)=>{
    try {
        const post = await Post.findByIdAndUpdate(req.body._id,{
            $pull: {likes:req.user._id}
        },{new:true});
        res.json(post);
    } catch (error) {
        console.log(error);
    }
}

const addComment= async(req,res)=>{
    // console.log(req.body)
    // console.log(req.user._id,"addcomment")
    //populate this to send to client from backend
    try {
        const {postId,comment} = req.body;
        const post = await Post.findByIdAndUpdate(postId,{
            $push:{
                comments:{text:comment,postedBy:req.user._id}
            }
        }, {new:true})
        .populate('postedBy',"_id name image")
        .populate('comments.postedBy',"_id name image")

        res.json(post);
    } catch (error) {
        console.log(error);
    }
}
const removeComment = async(req,res)=>{
    console.log(req.body,"rrrrrrrr");
    try {
        const {postId,comment} = req.body;
        const post = await Post.findByIdAndUpdate(postId,{
            $pull:{
                comments:{_id:comment._id}}
        },{new:true})
        res.json(post);
    } catch (error) {
        console.log(error);
    }
}
module.exports = {createPost,uploadImage,postByUser,userSinglePost,updatePost,deletePost,likePost,dislikePost,addComment,removeComment,
allpostbyuser}