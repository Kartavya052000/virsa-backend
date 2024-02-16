const mongoose = require('mongoose');

// Define a schema for the user
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: function () {
      return this.provider === "local"; // Only required for local users
    },
  },
  countryCode: {
    type: String,
    required: function () {
      return this.provider === "local"; // Only required for local users
    },
  },
  phoneNumber: {
    type: String,
    required: function () {
      return this.provider === "local"; // Only required for local users
    },
  },
  nationality:{
    type:String
  },
  otp: {
    type: String,
    // required: true,
  },
  otpExpiration: {
    type: Date,
    // required: true,
  },
  verified:{
    type:Boolean,
    default: false  // Default value is false

  },
  provider: {
    type: String,
    enum: ["local", "google"],
    required: true,
  },
  googleId: {
    type: String,
    unique: function () {
      return this.provider === "google"; // Set unique based on the provider
    },
    sparse: true, // Allow multiple null values
    required: function () {
      return this.provider === "google"; // Require for 'google' provider
    }
  }
});
userSchema.index({ email: 1, verified: 1 }, { unique: true, partialFilterExpression: { verified: true } });

// Middleware to update the compound index when the verified field is modified
userSchema.pre('save', function(next) {
  if (this.isModified('verified')) {
    this.constructor.updateOne({ email: this.email }, { verified: this.verified }).exec();
  }
  next();
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
