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
    }],
    link:{
        type:String,
        
    },
    amount:{
        type:Number
    },
    currency:{
        type:String
    }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
