import React, { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  TextField,
  Typography,
  Button,
  Autocomplete,
  InputLabel,
  FormControl,
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
import LoginService from "../Login/LoginService";

const NewAdjustment = () => {
  let navigate = useNavigate();
  const [profileInfo, setProfileInfo] = useState({});
  const [adj, setAdj] = useState({
    reason: "",
    date: new Date().toISOString().split("T")[0], 
    description: "",
    newQuantity: "",
    adjustedQuantity: "",
    itemId: "",
    userId: "",
    file: null,
  });
  const [item, setItem] = useState({
    itemName: "",
    quantity: "",
  });
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedItemName, setSelectedItemName] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

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

  const handleItemChange = async (event, value) => {
    if (value) {
      setSelectedItemName(value.itemName);
      setItem({ itemName: value.itemName});
      validateField("itemName", value.itemName);
      try {
        const response = await axios.get(
          `http://localhost:8080/inventory-item/getBrandsByItemName?itemName=${value.itemName}`
        );
        setBrands(response.data);
        setSelectedBrand("");
        setModels([]);
        setAdj((prevAdj) => ({ ...prevAdj, itemId: "" })); // Reset itemId
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
        setAdj((prevAdj) => ({ ...prevAdj, itemId: "" })); // Reset itemId
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
          setAdj((prevAdj) => ({ ...prevAdj, itemId: item.itemId }));
          setItem({ quantity: item.quantity });
          validateField("itemId", item.itemId);
        } else {
          setAdj((prevAdj) => ({ ...prevAdj, itemId: "" }));
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
      setAdj((prevAdj) => ({ ...prevAdj, itemId: "" })); // Reset itemId
    }
  };

  const validateField = (name, value) => {
    const validationErrors = {};
    if (name === "itemName" && !value) {
      validationErrors.itemName = "Item Name is required.";
    } else if (name === "reason" && !value) {
      validationErrors.reason = "Reason is required.";
    } else if (name === "date" && !value) {
      validationErrors.date = "Date is required.";
    } else if (name === "newQuantity") {
      if (!value) {
        validationErrors.newQuantity = "New Quantity is required.";
      } else if (isNaN(value) || value <= 0) {
        validationErrors.newQuantity = "New Quantity must be a positive number.";
      }
      const adjustedQty = value - item.quantity;
      if (adjustedQty < -10 || adjustedQty > 10) {
        validationErrors.adjustedQuantity = "Adjusted quantity must be between -10 and 10.";
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
    let updatedAdj = { ...adj, [name]: value };
    if (name === "newQuantity") {
      updatedAdj.adjustedQuantity = value - item.quantity;
      if (updatedAdj.adjustedQuantity < -10 || updatedAdj.adjustedQuantity > 10) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          adjustedQuantity: "Adjusted quantity must be between -10 and 10.",
        }));
      } else {
        setErrors((prevErrors) => {
          const { adjustedQuantity, ...rest } = prevErrors;
          return rest;
        });
      }
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
  
    // Validate all fields
    validateField("itemName", selectedItemName);
    validateField("reason", reason);
    validateField("date", date);
    validateField("newQuantity", newQuantity);
    validateField("brand", selectedBrand);
    validateField("model", selectedModel);
  
    const adjustedQty = newQuantity - item.quantity;
    if (adjustedQty < -10 || adjustedQty > 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        adjustedQuantity: "Adjusted quantity must be between -10 and 10.",
      }));
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Adjusted quantity must be between -10 and 10.",
      });
      return;
    }
  
    // Check if there are any errors
    const hasErrors = Object.keys(errors).some((key) => !!errors[key]);
  
    if (hasErrors) {
      console.log("Validation errors found:", errors);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to submit Adjustment. Please check your inputs.",
      });
      return;
    }
  
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
            userId,
            itemId,
          }),
        ],
        { type: "application/json" }
      )
    );
    if (file) {
      formData.append("file", file);
    }
    console.log(formData);
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
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Adjustment successfully submitted!",
        });
        navigate("/adjustment");
      }
    } catch (error) {
      if (error.response.status === 406) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: `${error.response.data}`,
        });
        return;
      }
      if (error.response) {
        console.log(error.response.data);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to submit Adjustment. Please check your inputs.",
        });
        const backendErrors = error.response.data;
        setErrors(backendErrors);
      }
    }
  };
  

  const handleFileChange = (e) => {
    setAdj({ ...adj, file: e.target.files[0] });
  };

  return (
    <form
      className="grid grid-cols-12 p-10 bg-white gap-y-10 rounded-2xl ml-14 mr-14"
      onSubmit={onSubmit}
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
            value={adj.itemId}
            disabled
            sx={{ width: 300 }}
            error={!!errors.itemId}
            onBlur={handleBlur}
            label="Item ID"
            helperText={errors.itemId}
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
          Reason
        </InputLabel>
        <div className="flex-grow">
          <Select
            value={reason}
            onChange={onInputChange}
            size="small"
            name="reason"
            onBlur={handleBlur}
            error={!!errors.reason}
            helperText={errors.reason}
            className="w-[300px] h-10 bg-white"
          >
            <MenuItem value="Damaged Item">Damaged Item</MenuItem>
            <MenuItem value="Return to Insurance">Return to Insurance</MenuItem>
            <MenuItem value="Omissions in Issuance">Omissions in Issuance</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </Select>
          <Typography variant="caption" className="text-xs text-[#FC0000]">
            {errors.reason}
          </Typography>
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
                  <TableCell component="th" scope="row">
                    {selectedItemName || "--"}
                  </TableCell>
                  <TableCell align="right">{item.quantity || "--"}</TableCell>
                  <TableCell align="right">
                    <TextField
                      size="small"
                      placeholder="Enter New Qty"
                      type="Number"
                      name="newQuantity"
                      value={newQuantity}
                      onChange={onInputChange}
                      error={!!errors.newQuantity}
                      helperText={errors.newQuantity}
                      onBlur={handleBlur}
                    ></TextField>
                  </TableCell>
                  <TableCell align="right">{adjustedQuantity || "--"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="caption" className="text-xs text-[#FC0000]">
            {errors.adjustedQuantity}
          </Typography>
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
        onClick={() => navigate("/adjustment")}
      >
        cancel
      </Button>
    </form>
  );
};

export default NewAdjustment;
