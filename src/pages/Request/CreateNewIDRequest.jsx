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
  const [initialLoad, setInitialLoad] = useState(true);
  const [workSite, setWorkSite] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [itemDetails, setItemDetails] = useState({});
  const [brandOptions, setBrandOptions] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);
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
  //set item details when navigating from item search
  useEffect(() => {
    if (location.state?.item) {

      const { itemName } = location.state.item;
     
      setItemName(itemName);
      fetchItemDetails(itemName);
     

    }
  }, [location.state]);


  

  const fetchItemDetails = async (itemName, brand, model) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/inventory-item/getItemByDetails",
        {
          params: { itemName, brand, model },
        }
      );
      const item = response.data;
      if (item) {
        setItemId(item.itemId);
        setAvailableQuantity(item.quantity);
      } else {
        setItemId("");
        setAvailableQuantity(0);
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
      setItemId("");
      setAvailableQuantity(0);
    }
  };

  useEffect(() => {
    validateForm();
  }, [itemId, quantity, reason,files]);

  const isPositiveNumber = (value) => {
    return !isNaN(value) && Number(value) > 0;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!itemId) newErrors.itemId = "Item selection is required";
    if (!quantity) newErrors.quantity = "Quantity is required";
    if (!isPositiveNumber(quantity)) 
    newErrors.quantity = "Quantity must be a positive number.";
    if (quantity > availableQuantity)
    newErrors.quantity = "Quantity exceeds available stock";
    if (!reason) newErrors.reason = "Reason is required";
    else if (reason.length > 50)
      newErrors.reason = "Reason must be 50 characters or less";
    if (description.split(/\s+/).length > 50)
      newErrors.description = "Description must be 50 words or less";
    if (!brand) newErrors.brand = "Brand selection is required";
    if (!model) newErrors.model = "Model selection is required";
    if (fileErrors) newErrors.files = fileErrors;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setInitialLoad(false);
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
    if(error.response.status===403){
      setErrors({ form: `Failed to submit request. Selected item is Inactive: ${error.message}` });

    }
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
      } else if (file.type !== "application/pdf") {
        errorMessages.push(`File ${file.name} is not a PDF.`);
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

  const handleItemChange = async (event, value) => {
    if (value) {
      setItemName(value.itemName);
      setItemId(value.itemId);
      setAvailableQuantity(value.quantity); // Assuming the item object has a quantity field
      setBrand("");
      setModel("");
      fetchItemDetails(value.itemId);
  
      // Fetch brand options
      try {
        const response = await axios.get(`http://localhost:8080/inventory-item/getBrandsByItemName?itemName=${value.itemName}`);
        setBrandOptions(response.data);
      } catch (error) {
        console.error("Error fetching brand options:", error);
      }
    } else {
      setItemName("");
      setItemId("");
      setAvailableQuantity(0);
      setBrand("");
      setModel("");
      setBrandOptions([]);
      setModelOptions([]);
    }
  };
  
  const handleBrandChange = async (event, value) => {
    setBrand(value);
    setModel("");
    setModelOptions([]);
    if (value) {
      // Fetch model options
      try {
        const response = await axios.get(`http://localhost:8080/inventory-item/getModelsByItemNameAndBrand?itemName=${itemName}&brand=${value}`);
        setModelOptions(response.data);
      } catch (error) {
        console.error("Error fetching model options:", error);
      }
      fetchItemDetails(itemName, value, model);
    } else {
      setModelOptions([]);
      setItemId("");
      setAvailableQuantity(0);
    }
  };
  
  const handleModelChange = (event, value) => {
    setModel(value);
    fetchItemDetails(itemName, brand, value);
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
                     value={options.find((option) => option.itemName === itemName) || null}
                     onChange={handleItemChange}
                    
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label=""
                        helperText={!errors.itemId ? "" : "Please select the item name."}
                        error={!initialLoad && !!errors.itemId}
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
                    disabled={!itemName}
                    value={brand || null}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        error={!initialLoad && !!errors.brand}
                        helperText={errors.brand}
                      />
                    )}
                     size="small"
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
                    value={model || null}
                    onChange={handleModelChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        error={!initialLoad && !!errors.model}
                        helperText={errors.model}
                      />
                    )}
                     size="small"
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
                    error={!initialLoad && !!errors.quantity}
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
                    error={!initialLoad && !!errors.reason} 
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
              id="files"
              name="files"
              type="file"
              multiple
              onChange={handleFileChange}
              accept="application/pdf"
            />
               {fileErrors && (
              <Typography color="error" variant="body2">
                {fileErrors}
              </Typography>
            )}
                <Typography variant="body2" color="textSecondary">
              Upload PDF files up to 5MB.
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
