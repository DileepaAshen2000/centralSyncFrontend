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
    const item = {
      itemName,
      itemGroup,
      brand,
      unit,
      dimension,
      weight,
      description,
      quantity,
    };
    console.log(item);

    // Send a POST request to add the item
    axios
      .post("http://localhost:8080/inventory-item/add", item)
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
    <form className="grid grid-cols-8 p-10 bg-white gap-y-10 rounded-2xl ml-14 mr-14">
      <h1 className="col-span-4 pt-2 text-3xl font-bold ">New item</h1>

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="name" className="flex-none w-32 text-black ">
          Item Name
        </InputLabel>
        <div>
          {errors.itemName && (
            <div className="text-[#FC0000] text-xs ml-6">{errors.itemName}</div>
          )}
          <TextField
            id="itemName"
            value={itemName}
            placeholder="Item name"
            onChange={onInputChange}
            variant="outlined"
            InputProps={{
              className: "w-[300px]   h-10 ml-5 bg-white  ",
            }}
          />
        </div>
      </div>

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="itemGroup" className="flex-none w-32 text-black ">
          Item Group
        </InputLabel>
        <div className="flex-grow">
          {errors.itemGroup && (
            <div className="text-[#FC0000] text-xs ml-6">
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

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="unit" className="flex-none w-32 text-black ">
          Unit
        </InputLabel>
        <div>
          {errors.unit && (
            <div className="text-[#FC0000] text-xs ml-6">{errors.unit}</div>
          )}
          <TextField
            id="unit"
            value={unit}
            placeholder="Unit"
            onChange={onInputChange}
            variant="outlined"
            InputProps={{
              className: "w-[300px] h-10 ml-5 bg-white  ",
            }}
          />
        </div>
      </div>
      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="brand" className="flex-none w-32 text-black ">
          Brand
        </InputLabel>
        <div>
          {errors.brand && (
            <div className="text-[#FC0000] text-xs ml-6">{errors.brand}</div>
          )}
          <TextField
            id="brand"
            value={brand}
            placeholder="Brand"
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
        <TextField
          id="dimension"
          value={dimension}
          placeholder="Dimension"
          onChange={onInputChange}
          variant="outlined"
          InputProps={{
            className: "w-[300px] h-10 ml-5 bg-white  ",
          }}
        />
      </div>
      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="weight" className="flex-none w-32 text-black">
          Weight
        </InputLabel>
        <TextField
          id="weight"
          value={weight}
          placeholder="Weight"
          onChange={onInputChange}
          variant="outlined"
          InputProps={{
            className: "w-[300px] h-10 ml-5 bg-white  ",
          }}
        />
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
          placeholder="Description"
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
            <div className="text-[#FC0000] text-xs ml-6">{errors.quantity}</div>
          )}
          <TextField
            id="quantity"
            value={quantity}
            placeholder="Initial Quantity"
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
        className="col-start-6 bg-blue-600 rounded-sm row-start-10 "
        onClick={handleSave}
      >
        Save
      </Button>
      <Button
        variant="outlined"
        className="col-start-8 bg-white rounded-sm row-start-10 text-blue-60-lue-600 "
        onClick={() => navigate("/item")}
      >
        Cancel
      </Button>
    </form>
  );
};

export default AddItemForm;
