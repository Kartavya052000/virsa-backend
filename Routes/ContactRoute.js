const express = require('express');
const router = express.Router();
const ContactController = require('../Controllers/ContactController');
const userVerification = require("../Middleware/AuthMiddleware")

router.post('/contact',userVerification, ContactController.createContact);

module.exports = router;
