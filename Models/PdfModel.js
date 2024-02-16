const mongoose = require('mongoose');



const pdfSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    data: Buffer
  });

module.exports = Pdf;
