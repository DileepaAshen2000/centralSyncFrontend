import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Button, Backdrop, CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";

const AddItemForm = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchData, setFetchData] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  //State for item object with properties -->initial state of properties=null
  const [inventoryItem, setInventoryItem] = useState({
    itemName: "",
    itemGroup: "",
    brand: "",
    model: "",
    unit: "",
    dimension: "",
    dimensionUnit: "",
    weight: "",
    weightUnit: "",
    description: "",
    quantity: "",
    image: null,
  });

  //Destructure the state
  const {
    itemName,
    itemGroup,
    brand,
    model,
    unit,
    dimension,
    dimensionUnit,
    weight,
    weightUnit,
    description,
    quantity,
    image,
  } = inventoryItem;

  const validateField = (name, value) => {
    const validationErrors = {};

    if (name === "itemName") {
      if (!value) {
        validationErrors.itemName = "Item name is required";
      } else if (!/^[a-zA-Z][a-zA-Z\s]*$/.test(value)) {
        validationErrors.itemName = "Item name must contain only letters";
      }
    } else if (name === "itemGroup" && !value) {
      validationErrors.itemGroup = "Item Group is required";
    } else if (name === "brand" && !value) {
      validationErrors.brand = "Brand Name is required";
    } else if (name === "model" && !value) {
      validationErrors.model = "Model Number is required";
    } else if (name === "unit" && !value) {
      if (!value) {
        validationErrors.unit = "Unit is required";
      } else if (!/^[a-zA-Z][a-zA-Z\s]*$/.test(value)) {
        validationErrors.dimension = "Unit must contain only letters";
      }
    } else if (name === "dimension") {
      if (!value) {
        validationErrors.dimension = "Dimension is required";
      } else if (!/^(\d+\*\d+(\*\d+)?|\d+\*\d+)$/.test(value)) {
        validationErrors.dimension =
          "Enter dimension in the format a*b*c or a*b";
      }
    } else if (name === "dimensionUnit" && !value) {
      validationErrors.dimensionUnit = "Dimension is required with the MEASURING UNIT";
    } else if (name === "weight") {
      if (!value) {
        validationErrors.weight = "Weight is required";
      } else if (!/^(?!0$)(?!0\.\d*$)\d+(\.\d+)?$/.test(value)) {
        validationErrors.weight = "Weight must be a positive number";
      }
    } else if (name === "weightUnit" && !value) {
      validationErrors.weightUnit = "Weight is required with the MEASURING UNIT";
    } else if (name === "description" && !value) {
      validationErrors.description = "Description is required";
    } else if (name === "quantity") {
      if (!value) {
        validationErrors.quantity = "Quantity is required";
      } else if (!/^[1-9]\d*$/.test(value)) {
        validationErrors.quantity = "Quantity must be a positive number";
      }
    }
    setErrors({
      ...errors,
      [name]: validationErrors[name],
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
    if (name === "weight" || name === "dimension") {
      validateField(name + "Unit", inventoryItem[name + "Unit"]);
    }
  };

  const onInputChange = (e) => {
    validateField(e.target.name, e.target.value);
    setInventoryItem({ ...inventoryItem, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // Reset error messages
    setErrors({
      ...errors,
      image: "",
    });

    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setErrors({
          ...errors,
          image: "File must be a JPG, JPEG, or PNG image",
        });
        setImagePreview(null);
        return;
      }
      setInventoryItem({ ...inventoryItem, image: file });

      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const weightWithUnit = `${weight} ${weightUnit}`;
    const dimensionWithUnit = `${dimension} ${dimensionUnit}`;
    const formData = new FormData();
    formData.append(
      "item",
      new Blob(
        [
          JSON.stringify({
            itemName,
            itemGroup,
            brand,
            model,
            unit,
            dimension: dimensionWithUnit,
            weight: weightWithUnit,
            description,
            quantity,
          }),
        ],
        { type: "application/json" }
      )
    );
    if (image) {
      formData.append("image", image);
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/inventory-item/add",
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
          text: "Item successfully added!",
        });
        setFetchData(!fetchData);
        navigate("/item");
      }
    } catch (error) {
      console.error("Error response:", error.response);
      if (error.response.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to add new item. Please check your inputs.",
        });
        setErrors(error.response.data);
      } else if (error.response.status === 409) {
        Swal.fire({
          icon: "error",
          title: "Conflict!",
          text: `Similar item is already present in the inventory with an id : ${error.response.data.itemId}`,
        });
      }
    } finally {
      setLoading(false);
    }
  };
  // Disable Save button if there are any errors
  const isSaveDisabled = Object.keys(errors).some((key) => errors[key]);
  return (
    <>
      <form
        onSubmit={(e) => handleSave(e)}
        className="grid grid-cols-8 p-10 bg-white gap-y-10 rounded-2xl ml-14 mr-14"
      >
        <h1 className="col-span-4 pt-2 text-3xl font-bold ">New item</h1>

        <div className="flex items-center col-span-4 col-start-1">
          <InputLabel htmlFor="name" className="flex-none w-32 text-black ">
            Item Name
          </InputLabel>
          <div>
            {errors.itemName && (
              <div className="text-[#d32f2f] text-xs ml-4 my-1">
                {errors.itemName}
              </div>
            )}
            <TextField
              name="itemName"
              value={itemName}
              onChange={onInputChange}
              variant="outlined"
              error={errors.itemName}
              onBlur={handleBlur}
              InputProps={{
                className: "w-[300px] ml-3  ",
              }}
              size="small"
            />
          </div>
        </div>

        <div className="flex items-center col-span-4 col-start-1">
          <InputLabel
            htmlFor="itemGroup"
            className="flex-none w-32 text-black "
          >
            Item Group
          </InputLabel>
          <div className="flex-grow">
            {errors.itemGroup && (
              <div className="text-[#d32f2f] text-xs ml-4 my-1">
                {errors.itemGroup}
              </div>
            )}
            <Select
              name="itemGroup"
              value={itemGroup}
              onChange={onInputChange}
              error={errors.itemGroup}
              onBlur={handleBlur}
              className="w-[300px]  ml-3   "
              size="small"
            >
              {" "}
              <MenuItem value="COMPUTERS_AND_LAPTOPS">
                Computers & Laptops
              </MenuItem>
              <MenuItem value="COMPUTER_ACCESSORIES">
                Computer Accessories
              </MenuItem>
              <MenuItem value="COMPUTER_HARDWARE">Computer Hardware</MenuItem>
              <MenuItem value="PRINTERS_AND_SCANNERS">
                Printers & Scanners
              </MenuItem>
              <MenuItem value="FURNITURE">Furniture</MenuItem>
              <MenuItem value="OFFICE_SUPPLIES">Office Supplies</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </Select>
          </div>
        </div>
        <div className="flex items-center col-span-4 col-start-1">
          <InputLabel htmlFor="brand" className="flex-none w-32 text-black ">
            Brand
          </InputLabel>
          <div>
            {errors.brand && (
              <div className="text-[#d32f2f] text-xs ml-4 my-1">
                {errors.brand}
              </div>
            )}
            <TextField
              name="brand"
              value={brand}
              onChange={onInputChange}
              variant="outlined"
              error={errors.brand}
              onBlur={handleBlur}
              InputProps={{
                className: "w-[300px] ml-3   ",
              }}
              size="small"
            />
          </div>
        </div>
        <div className="flex items-center col-span-4 col-start-1">
          <InputLabel htmlFor="brand" className="flex-none w-32 text-black ">
            Model
          </InputLabel>
          <div>
            {errors.model && (
              <div className="text-[#d32f2f] text-xs ml-4 my-1">
                {errors.model}
              </div>
            )}
            <TextField
              name="model"
              value={model}
              onChange={onInputChange}
              variant="outlined"
              error={errors.model}
              onBlur={handleBlur}
              InputProps={{
                className: "w-[300px] ml-3   ",
              }}
              size="small"
            />
          </div>
        </div>

        <div className="col-start-1 col-span-4 flex ">
          <InputLabel htmlFor="unit" className="flex-none text-black w-32 ">
            Unit
          </InputLabel>
          <div>
            {errors.unit && (
              <div className="text-[#d32f2f] text-xs ml-4 my-1">
                {errors.unit}
              </div>
            )}
            <TextField
              name="unit"
              value={unit}
              onChange={onInputChange}
              variant="outlined"
              error={errors.unit}
              onBlur={handleBlur}
              InputProps={{
                className: "w-[300px] ml-3   ",
              }}
              size="small"
              helperText="Enter the quantity measurement unit(e.g., pcs, kg, boxes,)."
            />
          </div>
        </div>

        <div className="flex items-center col-span-6 col-start-1">
          <InputLabel htmlFor="dimension" className="flex-none w-32 text-black">
            Dimension
          </InputLabel>
          <div className="col-span-2">
            {(errors.dimension || errors.dimensionUnit) && (
              <div className="flex-row text-[#d32f2f] text-xs ml-4 my-1">
                {errors.dimension || errors.dimensionUnit}
              </div>
            )}
            <TextField
              name="dimension"
              value={dimension}
              onChange={onInputChange}
              variant="outlined"
              error={errors.dimension || errors.dimensionUnit}
              onBlur={handleBlur}
              InputProps={{
                className: "w-[220px] ml-3  ",
              }}
              placeholder="W*H*D"
              size="small"
            />
            <Select
              name="dimensionUnit"
              value={dimensionUnit}
              onChange={onInputChange}
              error={errors.dimensionUnit}
              onBlur={handleBlur}
              className="col-start-3  col-span-2 w-[80] ml-1 "
              size="small"
            >
              <MenuItem value="mm">mm</MenuItem>
              <MenuItem value="cm">cm</MenuItem>
              <MenuItem value="m">m</MenuItem>
              <MenuItem value="in">in</MenuItem>
              <MenuItem value="ft">ft</MenuItem>
            </Select>
          </div>
        </div>
        <div className="col-start-1 col-span-6 flex items-center">
          <InputLabel htmlFor="weight" className="flex-none text-black  w-32">
            Weight
          </InputLabel>
          <div className="col-span-2">
            {(errors.weight || errors.weightUnit) && (
              <div className="flex-row text-[#d32f2f] text-xs ml-4 my-1">
                {errors.weight || errors.weightUnit}
              </div>
            )}
            <TextField
              name="weight"
              value={weight}
              onChange={onInputChange}
              variant="outlined"
              error={errors.weight || errors.weightUnit}
              onBlur={handleBlur}
              InputProps={{
                className: "w-[220px] ml-3   ",
              }}
              size="small"
            />
            <Select
              name="weightUnit"
              value={weightUnit}
              onChange={onInputChange}
              error={errors.weightUnit}
              onBlur={handleBlur}
              className="col-start-3 col-span-2 w-[80] ml-1 "
              size="small"
            >
              <MenuItem value="kg">Kg</MenuItem>
              <MenuItem value="g">g</MenuItem>
              <MenuItem value="lb">lb</MenuItem>
              <MenuItem value="oz">oz</MenuItem>
            </Select>
          </div>
        </div>

        <div className="col-start-1 col-span-4 flex ">
          <InputLabel
            htmlFor="description"
            className="flex-none w-32 mt-0 text-black"
          >
            Description
          </InputLabel>
          <div>
            {errors.description && (
              <div className="text-[#d32f2f] text-xs ml-4 my-1">
                {errors.description}
              </div>
            )}
            <TextField
              name="description"
              value={description}
              placeholder="Here you can enter specifications and other details about the item"
              onChange={onInputChange}
              error={errors.description}
              onBlur={handleBlur}
              variant="outlined"
              multiline
              rows={6}
              InputProps={{
                className: "w-[500px] ml-3 bg-white  ",
              }}
            />
          </div>
        </div>
        <div className="flex items-center col-span-4 col-start-1">
          <InputLabel htmlFor="quantity" className="flex-none w-32 text-black ">
            Initial Quantity
          </InputLabel>
          <div>
            {errors.quantity && (
              <div className="text-[#d32f2f] text-xs ml-4 my-1">
                {errors.quantity}
              </div>
            )}
            <TextField
              name="quantity"
              value={quantity}
              onChange={onInputChange}
              variant="outlined"
              error={errors.quantity}
              onBlur={handleBlur}
              InputProps={{
                className: "w-[300px]  ml-3  ",
              }}
              size="small"
            />
          </div>
        </div>
        <div className="col-start-1  col-span-5 flex-row ">
          {errors.image && (
            <div className="text-[#d32f2f] text-xs  my-1">{errors.image}</div>
          )}
          <Typography display="block" gutterBottom>
            Upload an image
          </Typography>
          <div>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-4 mb-2"
            />
            <div>
              <img
                src={imagePreview}
                alt={inventoryItem.itemName}
                className="-[300px] ml-3w"
              />
            </div>
          </div>
        </div>

        <Button
          variant="contained"
          type="submit"
          disabled={isSaveDisabled || loading}
          className="col-start-6 bg-blue-600 rounded-sm row-start-12 "
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Save"}
        </Button>
        <Button
          variant="outlined"
          className="col-start-8 bg-white rounded-sm row-start-12 text-blue-60-lue-600 "
          onClick={() => navigate("/item")}
        >
          Cancel
        </Button>
      </form>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default AddItemForm;
