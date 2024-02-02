// models/book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    pages: {
        type: Number,
        required: true
    },
    purchasedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
