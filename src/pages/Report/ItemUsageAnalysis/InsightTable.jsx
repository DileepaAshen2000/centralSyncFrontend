import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const InsightTable = ({ category, year, isOpen }) => {
  const [ticket, setTicket] = useState([]);
  const [mostRequestedItem, setMostRequestedItem] = useState(null);
  const [open, setOpen] = useState(isOpen);
  const [loadingTickets, setLoadingTickets] = useState();
  const [loadingMostRequested, setLoadingMostRequested] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoadingTickets(true);
        const response = await axios.get(
          `http://localhost:8080/ticket/item?itemGroup=${category}&year=${year}`
        );
        console.log(response.data);

        if (response.data) {
          const ticketList = response.data.map((ticket) => ({
            id: ticket.ticketId,
            itemName: ticket.itemId.itemName,
            brand: ticket.itemId.brand,
            details: [
              {
                id: ticket.ticketId,
                date: ticket.date,
                issue: ticket.topic,
                description: ticket.description,
              },
            ],
          }));
          setTicket(ticketList);
        } else {
          setTicket(null);
        }
      } catch (error) {
        console.log(error);
        setTicket(null);
      } finally {
        setLoadingTickets(false);
      }
    };

    const fetchMostRequested = async () => {
      setLoadingMostRequested(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/request/mostRequested?itemGroup=${category}&year=${year}`
        );
        console.log("mostRequestedItem", response.data);

        // Update mostRequestedItem state
        if (response.data) {
          const mostRequestedItemData = {
            id: response.data.item.itemId,
            itemName: response.data.item.itemName,
            brand: response.data.item.brand,
            count: response.data.count,
          };
          setMostRequestedItem(mostRequestedItemData);
          console.log("mostRequestedItem", mostRequestedItemData);
        } else {
          setMostRequestedItem(null); // Handle case where data may be incomplete
        }
        console.log("mostRequestedItem", mostRequestedItem);
      } catch (error) {
        console.log(error);
        setMostRequestedItem(null);
      } finally {
        setLoadingMostRequested(false);
      }
    };

    fetchTickets();
    fetchMostRequested();
  }, [category, year]);

  if (loadingTickets) {
    return (
      <div className="flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  const renderNoRecords = (message) => (
    <Typography
      variant="body1"
      align="center"
      className=" flex justify-center items-center my-10"
    >
      {message}
    </Typography>
  );

  return (
    <div className="w-full md:w-4/5 mx-auto my-10">
      <div className="bg-gray-200 p-4">
        <Typography variant="h6" align="center">
          Most Frequently Maintained Item
        </Typography>
      </div>
      {loadingTickets ? (
        <div className="flex justify-center mostRequestedItems-center">
          <CircularProgress />
        </div>
      ) : ticket.length > 0 ? (
        <TableContainer component={Paper} className="bg-gray-100 mt-2">
          <Table aria-label="collapsible table" size="small">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Item Name</TableCell>
                <TableCell align="left">Brand</TableCell>
                <TableCell align="right">Count</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                  >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                  {ticket[0].itemName}
                </TableCell>
                <TableCell align="left">{ticket[0].brand}</TableCell>
                <TableCell align="right">{ticket.length}</TableCell>
              </TableRow>
              <TableRow className="bg-gray-50">
                <TableCell className="p-0" colSpan={4}>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 0 }}>
                      <Typography
                        variant="subtitle1"
                        align="center"
                        className="p-4"
                      >
                        Details
                      </Typography>
                      <Table size="small" aria-label="purchases">
                        <TableHead>
                          <TableRow>
                            <TableCell>Ticket Id</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell align="right">Issue</TableCell>
                          </TableRow>
                        </TableHead>
                        {ticket.map((row) => (
                          <Row key={row.id} row={row} />
                        ))}
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        renderNoRecords("No records found")
      )}

      <div className="bg-gray-200 p-4 mt-10">
        <Typography variant="h6" align="center">
          Most Requested Item
        </Typography>
      </div>

      {loadingMostRequested ? (
        <div className="flex justify-center mostRequestedItems-center">
          <CircularProgress />
        </div>
      ) : mostRequestedItem !== null ? (
        <TableContainer component={Paper} className="bg-gray-100 mt-2">
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>Item Name</TableCell>
                <TableCell align="left">Brand</TableCell>
                <TableCell align="right">Count</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow onClick={()=> navigate("/item/view-item/" + mostRequestedItem.id)}>
                <TableCell component="th" scope="row">
                  {mostRequestedItem.itemName}
                </TableCell>
                <TableCell align="left">{mostRequestedItem.brand}</TableCell>
                <TableCell align="right">{mostRequestedItem.count}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        renderNoRecords("No records found")
      )}
    </div>
  );
};

function Row(props) {
  const navigate = useNavigate();
  const { row } = props;

  return (
    <TableBody>
      {row.details &&
        row.details.map((detailsRow) => (
          <TableRow
            key={detailsRow.id}
            onClick={() => navigate("/ticket/ticketdoc/" + detailsRow.id)}
          >
            <TableCell component="th" scope="row">
              {detailsRow.id}
            </TableCell>
            <TableCell>
              {new Date(detailsRow.date).toLocaleDateString()}
            </TableCell>
            <TableCell align="right">{detailsRow.issue}</TableCell>
          </TableRow>
        ))}
    </TableBody>
  );
}

export default InsightTable;
