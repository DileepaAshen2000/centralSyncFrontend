import { Button, InputLabel, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const EditOrderDetails = () => {
  const navigate = useNavigate();
  // Getting the order ID from the URL params
  const { orderID } = useParams();

  //state variable to catch error messages sent from API
  const [errors, setErrors] = useState({});

  //State for order object with properties -->initial state of properties=null
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
    setOrder({ ...order, [e.target.orderID]: e.target.value });
  };

  // Fetching the order details by ID
  useEffect(() => {
    axios
      .get(`http://localhost:8080/orders/getById/${orderID}`)
      .then((response) => {
        const order = {
          vendorName: response.data.vendorName,
          companyName: response.data.companyName,
          vendorEmail: response.data.vendorEmail,
          mobile: response.data.mobile,
          date: response.data.date,
          itemName: response.data.itemName,
          brandName: response.data.brandName,
          quantity: response.data.quantity,
          description: response.data.description,
        };
        setOrder(order);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [orderID]);

  // Function to handle saving the edited order details
  const handleSave = () => {
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

    // Updating the order details by ID
    axios
      .put(`http://localhost:8080/orders/updateByorderID/${orderID}`, order)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Order details successfully edited!",
          });
          navigate("/order");
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to edit order details. Please check your inputs.",
        });
        if (error.response) {
          setErrors(error.response.data);
        }
      });
    };
  
    
    return (
      <form className="grid grid-cols-8 gap-y-10 pl-12 ">
        <h1 className=" col-span-4 text-2xl ">Order Details</h1>
  
        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel
            htmlFor="vendorName"
            className="flex-none text-black w-32 "
          >
            Vendor name
          </InputLabel>
          <div>
          {errors.vendorName && (
            <div className="text-[#FC0000] text-xs ml-6">
              {errors.vendorName}
            </div>
          )}
          <TextField
            orderID="vendorName"
            value={vendorName}
            onChange={onInputChange}
            variant="outlined"
            InputProps={{
              className: "w-[300px]   h-10 ml-5 bg-white  ",
              readOnly: false,
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
            orderID="vendorEmail"
            value={vendorEmail}
            onChange={onInputChange}
            variant="outlined"
            InputProps={{
              className: "w-[300px]   h-10 ml-5 bg-white  ",
              readOnly: false,
            }}
          />
          </div>
        </div>
  
        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel
            htmlFor="companyName"
            className="flex-none text-black w-32 "
          >
            Company Name
          </InputLabel>
          <div>
          {errors.companyName && (
            <div className="text-[#FC0000] text-xs ml-6">
              {errors.companyName}
            </div>
          )}
          <TextField
            orderID="companyName"
            value={companyName}
            onChange={onInputChange}
            variant="outlined"
            InputProps={{
              className: "w-[300px]   h-10 ml-5 bg-white  ",
              readOnly: false,
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
            orderID="mobile"
            value={mobile}
            onChange={onInputChange}
            variant="outlined"
            InputProps={{
              className: "w-[300px]   h-10 ml-5 bg-white  ",
              readOnly: false,
            }}
          />
          </div>
        </div>
        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel htmlFor="date" className="flex-none text-black  w-32">
            Date
          </InputLabel>
          <TextField
            id="date"
            value={date}
            type="date"
            variant="outlined"
            InputProps={{
              className:
                "w-[400px] rounded-2xl border border-gray-400 h-10 ml-5 bg-white",
              readOnly: true,
            }}
          />
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
            orderID="itemName"
            value={itemName}
            onChange={onInputChange}
            variant="outlined"
            InputProps={{
              className: "w-[300px]   h-10 ml-5 bg-white  ",
              readOnly: false,
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
            orderID="brandName"
            value={brandName}
            onChange={onInputChange}
            variant="outlined"
            InputProps={{
              className: "w-[300px]   h-10 ml-5 bg-white  ",
              readOnly: false,
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
            orderID="quantity"
            value={quantity}
            onChange={onInputChange}
            variant="outlined"
            InputProps={{
              className: "w-[300px]   h-10 ml-5 bg-white  ",
              readOnly: false,
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
            onChange={onInputChange}
            variant="outlined"
            multiline
            rows={10}
            InputProps={{
              className:
                "w-[400px] rounded-2xl border border-gray-400 ml-5 bg-white",
              readOnly: false,
            }}
          />
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
              className="row-start-11 col-start-8 rounded-sm bg-white text-blue-600 border-blue-600"
              onClick={() => navigate("/order")}
            >
              Cancel
            </Button>
          </>
      </form>
    );
  };
  
  export default EditOrderDetails;
  