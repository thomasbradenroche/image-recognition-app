import React from "react";
import { Button, Input } from "@mui/material";

export const ImageUploader = ({ handleUpload, handleFileChange }) => {
  return (
    <>
      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </>
  );
};

export default ImageUploader;
