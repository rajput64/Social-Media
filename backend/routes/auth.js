// routes/register.js

const express = require('express');
const { register, login, currentUser, forgotPassword, profileUpdate, findPeople, userFollow, addFollower, allFollowing, removeFollower, userUnfollow, UserDetail, resetPassword, getUserData, allFollowers } = require('../controllers/auth');
const  {requireSingin}  = require('../middleware/middleware');
const { userSinglePost, updatePost, deletePost, likePost, dislikePost } = require('../controllers/post');
const router = express.Router();

// Define your route handlers
router.post('/register', register);

//login router
router.post('/login',login);

router.get('/current-user',requireSingin,currentUser);

//get user data
router.get('/userData',requireSingin,getUserData);

//get user detail by id
router.get("/user-detail/:id",requireSingin,UserDetail);

//forgot password
router.post('/forgot-password',forgotPassword)

//update user
router.put('/profile-update',requireSingin,profileUpdate);

//show update post
router.get("/user-post/:id",requireSingin,userSinglePost);

//updating post
router.put("/update-post/:id",requireSingin,updatePost);

//delete post
router.delete("/delete-post/:id",requireSingin,deletePost);

//findine people
router.get("/find-people",requireSingin,findPeople);

//follow people
router.put("/user-follow",requireSingin,addFollower,userFollow);

//get all following
router.get("/user-following",requireSingin,allFollowing);

//get all followers
router.get("/user-followers",requireSingin,allFollowers);


//unfollow
router.put('/user-unfollow',requireSingin,removeFollower,userUnfollow);
router.post('/reset-password',requireSingin,resetPassword);

router.put('/like-post',requireSingin,likePost);
router.put('/dislike-post',requireSingin,dislikePost);
module.exports = router;
