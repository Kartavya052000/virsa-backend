// controllers/postController.js
const Post = require('../Models/PostModel');

exports.getAllPosts = async (req, res) => {
  try {
    // Fetch all posts
    let query = {};
    if (req.body.groupName) {
      // If group name is provided, filter posts by group name
      query.groupName = req.body.groupName;
    }
    const posts = await Post.find(query);

    // Get the user ID from the request (assuming it's stored in req.user._id)
    const userId = req.user._id;

    // Iterate through each post and check if the user has bookmarked it
    const postsWithBookmarks = posts.map(post => {
      // Check if the post's bookmarks array contains the user ID
      const isBookmarked = post.bookmarks.users.includes(userId);
      // Add a 'bookmarked' key to the post object indicating whether the user has bookmarked it
      return { ...post.toObject(), bookmarked: isBookmarked };
    });

    // Send the modified posts array with bookmarked status in the response
    res.json(postsWithBookmarks);
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
  // controllers/postController.js
exports.bookmarkPost = async (req, res) => {
  const userId = req.user._id;

  try {
    const post = await Post.findById(req.params.postId);

    if (post.bookmarks.users.includes(userId)) {
      // If the user has already bookmarked the post, remove the bookmark
      post.bookmarks.users.pull(userId);
    } else {
      // If the user hasn't bookmarked the post, add the bookmark
      post.bookmarks.users.push(userId);
    }

    // Update the count of unique users who bookmarked the post
    post.bookmarks.count = post.bookmarks.users.length;

    // Save the updated post
    const bookmarkedPost = await post.save();

    res.json(bookmarkedPost);
  } catch (error) {
    console.error('Error bookmarking post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.UserBookmark = async (req, res) => {
  const userId = req.user._id;


  try {
    // Find all posts where the user has bookmarked
    const bookmarkedPosts = await Post.find({ 'bookmarks.users': userId });

    res.json(bookmarkedPosts);
  } catch (error) {
    console.error('Error fetching bookmarked posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

  