require("dotenv").config();
const express = require("express");
const cors = require("cors");
const tf = require("@tensorflow/tfjs-node");
const multer = require("multer");

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

app.use(express.json());

async function testModelLoading() {
  try {
    const modelPath =
      "https://tfhub.dev/tensorflow/tfjs-model/mobilenet_v2/classification/4/default/1/model.json";
    const model = await tf.loadLayersModel(modelPath);

    // Log the summary of the loaded model (optional)
    model.summary();

    console.log("Model loaded successfully!");
  } catch (error) {
    console.error("Error loading model:", error);
  }
}

testModelLoading();

// API endpoint to load the model
app.get("/load-model", (req, res) => {
  const modelPath =
    "https://tfhub.dev/tensorflow/tfjs-model/mobilenet_v2/classification/4/default/1/model.json";

  tf.loadLayersModel(modelPath)
    .then((loadedModel) => {
      res.json({ message: "Model loaded successfully" });
    })
    .catch((error) => {
      console.error("Error loading model:", error);
      res.status(500).json({ error: "Failed to load model" });
    });
});

// API endpoint for image upload and recognition
app.post("/upload", multer().single("image"), async (req, res) => {
  try {
    const { buffer } = req.file;

    // Load the model inside the endpoint
    const modelPath =
      "https://tfhub.dev/tensorflow/tfjs-model/mobilenet_v2/classification/4/default/1/model.json";
    const model = await tf.loadLayersModel(modelPath);

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
