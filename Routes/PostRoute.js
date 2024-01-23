// routes/postRoutes.js
const express = require('express');
const postController = require('../Controllers/PostController');

const router = express.Router();
const userVerification = require("../Middleware/AuthMiddleware")
// Get all posts
router.get('/get-post', postController.getAllPosts);

// Create a new post
router.post('/create-post', postController.createPost);
router.post('/like/:postId',userVerification, postController.LikePost)
router.post('/comment/:postId',userVerification,postController.CommentOnPost)

module.exports = router;
