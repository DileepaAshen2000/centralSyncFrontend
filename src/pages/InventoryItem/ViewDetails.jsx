import {
  Button,
  MenuList,
  Popover,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";
import LoginService from "../Login/LoginService";

const ViewItemDetails = () => {
  const navigate = useNavigate();
  const { itemID } = useParams();
  const isAdmin = LoginService.isAdmin();



  const [inventoryItem, setInventoryItem] = useState({
    itemName: "",
    itemGroup: "",
    unit: "",
    brand: "",
    dimension: "",
    weight: "",
    description: "",
    quantity: "",
    status: "",
  });

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

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/inventory-item/getById/${itemID}`);
        const item = {
          itemName: response.data.itemName,
          itemGroup: response.data.itemGroup,
          brand: response.data.brand,
          unit: response.data.unit,
          dimension: response.data.dimension,
          weight: response.data.weight,
          description: response.data.description,
          quantity: response.data.quantity,
        };
        setInventoryItem(item);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchItemDetails();
  }, [itemID]);
  

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
        .delete(`http://localhost:8080/inventory-item/deleteItem/${itemID}`)
        .then(() => {
  
          navigate("/item");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkAsInactiveButton = () => {
    axios
      .patch(`http://localhost:8080/inventory-item/updateStatus/${itemID}`)
      .then(() => {

        navigate("/item");
      })
      .catch((error) => {
        console.log(error);
      });
  };


  return (
    <form className="grid grid-cols-8 p-10 bg-white gap-y-10 rounded-2xl ml-14 mr-14">
      <h1 className="col-span-4 pt-2 text-3xl font-bold ">Item Details</h1>
      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="itemID" className="flex-none w-32 text-black ">
          Item Id
        </InputLabel>
        <TextField
          value={itemID}
          id="itemId"
          variant="outlined"
          InputProps={{
            className: "w-[300px] h-10 ml-5 bg-white  ",
            readOnly: true,
          }}
        />
      </div>

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel
          htmlFor="name"
          className="flex-none w-32 text-black "
        >
          Item Name
        </InputLabel>
        <TextField
          value={itemName}
          id="name"
          variant="outlined"
          InputProps={{
            className: "w-[300px] h-10 ml-5 bg-white  ",
          }}
        />
      </div>

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="itemGroup" className="flex-none w-32 text-black ">
          Item Group
        </InputLabel>
        <div className="flex-grow">
          <Select
           id="itemGroup"
            value={itemGroup}
           
            className="w-[300px] h-10 ml-5 bg-white  "
          >
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
        <InputLabel htmlFor="unit" className="flex-none w-32 text-black ">
          Unit
        </InputLabel>
        <TextField
         id="unit"
          value={unit}
         
          variant="outlined"
          InputProps={{
            className: "w-[300px] h-10 ml-5 bg-white  ",
            readOnly: true,
          }}
        />
      </div>
      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="brand" className="flex-none w-32 text-black ">
          Brand
        </InputLabel>
        <TextField
         id="brand"
          value={brand}
         
          variant="outlined"
          InputProps={{
            className: "w-[300px] h-10 ml-5 bg-white  ",
            readOnly: true,
          }}
        />
      </div>
      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="dimension" className="flex-none w-32 text-black">
          Dimension
        </InputLabel>
        <TextField
           id="dimension"
          value={dimension}
       
          variant="outlined"
          InputProps={{
            className: "w-[300px] h-10 ml-5 bg-white  ",
            readOnly: true,
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
        
          variant="outlined"
          InputProps={{
            className: "w-[300px] h-10 ml-5 bg-white  ",
            readOnly: true,
          }}
        />
      </div>
      <div className="flex col-span-4 col-start-1">
        <InputLabel
          htmlFor="description"
          className="flex-none w-32 mt-0 text-black"
        >
          Description
        </InputLabel>
        <TextField
          
          id="description"
          value={description}
          variant="outlined"
          multiline
          rows={6}
          InputProps={{
            className: "w-[500px] ml-5 bg-white  ",
            readOnly: true,
          }}
        />
      </div>
      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="quantity" className="flex-none w-32 text-black ">
          Initial quantity
        </InputLabel>
        <TextField
          
          id="quantity"
          value={quantity}
          variant="outlined"
          InputProps={{
            className: "w-[300px] h-10 ml-5 bg-white  ",
            readOnly: true,
          }}
        />
      </div>

      {/*Buttons*/}
      <>
      {isAdmin && (
        <Button
          variant="contained"
          className="row-start-1 col-start-6 rounded-sm bg-blue-600 ml-10 w-[180px]"
          onClick={handleMoreButton}
        >
          More
        </Button>
      )}
        
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
        className="col-start-8 bg-white rounded-sm row-start-11 text-blue-60blue-600"
        onClick={() => navigate("/item")}
      >
        Cancel
      </Button>
    </form>
  );
};

export default ViewItemDetails;
