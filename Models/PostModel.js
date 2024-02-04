const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming your user model is named 'User'
      // required: true,
    },
    username: {
      type: String,
      // required: true,
    },
  },
  comment: {
    type: String,
    // required: true,
  },
   createdAt: {
    type: Date,
    default: Date.now, // Automatically set the timestamp to the current date and time
  },
});

const postSchema = new mongoose.Schema({
  postContent: {
    type: String,
    required: true,
  },
  groupName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    count: {
      type: Number,
      default: 0,
    },
  },
  comments: [commentSchema], // Use the commentSchema for comments
  bookmarks:{
    users:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // New field for bookmarks
  } 

});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
