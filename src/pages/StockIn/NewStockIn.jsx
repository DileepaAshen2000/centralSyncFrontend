import React, { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  TextField,
  Typography,
  Button,
  Autocomplete,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import LoginService from "../Login/LoginService";

const NewStockIn = () => {
  let navigate = useNavigate();
  let reactLocation = useLocation();
  const [profileInfo, setProfileInfo] = useState({});
  const [stockIn, setStockIn] = useState({
    location: "",
    date: new Date().toISOString().split("T")[0], // Set to today's date
    description: "",
    inQty: "",
    itemId: "",
    userId: "",
    file: null,
  });
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedItemName, setSelectedItemName] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  const { location, date, description, inQty, itemId, userId, file } = stockIn;
  //fetch data when navigate through search
  useEffect(() => {
    if (reactLocation.state?.item) {
      const { itemName, brand, model } = reactLocation.state.item;
    
      setSelectedItemName(itemName);
      setSelectedBrand(brand);
      setSelectedModel(model);
    }
  }, [reactLocation.state]);

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
        setStockIn((prevStockIn) => ({
          ...prevStockIn,
          userId: profile.users.userId,
        }));
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };
    fetchData();
  }, []);

  const handleItemChange = async (event, value) => {
    if (value) {
      setSelectedItemName(value.itemName);
      validateField("itemName", value.itemName);
      try {
        const response = await axios.get(
          `http://localhost:8080/inventory-item/getBrandsByItemName?itemName=${value.itemName}`
        );
        setBrands(response.data);
        setSelectedBrand("");
        setModels([]);
        setStockIn((prevStockIn) => ({ ...prevStockIn, itemId: "" })); // Reset itemId
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    } else {
      setSelectedItemName("");
      setBrands([]);
      setModels([]);
      validateField("itemName", "");
    }
  };

  const handleBrandChange = async (event, value) => {
    if (value) {
      setSelectedBrand(value);
      validateField("brand", value);
      try {
        const response = await axios.get(
          `http://localhost:8080/inventory-item/getModelsByItemNameAndBrand?itemName=${selectedItemName}&brand=${value}`
        );
        setModels(response.data);
        setSelectedModel("");
        setStockIn((prevStockIn) => ({ ...prevStockIn, itemId: "" })); // Reset itemId
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    } else {
      setSelectedBrand("");
      setModels([]);
      validateField("brand", "");
    }
  };

  const handleModelChange = async (event, value) => {
    if (value) {
      setSelectedModel(value);
      validateField("model", value);
      try {
        const response = await axios.get(
          `http://localhost:8080/inventory-item/getItemByDetails`,
          {
            params: {
              itemName: selectedItemName,
              brand: selectedBrand,
              model: value,
            },
          }
        );
        if (response.status === 200) {
          const item = response.data;
          setStockIn((prevStockIn) => ({
            ...prevStockIn,
            itemId: item.itemId,
          }));
        } else {
          setStockIn((prevStockIn) => ({ ...prevStockIn, itemId: "" }));
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Item not found.",
          });
        }
      } catch (error) {
        console.error("Error fetching item details:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to fetch item details.",
        });
      }
    } else {
      setSelectedModel("");
      validateField("model", "");
      setStockIn((prevStockIn) => ({ ...prevStockIn, itemId: "" })); // Reset itemId
    }
  };

  const validateField = (name, value) => {
    const validationErrors = {};
    if (name === "itemName" && !value) {
      validationErrors.itemName = "Item Name is required.";
    } else if (name === "location" && !value) {
      validationErrors.location = "Location is required.";
    } else if (name === "date" && !value) {
      validationErrors.date = "Date is required.";
    } else if (name === "inQty") {
      if (!value) {
        validationErrors.inQty = "In Quantity is required.";
      } else if (isNaN(value) || value <= 0) {
        validationErrors.inQty = "In Quantity must be a positive number.";
      }
    } else if (name === "brand" && !value) {
      validationErrors.brand = "Brand is required.";
    } else if (name === "model" && !value) {
      validationErrors.model = "Model is required.";
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

  const onInputChange = (e) => {
    const { name, value } = e.target;
    let updatedStockIn = { ...stockIn, [name]: value };
    setStockIn(updatedStockIn);
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

    try {
      const validationErrors = {};

      // Validate all fields
      validateField("itemName", selectedItemName);
      validateField("location", location);
      validateField("date", date);
      validateField("inQty", inQty);
      validateField("brand", selectedBrand);
      validateField("model", selectedModel);

      // Check if there are any errors
      const hasErrors = Object.keys(errors).some((key) => !!errors[key]);

      if (hasErrors) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to submit Stock-In. Please check your inputs.",
        });
        return;
      }
            const formData = new FormData();
            formData.append("location", location);
            formData.append("date", date);
            formData.append("description", description);
            formData.append("inQty", inQty);
            formData.append("itemId", itemId);
            formData.append("userId", userId);
            formData.append("file", file); // Append the file to the formData
      
            const result = await axios.post(
              "http://localhost:8080/stock-in/add",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
      
            navigate("/stockIn"); // To navigate to the stockin page
            Swal.fire({
              title: "Done!",
              text: "Stock-In Successfully Submitted.!",
              icon: "success",
            });
          } catch (error) {

            if(error.response.status === 406){
              Swal.fire({
                title: "Error!",
                text: "Inventory item is currently inactive and can not be used.",
                icon: "error"
              });
              return;
            }
            console.error("Error:", error);
            console.log(error.response.data);
            Swal.fire({
              title: "Error!",
              text: "Failed to submit Stock-In. Please check your inputs.",
              icon: "error"
            });
            
          }
  };

  const handleFileChange = (e) => {
    setStockIn({ ...stockIn, file: e.target.files[0] });
  };

  return (
    <form
      className="grid grid-cols-12 p-10 bg-white gap-y-10 rounded-2xl ml-14 mr-14"
      onSubmit={onSubmit}
    >
      <h1 className="col-span-4 pt-2 text-3xl font-bold ">New Stock-In</h1>

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
            value={selectedItemName ? options.find(option => option.itemName === selectedItemName) || null : null}
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
        <InputLabel htmlFor="brand" className="flex-none w-32 text-black ">
          Brand
        </InputLabel>
        <div>
          <Autocomplete
            disablePortal
            options={brands}
            getOptionLabel={(option) => option}
            onChange={handleBrandChange}
            value={selectedBrand}
            disabled={!selectedItemName}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Brand"
                helperText={errors.brand || "Please select the brand."}
                error={!!errors.brand}
                onBlur={handleBlur}
                name="brand"
              />
            )}
            size="small"
            type="search"
          />
        </div>
      </div>

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="model" className="flex-none w-32 text-black ">
          Model
        </InputLabel>
        <div>
          <Autocomplete
            disablePortal
            options={models}
            getOptionLabel={(option) => option}
            onChange={handleModelChange}
            value={selectedModel}
            disabled={!selectedItemName || !selectedBrand}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Model"
                helperText={errors.model || "Please select the model."}
                error={!!errors.model}
                onBlur={handleBlur}
                name="model"
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
          <TextField
            value={stockIn.itemId}
            disabled
            sx={{ width: 300 }}
            error={!!errors.itemId}
            onBlur={handleBlur}
            label="Item ID"
            helperText={errors.itemId || "Item ID is Required."}
          />
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
          <Typography variant="caption" className="text-xs text-[#FC0000]">
            {errors.date}
          </Typography>
        </div>
      </div>

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="reason" className="flex-none w-32 text-black ">
          Location
        </InputLabel>
        <div className="flex-grow">
          <Select
            value={location}
            onChange={onInputChange}
            size="small"
            name="location"
            onBlur={handleBlur}
            error={!!errors.location}
            helperText={errors.location}
            className="w-[300px] h-10 bg-white"
          >
            <MenuItem value="Store A">Store A</MenuItem>
            <MenuItem value="Store B">Store B</MenuItem>
            <MenuItem value="Store C">Store C</MenuItem>
          </Select>
          <Typography variant="caption" className="text-xs text-[#FC0000]">
            {errors.location}
          </Typography>
        </div>
      </div>

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="name" className="flex-none w-32 text-black ">
          Quantity In
        </InputLabel>
        <div>
          <TextField
            size="small"
            placeholder="Enter Quantity In"
            type="Number"
            name="inQty"
            value={inQty}
            error={!!errors.inQty}
            helperText={errors.inQty}
            onChange={onInputChange}
          />
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
            onChange={onInputChange}
          />
        </div>
      </div>

      <div className="flex-row col-span-10 col-start-1 ">
        <Typography display="block" gutterBottom>
          Attach File(s) to inventory Stock-In{" "}
        </Typography>
        <input
          type="file"
          className="mt-4 mb-2"
          onChange={handleFileChange}
        ></input>
        <Typography variant="caption" display="block" gutterBottom>
          You can upload a maximum of 10MB file.
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
        onClick={() => navigate(-1)}
      >
        cancel
      </Button>
    </form>
  );
};

export default NewStockIn;
