import {
  Button,
  InputLabel,
  TextField,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const EditOrderDetails = () => {
  const navigate = useNavigate();
  const { orderID } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const onInputChange = (e) => {
    setOrder({ ...order, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/orders/getById/${orderID}`
        );
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
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderID]);

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/orders/updateById/${orderID}`,
        order
      );
      if (response.status === 200) {
        console.log(response.data);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Order details successfully edited!",
        });
        navigate(-1);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to edit order details. Please check your inputs.",
      });
      if (error.response) {
        setErrors(error.response.data);
      }
    }
  };

  return (
    <>
      <form className="grid grid-cols-8 gap-y-10 p-10 bg-white rounded-2xl ml-14 mr-14">
        <h1 className=" col-span-4 text-3xl pt-2 font-bold ">Order Details</h1>

        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel
            htmlFor="vendorName"
            className="flex-none text-black w-32 "
          >
            Vendor name
          </InputLabel>
          <div>
            {errors.vendorName && (
              <div className="text-[#FC0000] text-xs ml-6 my-1">
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
              <div className="text-[#FC0000] text-xs ml-6 my-1">
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
              <div className="text-[#FC0000] text-xs ml-6 my-1">
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
              <div className="text-[#FC0000] text-xs ml-6 my-1">
                {errors.mobile}
              </div>
            )}
            <TextField
              id="mobile"
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
            onChange={() =>
              setOrder({
                ...order,
                date: new Date().toISOString().split("T")[0],
              })
            }
            type="date"
            variant="outlined"
            InputProps={{
              className: "w-[300px] h-10 ml-5 bg-white  ",
              readOnly: false,
            }}
          />
        </div>
        <div className="col-start-1 col-span-4 flex items-center">
          <InputLabel htmlFor="itemName" className="flex-none text-black  w-32">
            Item Name
          </InputLabel>
          <div>
            {errors.itemName && (
              <div className="text-[#FC0000] text-xs ml-6 my-1">
                {errors.itemName}
              </div>
            )}
            <TextField
              id="itemName"
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
              <div className="text-[#FC0000] text-xs ml-6 my-1">
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
              <div className="text-[#FC0000] text-xs ml-6 my-1">
                {errors.quantity}
              </div>
            )}
            <TextField
              id="quantity"
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
        <div className="col-start-1 col-span-4 flex">
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
              className: "w-[500px] ml-5 bg-white  ",
              readOnly: false,
            }}
          />
        </div>
        <>
          <Button
            variant="contained"
            className="row-start-11 col-start-6 col-span-2 rounded-sm bg-blue-600 m-5 w-[80%] "
            onClick={handleSave}
          >
            Edit & replace the order
          </Button>
          <Button
            variant="outlined"
            className="row-start-11 col-start-8 rounded-sm bg-white text-blue-600 border-blue-600 m-5"
            onClick={() => navigate("/order")}
          >
            Cancel
          </Button>
        </>
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

export default EditOrderDetails;
