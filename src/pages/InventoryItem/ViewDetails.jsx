import {
  Button,
  MenuList,
  Popover,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";

const ViewItemDetails = () => {
  const [itemName, setItemName] = useState("");
  const [itemGroup, setItemGroup] = useState("select an item group");
  const [unit, setUnit] = useState("");
  const [brand, setBrand] = useState("");
  const [dimension, setDimension] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");

  const [fetchData, setFetchData] = useState(false);

  const { ID } = useParams();

 // const [fetchData, setFetchData] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/inventory-item/getById/${ID}`)
      .then((response) => {
        const data = {
          itemName: response.data.itemName,
          itemGroup: response.data.itemGroup,
          brand: response.data.brand,
          unit: response.data.unit,
          dimension: response.data.dimension,
          weight: response.data.weight,
          description: response.data.description,
          quantity: response.data.quantity,
          status: response.data.status,
        };

        setItemName(data.itemName);
        setItemGroup(data.itemGroup);
        setBrand(data.brand);
        setUnit(data.unit);
        setDimension(data.dimension);
        setWeight(data.weight);
        setDescription(data.description);
        setQuantity(data.quantity);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [ID]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleMoreButton = (event) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsOpen(false);
  };

  const handleDelete = () => {
    try {
      axios
        .delete(`http://localhost:8080/inventory-item/deleteItem/${ID}`)
        .then(() => {
          setFetchData(!fetchData);
          navigate("/item", { fetchData });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkAsInactiveButton = () => {
    axios
      .patch(
        `http://localhost:8080/inventory-item/updateStatus/${ID}`
      )
      .then(() => {
        setFetchData(!fetchData);
        navigate("/item", { fetchData });
      })
      .catch((error) => {
        console.log(error);
      });
  };


  return (
    <form className="grid grid-cols-8 gap-y-10 pl-12 ">
      <h1 className=" col-span-4 text-2xl ">Item Details</h1>
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="id" className="flex-none text-black w-32 ">
          Item id
        </InputLabel>
        <TextField
          value={ID}
          id="id"
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white  ",
            readOnly: true,
          }}
        />
      </div>

      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel
          htmlFor="name"
          className="flex-none text-black w-32 "
          required
        >
          Item name
        </InputLabel>
        <TextField
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          id="name"
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white  ",
            readOnly: true,
          }}
        />
      </div>

      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="itemGroup" className="flex-none text-black w-32 ">
          Item group
        </InputLabel>
        <div className="flex-grow">
          <Select
            value={itemGroup}
            onChange={(e) => setItemGroup(e.target.value)}
            id="itemGroup"
            className="bg-white  w-[400px] h-10 border border-gray-400 rounded-2xl  ml-5"
            readOnly="true"
          >
            <MenuItem disabled value={itemGroup}></MenuItem>
            <MenuItem value="computerAccessories">
              Computer accessories
            </MenuItem>
            <MenuItem value="printers">Printers</MenuItem>
            <MenuItem value="computerHardware">Computer hardware</MenuItem>
            <MenuItem value="other">other</MenuItem>
          </Select>
        </div>
      </div>

      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="unit" className="flex-none text-black w-32 ">
          Unit
        </InputLabel>
        <TextField
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          id="unit"
          variant="outlined"
          InputProps={{
            endAdornment: <InputAdornment position="end">pcs</InputAdornment>,
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white",
            readOnly: true,
          }}
        />
      </div>
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="brand" className="flex-none text-black w-32 ">
          Brand
        </InputLabel>
        <TextField
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          id="brand"
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white",
            readOnly: true,
          }}
        />
      </div>
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="dimension" className="flex-none text-black  w-32">
          Dimension
        </InputLabel>
        <TextField
          value={dimension}
          onChange={(e) => setDimension(e.target.value)}
          id="dimension"
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white",
            readOnly: true,
          }}
        />
      </div>
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="weight" className="flex-none text-black  w-32">
          Weight
        </InputLabel>
        <TextField
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          id="weight"
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white",
            readOnly: true,
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          id="description"
          variant="outlined"
          multiline
          rows={10}
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 ml-5 bg-white",
            readOnly: true,
          }}
        />
      </div>
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="quantity" className="flex-none text-black w-32 ">
          Initial quantity
        </InputLabel>
        <TextField
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          id="quantity"
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white",
            readOnly: true,
          }}
        />
      </div>
      <>
          <Button
            variant="contained"
            className="row-start-1 col-start-6 rounded-sm bg-blue-600 ml-10 w-[180px]"
            onClick={handleMoreButton}
          >
            More
          </Button>
          <Popover
            open={isOpen}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <MenuList>
              
              <MenuItem>
                <Button
                  variant="contained"
                  className="col-start-6 rounded-sm bg-blue-600 ml-10 w-[180px]"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </MenuItem>
              <MenuItem>
                <Button
                  variant="contained"
                  className=" col-start-6 rounded-sm bg-blue-600 ml-10 w-[180px]"
                  onClick={handleMarkAsInactiveButton}
                >
                  Mark as inactive
                </Button>
              </MenuItem>
            </MenuList>
          </Popover>
        </>

      <Button
        variant="outlined"
        className="row-start-11 col-start-8 rounded-sm bg-white text-blue-600 border-blue-600"
        onClick={() => navigate("/item")}
      >
        Cancel
      </Button>
    </form>
  );
};

export default ViewItemDetails;
