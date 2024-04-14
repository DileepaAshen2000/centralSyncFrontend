import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { InputLabel, TextField } from "@mui/material";
import { Button } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

const NewOrderForm = () => {
  const navigate = useNavigate();

  const [vendorName, setVendorName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [date, setDate] = useState("");
  const [itemName, setItemName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");

  const [errors,setErrors]=useState({});

  const [fetchData, setFetchData] = useState(false);

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
        if (response.status===200) {
          console.log(response.data);
          Swal.fire({
                icon:'success',
                title:'Success!',
                text:'Order successfully submitted!'
              });
          setFetchData(!fetchData);
          navigate("/order", { fetchData });
        }
      })
      .catch((error) => {
        if (error.response) {
          Swal.fire({
            icon:'error',
            title:'Error!',
            text:'Failed to submit order. Please check your inputs.'
          }); 
          setErrors(error.response.data);
        }
      });
  };


  return (
    
   

    <form className="grid grid-cols-8 gap-y-10 pl-12 ">
      <h1 className=" col-span-4 text-2xl ">New Order</h1>

      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel
          htmlFor="vendorName"
          className="flex-none text-black w-32 "
        >
          Vendor name
        </InputLabel>
        <div>
        {errors.vendorName && (
            <div className="text-[#FC0000] text-sm ml-6">{errors.vendorName}</div>
          )}
        <TextField
          id="vendorName"
          value={vendorName}
          onChange={(e) => setVendorName(e.target.value)}
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white  ",
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
            <div className="text-[#FC0000] text-sm ml-6">{errors.vendorEmail}</div>
          )}
        <TextField
          id="vendorEmail"
          value={vendorEmail}
          onChange={(e) => setVendorEmail(e.target.value)}
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white",
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
            <div className="text-[#FC0000] text-sm ml-6">{errors.companyName}</div>
          )}
        <TextField
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white  ",
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
            <div className="text-[#FC0000] text-sm ml-6">{errors.mobile}</div>
          )}
        <TextField
          id="mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white",
          }}
        />
        </div>
      </div>
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="date" className="flex-none text-black  w-32">
          Date
        </InputLabel>
        <div>
        {errors.date && (
            <div className="text-[#FC0000] text-sm ml-6">{errors.date}</div>
          )}
        <TextField
          id="date"
          value={date}
          type="date"
          onChange={(e) => setDate(e.target.value)}
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white",
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
            <div className="text-[#FC0000] text-sm ml-6">{errors.itemName}</div>
          )}
        <TextField
          id="itemName"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white",
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
            <div className="text-[#FC0000] text-sm ml-6">{errors.brandName}</div>
          )}
        <TextField
          id="brandName"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white",
           
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
            <div className="text-[#FC0000] text-sm ml-6">{errors.quantity}</div>
          )}
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
      </div>
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel
          htmlFor="description"
          className="flex-none text-black w-32 "
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
