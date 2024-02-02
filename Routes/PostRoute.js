// routes/postRoutes.js
const express = require('express');
const postController = require('../Controllers/PostController');

const router = express.Router();
const userVerification = require("../Middleware/AuthMiddleware")
// Get all posts
router.post('/get-post',userVerification, postController.getAllPosts);

// Create a new post
router.post('/create-post', postController.createPost);
router.post('/like/:postId',userVerification, postController.LikePost)
router.post('/comment/:postId',userVerification,postController.CommentOnPost)
router.post('/bookmark/:postId',userVerification, postController.bookmarkPost);
router.get('/bookmark-posts',userVerification, postController.UserBookmark);

module.exports = router;
