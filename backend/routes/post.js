const express = require('express');
const { createPost, uploadImage, postByUser, addComment, removeComment, allpostbyuser } = require('../controllers/post');
const { requireSingin } = require('../middleware/middleware');
const router = express.Router();
const formidable = require('express-formidable');
const { profileImage } = require('../controllers/auth');


router.post('/create-post',requireSingin,createPost);
router.post('/upload-image',requireSingin,formidable({maxFieldsSize: 5 * 1024 * 1024}),uploadImage);
router.get('/user-posts',requireSingin,postByUser);

//post by user show
router.get("/allpostbyuser",requireSingin,allpostbyuser);

router.post('/profile-image',requireSingin,formidable({maxFieldsSize: 10*1024*1024}),profileImage);

router.put('/add-comment',requireSingin,addComment);
router.delete('/remove-comment',requireSingin,removeComment);
module.exports = router;