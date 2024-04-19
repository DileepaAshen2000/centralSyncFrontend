import {
    Button,
    InputLabel,
    TextField,
  } from "@mui/material";
  
  import { useEffect, useState } from "react";
  import { useParams, useNavigate } from "react-router-dom";
  import Swal from "sweetalert2";
  import axios from "axios";
  
  const EditOrderDetails = () => {
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
  const [errors,setErrors]=useState({});
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
  
      axios
      .put(`http://localhost:8080/orders/updateById/${ID}`, order)
      .then((response) => {
        if (response.status===200) {
          console.log(response.data);
          Swal.fire({
            icon:'success',
            title:'Success!',
            text:'Order details successfully edited!'
          });
          setFetchData(!fetchData);
          navigate("/order", { fetchData });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon:'error',
          title:'Error!',
          text:'Failed to edit order details. Please check your inputs.'
        }); 
        if (error.response) {
          setErrors(error.response.data);
        }
      });
    };

    return (
      <form className="grid grid-cols-8 pl-12 gap-y-10 ">
        <h1 className="col-span-4 text-2xl ">Order Details</h1>
  
        <div className="flex items-center col-span-4 col-start-1">
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
              readOnly: false,
            }}
          />
          </div>
        </div>
  
        <div className="flex items-center col-span-4 col-start-1">
          <InputLabel
            htmlFor="companyName"
            className="flex-none text-black w-32 "
          >
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
              readOnly: false,
            }}
          />
          </div>
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
              readOnly: false,
            }}
          />
          </div>
        </div>
        <div className="flex items-center col-span-4 col-start-1">
          <InputLabel
            htmlFor="brandName"
            className="flex-none w-32 mt-0 text-black"
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
              readOnly: false,
            }}
          />
          </div>
        </div>
        <div className="flex items-center col-span-4 col-start-1">
          <InputLabel htmlFor="quantity" className="flex-none w-32 text-black ">
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
              readOnly: false,
            }}
          />
          </div>
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
              readOnly: false,
            }}
          />
        </div>
          <>
            <Button
              variant="contained"
              className="col-start-6 ml-10 bg-blue-600 rounded-sm row-start-11"
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              className="col-start-8 text-blue-600 bg-white border-blue-600 rounded-sm row-start-11"
              onClick={() => navigate("/order")}
            >
              Cancel
            </Button>
          </>
      </form>
    );
  };
  
  export default EditOrderDetails;
  