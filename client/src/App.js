import React, { useState } from "react";
import {
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Input,
} from "@mui/material";
import axios from "axios";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [images, setImages] = useState([]); // [{ name: "image1.jpg", url: "http://localhost:5000/uploads/image1.jpg" }

  const getImages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/image-data");
      setImages(response.data);
      alert("Images retrieved successfully");
    } catch (error) {
      console.error("Error: ", error);
      setImages([]);
      alert("Error retrieving images");
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);

      console.log("formData: ", formData);

      try {
        await axios.post("http://localhost:5000/upload", formData);
        alert("Image uploaded successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image");
      }
    } else {
      alert("Please select an image to upload");
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
        spacing={0}
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
              <Button onClick={getImages}>Get Images</Button>
              <Button onClick={() => setImages([])}>Clear Images</Button>
            </Grid>

            <Grid container style={{ background: "rgba(255, 255, 255, 0.9)" }}>
              <Grid item style={{ background: "rgba(255, 255, 255, 0.9)" }}>
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

            {/*List out all the images in a grid with name and imageURL */}
            <Grid style={{ marginTop: "50px" }}>
              <Typography variant="h6">Images</Typography>
              {images.map((image) => (
                <div key={image._id}>
                  <h2>{image.name}</h2>
                  <img
                    src={image.imageURL}
                    alt={image.name}
                    style={{ maxWidth: "100%", maxHeight: "100px" }}
                  />
                </div>
              ))}
              {images.length === 0 && <Typography>No images found</Typography>}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
