import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  InputLabel,
  TextField,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { Button } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

const NewOrderForm = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState({
    vendorName: "",
    companyName: "",
    vendorEmail: "",
    mobile: "",
    dateInitiated: new Date().toISOString().split("T")[0], // Set to today's date
    itemName: "",
    bandName: "",
    quantity: "",
    description: "",
    file: null,
  });

  const {
    vendorName,
    companyName,
    vendorEmail,
    mobile,
    dateInitiated,
    itemName,
    brandName,
    quantity,
    description,
    file,
  } = order;

  const validateField = (name, value) => {
    const validationErrors = {};
    if (name === "vendorName") {
      if (!value) {
        validationErrors.vendorName = "Vendor Name is required";
      } else if (!/^[a-zA-Z][a-zA-Z\s]*$/.test(value)) {
        validationErrors.vendorName = "Vendor name must contain only letters";
      }
    } else if (name === "companyName" && !value) {
      validationErrors.companyName = "Company Name is required";
    } else if (name === "vendorEmail") {
      if (!value) {
        validationErrors.vendorEmail = "Email address is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        validationErrors.vendorEmail = "Invalid email address";
      }
    } else if (name === "mobile") {
      if (!value) {
        validationErrors.mobile = "Mobile number is required";
      } else if (!/^\d{10}$/.test(value)) {
        validationErrors.mobile = "Mobile number must be 10 digits";
      }
    } else if (name === "itemName") {
      if (!value) {
        validationErrors.itemName = "Item Name is required";
      } else if (!/^[a-zA-Z][a-zA-Z\s]*$/.test(value)) {
        validationErrors.itemName = "item name must contain only letters";
      }
    } else if (name === "brandName" && !value) {
      validationErrors.brandName = "Brand name is required";
    } else if (name === "description" && !value) {
      validationErrors.description = "Description is required";
    } else if (name === "quantity") {
      if (!value) {
        validationErrors.quantity = "Quantity is required";
      } else if (!/^[1-9]\d*$/.test(value)) {
        validationErrors.quantity = "Quantity must be a positive number";
      }
    }

    setErrors({
      ...errors,
      [name]: validationErrors[name],
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };
  const onInputChange = (e) => {
    validateField(e.target.name, e.target.value);

    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append(
      "order",
      new Blob(
        [
          JSON.stringify({
            vendorName,
            companyName,
            vendorEmail,
            mobile,
            dateInitiated,
            itemName,
            brandName,
            quantity,
            description,
          }),
        ],
        { type: "application/json" }
      )
    );
    if (file) {
      formData.append("file", file);
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/orders/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        console.log(response.data);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Order successfully submitted!",
        });
        navigate("/order");
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to submit order. Please check your inputs.",
        });
        setErrors(error.response.data);
      } else {
        console.log("Network error:", error.message);
        Swal.fire({
          icon: "error",
          title: "Network Error!",
          text: "Failed to submit order due to network issues.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to handle file selection
  const handleFileChange = (e) => {
    setOrder({ ...order, file: e.target.files[0] }); // Update file state with the selected file
  };

  return (
    <>
      <form className="grid grid-cols-8 gap-y-10 p-10 bg-white rounded-2xl ml-14 mr-14">
        <h1 className=" col-span-4 text-3xl pt-2 font-bold ">New Order</h1>

        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel
            htmlFor="vendorName"
            className="flex-none text-black w-32 "
          >
            Vendor name
          </InputLabel>
          <div>
            {errors.vendorName && (
              <div className="text-[#d32f2f] text-xs ml-4 my-1">
                {errors.vendorName}
              </div>
            )}
            <TextField
              name="vendorName"
              value={vendorName}
              onChange={onInputChange}
              error={errors.vendorName}
              onBlur={handleBlur}
              variant="outlined"
              InputProps={{
                className: "w-[300px] ml-3   ",
              }}
              size="small"
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
              <div className="text-[#d32f2f] text-xs ml-4 my-1">
                {errors.vendorEmail}
              </div>
            )}
            <TextField
              name="vendorEmail"
              value={vendorEmail}
              onChange={onInputChange}
              error={errors.vendorEmail}
              onBlur={handleBlur}
              variant="outlined"
              InputProps={{
                className: "w-[300px] ml-3  ",
              }}
              size="small"
            />
          </div>
        </div>

        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel htmlFor="Group" className="flex-none text-black w-32 ">
            Company Name
          </InputLabel>
          <div>
            {errors.companyName && (
              <div className="text-[#d32f2f] text-xs ml-4 my-1">
                {errors.companyName}
              </div>
            )}
            <TextField
              name="companyName"
              value={companyName}
              onChange={onInputChange}
              error={errors.companyName}
              onBlur={handleBlur}
              variant="outlined"
              InputProps={{
                className: "w-[300px]  ml-3  ",
              }}
              size="small"
            />
          </div>
        </div>

        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel htmlFor="mobile" className="flex-none text-black w-32 ">
            Mobile
          </InputLabel>
          <div>
            {errors.mobile && (
              <div className="text-[#d32f2f] text-xs ml-4 my-1">
                {errors.mobile}
              </div>
            )}
            <TextField
              name="mobile"
              value={mobile}
              onChange={onInputChange}
              error={errors.mobile}
              onBlur={handleBlur}
              variant="outlined"
              InputProps={{
                className: "w-[300px] ml-3   ",
              }}
              size="small"
            />
          </div>
        </div>
        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel htmlFor="date" className="flex-none text-black  w-32">
            Date
          </InputLabel>
          <div>
            {errors.dateInitiated && (
              <div className="text-[#d32f2f] text-xs ml-4 my-1">
                {errors.dateInitiated}
              </div>
            )}
            <TextField
              name="dateInitiated"
              value={dateInitiated}
              type="date"
              variant="outlined"
              InputProps={{
                className: "w-[300px] ml-3   ",
                readOnly: true,
              }}
              size="small"
            />
          </div>
        </div>
        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel htmlFor="itemName" className="flex-none text-black  w-32">
            Item Name
          </InputLabel>
          <div>
            {errors.itemName && (
              <div className="text-[#d32f2f] text-xs ml-4 my-1">
                {errors.itemName}
              </div>
            )}
            <TextField
              name="itemName"
              value={itemName}
              onChange={onInputChange}
              error={errors.itemName}
              onBlur={handleBlur}
              variant="outlined"
              InputProps={{
                className: "w-[300px] ml-3   ",
              }}
              size="small"
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
              <div className="text-[#d32f2f] text-xs ml-4 my-1">
                {errors.brandName}
              </div>
            )}
            <TextField
              name="brandName"
              value={brandName}
              onChange={onInputChange}
              error={errors.brandName}
              onBlur={handleBlur}
              variant="outlined"
              InputProps={{
                className: "w-[300px] ml-3   ",
              }}
              size="small"
            />
          </div>
        </div>
        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel htmlFor="quantity" className="flex-none text-black w-32 ">
            Quantity
          </InputLabel>
          <div>
            {errors.quantity && (
              <div className="text-[#d32f2f] text-xs ml-4 my-1">
                {errors.quantity}
              </div>
            )}
            <TextField
              name="quantity"
              value={quantity}
              onChange={onInputChange}
              error={errors.quantity}
              onBlur={handleBlur}
              variant="outlined"
              InputProps={{
                className: "w-[300px] ml-3 bg-white  ",
              }}
              size="small"
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
          <div>
            {" "}
            {errors.description && (
              <div className="text-[#d32f2f] text-xs ml-4 my-1">
                {errors.description}
              </div>
            )}
            <TextField
              name="description"
              value={description}
              onChange={onInputChange}
              error={errors.description}
              onBlur={handleBlur}
              variant="outlined"
              multiline
              rows={6}
              InputProps={{
                className: "w-[500px]  ml-3   ",
              }}
            />
          </div>
        </div>
        <div className="flex-row col-span-10 col-start-1 ">
          <Typography display="block" gutterBottom>
            Attach File(s) to initiate the order{" "}
          </Typography>
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-4 mb-2"
          ></input>
          <Typography variant="caption" display="block" gutterBottom>
            You can upload a maximum of 1 file, 5MB each
          </Typography>
        </div>

        <Button
          variant="contained"
          className="row-start-13 col-start-6 col-span-3 w-[60%]  rounded-sm bg-blue-600  m-5"
          onClick={handleSubmit}
        >
          Initiate the Order
        </Button>
        <Button
          variant="outlined"
          className="row-start-13 col-start-8 rounded-sm bg-white text-blue-600 border-blue-600 m-5"
          onClick={() => navigate("/order")}
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

export default NewOrderForm;
