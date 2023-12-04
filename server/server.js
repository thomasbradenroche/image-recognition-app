require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const tf = require("@tensorflow/tfjs-node");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Load the MobileNet model
const modelPath =
  "https://tfhub.dev/tensorflow/tfjs-model/mobilenet_v2/classification/4/default/1/model.json";
let model;
tf.loadLayersModel(modelPath)
  .then((loadedModel) => {
    model = loadedModel;
    console.log("Model loaded successfully.");
  })
  .catch((error) => {
    console.error("Error loading model:", error);
  });

// const mongodbConnection =
//   process.env.MONGODB_URI || "mongodb://localhost:27017";

// MongoDB connection setup (replace 'your_db_url' with your actual MongoDB URL)
// mongoose.connect(mongodbConnection, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Define a simple schema (for demonstration purposes)
// const imageSchema = new mongoose.Schema({
//   _id: mongoose.Schema.Types.ObjectId,
//   name: String,
//   imageUrl: String,
//   prediction: String,
// });

// const Image = mongoose.model("test", imageSchema, "images");
// const Image = mongoose.model(
//   process.env.MONGODB_DATABASE,
//   imageSchema,
//   process.env.MONGODB_COLLECTION
// );

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

// API endpoint to upload for image to mongoDB
// app.post("/upload", upload.single("image"), async (req, res) => {
//   // Here you would integrate with your AI/ML model for image recognition
//   // For simplicity, we'll just echo back the uploaded image details
//   const { originalname, buffer } = req.file;
//   const imageUrl = `data:image/png;base64,${buffer.toString("base64")}`;

//   const newImage = new Image({
//     _id: new mongoose.Types.ObjectId(),
//     name: originalname,
//     imageUrl: imageUrl,
//     prediction: "AI/ML prediction goes here",
//   });

//   await newImage.save();

//   res.json({ message: "Image uploaded successfully" });
// });

// Endpoint for image upload and recognition
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!model) {
      throw new Error("Model not loaded yet");
    }

    const { buffer } = req.file;
    const imageBuffer = tf.node.decodeImage(buffer);
    const batchedImage = tf.expandDims(imageBuffer);

    // Make a prediction using the loaded model
    const prediction = await model.predict(batchedImage).data();

    // Choose the top prediction class
    const topPredictionClass = tf.argMax(prediction).dataSync()[0];

    res.json({ prediction: topPredictionClass });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
