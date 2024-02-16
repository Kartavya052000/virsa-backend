const jwt = require('jsonwebtoken');
const Contact = require('../Models/ContactModel');

// Route handler for creating a new contact
exports.createContact = async (req, res) => {
  try {
    // Get the decoded user information from the JWT token
    const userId = req.user._id;

    // Create a new contact with the decoded user information and message from the request body
    const contact = new Contact({
      message: req.body.message,
      user:req.user 
    });

    // Save the contact to the database
    await contact.save();

    res.status(201).json({ message: 'Contact created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
