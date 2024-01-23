// controllers/postController.js
const Post = require('../Models/PostModel');

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPost = async (req, res) => {
  const { postContent, groupName } = req.body;

  const newPost = new Post({
    postContent,
    groupName,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Like a post
// controllers/postController.js
// controllers/postController.js
// controllers/postController.js
exports.LikePost = async (req, res) => {
    const userId = req.user._id; // Assuming your user object has an '_id' field
  
    try {
      const post = await Post.findById(req.params.postId);
  
      if (post.likes.users.includes(userId)) {
        // If the user has already liked the post, remove the like
        post.likes.users.pull(userId);
      } else {
        // If the user hasn't liked the post, add the like
        post.likes.users.push(userId);
      }
  
      // Update the count of unique users who liked the post
      post.likes.count = post.likes.users.length;
  
      // Save the updated post
      const likedPost = await post.save();
  
      // Include likes and userCount in the response
      const { _id, postContent, groupName, likes, createdAt, comments } = likedPost;
      res.json({ _id, postContent, groupName, likes, userCount: likes.count, createdAt, comments });
    } catch (error) {
      console.error('Error liking post:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
//   // Comment on a post
exports.CommentOnPost = async (req, res) => {
    try {
      const { user, comment } = req.body;
      const userId = req.user._id;
      const username = req.user.fullname; // Assuming your user object has a 'username' field
  console.log(username,"User")
//   return
      const commentedPost = await Post.findByIdAndUpdate(
        req.params.postId,
        {
          $push: {
            comments: {
              user: {
                _id: userId,
                username: username,
              },
              comment: comment,
            },
          },
        },
        { new: true }
      );
  
      res.json(commentedPost);
    } catch (error) {
      console.error('Error commenting on post:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  