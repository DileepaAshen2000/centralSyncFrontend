import React, { useState, useEffect } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  TextField,
  Grid,
  Box,
  Typography,
  Button,
} from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const NewReservation = () => {
  const location = useLocation();

  let navigate = useNavigate();
  const [res, setRes] = useState({
    // create state for adjustment, initial state is empty with object.
    itemId: "",
    itemName: "",
    reason: "",
    date: "",
    description: "",
    newQuantity: "",
  });

  const { reason, date, description, newQuantity } = res;

  //Add onChange event to the input fields
  const onInputChange = (e) => {
    setRes({ ...res, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    if (location.state?.item) {
      const { itemId, itemName } = location.state.item;
      setRes((prevState) => ({
        ...prevState,
        itemId: itemId,
        itemName: itemName,
      }));
    }
  }, [location.state]);

  const onSubmit = async (e) => {
    e.preventDefault(); // To remove unwanted url tail part
    await axios.post("http://localhost:8080/adjustment/add", res); // To send data to the server
    navigate("/reservation"); // To navigate to the adjustment page
  };

  return (
    <Box className="p-10 bg-white rounded-2xl ml-14 mr-14">
      <Box className="pb-4">
        <h1 className="pt-2 pb-3 text-3xl font-bold ">New Reservation</h1>
      </Box>
      <form onSubmit={(e) => onSubmit(e)}>
        <Grid container spacing={2} padding={4}>
          <Grid container display="flex" mt={4}>
            <Grid item sm={2} xs={2}>
              <Typography>Item ID</Typography>
            </Grid>
            <Grid item sm={9} xs={9}>
              <TextField
                style={{ width: "300px" }}
                label="Item ID"
                name="itemId"
                value={res.itemId}
                size="small"
              />
            </Grid>
          </Grid>

          <Grid container display="flex" mt={4}>
            <Grid item sm={2} xs={2}>
              <Typography>Item Name</Typography>
            </Grid>
            <Grid item sm={9} xs={9}>
              <TextField
                style={{ width: "300px" }}
                label="Item Name"
                type="search"
                value={res.itemName}
                name="itemName"
                size="small"
                helperText="Please select the item name."
              />
            </Grid>
          </Grid>

          <Grid container display="flex">
            <Grid item sm={2} xs={2}>
              <Typography>Group</Typography>
            </Grid>
            <Grid item sm={9} xs={9}>
              <FormControl style={{ width: "300px" }}>
                <Select size="small" name="group">
                  <MenuItem value="option1">Option 1</MenuItem>
                  <MenuItem value="option2">Option 2</MenuItem>
                  <MenuItem value="option3">Option 3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container display="flex" mt={4}>
            <Grid item sm={2} xs={2}>
              <Typography>Employee ID</Typography>
            </Grid>
            <Grid item sm={9} xs={9}>
              <TextField
                style={{ width: "300px" }}
                label="Item ID"
                name="id"
                size="small"
              />
            </Grid>
          </Grid>

          <Grid container display="flex" mt={4}>
            <Grid item sm={2} xs={2}>
              <Typography>Employee Name</Typography>
            </Grid>
            <Grid item sm={9} xs={9}>
              <TextField
                style={{ width: "300px" }}
                label="Item ID"
                name="id"
                size="small"
              />
            </Grid>
          </Grid>

          <Grid item sm={2} xs={2}>
            <Typography>Duration</Typography>
          </Grid>
          <Grid container display="flex" mt={4}>
            <Grid item sm={2} xs={2}>
              <Typography>From</Typography>
            </Grid>
            <Grid item sm={9} xs={9}>
              <TextField
                style={{ width: "300px" }}
                label="Date"
                name="date"
                type="date"
                value={date}
                onChange={(e) => onInputChange(e)}
                size="small"
                InputLabelProps={{
                  // To shrink the label
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
          <Grid container display="flex" mt={4}>
            <Grid item sm={2} xs={2}>
              <Typography>To</Typography>
            </Grid>
            <Grid item sm={9} xs={9}>
              <TextField
                style={{ width: "300px" }}
                label="Date"
                name="date"
                type="date"
                value={date}
                onChange={(e) => onInputChange(e)}
                size="small"
                InputLabelProps={{
                  // To shrink the label
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>

          <Grid container display="flex" mt={4}>
            <Grid item sm={2} xs={2}>
              <Typography>Reason</Typography>
            </Grid>
            <Grid item sm={9} xs={9}>
              <FormControl style={{ width: "300px" }}>
                <Select
                  value={reason}
                  onChange={(e) => onInputChange(e)}
                  size="small"
                  name="reason"
                >
                  <MenuItem value="reason1">Reason 1</MenuItem>
                  <MenuItem value="reason2">Reason 2</MenuItem>
                  <MenuItem value="reason3">Reason 3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container display="flex" mt={4}>
            <Grid item sm={2} xs={2}>
              <Typography>Description</Typography>
            </Grid>
            <Grid item sm={9} xs={9}>
              <TextField
                // id="outlined-multiline-static"
                label="Description"
                name="description"
                multiline
                rows={6}
                placeholder="Enter Description Here..."
                style={{ width: "500px" }}
                value={description}
                onChange={(e) => onInputChange(e)}
              />
            </Grid>
          </Grid>
        </Grid>
        <Box>
          <Typography display="block" gutterBottom>
            Attach File(s) to inventory adjustment{" "}
          </Typography>
          <input type="file" className="mt-4 mb-2"></input>
          <Typography variant="caption" display="block" gutterBottom>
            You can upload a maximum of 5 files, 5MB each
          </Typography>
        </Box>
        <div className="flex gap-6 mt-6 ml-[70%]">
          <Button
            className="px-6 py-2 text-white bg-blue-600 rounded"
            variant="contained"
            type="submit"
            onClick={() => navigate("/newreservation")}
          >
            submit
          </Button>

          <Button
            className="px-6 py-2 rounded"
            variant="outlined"
            onClick={() => navigate(-1)}
          >
            cancel
          </Button>
        </div>
      </form>
    </Box>
  );
};

export default NewReservation;
