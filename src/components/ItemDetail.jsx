import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";

const ItemDetail = () => {
  const location = useLocation();
  const { item } = location.state;
  const navigate = useNavigate();
  return (
    <div className="p-4 flex justify-center w-ful items-center">
      <Card className="max-w-md w-full shadow-lg">
        <CardMedia
          component="img"
          height="200"
          image={item.image || "default-image-url.jpg"}
          alt={item.itemName}
        />
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            className="text-xl font-bold mb-2"
          >
            {item.itemName}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            className="text-gray-700 mb-2"
          >
            Brand: {item.brand}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            className="text-gray-700 mb-2"
          >
            Quantity: {item.quantity}
          </Typography>
         
          <Typography
            variant="body2"
            color="textSecondary"
            className="text-gray-700 mb-4"
          >
            Description: {item.description || "No description available."}
          </Typography>
          <div className="mb-4">
            <Chip label={`Item group: ${item.itemGroup}`} className="mr-2" />
            <Chip label={`Status: ${item.status}`} />
          </div>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemDetail;
