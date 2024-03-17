import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { InputLabel, TextField } from "@mui/material";
import { Button } from "@mui/material";

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
  const status = "pending";

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
      status,
    };
    console.log(order);

    fetch("http://localhost:8080/orders/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    }).then(() => {
      setFetchData(!fetchData);
      console.log("New order sent");
      navigate("/order", { fetchData });
    });
  };

  return (
    <form className="grid grid-cols-8 gap-y-10 pl-12 ">
      <h1 className=" col-span-4 text-2xl ">New Order</h1>

      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel
          htmlFor="vendorName"
          className="flex-none text-black w-32 "
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
          }}
        />
      </div>

      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="Group" className="flex-none text-black w-32 ">
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
          }}
        />
      </div>

      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel
          htmlFor="vendorEmail"
          className="flex-none text-black w-32 "
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
          }}
        />
      </div>
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="mobile" className="flex-none text-black w-32 ">
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
          }}
        />
      </div>
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="date" className="flex-none text-black  w-32">
          Date
        </InputLabel>
        <TextField
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          variant="outlined"
          InputProps={{
            className:
              "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white",
          }}
        />
      </div>
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="itemName" className="flex-none text-black  w-32">
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
          }}
        />
      </div>
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel
          htmlFor="brandName"
          className="flex-none text-black  w-32 mt-0"
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
           
          }}
        />
      </div>
      <div className="col-start-1 col-span-4 flex items-center">
        <InputLabel htmlFor="quantity" className="flex-none text-black w-32 ">
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
          }}
        />
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
