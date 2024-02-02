const express = require('express');
const router = express.Router();
const bookController = require('../Controllers/BookController');
const userVerification = require("../Middleware/AuthMiddleware")

router.post('/book', bookController.saveBook);
router.get('/get-books',userVerification, bookController.getBooks);
router.post('/purchase/books',userVerification, bookController.purchaseBook);
// router.get('/purchase/userId',userVerification, bookController.checkUserPurchase);

module.exports = router;
