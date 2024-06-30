import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";

const ItemDetail = () => {
  const location = useLocation();
  const { item } = location.state;
  const navigate = useNavigate();
 

  const getStatusChipColor = (status) => {
    return status === "INACTIVE" ? "bg-red-500" : "bg-green-400";
  };

  return (
    <div className="p-4 flex justify-center w-full items-center relative">
      <IconButton
        onClick={() => navigate(-1)}
        className="absolute top-4 left-11  "
      >
        <ArrowBackIcon fontSize="medium" />
      </IconButton>

      <Card className="max-w-4xl w-full shadow-lg">
        <CardMedia
          component="img"
          image={`data:image/*;base64,${item.image}`}
          alt={item.itemName}
          className="mt-10 h-[150px] w-auto"
       
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
            <Chip
              label={`Status: ${item.status}`}
              className={`${getStatusChipColor(item.status)} text-white`}
            />
          </div>
        
          {item.status === "ACTIVE" && (
            <>
              <Divider variant="middle" className="mb-4" />

              <div className="flex justify-around mb-4">
                <Button
                  variant="outlined"
                  onClick={() =>
                    navigate("/in-request/create-new-in-request", {
                      state: { item: item },
                    })
                  }
                >
                  Request Item
                </Button>
                <Button
                  variant="outlined"
                  onClick={() =>
                    navigate("/newreservation", { state: { item: item } })
                  }
                >
                  Reserve Item
                </Button>
                <Button
                  variant="outlined"
                  onClick={() =>
                    navigate("/newTicket", { state: { item: item } })
                  }
                >
                  Submit Ticket
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemDetail;
