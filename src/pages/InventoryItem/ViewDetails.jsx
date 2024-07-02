import {
  Button,
  MenuList,
  Popover,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const ViewItemDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { itemID } = useParams();
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

  useEffect(() => {
    const fetchItemDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/inventory-item/getById/${itemID}`
        );
        const item = {
          itemName: response.data.itemName,
          itemGroup: response.data.itemGroup,
          brand: response.data.brand,
          unit: response.data.unit,
          dimension: response.data.dimension,
          weight: response.data.weight,
          description: response.data.description,
          quantity: response.data.quantity,
          status: response.data.status,
          image: response.data.image,
        };
        setInventoryItem(item);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemID]);

  return (
    <>
      <form className="grid grid-cols-8 gap-y-10 p-10 bg-white rounded-2xl ml-14 mr-14">
        <h1 className=" col-span-4 text-3xl pt-2 font-bold ">Item Details</h1>
        <div className="col-start-1 col-span-4 flex items-center">
          {inventoryItem.image && (
            <img
              src={`data:image/*;base64,${inventoryItem.image}`}
              alt="Item"
              className="w-[300px] ml-5"
            />
          )}
        </div>
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
              readOnly: true,
            }}
          />
        </div>

        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel htmlFor="name" className="flex-none text-black w-32 ">
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

        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel
            htmlFor="itemGroup"
            className="flex-none text-black w-32 "
          >
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

        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel htmlFor="unit" className="flex-none text-black w-32 ">
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
        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel htmlFor="brand" className="flex-none text-black w-32 ">
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
        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel
            htmlFor="dimension"
            className="flex-none text-black  w-32"
          >
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
        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel htmlFor="weight" className="flex-none text-black  w-32">
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
        <div className="col-start-1 col-span-4 flex">
          <InputLabel
            htmlFor="description"
            className="flex-none text-black  w-32 mt-0"
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
        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel htmlFor="quantity" className="flex-none text-black w-32 ">
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

        <Button
          variant="outlined"
          className="row-start-12 col-start-8 rounded-sm bg-white text-blue-60blue-600"
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

export default ViewItemDetails;
