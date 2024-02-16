const PDF = require('../Models/PdfModel');

exports.uploadPDF = async (req, res) => {
  try {
    // Get the decoded user information from the JWT token
    // const userId = req.user._id;

    // Extract file details from the request
    const { originalname, buffer } = req.file;

    // Save PDF data to MongoDB
    const pdf = new PDF({
      filename: originalname,
      contentType: 'application/pdf',
      data: buffer,
    //   user: userId // Assuming userId is stored in the JWT token
    });

    await pdf.save();

    res.status(201).json({ message: 'PDF uploaded successfully' });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).json({ error: 'Server error' });
  }
};