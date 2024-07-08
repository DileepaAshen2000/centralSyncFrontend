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
    specification: "",
    unit: "",
    dimension: "",
    weight: "",
    description: "",
    quantity: "",
    image: null,
  });

  //Destructure the state
  const {
    itemName,
    itemGroup,
    brand,
    specification,
    unit,
    dimension,
    weight,
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
    } else if (
      [
        "COMPUTERS_AND_LAPTOPS",
        "COMPUTER_ACCESSORIES",
        "COMPUTER_HARDWARE",
        "PRINTERS_AND_SCANNERS",
      ].includes(itemGroup) &&
      name === "specification" &&
      !value
    ) {
      validationErrors.specification =
        "Specification is required for the selected item group";
    } else if (name === "brand" && !value) {
      validationErrors.brand = "Brand Name is required";
    } else if (name === "unit" && !value) {
      validationErrors.unit = "Unit is required";
    } else if (name === "dimension" && !value) {
      validationErrors.dimension = "Dimension is required";
    } else if (name === "weight" && !value) {
      validationErrors.weight = "Weight is required";
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
  };

  const onInputChange = (e) => {
    validateField(e.target.name, e.target.value);
    setInventoryItem({ ...inventoryItem, [e.target.name]: e.target.value });
  };

  const onItemGroupChange = (e) => {
    validateField(e.target.name, e.target.value);
    setInventoryItem({ ...inventoryItem, itemGroup: e.target.value });
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
    const formData = new FormData();
    formData.append(
      "item",
      new Blob(
        [
          JSON.stringify({
            itemName,
            itemGroup,
            brand,
            specification,
            unit,
            dimension,
            weight,
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
              onChange={onItemGroupChange}
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
        {[
          "COMPUTERS_AND_LAPTOPS",
          "COMPUTER_ACCESSORIES",
          "COMPUTER_HARDWARE",
          "PRINTERS_AND_SCANNERS",
        ].includes(itemGroup) && (
          <div className="flex  col-span-4 col-start-1">
            <InputLabel
              htmlFor="specification"
              className="flex-none w-32 text-black "
            >
              Specification
            </InputLabel>
            <div>
              {errors.specification && (
                <div className="text-[#d32f2f] text-xs ml-4 my-1">
                  {errors.specification}
                </div>
              )}
              <TextField
                name="specification"
                value={specification}
                onChange={onInputChange}
                variant="outlined"
                error={errors.specification}
                onBlur={handleBlur}
                InputProps={{
                  className: "w-[300px] ml-3",
                }}
                size="small"
              />
            </div>
          </div>
        )}
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

        <div className="flex items-center col-span-4 col-start-1">
          <InputLabel htmlFor="dimension" className="flex-none w-32 text-black">
            Dimension
          </InputLabel>
          <div>
            {errors.dimension && (
              <div className="text-[#d32f2f] text-xs ml-4 my-1">
                {errors.dimension}
              </div>
            )}
            <TextField
              name="dimension"
              value={dimension}
              onChange={onInputChange}
              variant="outlined"
              error={errors.dimension}
              onBlur={handleBlur}
              InputProps={{
                className: "w-[300px] ml-3  ",
              }}
              size="small"
            />
          </div>
        </div>
        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel htmlFor="weight" className="flex-none text-black  w-32">
            Weight
          </InputLabel>
          <div>
            {errors.weight && (
              <div className="text-[#d32f2f] text-xs ml-4 my-1">
                {errors.weight}
              </div>
            )}
            <TextField
              name="weight"
              value={weight}
              onChange={onInputChange}
              variant="outlined"
              error={errors.weight}
              onBlur={handleBlur}
              InputProps={{
                className: "w-[300px] ml-3   ",
              }}
              size="small"
            />
          </div>
        </div>
        <div className="col-start-1 col-span-4 flex ">
          <InputLabel
            htmlFor="description"
            className="flex-none w-32 mt-0 text-black"
          >
            Description
          </InputLabel>
          <TextField
            name="description"
            value={description}
            onChange={onInputChange}
            variant="outlined"
            multiline
            rows={6}
            InputProps={{
              className: "w-[500px] ml-3 bg-white  ",
            }}
          />
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
          className="col-start-6 bg-blue-600 rounded-sm row-start-12 "
        >
          Save
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
