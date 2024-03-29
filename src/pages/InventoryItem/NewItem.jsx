import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Button } from "@mui/material";

const AddItemForm = () => {
  const navigate = useNavigate();

  const [itemName, setItemName] = useState("");
  const [itemGroup, setItemGroup] = useState("select an item group");
  const [unit, setUnit] = useState("");
  const [brand, setBrand] = useState("");
  const [dimension, setdimension] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleClick = (e) => {
    e.preventDefault();
    const item = {
      itemName,
      itemGroup,
      unit,
      brand,
      dimension,
      weight,
      description,
      quantity,
    };
    console.log(item);

    fetch("http://localhost:8080/inventory-item/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    }).then(() => {
      console.log("New inventory item added");
    });
  };

  return (
    <form className="bg-[#F5F5F5] grid grid-cols-8 gap-y-10 pl-12 ">
      <h1 className=" col-span-4 text-2xl ">New item</h1>

      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel
          htmlFor="name"
          className="flex-none text-black w-32 "
          required
        >
          Item name
        </InputLabel>
        <TextField
          id="name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white  ",
          }}
        />
      </div>

      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="Group" className="flex-none text-black w-32 ">
          Item group
        </InputLabel>
        <div className="flex-grow">
          <Select
            id="Group"
            value={itemGroup}
            onChange={(e) => setItemGroup(e.target.value)}
            className="  w-[400px] h-10 border border-gray-400 rounded-2xl  ml-5"
          >
            <MenuItem disabled value={itemGroup}>
              <em>Select an itemGroup</em>
            </MenuItem>
            <MenuItem value="computer accessories">
              Computer accessories
            </MenuItem>
            <MenuItem value="printers">Printers</MenuItem>
            <MenuItem value="hardware">Hardware</MenuItem>
            <MenuItem value="other">other</MenuItem>
          </Select>
        </div>
      </div>

      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="unit" className="flex-none text-black w-32 ">
          Unit
        </InputLabel>
        <TextField
          id="unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          variant="outlined"
          InputProps={{
            endAdornment: <InputAdornment position="end">pcs</InputAdornment>,
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white",
          }}
        />
      </div>
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="brand" className="flex-none text-black w-32 ">
          Brand
        </InputLabel>
        <TextField
          id="brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white",
          }}
        />
      </div>
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="dimension" className="flex-none text-black  w-32">
          Dimension
        </InputLabel>
        <TextField
          id="dimension"
          value={dimension}
          onChange={(e) => setdimension(e.target.value)}
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white",
          }}
        />
      </div>
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="weight" className="flex-none text-black  w-32">
          Weight
        </InputLabel>
        <TextField
          id="weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white",
          }}
        />
      </div>
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel
          htmlFor="description"
          className="flex-none text-black  w-32 mt-0"
        >
          Description
        </InputLabel>
        <TextField
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          variant="outlined"
          multiline
          rows={10}
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 ml-5 bg-white",
          }}
        />
      </div>
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="quantity" className="flex-none text-black w-32 ">
          Initial quantity
        </InputLabel>
        <TextField
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white",
          }}
        />
      </div>

      <Button
        variant="contained"
        className="row-start-10 col-start-6 rounded-sm bg-blue-600 ml-10"
        onClick={handleClick}
      >
        Save
      </Button>
      <Button
        variant="outlined"
        className="row-start-10 col-start-8 rounded-sm bg-white text-blue-600 border-blue-600"
        onClick={() => navigate("/item")}
      >
        Cancel
      </Button>
    </form>
  );
};

export default AddItemForm;
