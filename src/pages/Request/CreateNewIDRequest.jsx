import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Autocomplete,
  TextField,
  Grid,
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import LoginService from "../Login/LoginService";
import axios from "axios";

const NewRequest = () => {
  const [itemName, setItemName] = useState("");
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [workSite, setWorkSite] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const location = useLocation();

  const isEmployee = LoginService.isEmployee();
  const isReqHandler = LoginService.isReqHandler();
  const userID = LoginService.returnUserID();
  const isOnlineEmployee = LoginService.isOnlineEmployee();

  useEffect(() => {
    const fetchWorkSite = () => {
      const workSite = LoginService.isOnlineEmployee() ? "ONLINE" : "ONSITE";
      setWorkSite(workSite);
      console.log("Work site set to:", workSite);
    };

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/inventory-item/getAll"
        );
        let fetchedOptions = response.data;

        // Filter out inactive items
        fetchedOptions = fetchedOptions.filter((item) => item.status === "ACTIVE");

        // Filter options based on workSite condition
        if (workSite === "ONLINE") {
          fetchedOptions = fetchedOptions.filter(
            (item) => item.itemGroup !== "OTHER" && item.itemGroup !== "FURNITURE"
          );
        }
        setOptions(fetchedOptions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching item details:", error);
        setLoading(false); 
      }
    };

    fetchWorkSite();
    fetchData();
  }, []);
  //set item name and id when navigating from item search
  useEffect(() => {
    if (location.state?.item) {
      const { itemId, itemName } = location.state.item;
      setItemId(itemId);
      setItemName(itemName);
      setBrand(brand);
      setModel(model);
    }
  }, [location.state]);

  useEffect(() => {
    validateForm();
  }, [itemId, quantity, reason]);
  

  const validateForm = () => {
    const newErrors = {};
    if (!itemId) newErrors.itemId = "Item selection is required";
    if (!quantity) newErrors.quantity = "Quantity is required";
    if (quantity > availableQuantity)
      newErrors.quantity = "Quantity exceeds available stock";
    if (!reason) newErrors.reason = "Reason is required";
    else if (reason.length > 50)
      newErrors.reason = "Reason must be 35 characters or less";
    if (description.split(/\s+/).length > 50)
      newErrors.description = "Description must be 150 words or less";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("quantity", quantity);
    formData.append("reason", reason);
    formData.append("description", description);
    formData.append("userId", userID);
    formData.append("itemId", itemId);

    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }

    try {
      // Changed: Added 'await' keyword to the fetch call
      const response = await fetch("http://localhost:8080/request/add", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${LoginService.getAuthToken()}`,
        },
        body: formData,
      });
      const responseText = await response.text();
      if (response.ok) {
        console.log("New inventory request added");
        navigate(getInventoryRequestListLink());
      } else {
        console.error("Error response from server:", responseText);
        try {
          const backendErrors = JSON.parse(responseText);
          setErrors(backendErrors);
        } catch (e) {
          console.error("Failed to parse error response as JSON:", e);
          setErrors({ form: `Failed to submit request. Server responded with: ${responseText}` });
        }
      }
  } catch (error) {
    console.error("Error during fetch:", error);
    setErrors({ form: `Failed to submit request. Network or server error: ${error.message}` });
  }
};

      



  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validFiles = [];
    let errorMessages = [];

    newFiles.forEach(file => {
      if (file.size > maxSize) {
        errorMessages.push(`File ${file.name} exceeds the 5MB limit.`);
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length + files.length > 5) {
      errorMessages.push("You can upload a maximum of 5 files.");
    }

    setFileErrors(errorMessages.join(" "));
    if (errorMessages.length === 0) {
      setFiles([...files, ...validFiles]);
    }
  };

  const handleFileRemove = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleItemChange = (event, value) => {
    if (value) {
      setItemName(value.itemName);
      setItemId(value.itemId);
      setAvailableQuantity(value.quantity); // Assuming the item object has a quantity field
      setBrand(value.brand);
      setModel(value.model);
    } else {
      setItemName("");
      setItemId("");
      setAvailableQuantity(0);
      setBrand("");
      setModel("");

    }
  };
  const handleBrandChange = (event, value) => {
    setBrand(value);
    setModel("");
  };

  const handleModelChange = (event, value) => {
    setModel(value);
  };
  const handleReasonChange = (e) => {
    if (e.target.value.length <= 50) {
      setReason(e.target.value);
    }
  };

  const handleDescriptionChange = (e) => {
    const words = e.target.value.split(/\s+/);
    if (words.length <= 50) {
      setDescription(e.target.value);
    }
  };

  const getInventoryRequestListLink = () => {
    if (isReqHandler) return "/requestHandler/in-request-list";
    if(isOnlineEmployee) return "/employee-de-request-list"
    return  "/employee-in-request-list";
  };

  const filteredOptions = options.filter(
    (option) =>
      (!brand || option.brand === brand) && (!model || option.model === model)
  );

  const brandOptions = [...new Set(options.map((option) => option.brand))];
  const modelOptions = [
    ...new Set(
      options.filter((option) => option.brand === brand).map((option) => option.model)
    ),
  ];

  return (
    <Box className="p-10 bg-white rounded-2xl ml-14 mr-14">
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {workSite === "ONLINE" ? (
            <Box className="w-full bg-green-900 text-white text-center py-4 m-4">
              <h1 className="pt-2 pb-3 text-3xl font-bold">
                New Delivery Request
              </h1>
            </Box>
          ) : (
            <Box className="flex flex-col items-center pb-4">
              <Box className="w-full bg-blue-900 text-white text-center py-4 m-4">
                <header className="text-3xl font-bold">
                  New Inventory Request
                </header>
              </Box>
            </Box>
          )}
          <form>
            <Grid container spacing={2} padding={4}>
              <Grid container display="flex" mt={4}style={{ height: "70px" }}>
                <Grid item sm={1.5}>
                  <Typography>Item Name</Typography>
                </Grid>
                <Grid item sm={4.5}>
                  <Autocomplete
                     options={filteredOptions}
                     getOptionLabel={(option) => option.itemName}
                     onChange={handleItemChange}
                     value={
                       itemName
                         ? options.find((option) => option.itemId === itemId) || null
                         : null
                     }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label=""
                        helperText={!errors.itemId ? "" : "Please select the item name."}
                        error={!!errors.itemId}
                      />
                    )}
                    size="small"
                  />
                </Grid>
              </Grid>
              <Grid container display="flex" mt={4}style={{ height: "80px" }}>
              <Grid item sm={1.5}>
                  <Typography>Brand</Typography>
                </Grid>
                <Grid item sm={4.5}>
                  <Autocomplete
                    options={brandOptions}
                    getOptionLabel={(option) => option}
                    onChange={handleBrandChange}
                    value={brand}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select a brand"
                        variant="outlined"
                        error={!!errors.brand}
                        helperText={errors.brand}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container display="flex" mt={4} style={{ height: "70px" }}>
              <Grid item sm={1.5}>
                  <Typography>Model</Typography>
                </Grid>
                <Grid item sm={4.5}>
                  <Autocomplete
                    options={modelOptions}
                    getOptionLabel={(option) => option}
                    onChange={handleModelChange}
                    value={model}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select a model"
                        variant="outlined"
                        error={!!errors.model}
                        helperText={errors.model}
                      />
                    )}
                  />
                </Grid>
                </Grid>
              <Grid container display="flex" mt={4}style={{ height: "80px" }}>
                <Grid item sm={1.5}>
                  <Typography>Quantity</Typography>
                </Grid>
                <Grid item sm={4.5}>
                  <TextField
                    id="quan"
                    value={quantity}
                    style={{ width: "300px" }}
                    onChange={(e) => setQuantity(e.target.value)}
                    name="quantity"
                    size="small"
                    error={!!errors.quantity}
                    helperText={
                      !errors.quantity 
                        ? `Available quantity: ${availableQuantity}`
                        : errors.quantity
                    }
                  />
                </Grid>
              </Grid>

              <Grid container display="flex" mt={4}style={{ height: "80px" }}>
                <Grid item sm={1.5}>
                  <Typography>Reason</Typography>
                </Grid>
                <Grid item sm={4.5}>
                  <TextField
                    id="reason"
                    value={reason}
                    style={{ width: "300px" }}
                    onChange={handleReasonChange}
                    name="reason"
                    size="small"
                    error={!!errors.reason}
                    helperText={errors.reason
                      ? errors.reason
                      : `${reason.length}/50 characters`
                  } 
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
                    style={{ width: "500px" }}
                    value={description}
                    onChange={handleDescriptionChange}
                    error={!!errors.description}
                    helperText={
                      errors.description
                        ? errors.description
                        : `${description.split(/\s+/).length}/50 words`
                    }
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
              <input
                type="file"
                className="mt-4 mb-2"
                onChange={handleFileChange}
                multiple
              />
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
                onClick={() => navigate(-1)}
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
