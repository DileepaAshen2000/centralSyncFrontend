import { Button, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const EditItem = () => {
  const navigate = useNavigate();

  //state variable to catch error messages sent from API
  const [errors, setErrors] = useState({});

  // Get item itemID from route parameters
  const { itemID } = useParams();


  //State for item object with properties -->initial state of properties=null
  const [inventoryItem, setInventoryItem] = useState({
    itemName: "",
    itemGroup: "",
    unit: "",
    brand: "",
    dimension: "",
    weight: "",
    description: "",
    quantity: ""
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
    quantity
  } = inventoryItem;

  //function to be called on input changing
  const onInputChange = (e) => {
    setInventoryItem({ ...inventoryItem, [e.target.id]: e.target.value });
  };

  //function to be called on item group selection
  const onItemGroupChange = (e) => {
    setInventoryItem({ ...inventoryItem, itemGroup: e.target.value });
  };

  // Fetch item details from the API on component mount
  useEffect(() => {
    axios
      .get(`http://localhost:8080/inventory-item/getById/${itemID}`)
      .then((response) => {
        const item = {
          itemName: response.data.itemName,
          itemGroup: response.data.itemGroup,
          unit: response.data.unit,
          brand: response.data.brand,
          dimension: response.data.dimension,
          weight: response.data.weight,
          description: response.data.description,
          quantity: response.data.quantity,
          status: response.data.status,
        };
        setInventoryItem(item); // Make sure the fetched data structure matches the structure of your state
      })
      .catch((error) => {
        console.log(error);
      });
  }, [itemID]);

  // Handle saving edited item details
  const handleSave = () => {
  
    axios
      .put(`http://localhost:8080/inventory-item/updateById/${itemID}`, inventoryItem)
      .then((response) => {
        if (response.status === 200) {
          // Show error message and set errors for form valitemIDation
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Item details successfully edited!",
          });
          navigate("/item");
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to edit item details. Please check your inputs.",
        });
        if (error.response) {
          setErrors(error.response.data);
        }
      });
  };

  // Form for editing item details
  return (
    <form className="grid grid-cols-8 gap-y-10 p-10 bg-white rounded-2xl ml-14 mr-14">
      <h1 className=" col-span-4 text-3xl pt-2  font-bold">Item Details</h1>
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="itemID" className="flex-none text-black w-32 ">
          Item Id
        </InputLabel>
        <TextField
          value={itemID}
          id="itemId"
          variant="outlined"
          InputProps={{
            className: "w-[300px] h-10 ml-5 bg-white  ",
          }}
        />
      </div>

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
              className: "w-[300px] h-10 ml-5 bg-white  ",
              readOnly: false,
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
            <MenuItem value="printer">Printers</MenuItem>
            <MenuItem value="computerHardware">Computer hardware</MenuItem>
            <MenuItem value="other">other</MenuItem>
          </Select>
        </div>
      </div>

      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="unit" className="flex-none text-black w-32 ">
          Unit
        </InputLabel>
        <div>
          {errors.unit && (
            <div className="text-[#FC0000] text-xs ml-6 my-1">{errors.unit}</div>
          )}
          <TextField
            value={unit}
            onChange={onInputChange}
            id="unit"
            variant="outlined"
            InputProps={{
              className: "w-[300px] h-10 ml-5 bg-white  ",
            }}
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
            value={brand}
            onChange={onInputChange}
            id="brand"
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
        <TextField
          value={dimension}
          onChange={onInputChange}
          id="dimension"
          variant="outlined"
          InputProps={{
            className: "w-[300px] h-10 ml-5 bg-white  ",
            readOnly: false,
          }}
        />
      </div>
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="weight" className="flex-none text-black  w-32">
          Weight
        </InputLabel>
        <TextField
          value={weight}
          onChange={onInputChange}
          id="weight"
          variant="outlined"
          InputProps={{
            className: "w-[300px] h-10 ml-5 bg-white  ",
            readOnly: false,
          }}
        />
      </div>
      <div className="col-start-1 col-span-4 flex">
        <InputLabel
          htmlFor="description"
          className="flex-none text-black  w-32 mt-0"
        >
          Description
        </InputLabel>
        <TextField
          value={description}
          onChange={onInputChange}
          id="description"
          variant="outlined"
          multiline
          rows={6}
          InputProps={{
            className: "w-[500px] ml-5 bg-white  ",
            readOnly: false,
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
            value={quantity}
            onChange={onInputChange}
            id="quantity"
            variant="outlined"
            InputProps={{
              className: "w-[300px] h-10 ml-5 bg-white  ",
              readOnly: false,
            }}
          />
        </div>
      </div>

      <>
        <Button
          variant="contained"
          className="row-start-11 col-start-6 rounded-sm bg-blue-600 ml-10"
          onClick={handleSave}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          className="row-start-11 col-start-8 rounded-sm bg-white text-blue-60blue-600"
          onClick={() => navigate("/item")}
        >
          Cancel
        </Button>
      </>
    </form>
  );
};

export default EditItem;
