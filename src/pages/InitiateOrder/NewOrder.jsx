import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputLabel, TextField } from "@mui/material";
import { Button } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

const NewOrderForm = () => {
  const navigate = useNavigate();

  //state variable to catch error messages sent from API
  const [errors, setErrors] = useState({});

  //State for order object with properties -->initial state of properties=null
  const [order, setOrder] = useState({
    vendorName: "",
    companyName: "",
    vendorEmail: "",
    mobile: "",
    date: new Date().toISOString().split("T")[0], // Set to today's date
    itemName: "",
    bandName: "",
    quantity: "",
    description: "",
  });

  //Destructure the state
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

  //function to be called on input changing
  const onInputChange = (e) => {
    setOrder({ ...order, [e.target.id]: e.target.value });
  };

  const handleClick = (e) => {
    e.preventDefault();
    const order = {
      vendorName,
      companyName,
      vendorEmail,
      mobile,
      date,
      itemName,
      brandName,
      quantity,
    };

    axios
      .post("http://localhost:8080/orders/add", order)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Order successfully submitted!",
          });
          navigate("/order");
        }
      })
      .catch((error) => {
        if (error.response) {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Failed to submit order. Please check your inputs.",
          });
          setErrors(error.response.data);
        }
      });
  };

  //Form for initiate a new order
  return (
    <form className="grid grid-cols-8 gap-y-10 p-10 bg-white rounded-2xl ml-14 mr-14">
      <h1 className=" col-span-4 text-3xl pt-2 font-bold ">New Order</h1>

      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="vendorName" className="flex-none text-black w-32 ">
          Vendor name
        </InputLabel>
        <div>
          {errors.vendorName && (
            <div className="text-[#FC0000] text-xs ml-6">
              {errors.vendorName}
            </div>
          )}
          <TextField
            id="vendorName"
            value={vendorName}
            onChange={onInputChange}
            variant="outlined"
            InputProps={{
              className: "w-[300px]   h-10 ml-5 bg-white  ",
            }}
          />
        </div>
      </div>

      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel
          htmlFor="vendorEmail"
          className="flex-none text-black w-32 "
        >
          Email Address
        </InputLabel>
        <div>
          {errors.vendorEmail && (
            <div className="text-[#FC0000] text-xs ml-6">
              {errors.vendorEmail}
            </div>
          )}
          <TextField
            id="vendorEmail"
            value={vendorEmail}
            onChange={onInputChange}
            variant="outlined"
            InputProps={{
              className: "w-[300px]   h-10 ml-5 bg-white  ",
            }}
          />
        </div>
      </div>

      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="Group" className="flex-none text-black w-32 ">
          Company Name
        </InputLabel>
        <div>
          {errors.companyName && (
            <div className="text-[#FC0000] text-xs ml-6">
              {errors.companyName}
            </div>
          )}
          <TextField
            id="companyName"
            value={companyName}
            onChange={onInputChange}
            variant="outlined"
            InputProps={{
              className: "w-[300px]   h-10 ml-5 bg-white  ",
            }}
          />
        </div>
      </div>

      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="mobile" className="flex-none text-black w-32 ">
          Mobile
        </InputLabel>
        <div>
          {errors.mobile && (
            <div className="text-[#FC0000] text-xs ml-6">{errors.mobile}</div>
          )}
          <TextField
            id="mobile"
            value={mobile}
            onChange={onInputChange}
            variant="outlined"
            InputProps={{
              className: "w-[300px]   h-10 ml-5 bg-white  ",
            }}
          />
        </div>
      </div>
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="date" className="flex-none text-black  w-32">
          Date
        </InputLabel>
        <div>
          <TextField
            id="date"
            value={date}
            type="date"
            variant="outlined"
            InputProps={{
              className: "w-[300px]   h-10 ml-5 bg-white  ",
              readOnly: true,
            }}
          />
        </div>
      </div>
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="itemName" className="flex-none text-black  w-32">
          Item Name
        </InputLabel>
        <div>
          {errors.itemName && (
            <div className="text-[#FC0000] text-xs ml-6">{errors.itemName}</div>
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
        <InputLabel
          htmlFor="brandName"
          className="flex-none text-black  w-32 mt-0"
        >
          Brand Name
        </InputLabel>
        <div>
          {errors.brandName && (
            <div className="text-[#FC0000] text-xs ml-6">
              {errors.brandName}
            </div>
          )}
          <TextField
            id="brandName"
            value={brandName}
            onChange={onInputChange}
            variant="outlined"
            InputProps={{
              className: "w-[300px]   h-10 ml-5 bg-white  ",
            }}
          />
        </div>
      </div>
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="quantity" className="flex-none text-black w-32 ">
          Quantity
        </InputLabel>
        <div>
          {errors.quantity && (
            <div className="text-[#FC0000] text-xs ml-6">{errors.quantity}</div>
          )}
          <TextField
            id="quantity"
            value={quantity}
            onChange={onInputChange}
            variant="outlined"
            InputProps={{
              className: "w-[300px]   h-10 ml-5 bg-white  ",
            }}
          />
        </div>
      </div>
      <div className="col-start-1 col-span-4 flex ">
        <InputLabel
          htmlFor="description"
          className="flex-none text-black w-32 "
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
            className: "w-[500px]  ml-5 bg-white  ",
          }}
        />
      </div>

      <Button
        variant="contained"
        className="row-start-11 col-start-6 rounded-sm bg-blue-600 ml-10"
        onClick={handleClick}
      >
        Save
      </Button>
      <Button
        variant="outlined"
        className="row-start-11 col-start-8 rounded-sm bg-white text-blue-600 border-blue-600"
        onClick={() => navigate("/order")}
      >
        Cancel
      </Button>
    </form>
  );
};

export default NewOrderForm;
