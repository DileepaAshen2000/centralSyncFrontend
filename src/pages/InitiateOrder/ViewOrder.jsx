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
  const [vendorName, setVendorName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [date, setDate] = useState("");
  const [itemName, setItemName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");

  const { ID } = useParams();
  
  const [fetchData, setFetchData] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/orders/getById/${ID}`)
      .then((response) => {
        const data = {
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

        setVendorName(data.vendorName);
        setCompanyName(data.companyName);
        setVendorEmail(data.vendorEmail);
        setMobile(data.mobile);
        setDate(data.date);
        setItemName(data.itemName);
        setBrandName(data.brandName);
        setQuantity(data.quantity);
        setDescription(data.description);
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
        .delete("http://localhost:8080/orders/deleteOrder/" + ID)
        .then(() => {
          setFetchData(!fetchData);
          navigate("/order", { fetchData });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkAsReviewed = () => {
    axios
      .patch("http://localhost:8080/orders/updateStatus/" + ID)
      .then(() => {
        setFetchData(!fetchData); 
        navigate("/order", { fetchData }); 
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <form className="grid grid-cols-8 pl-12 gap-y-10 ">
      <h1 className="col-span-4 text-2xl ">Order Details</h1>

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel
          htmlFor="vendorName"
          className="flex-none w-32 text-black "
          required
        >
          Vendor name
        </InputLabel>
        <TextField
          id="vendorName"
          value={vendorName}
          onChange={(e) => setVendorName(e.target.value)}
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white  ",
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
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white  ",
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
          id="vendorEmail"
          value={vendorEmail}
          onChange={(e) => setVendorEmail(e.target.value)}
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white",
            readOnly: true,
          }}
        />
      </div>
      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="mobile" className="flex-none w-32 text-black ">
          Mobile
        </InputLabel>
        <TextField
          id="mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white",
            readOnly: true,
          }}
        />
      </div>
      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="date" className="flex-none w-32 text-black">
          Date
        </InputLabel>
        <TextField
          id="date"
          value={date}
          type="date"
          onChange={(e) => setDate(e.target.value)}
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white",
            readOnly: true,
          }}
        />
      </div>
      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="itemName" className="flex-none w-32 text-black">
          Item Name
        </InputLabel>
        <TextField
          id="itemName"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white",
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
          id="brandName"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white",
            readOnly: true,
          }}
        />
      </div>
      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="quantity" className="flex-none w-32 text-black ">
          Quantity
        </InputLabel>
        <TextField
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white",
            readOnly: true,
          }}
        />
      </div>
      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel
          htmlFor="description"
          className="flex-none w-32 text-black "
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
