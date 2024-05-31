import {
  Button,
  Popover,
  InputLabel,
  MenuList,
  MenuItem,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewOrderDetails = () => {
  const navigate = useNavigate();
  const { orderID } = useParams();

  const [order, setOrder] = useState({
    vendorName: "",
    companyName: "",
    vendorEmail: "",
    mobile: "",
    date: "",
    itemName: "",
    bandName: "",
    quantity: "",
    description: "",
  });

  const {
    vendorName,
    companyName,
    vendorEmail,
    mobile,
    date,
    itemName,
    brandName,
    quantity,
    description,
  } = order;

useEffect(() => {
  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/orders/getById/${orderID}`);
      const order = {
        vendorName: response.data.vendorName,
        companyName: response.data.companyName,
        mobile: response.data.mobile,
        vendorEmail: response.data.vendorEmail,
        date: response.data.date,
        itemName: response.data.itemName,
        brandName: response.data.brandName,
        quantity: response.data.quantity,
        description: response.data.description,
      };
      setOrder(order);
    } catch (error) {
      console.log(error);
    }
  };

  fetchOrderDetails();
}, [orderID]);

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
        .delete("http://localhost:8080/orders/deleteOrder/" + orderID)
        .then(() => {
          navigate("/order");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkAsReviewed = () => {
    axios
      .patch("http://localhost:8080/orders/updateStatus/" + orderID)
      .then(() => {
        navigate("/order");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <form className="grid grid-cols-8 gap-y-10 p-10 bg-white rounded-2xl ml-14 mr-14">
      <h1 className=" col-span-4 text-3xl pt-2 font-bold ">Order Details</h1>

      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="vendorName" className="flex-none text-black w-32 ">
          Vendor name
        </InputLabel>
        <TextField
          orderID="vendorName"
          value={vendorName}
          variant="outlined"
          InputProps={{
            className: "w-[300px]   h-10 ml-5 bg-white  ",
            readOnly: true,
          }}
        />
      </div>

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel
          htmlFor="companyName"
          className="flex-none w-32 text-black "
        >
          Company Name
        </InputLabel>
        <TextField
          orderID="companyName"
          value={companyName}
          variant="outlined"
          InputProps={{
            className: "w-[300px]   h-10 ml-5 bg-white  ",
            readOnly: true,
          }}
        />
      </div>

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel
          htmlFor="vendorEmail"
          className="flex-none w-32 text-black "
        >
          Email Address
        </InputLabel>
        <TextField
          orderID="vendorEmail"
          value={vendorEmail}
          variant="outlined"
          InputProps={{
            className: "w-[300px]   h-10 ml-5 bg-white  ",
            readOnly: true,
          }}
        />
      </div>
      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="mobile" className="flex-none w-32 text-black ">
          Mobile
        </InputLabel>
        <TextField
          orderID="mobile"
          value={mobile}
          variant="outlined"
          InputProps={{
            className: "w-[300px]   h-10 ml-5 bg-white  ",
            readOnly: true,
          }}
        />
      </div>
      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="date" className="flex-none w-32 text-black">
          Date
        </InputLabel>
        <TextField
          orderID="date"
          value={date}
          type="date"
          variant="outlined"
          InputProps={{
            className: "w-[300px]   h-10 ml-5 bg-white  ",
            readOnly: true,
          }}
        />
      </div>
      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="itemName" className="flex-none w-32 text-black">
          Item Name
        </InputLabel>
        <TextField
          orderID="itemName"
          value={itemName}
          variant="outlined"
          InputProps={{
            className: "w-[300px]   h-10 ml-5 bg-white  ",
            readOnly: true,
          }}
        />
      </div>
      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel
          htmlFor="brandName"
          className="flex-none w-32 mt-0 text-black"
        >
          Brand Name
        </InputLabel>
        <TextField
          orderID="brandName"
          value={brandName}
          variant="outlined"
          InputProps={{
            className: "w-[300px]   h-10 ml-5 bg-white  ",
            readOnly: true,
          }}
        />
      </div>
      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="quantity" className="flex-none w-32 text-black ">
          Quantity
        </InputLabel>
        <TextField
          orderID="quantity"
          value={quantity}
          variant="outlined"
          InputProps={{
            className: "w-[300px]   h-10 ml-5 bg-white  ",
            readOnly: true,
          }}
        />
      </div>
      <div className="col-start-1 col-span-4 flex">
        <InputLabel
          htmlFor="description"
          className="flex-none w-32 text-black "
        >
          Description
        </InputLabel>
        <TextField
          orderID="description"
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
                onClick={handleMarkAsReviewed}
              >
                Mark as reviewed
              </Button>
            </MenuItem>
          </MenuList>
        </Popover>
      </>
    </form>
  );
};

export default ViewOrderDetails;
