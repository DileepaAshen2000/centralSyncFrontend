import React, { useState } from "react";
import {
  Select,
  MenuItem,
  TextField,
  Typography,
  Button,
  Autocomplete,
  InputLabel,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import LoginService from "../Login/LoginService";

const NewAdjustment = () => {
  let navigate = useNavigate();
  const [profileInfo, setProfileInfo] = useState({});
  const [adj, setAdj] = useState({
    reason: "",
    date: new Date().toISOString().split("T")[0], // Set to today's date
    description: "",
    newQuantity: "",
    adjustedQuantity: "",
    itemId: "",
    userId: "",
    file: null,
  });
  const [item, setItem] = useState({
    // create state for item, initial state is empty with object.
    itemName: "",
    quantity: "",
  });
  const [errors, setErrors] = useState({}); // State to manage errors for input fields
  const [options, setOptions] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState("Select an Item");

  const {
    reason,
    date,
    description,
    newQuantity,
    adjustedQuantity,
    itemId,
    userId,
    file,
  } = adj;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/inventory-item/getAll"
        );
        setOptions(response.data);

        const token = localStorage.getItem("token");
        const profile = await LoginService.getYourProfile(token);
        setProfileInfo(profile.users);
        setAdj((prevAdj) => ({ ...prevAdj, userId: profile.users.userId }));
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };
    fetchData();
  }, []);

  const clearItemNameError = () => {
    setErrors((prevErrors) => {
      const { itemName, ...rest } = prevErrors;
      return rest;
    });
  };

  const handleItemChange = (event, value) => {
    if (value) {
      setSelectedItemId(value.itemId);
      setAdj({ ...adj, itemId: value.itemId }); // Update the itemId in the adj state
      fetchItemDetails(value.itemId);
    } else {
      setSelectedItemId(null);
      setAdj({ ...adj, itemId: "" });
    }
  };

  // Fetch the item details
  const fetchItemDetails = async (itemId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/inventory-item/getById/${itemId}`
      );
      setItem({ ...item, quantity: response.data.quantity });
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

  const validateField = (name, value) => {
    const validationErrors = {};
    if (name === "itemName" && !value) {
      validationErrors.itemName = "Item Name is required";
    } else if (name === "reason" && !value) {
      validationErrors.reason = "Reason is required";
    } else if (name === "date" && !value) {
      validationErrors.date = "Date is required";
    } else if (name === "newQuantity") {
      if (!value) {
        validationErrors.newQuantity = "New Quantity is required";
      } else if (isNaN(value) || value <= 0) {
        validationErrors.newQuantity = "New Quantity must be a positive number";
      }
    } else if (name === "itemId" && !value) {
      validationErrors.itemId = "Item ID is required";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validationErrors[name],
    }));

    // Remove the error if there is no validation error for the field
    if (!validationErrors[name]) {
      setErrors((prevErrors) => {
        const { [name]: removedError, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const validateAllFields = () => {
    validateField("itemName", adj.itemName);
    validateField("reason", adj.reason);
    validateField("date", adj.date);
    validateField("newQuantity", adj.newQuantity);

    return Object.keys(errors).length === 0;
  };

  const onInputChange = async (e) => {
    const { name, value } = e.target;
    let updatedAdj = { ...adj, [name]: value };
    if (name === "newQuantity") {
      updatedAdj.adjustedQuantity = value - item.quantity;
    }
    setAdj(updatedAdj);
    if (errors[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      "adjustment",
      new Blob(
        [
          JSON.stringify({
            reason,
            date,
            description,
            newQuantity,
            adjustedQuantity,
            itemId,
            userId,
          }),
        ],
        { type: "application/json" }
      )
    );
    if (file) {
      formData.append("file", file);
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/adjustment/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        console.log(response.data);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Adjustment successfully submitted!",
        });
        navigate("/adjustment");
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to submit adjustment. Please check your inputs.",
        });
        if (!validateAllFields()) {
          return;
        }
        //setErrors(error.response.data);
      }
    }
  };

  const handleFileChange = (e) => {
    setAdj({ ...adj, file: e.target.files[0] });
  };

  return (
    <form
      className="grid grid-cols-12 p-10 bg-white gap-y-10 rounded-2xl ml-14 mr-14"
      onSubmit={(e) => onSubmit(e)}
    >
      <h1 className="col-span-4 pt-2 text-3xl font-bold ">New Adjustment</h1>

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="itemName" className="flex-none w-32 text-black ">
          Item Name
        </InputLabel>

        <div>
          <Autocomplete
            disablePortal
            options={options}
            getOptionLabel={(option) => option.itemName}
            onChange={handleItemChange}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Item Name"
                helperText={errors.itemName || "Please select the item name."}
                error={!!errors.itemName}
                onBlur={handleBlur}
                name="itemName"
              />
            )}
            size="small"
            type="search"
          />
        </div>
      </div>

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="itemId" className="flex-none w-32 text-black ">
          Item ID
        </InputLabel>
        <div>
          <Autocomplete
            disabled
            options={[{ itemId: selectedItemId }]} // Provide the selected itemId as an option
            getOptionLabel={(option) => option.itemId} // Display itemId in the Autocomplete
            name="itemId"
            value={{ itemId: selectedItemId }} // Set the value to the selected itemId
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Item ID"
                error={!!errors.itemId}
                helperText={errors.itemId}
                onBlur={handleBlur}
              />
            )}
            size="small"
          />
          <Typography variant='caption' className='text-xs text-[#FC0000]'>{errors.itemId}</Typography>
        </div>
      </div>

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="date" className="flex-none w-32 text-black ">
          Date
        </InputLabel>

        <div>
          <TextField
            style={{ width: "300px" }}
            label="Date"
            name="date"
            value={date}
            onBlur={handleBlur}
            size="small"
            error={!!errors.date}
            helperText={errors.date}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Typography variant='caption' className='text-xs text-[#FC0000]'>{errors.date}</Typography>
        </div>
      </div>

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="reason" className="flex-none w-32 text-black ">
          Reason
        </InputLabel>

        <div className="flex-grow">
          <Select
            value={reason}
            onChange={(e) => onInputChange(e)}
            size="small"
            name="reason"
            onBlur={handleBlur}
            error={!!errors.reason}
            helperText={errors.reason}
            className="w-[300px] h-10  bg-white"
          >
            <MenuItem value="Damaged Item">Damaged Item</MenuItem>
            <MenuItem value="Stolen Item">Stolen Item</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </Select>
          <Typography variant='caption' className='text-red-600'>{errors.reason}</Typography>
        </div>
      </div>

      <div className="flex col-span-4 col-start-1 ">
        <InputLabel
          htmlFor="description"
          className="flex-none w-32 mt-0 text-black"
        >
          Description
        </InputLabel>

        <div>
          <TextField
            label="Description"
            name="description"
            multiline
            rows={6}
            placeholder="Enter Description Here..."
            style={{ width: "500px" }}
            value={description}
            onChange={(e) => onInputChange(e)}
          />
        </div>
      </div>

      <div className="flex col-span-4 col-start-1 ">
        <InputLabel
          htmlFor="itemDetails"
          className="flex-none w-32 mt-0 text-black"
        >
          Item Details
        </InputLabel>
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650, border: 2 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Item Details</TableCell>
                  <TableCell align="right">Quantity Available</TableCell>
                  <TableCell align="right">New Quantity</TableCell>
                  <TableCell align="right">Adjusted Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {/* item name */}
                  <TableCell component="th" scope="row">
                    {options.find((option) => option.itemId === selectedItemId)
                      ?.itemName || "Loading..."}
                  </TableCell>
                  {/* available Qty */}
                  <TableCell align="right">{item.quantity}</TableCell>
                  {/* new Qty */}

                  <TableCell align="right">
                    <TextField
                      size="small"
                      placeholder="Enter New Qty"
                      type="Number"
                      name="newQuantity"
                      value={newQuantity}
                      onChange={(e) => onInputChange(e)}
                      error={!!errors.newQuantity}
                      helperText={errors.newQuantity}
                      onBlur={handleBlur}
                    ></TextField>
                  </TableCell>
                  {/* adjusted Qty */}
                  <TableCell align="right">
                    {adj.newQuantity - item.quantity}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant='caption' className='text-xs text-[#FC0000]'>{errors.adjustedQuantity}</Typography>
        </div>
      </div>

      <div className="flex-row col-span-10 col-start-1 ">
        <Typography display="block" gutterBottom>
          Attach File(s) to inventory adjustment{" "}
        </Typography>
        <input
          type="file"
          className="mt-4 mb-2"
          onChange={handleFileChange}
        ></input>
        <Typography variant="caption" display="block" gutterBottom>
          You can upload a maximum of 1 file, 5MB each
        </Typography>
      </div>

      <Button
        className="col-start-10 text-white bg-blue-600 rounded"
        variant="contained"
        type="submit"
      >
        submit
      </Button>
      <Button
        className="col-start-12 rounded"
        variant="outlined"
        onClick={() => navigate("/adjustment")}
      >
        cancel
      </Button>
    </form>
  );
};

export default NewAdjustment;
