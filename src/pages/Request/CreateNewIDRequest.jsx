import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Autocomplete, TextField, Grid, Box, Typography, Button, CircularProgress } from '@mui/material';
import LoginService from '../Login/LoginService';
import axios from 'axios';

const NewRequest = () => {
  const [itemName, setItemName] = useState("");
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [workSite, setWorkSite] = useState("");

  const isEmployee = LoginService.isEmployee();
  const isReqHandler = LoginService.isReqHandler();
  const userID = LoginService.returnUserID();

  useEffect(() => {
    const fetchWorkSite = () => {
      const workSite = LoginService.isOnlineEmployee() ? "ONLINE" : "ONSITE";
      setWorkSite(workSite);
      console.log("Work site set to:", workSite); // Debug log
    };

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/inventory-item/getAll');
        setOptions(response.data);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching item details:', error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchWorkSite();
    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!itemId) newErrors.itemId = "Item selection is required";
    if (!quantity) newErrors.quantity = "Quantity is required";
    if (quantity > availableQuantity) newErrors.quantity = "Quantity exceeds available stock";
    if (!reason) newErrors.reason = "Reason is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("quantity", quantity);
    formData.append("reason", reason);
    formData.append("description", description);
    formData.append("userId", userID);
    formData.append("itemId", itemId);
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
          navigate("/employee-in-request-list");
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
    setFiles(Array.from(e.target.files));
  };

  const handleFileRemove = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleItemChange = (event, value) => {
    if (value) {
      setItemName(value.itemName);
      setItemId(value.itemId);
      setAvailableQuantity(value.quantity); // Assuming the item object has a quantity field
    } else {
      setItemName("");
      setItemId("");
      setAvailableQuantity(0);
    }
  };

  return (
    <Box className="p-10 bg-white rounded-2xl ml-14 mr-14">
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {workSite === "ONLINE" ? (
            <Box className="w-full bg-green-900 text-white text-center py-4 m-4">
              <h1 className="pt-2 pb-3 text-3xl font-bold">New Delivery Request</h1>
            </Box>
          ) : (
            <Box className="flex flex-col items-center pb-4">
              <Box className="w-full bg-blue-900 text-white text-center py-4 m-4">
                <header className="text-3xl font-bold">New Inventory Request</header>
              </Box>
            </Box>
          )}
          <form>
            <Grid container spacing={2} padding={4}>
              <Grid container display="flex" mt={4}>
                <Grid item sm={1.5}>
                  <Typography>Item Name</Typography>
                </Grid>
                <Grid item sm={4.5}>
                  <Autocomplete
                    disablePortal
                    options={options}
                    getOptionLabel={(option) => option.itemName}
                    onChange={handleItemChange}
                    renderInput={(params) => (
                      <TextField {...params} label="Item Name" helperText="Please select the item name." error={!!errors.itemId} />
                    )}
                    size="small"
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
                    helperText={errors.quantity || `Available quantity: ${availableQuantity}`}
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

            <Box mt={4}>
              {workSite === "ONLINE" ? (
                <Typography display="block" gutterBottom>
                  Attach File(s) to Delivery request
                </Typography>
              ) : (
                <Typography display="block" gutterBottom>
                  Attach File(s) to Inventory request
                </Typography>
              )}
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
        </>
      )}
    </Box>
  );
};

export default NewRequest;
