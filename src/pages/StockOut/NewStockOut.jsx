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
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LoginService from "../Login/LoginService";
import { useParams } from "react-router-dom";

const NewStockOut = () => {
  let navigate = useNavigate();
  const { reqId } = useParams();
  const [profileInfo, setProfileInfo] = useState({});
  const [stockOut, setStockOut] = useState({
    department: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    outQty: "",
    itemId: "",
    userId: "",
    file: null,
  });

  const [req, setReq] = useState({
    quantity: "",
    itemId:"",
    userId:"",
  });

  const {
    quantity,
    itemId: reqItemId,
    userId: reqUserId,
  } = req;
 
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedItemName, setSelectedItemName] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState(0);

  const { department, date, description, outQty, itemId, userId, file } =
    stockOut;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/inventory-item/getAll"
        );
        setOptions(response.data);

        if (reqId && !isNaN(reqId)) {
          const request = await axios.get(`http://localhost:8080/request/getById/${reqId}`);
          const requestData = request.data;
          setReq(requestData);
          console.log(requestData);

          setStockOut((prevStockOut) => ({
            ...prevStockOut,
            outQty: requestData.quantity,
            itemId: requestData.itemId,
            userId: requestData.userId,
          }));

          const itemResponse = await axios.get(`http://localhost:8080/inventory-item/getById/${requestData.itemId}`);
          const itemData = itemResponse.data;

          setSelectedItemName(itemData.itemName);
          setSelectedBrand(itemData.brand);
          setSelectedModel(itemData.model);

          const brandsResponse = await axios.get(
            `http://localhost:8080/inventory-item/getBrandsByItemName?itemName=${itemData.itemName}`
          );
          setBrands(brandsResponse.data);

          const modelsResponse = await axios.get(
            `http://localhost:8080/inventory-item/getModelsByItemNameAndBrand?itemName=${itemData.itemName}&brand=${itemData.brand}`
          );
          setModels(modelsResponse.data);
        }

        const token = localStorage.getItem("token");
        const profile = await LoginService.getYourProfile(token);
        setProfileInfo(profile.users);
        setStockOut((prevStockOut) => ({
          ...prevStockOut,
          userId: profile.users.userId,
        }));
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };
    fetchData();
  }, [reqId]);

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
        setStockOut((prevStockOut) => ({ ...prevStockOut, itemId: "" }));
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
        setStockOut((prevStockOut) => ({ ...prevStockOut, itemId: "" }));
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
          setAvailableQuantity(item.quantity);
          setStockOut((prevStockOut) => ({ ...prevStockOut, itemId: item.itemId }));
        } else {
          setStockOut((prevStockOut) => ({ ...prevStockOut, itemId: "" }));
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
      setStockOut((prevStockOut) => ({ ...prevStockOut, itemId: "" }));
    }
  };

  const validateField = (name, value) => {
    const validationErrors = {};
    if (name === "itemName" && !value) {
      validationErrors.itemName = "Item Name is required.";
    } else if (name === "department" && !value) {
      validationErrors.department = "Department is required.";
    } else if (name === "date" && !value) {
      validationErrors.date = "Date is required.";
    } else if (name === "outQty") {
      if (!value) {
        validationErrors.outQty = "Out Quantity is required.";
      } else if (isNaN(value) || value <= 0) {
        validationErrors.outQty = "Out Quantity must be a positive number.";
      }
    } else if (name === "brand" && !value) {
      validationErrors.brand = "Brand is required.";
    } else if (name === "model" && !value) {
      validationErrors.model = "Model is required.";
    } else if (name === "itemId" && !value) {
      validationErrors.itemId = "Item ID is required.";
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
    let updatedStockOut = { ...stockOut, [name]: value };
    setStockOut(updatedStockOut);
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
  
    // Perform final validation
    const validationErrors = {};
  
    // Validate all fields
    validateField("itemName", selectedItemName);
    validateField("department", department);
    validateField("date", date);
    validateField("outQty", outQty);
    validateField("brand", selectedBrand);
    validateField("model", selectedModel);
  
    // Check if there are any errors
    const hasErrors = Object.keys(errors).some((key) => !!errors[key]);
  
    // Check for negative quantity
    if (parseInt(outQty) <= 0) {
      validationErrors.outQty = "Out Quantity must be a positive number.";
    }
  
    // If there are any errors, prevent submission
    if (hasErrors || Object.keys(validationErrors).length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...validationErrors,
      }));
  
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to submit Stock-Out. Please check your inputs.",
      });
      return;
    }
  
    if (parseInt(outQty) > availableQuantity) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Out Quantity cannot be greater than available quantity. Available Quantity: " + availableQuantity,
      });
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("department", department);
      formData.append("date", date);
      formData.append("description", description);
      formData.append("outQty", outQty);
      formData.append("itemId", itemId);
      formData.append("userId", userId);
      formData.append("file", file);
  
      const result = await axios.post(
        "http://localhost:8080/stock-out/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      navigate("/stockOut");
      Swal.fire({
        title: "Done!",
        text: "Stock-Out Successfully Submitted.!",
        icon: "success",
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log(error.response.data);
      } else if (error.response.status === 406) {
        console.log(error.response.data);
        Swal.fire({
          title: "Error!",
          text: "Inventory item is currently inactive and can not be used",
          icon: "error",
        });
      } else {
        console.error("Error:", error);
        console.log(error.response.data);
        Swal.fire({
          title: "Error!",
          text: `Failed to submit Stock-Out. Error: ${error.response.data}`,
          icon: "error",
        });
      }
    }
  };
  

  const handleFileChange = (e) => {
    setStockOut({ ...stockOut, file: e.target.files[0] });
  };

  return (
    <form
      className="grid grid-cols-12 p-10 bg-white gap-y-10 rounded-2xl ml-14 mr-14"
      onSubmit={onSubmit}
    >
      <h1 className="col-span-4 pt-2 text-3xl font-bold ">New Stock-Out</h1>

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="itemName" className="flex-none w-32 text-black ">
          Item Name
        </InputLabel>
        <div>
          <Autocomplete
            disablePortal
            options={options}
            getOptionLabel={(option) => option.itemName}
            value={selectedItemName ? { itemName: selectedItemName } : null}
            onChange={handleItemChange}
            // value={selectedItemName ? options.find(option => option.itemName === selectedItemName) || null : null}
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
            value={stockOut.itemId}
            disabled
            sx={{ width: 300 }}
            name="itemId"
            error={!!errors.itemId}
            onBlur={handleBlur}
            label="Item ID"
            helperText={errors.itemId || "Item ID is Required."}
          />
          <Typography variant="caption" className="text-xs text-[#FC0000]">
            {errors.itemId}
          </Typography>
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
        <InputLabel htmlFor="name" className="flex-none w-32 text-black ">
          Department
        </InputLabel>
        <div>
          <FormControl style={{ width: "300px" }}>
            <Select
              value={department}
              onChange={(e) => onInputChange(e)}
              size="small"
              name="department"
              error={!!errors.department}
              helperText={errors.department}
            >
              <MenuItem value="Software Engineering">
                Software Engineering
              </MenuItem>
              <MenuItem value="Product Management">Product Management</MenuItem>
              <MenuItem value="UI/UX Department">UI/UX Department</MenuItem>
              <MenuItem value="Quality Assurance">Quality Assurance</MenuItem>
              <MenuItem value="Customer Service">Customer Service</MenuItem>
              <MenuItem value="Human Resource">Human Resource</MenuItem>
              <MenuItem value="Finance & Administration">
                Finance & Administration
              </MenuItem>
              <MenuItem value="Research & Development">
                Research & Development
              </MenuItem>
            </Select>
            <Typography variant="caption" className="text-red-600">
              {errors.department}
            </Typography>
          </FormControl>
        </div>
      </div>

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="name" className="flex-none w-32 text-black ">
          Quantity Out
        </InputLabel>
        <div>
          <TextField
            size="small"
            placeholder="Enter Quantity In"
            type="Number"
            name="outQty"
            value={outQty}
            error={!!errors.outQty}
            helperText={errors.outQty}
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
        onClick={() => navigate("/stockIn")}
      >
        cancel
      </Button>
    </form>
  );
};

export default NewStockOut;
