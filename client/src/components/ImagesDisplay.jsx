import { Typography } from "@mui/material";

export const ImagesDisplay = ({ images }) => {
  return (
    <div>
      <Typography variant="h6">Images</Typography>
      {images.map((image) => (
        <div key={image._id}>
          <h2>{image.name}</h2>
          <img
            src={image.imageUrl}
            alt={image.name}
            style={{ maxWidth: "100%", maxHeight: "300px" }}
          />
        </div>
      ))}
    </div>
  );
};
