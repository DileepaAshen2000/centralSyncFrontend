import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControl, Select, MenuItem, TextField, Grid, Box, Typography, Button } from '@mui/material';
import LoginService from '../Login/LoginService';

const NewRequest = () => {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const isEmployee = LoginService.isEmployee();
  const isReqHandler = LoginService.isReqHandler();
  const userID = LoginService.returnUserID();

  console.log("userID", userID);
  console.log("isEmployee", isEmployee);

  const validateForm = () => {
    const newErrors = {};
    if (!itemName) newErrors.itemName = "Item name is required";
    if (!quantity) newErrors.quantity = "Quantity is required";
    if (!reason) newErrors.reason = "Reason is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("itemName", itemName);
    formData.append("quantity", quantity);
    formData.append("reason", reason);
    formData.append("description", description);
    formData.append("userId", userID);
    if (isReqHandler) {
      formData.append("role", "REQ_HANDLER");
    } else if (isEmployee) {
      formData.append("role", "EMPLOYEE");
    }

    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }

    fetch("http://localhost:8080/request/add", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          console.log("New inventory request added");
          navigate("/inventory-request");
        } else {
          response.json().then((backendErrors) => {
            setErrors(backendErrors);
          });
        }
      })
      .catch((error) => {
        console.error("Error during fetch:", error);
      });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  return (
    <Box className="p-10 bg-white rounded-2xl ml-14 mr-14">
      <Box className="pb-4">
        <h1 className="pt-2 pb-3 text-3xl font-bold">New Request</h1>
      </Box>
      <form>
        <Grid container spacing={2} padding={4}>
          <Grid container display="flex" mt={4}>
            <Grid item sm={1.5}>
              <Typography>Item Name</Typography>
            </Grid>
            <Grid item sm={4.5}>
              <TextField
                id="iName"
                value={itemName}
                style={{ width: '300px' }}
                name="itemName"
                size="small"
                onChange={(e) => setItemName(e.target.value)}
                error={!!errors.itemName}
                helperText={errors.itemName}
              />
            </Grid>
          </Grid>

          <Grid container display="flex" mt={4}>
            <Grid item sm={1.5}>
              <Typography>Quantity</Typography>
            </Grid>
            <Grid item sm={4.5}>
              <TextField
                id="quan"
                value={quantity}
                style={{ width: '300px' }}
                onChange={(e) => setQuantity(e.target.value)}
                name="quantity"
                size="small"
                error={!!errors.quantity}
                helperText={errors.quantity}
              />
            </Grid>
          </Grid>

          <Grid container display="flex" mt={4}>
            <Grid item sm={1.5}>
              <Typography>Reason</Typography>
            </Grid>
            <Grid item sm={4.5}>
              <TextField
                id="reason"
                value={reason}
                style={{ width: '300px' }}
                onChange={(e) => setReason(e.target.value)}
                name="reason"
                size="small"
                error={!!errors.reason}
                helperText={errors.reason}
              />
            </Grid>
          </Grid>

          <Grid container display="flex" mt={4}>
            <Grid item sm={1.5}>
              <Typography>Description</Typography>
            </Grid>
            <Grid item sm={9} xs={9}>
              <TextField
                label="Description"
                name="description"
                multiline
                rows={6}
                placeholder="Enter Description Here..."
                style={{ width: '500px' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>
          </Grid>
        </Grid>

        <Box>
          <Typography display="block" gutterBottom>
            Attach File(s) to inventory request
          </Typography>
          <input type="file" className="mt-4 mb-2" onChange={handleFileChange} multiple />
          <Typography variant="caption" display="block" gutterBottom>
            You can upload a maximum of 5 files, 5MB each
          </Typography>
        </Box>

        <div className="flex gap-6 mt-6 ml-[70%]">
          <Button
            className="px-6 py-2 text-white bg-blue-600 rounded"
            variant="contained"
            type="submit"
            onClick={handleClick}
          >
            Submit
          </Button>

          <Button
            className="px-6 py-2 rounded"
            variant="outlined"
            onClick={() => navigate("/employee-in-request-list")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Box>
  );
};

export default NewRequest;
