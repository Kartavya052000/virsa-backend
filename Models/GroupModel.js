const mongoose = require('mongoose');

// Define a schema for the user
const userSchema = new mongoose.Schema({
  groupName: {
    type: String,
    // required: true,
  },
  image:{
    type: String
  }
});


// Create and export the User model
const Group = mongoose.model('Group', userSchema);
module.exports = Group;
