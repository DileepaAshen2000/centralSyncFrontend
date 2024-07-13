import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RequestIcon from "@mui/icons-material/RequestPage";
import ReserveIcon from "@mui/icons-material/EventAvailable";
import TicketIcon from "@mui/icons-material/ConfirmationNumber";
import StockInIcon from "@mui/icons-material/MoveToInbox";
import StockOutIcon from "@mui/icons-material/Outbox";
import LoginService from "../pages/Login/LoginService";

const ItemDetail = () => {
  const location = useLocation();
  const { item } = location.state;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const isAdmin = LoginService.isAdmin();
  const isEmployee=LoginService.isEmployee();
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (path) => {
    navigate(path, { state: { item: item } });
    handleMenuClose();
  };

  const getStatusChipColor = (status) => {
    return status === "INACTIVE" ? "bg-red-500" : "bg-green-400";
  };

  return (
    <div className="p-4 flex justify-center w-full items-center relative">
      <IconButton
        onClick={() => navigate(-1)}
        className="absolute top-4 left-11 z-50 "
      >
        <ArrowBackIcon fontSize="medium" />
      </IconButton>

      <Card className="max-w-4xl w-full shadow-lg relative">
        {item.status === "ACTIVE" && (
          <>
            <IconButton
              aria-controls="actions-menu"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              className="absolute top-2 right-2"
            >
              <MoreVertIcon fontSize="large" />
            </IconButton>

            <Menu
              id="actions-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {!isAdmin && (
                <MenuItem
                  onClick={() =>
                    handleAction("/in-request/create-new-in-request")
                  }
                >
                  <RequestIcon className="mr-2" /> Request Item
                </MenuItem>
              )}
              <MenuItem onClick={() => handleAction("/newreservation")}>
                <ReserveIcon className="mr-2" /> Reserve Item
              </MenuItem>
              <MenuItem onClick={() => handleAction("/newTicket")}>
                <TicketIcon className="mr-2" /> Submit Ticket
              </MenuItem>
              {!isEmployee && (
                <>
                  <MenuItem onClick={() => handleAction("/new-stockin")}>
                    <StockInIcon className="mr-2" /> Stock In
                  </MenuItem>
                  <MenuItem onClick={() => handleAction("/new-stockout")}>
                    <StockOutIcon className="mr-2" /> Stock Out
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        )}

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
            Model: {item.model}
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
            <Divider variant="middle" className="mt-4" />
          </div>

          {item.status === "ACTIVE" ? (
            <></>
          ) : (
            <>
              <Typography
                variant="body2"
                color="error"
                className="text-red-500"
              >
                Cannot perform any activities on inactive items.
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemDetail;
