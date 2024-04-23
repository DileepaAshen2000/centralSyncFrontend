import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Button } from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";

const AddItemForm = () => {
  const navigate = useNavigate();

  //state variable to catch error messages sent from API
  const [errors, setErrors] = useState({});

  // State variable to trigger data fetchin
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
  } = inventoryItem;

  //function to be called on input changing
  const onInputChange = (e) => {
    setInventoryItem({ ...inventoryItem, [e.target.id]: e.target.value });
  };

  //function to be called on item group selection
  const onItemGroupChange = (e) => {
    setInventoryItem({ ...inventoryItem, itemGroup: e.target.value });
  };

  // Handle form submission
  const handleSave = (e) => {
    e.preventDefault();
  
    // Send a POST request to add the item
    axios
      .post("http://localhost:8080/inventory-item/add", inventoryItem)
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Item successfully added!",
          });
          setFetchData(!fetchData);
          navigate("/item");
        }
      })
      .catch((error) => {
        // Show error message and set errors if any
        Swal.fire({
 
          icon: "error",
          title: "Error!",
          text: "Failed to add new item. Please check your inputs.",
        });
 
        if (error.response) {
          setErrors(error.response.data);
        }
      });
  };

  //Form for adding a new item
  return (
    <form className="grid grid-cols-8 gap-y-10 p-10 bg-white rounded-2xl ml-14 mr-14">
      <h1 className=" col-span-4 text-3xl pt-2 font-bold">New item</h1>

      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="name" className="flex-none text-black w-32 ">
          Item Name
        </InputLabel>
        <div>
          {errors.itemName && (
            <div className="text-[#FC0000] text-xs ml-6 my-1">{errors.itemName}</div>
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

      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="itemGroup" className="flex-none text-black w-32 ">
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
            <MenuItem value="computerAccessories">
              Computer accessories
            </MenuItem>
            <MenuItem value="printer">Printer</MenuItem>
            <MenuItem value="computerHardware">Computer hardware</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </div>
      </div>

      <div className="col-start-1 col-span-4 flex ">
        <InputLabel htmlFor="unit" className="flex-none text-black w-32 ">
          Unit
        </InputLabel>
        <div>
          {errors.unit && (
            <div className="text-[#FC0000] text-xs ml-6 my-1">{errors.unit}</div>
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
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="brand" className="flex-none text-black w-32 ">
          Brand
        </InputLabel>
        <div>
          {errors.brand && (
            <div className="text-[#FC0000] text-xs ml-6 my-1">{errors.brand}</div>
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
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="dimension" className="flex-none text-black  w-32">
          Dimension
        </InputLabel>
        <div>
        {errors.dimension && (
            <div className="text-[#FC0000] text-xs ml-6 my-1">{errors.dimension}</div>
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
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="weight" className="flex-none text-black  w-32">
          Weight
        </InputLabel>
        <div>
        {errors.weight && (
            <div className="text-[#FC0000] text-xs ml-6 my-1">{errors.weight}</div>
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
      <div className="col-start-1 col-span-4 flex ">
        <InputLabel
          htmlFor="description"
          className="flex-none text-black  w-32 mt-0"
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
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="quantity" className="flex-none text-black w-32 ">
          Initial Quantity
        </InputLabel>
        <div>
          {errors.quantity && (
            <div className="text-[#FC0000] text-xs ml-6 my-1">{errors.quantity}</div>
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

      <Button
        variant="contained"
        className="row-start-10 col-start-6 rounded-sm bg-blue-600 "
        onClick={handleSave}
      >
        Save
      </Button>
      <Button
        variant="outlined"
        className="row-start-10 col-start-8 rounded-sm bg-white text-blue-60-lue-600 "
        onClick={() => navigate("/item")}
      >
        Cancel
      </Button>
    </form>
  );
};

export default AddItemForm;
