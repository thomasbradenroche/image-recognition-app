import React, { useState } from "react";
// Import necessary styles (add this line at the top of your file)
import "react-toastify/dist/ReactToastify.css";

// Import the necessary components
import { ToastContainer } from "react-toastify";
// Import the necessary components
import { toast } from "react-toastify";
import { Button, Container, Typography, Grid, Paper } from "@mui/material";
import { useDropzone } from "react-dropzone";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState("");

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const clearImage = () => {
    setFile(null);
    setPrediction("");
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post(
          "http://localhost:5000/upload",
          formData
        );
        console.log("Response: ", response);
        setPrediction(response.data.prediction);
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
              <Typography variant="h2">Image Recognition</Typography>
              <Typography variant="h6">
                Upload a photo and it will guess what it is
              </Typography>
            </Grid>

            <Grid>
              <Paper style={{ padding: "20px" }}>
                <div {...getRootProps()} style={dropzoneStyles}>
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Drop the files here...</p>
                  ) : (
                    <p>Drag and drop a file here, or click to select a file</p>
                  )}
                </div>
                {file && (
                  <div>
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Selected"
                      style={{
                        maxWidth: "300px",
                        maxHeight: "300px",
                        padding: "50px",
                      }}
                    />
                    <br></br>
                    <Grid container justifyContent="flex-end" spacing={2}>
                      <Grid item>
                        <Button variant="contained" onClick={handleUpload}>
                          Upload and Analyze
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button onClick={clearImage}>Clear</Button>
                      </Grid>
                    </Grid>
                  </div>
                )}
                {prediction && <p>Prediction: {prediction}</p>}
              </Paper>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <ToastContainer />
    </Container>
  );
}

const dropzoneStyles = {
  border: "2px dashed #cccccc",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  marginTop: "20px",
};

export default App;
