require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const mongodbConnection =
  process.env.MONGODB_URI || "mongodb://localhost:27017";

console.log("mongodbConnection: ", mongodbConnection);
// MongoDB connection setup (replace 'your_db_url' with your actual MongoDB URL)
mongoose.connect(mongodbConnection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a simple schema (for demonstration purposes)
const imageSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  imageUrl: String,
  prediction: String,
});

// const Image = mongoose.model("test", imageSchema, "images");
const Image = mongoose.model(
  process.env.MONGODB_DATABASE,
  imageSchema,
  process.env.MONGODB_COLLECTION
);

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//Get all the image Data from the API endpoint
app.get("/image-data", (req, res) => {
  Image.find()
    .then((data) => {
      console.log("Data: ", data);
      res.json(data);
    })
    .catch((error) => {
      console.log("Error: ", error);
    });
});

// API endpoint to upload an image
app.post("/upload", upload.single("image"), async (req, res) => {
  // Here you would integrate with your AI/ML model for image recognition
  // For simplicity, we'll just echo back the uploaded image details
  const { originalname, buffer } = req.file;
  const imageUrl = `data:image/png;base64,${buffer.toString("base64")}`;

  console.log("image url: ", imageUrl);

  const newImage = new Image({
    _id: new mongoose.Types.ObjectId(),
    name: originalname,
    imageURL: imageUrl,
    prediction: "AI/ML prediction goes here",
  });

  await newImage.save();

  res.json({ message: "Image uploaded successfully" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
