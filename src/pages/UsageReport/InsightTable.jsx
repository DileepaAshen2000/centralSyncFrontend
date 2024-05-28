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

const InsightTable = ({ category, year }) => {
  const [tickets, setTickets] = useState([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/ticket/item?itemGroup=${category}&year=${year}`
        );
        setTickets(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [category, year]);

  console.log(tickets);

  const rows = tickets.map((ticket) => ({
    id: ticket.ticketId,
    itemName: ticket.itemId.itemName,
    brand: ticket.itemId.brand,
    count: 5,
    details: [
      {
        id: ticket.ticketId,
        date: ticket.date,
        issue: ticket.topic,
        description: ticket.description,
      },
    ],
  }));

  if (rows.length === 0) {
    return (
      <div className="flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="w-4/5 mx-auto my-10">
      <TableContainer component={Paper} className="bg-gray-100">
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
              <TableCell colSpan={4}>
                <p className=" text-l  p-2 font-bold ">
                  Most Frequently Maintained Item
                </p>
              </TableCell>
            </TableRow>
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
                {rows[0].itemName}
              </TableCell>
              <TableCell align="left">{rows[0].brand}</TableCell>
              <TableCell align="right">{tickets.length}</TableCell>
            </TableRow>

            <TableRow className="bg-gray-50">
              <TableCell className="p-0" colSpan={4}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 0 }}>
                    <p className="text-m font-medium p-4 text-center">
                      Details
                    </p>
                    <Table size="small" aria-label="purchases">
                      <TableHead>
                        <TableRow>
                          <TableCell>Ticket Id</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell align="right">Issue</TableCell>
                        </TableRow>
                      </TableHead>
                      {rows.map((row) => (
                        <Row
                          key={row.id}
                          row={row}
                          open={open}
                          setOpen={setOpen}
                        />
                      ))}
                    </Table>
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

function Row(props) {
  const { row } = props;

  return (
    <TableBody>
      {row.details.map((detailsRow) => (
        <TableRow key={detailsRow.id}>
          <TableCell component="th" scope="row">
            {detailsRow.id}
          </TableCell>
          <TableCell>{detailsRow.date}</TableCell>
          <TableCell align="right">{detailsRow.issue}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

export default InsightTable;
