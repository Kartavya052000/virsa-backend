const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();
const multer = require('multer');

require("dotenv").config();

const { MONGO_URL, PORT } = process.env;
const authRoute = require("./Routes/AuthRoute");
const postRoute = require("./Routes/PostRoute")
const payRoute = require("./Routes/PayRoute")
const bookRoute = require("./Routes/BookRoute")
const Grouproute = require("./Routes/GroupRoute");
const Contactroute = require("./Routes/ContactRoute")
// app.use(cors({
//     origin: [
//       "http://localhost:3001",
//       "http://localhost:3000"
     
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   }));
// app.use(cors());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

  mongoose
    .connect(MONGO_URL)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error(err));
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use("/", authRoute);
  app.use("/", postRoute);
  app.use("/", payRoute);
  app.use("/", bookRoute);
  app.use("/",Grouproute)
  app.use("/",Contactroute)
  //   app.listen(PORT, () => {

  //   console.log(`Server is listening on port ${PORT}`);
  // });
  // Define schema for PDF model
const pdfSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  data: Buffer
});

const PDF = mongoose.model('PDF', pdfSchema);

// Set up multer storage for PDF uploads
const storage = multer.memoryStorage();
// const storage = multer.memoryStorage({
//   // Set a higher memory limit (e.g., 10 MB)
//   limits: { fileSize: 60 * 1024 * 1024 }
// });
const upload = multer({ storage: storage });
app.use(upload.single('pdf'));
app.post('/upload', async (req, res) => {
  try {
    const { originalname, buffer } = req.file;

    // Save PDF data to MongoDB
    const pdf = new PDF({
      filename: originalname,
      contentType: 'application/pdf',
      data: buffer
    });
    await pdf.save();

    res.status(201).send('File uploaded successfully');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
});
// Define route for fetching PDF files
app.get('/pdfs/:id', async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);
    if (!pdf) {
      return res.status(404).send('PDF not found');
    }

    // Set response headers
    res.set({
      'Content-Type': pdf.contentType,
      'Content-Disposition': `inline; filename="${pdf.filename}"`,
    });

    // Send PDF data
    res.send(pdf.data);
  } catch (error) {
    console.error('Error fetching PDF:', error);
    res.status(500).send('Error fetching PDF');
  }
});
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is listening on port ${PORT}`);
  });

