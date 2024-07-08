import { useState } from "react";
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

  //State for item object with properties -->initial state of properties=null
  const [inventoryItem, setInventoryItem] = useState({
    itemName: "",
    itemGroup: "",
    unit: "",
    brand: "",
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
    unit,
    brand,
    dimension,
    weight,
    description,
    quantity,
    image,
  } = inventoryItem;

  const onInputChange = (e) => {
    setInventoryItem({ ...inventoryItem, [e.target.id]: e.target.value });
  };

  const onItemGroupChange = (e) => {
    setInventoryItem({ ...inventoryItem, itemGroup: e.target.value });
  };
  const handleImageChange = (e) => {
    setInventoryItem({ ...inventoryItem, image: e.target.files[0] });
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
            unit,
            brand,
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
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to add new item. Please check your inputs.",
      });
      if (error.response && error.response.status === 400) {
        setErrors(error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="grid grid-cols-8 p-10 bg-white gap-y-10 rounded-2xl ml-14 mr-14">
        <h1 className="col-span-4 pt-2 text-3xl font-bold ">New item</h1>

        <div className="flex items-center col-span-4 col-start-1">
          <InputLabel htmlFor="name" className="flex-none w-32 text-black ">
            Item Name
          </InputLabel>
          <div>
            {errors.itemName && (
              <div className="text-[#FC0000] text-xs ml-6 my-1">
                {errors.itemName}
              </div>
            )}
            <TextField
              id="itemName"
              value={itemName}
              onChange={onInputChange}
              variant="outlined"
              InputProps={{
                className: "w-[300px]   h-10 ml-5 bg-white  ",
              }}
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
              <div className="text-[#FC0000] text-xs ml-6 my-1">
                {errors.itemGroup}
              </div>
            )}
            <Select
              id="itemGroup"
              value={itemGroup}
              onChange={onItemGroupChange}
              className="w-[300px] h-10 ml-5 bg-white  "
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

        <div className="flex col-span-4 col-start-1 ">
          <InputLabel htmlFor="unit" className="flex-none w-32 text-black ">
            Unit
          </InputLabel>
          <div>
            {errors.unit && (
              <div className="text-[#FC0000] text-xs ml-6 my-1">
                {errors.unit}
              </div>
            )}
            <TextField
              id="unit"
              value={unit}
              onChange={onInputChange}
              variant="outlined"
              InputProps={{
                className: "w-[300px] h-10 ml-5 bg-white  ",
              }}
              helperText="Enter the quantity measurement unit(e.g., pcs, kg, boxes,)."
            />
          </div>
        </div>
        <div className="flex items-center col-span-4 col-start-1">
          <InputLabel htmlFor="brand" className="flex-none w-32 text-black ">
            Brand
          </InputLabel>
          <div>
            {errors.brand && (
              <div className="text-[#FC0000] text-xs ml-6 my-1">
                {errors.brand}
              </div>
            )}
            <TextField
              id="brand"
              value={brand}
              onChange={onInputChange}
              variant="outlined"
              InputProps={{
                className: "w-[300px] h-10 ml-5 bg-white  ",
              }}
            />
          </div>
        </div>
        <div className="flex items-center col-span-4 col-start-1">
          <InputLabel htmlFor="dimension" className="flex-none w-32 text-black">
            Dimension
          </InputLabel>
          <div>
            {errors.dimension && (
              <div className="text-[#FC0000] text-xs ml-6 my-1">
                {errors.dimension}
              </div>
            )}
            <TextField
              id="dimension"
              value={dimension}
              onChange={onInputChange}
              variant="outlined"
              InputProps={{
                className: "w-[300px] h-10 ml-5 bg-white  ",
              }}
            />
          </div>
        </div>
        <div className="flex items-center col-span-4 col-start-1">
          <InputLabel htmlFor="weight" className="flex-none w-32 text-black">
            Weight
          </InputLabel>
          <div>
            {errors.weight && (
              <div className="text-[#FC0000] text-xs ml-6 my-1">
                {errors.weight}
              </div>
            )}
            <TextField
              id="weight"
              value={weight}
              onChange={onInputChange}
              variant="outlined"
              InputProps={{
                className: "w-[300px] h-10 ml-5 bg-white  ",
              }}
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
          <TextField
            id="description"
            value={description}
            onChange={onInputChange}
            variant="outlined"
            multiline
            rows={6}
            InputProps={{
              className: "w-[500px] ml-5 bg-white  ",
            }}
          />
        </div>
        <div className="flex items-center col-span-4 col-start-1">
          <InputLabel htmlFor="quantity" className="flex-none w-32 text-black ">
            Initial Quantity
          </InputLabel>
          <div>
            {errors.quantity && (
              <div className="text-[#FC0000] text-xs ml-6 my-1">
                {errors.quantity}
              </div>
            )}
            <TextField
              id="quantity"
              value={quantity}
              onChange={onInputChange}
              variant="outlined"
              InputProps={{
                className: "w-[300px] h-10 ml-5 bg-white  ",
              }}
            />
          </div>
        </div>
        <div className="flex-row col-span-5 col-start-1 ">
          {errors.image && (
            <div className="text-[#FC0000] text-xs  my-1">{errors.image}</div>
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
          </div>
        </div>

        <Button
          variant="contained"
          className="col-start-6 bg-blue-600 rounded-sm row-start-11 "
          onClick={handleSave}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          className="col-start-8 bg-white rounded-sm row-start-11 text-blue-60-lue-600 "
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
