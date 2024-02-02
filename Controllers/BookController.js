const Book = require("../Models/BookModel");
const User = require("../Models/UserModel");
// Save a new book
exports.saveBook = async (req, res, next) => {
    try {
        // Extract book data from request body
        const { name, pages } = req.body;

        // Create a new Book object
        const newBook = new Book({ name, pages });

        // Save the book to the database
        await newBook.save();

        // Send a success response
        res.status(201).json({ message: 'Book saved successfully', book: newBook });
    } catch (error) {
        // Handle errors
        console.error('Error saving book:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Retrieve all books
exports.getBooks = async (req, res, next) => {
    try {
        const books = await Book.find();
   console.log(req.user._id,"USER")
        // If userId is available in the request, check if the user has purchased each book
        if (req.user._id) {
            const user = await User.findById(req.user._id); // Assuming req.userId contains the user's ID

            // Iterate through each book and check if the user has purchased it
            const booksWithPurchaseInfo = await Promise.all(books.map(async (book) => {
                const hasPurchased = book.purchasedBy.includes(req.user._id);
                return {
                    ...book.toObject(),
                    hasPurchased // Add a flag indicating if the user has purchased the book
                };
            }));

            res.status(200).json(booksWithPurchaseInfo);
        } else {
            // If userId is not available, simply send the list of books without purchase info
            res.status(200).json(books);
        }
    } catch (error) {
        console.error('Error retrieving books:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Purchase a book
exports.purchaseBook = async (req, res, next) => {
    try {
    const userId = req.user._id; // Assuming your user object has an '_id' field

        // const { userId } = req.body;
        const { bookId } = req.body;

        // Find the book by its ID
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        // Update the book's purchasedBy array with the user's ID
        book.purchasedBy.push(userId);

        // Save the updated book to the database
        await book.save();

        res.status(201).json({ message: 'User record saved for the book' });
    } catch (error) {
        console.error('Error saving user record for book:', error);
        res.status(500).json({ error: 'Failed to save user record for book' });
    }
};

// Check if a user has purchased any book
// exports.checkUserPurchase = async (req, res, next) => {
//     try {
//         // const { userId } = req.params;
//         const userId = req.user._id; // Assuming your user object has an '_id' field

//         // Find all books where the user's ID exists in the purchasedBy array
//         const purchasedBooks = await Book.find({ purchasedBy: userId });

//         // Check if the user has purchased any book
//         const hasPurchasedAnyBook = purchasedBooks.length > 0;

//         res.status(200).json({ hasPurchasedAnyBook });
//     } catch (error) {
//         console.error('Error checking user purchase:', error);
//         res.status(500).json({ error: 'Failed to check user purchase' });
//     }
// };
