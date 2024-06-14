import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import axios from "axios";

const ItemDetail = () => {
  const location = useLocation();
  const { item } = location.state;
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);

  const itemId = item.itemId;
  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/ticket/getByItemId/${itemId}`
        );
        setTickets(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTicketData();
  }, [itemId]);

  return (
    <div className="p-4 flex justify-center w-full items-center">
      <Card className="max-w-4xl w-full shadow-lg">
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
          <Divider variant="middle" className="mb-4" />
          <Typography variant="h6" className="mb-2">
            Maintenance History
          </Typography>

          <TableContainer component={Paper}>
            <Table aria-label="maintenance history table">
              <TableHead>
                <TableRow>
                  <TableCell>Ticket ID</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.ticketId}>
                    <TableCell>{ticket.ticketId}</TableCell>
                    <TableCell>{ticket.description}</TableCell>
                    <TableCell>{ticket.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider variant="middle" className="mb-4" />
          <Typography variant="h6" className="mb-2">
            Actions
          </Typography>
          <div className="flex justify-around mb-4">
            <Button
              variant="contained"
              className="bg-blue-800 text-white"
              onClick={() =>
                navigate("/in-request/create-new-in-request", {
                  state: { item: item },
                })
              } //set correct navigation and add the method on repective component to set the item name and details
            >
              Request Item
            </Button>
            <Button
              variant="contained"
              className="bg-blue-600 text-white hover:bg-violet-800"
              onClick={() => navigate("/newTicket", { state: { item: item } })} //set correct navigation
            >
              Reserve Item
            </Button>
            <Button
              variant="contained"
              className="bg-violet-600 text-white hover:bg-violet-800"
              onClick={() => navigate("/newTicket", { state: { item: item } })}
            >
              Submit Ticket
            </Button>
          </div>

          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(-1)}
            className="mt-2"
          >
            Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemDetail;
