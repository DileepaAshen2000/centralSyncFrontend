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
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import axios from "axios";

const columns = [
  { field: "id", headerName: "Id", editable: false, width: 300 },

  { field: "itemName", headerName: "Item Name", editable: false, width: 300 },
  {
    field: "brand",
    headerName: "Brand",
    minwidth: 200,
    editable: false,
    flex: 1,
  },
];

const rows = [
  { id: 1, itemName: "Snow", brand: "Jon" },
  { id: 2, itemName: "Lannister", brand: "Cersei", age: 42 },
];

function Row(props) {
  const { row, open, setOpen } = props;

  return (
    <TableBody>
      {row.details.map((detailsRow) => (
        <TableRow key={detailsRow.id}>
          <TableCell component="th" scope="row">
            {detailsRow.date}
          </TableCell>
          <TableCell>{detailsRow.issue}</TableCell>
          <TableCell align="right">{detailsRow.description}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

const InfoTable = ({ category, year }) => {
  const [tickets, setTickets] = useState([]);

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
        issue: ticket.issue,
        description: ticket.description,
      },
    ],
  }));

  const [open, setOpen] = useState(false);
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Item Name</TableCell>
            <TableCell align="right">Brand</TableCell>
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
              {rows[0].itemName}
            </TableCell>
            <TableCell align="right">{rows[0].brand}</TableCell>
            <TableCell align="right">{rows[0].count}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Typography variant="h6" gutterBottom component="div">
                    Details
                  </Typography>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Issue</TableCell>
                        <TableCell align="right">Description</TableCell>
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
  );
};

export default InfoTable;
