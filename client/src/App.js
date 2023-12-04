import React, { useState } from "react";
// Import necessary styles (add this line at the top of your file)
import "react-toastify/dist/ReactToastify.css";

// Import the necessary components
import { ToastContainer } from "react-toastify";
// Import the necessary components
import { toast } from "react-toastify";
import {
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Input,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import axios from "axios";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]); // [{ name: "image1.jpg", url: "http://localhost:5000/uploads/image1.jpg" }

  const getImages = async () => {
    const getURL = process.env.APIGET_URL || "http://localhost:5000/image-data";
    try {
      const response = await axios.get(getURL);
      setImages(response.data);
    } catch (error) {
      console.error("Error: ", error);
      setImages([]);
    }
  };

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const postURL = process.env.APIPOST_URL || "http://localhost:5000/upload";

      try {
        setLoading(true);
        await axios.post(postURL, formData);
        setLoading(false);
        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
      }
    } else {
      toast.warn("Please select an image to upload");
    }
  };

  return (
    <Container
      style={{
        borderRadius: "8px",
        padding: "20px",
      }}
      className="App"
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={12} sm={6}>
          <Paper
            style={{
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            {/* Your centered block content */}
            <Grid style={{ marginBottom: "10px" }}>
              <Typography variant="h2">Image Library</Typography>
              <Typography variant="h6">
                Upload a photo and it will guess what it is
              </Typography>
            </Grid>

            <Grid container>
              <Grid item>
                <Paper style={{ padding: "20px" }}>
                  {/* Content for Column 1 */}
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    style={{ marginRight: "10px" }}
                  />
                  <Button variant="contained" onClick={handleUpload}>
                    Upload
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {loading && (
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h4">Uploaded Images</Typography>
          </Grid>
        )}
      </Grid>

      <ToastContainer />
    </Container>
  );
}

export default App;
