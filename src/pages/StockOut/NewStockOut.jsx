import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, TextField, InputLabel, Typography, Button, Autocomplete } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import LoginService from '../Login/LoginService';

const NewStockOut = () => {

  let navigate = useNavigate();
  const [profileInfo, setProfileInfo] = useState();
  const [stockOut, setStockOut] = useState({
    department: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    outQty: "",
    itemId: "",
    userId: "",
    file: null
  });

  const { department, date, description, outQty, itemId, userId, file } = stockOut;

  const [options, setOptions] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [availableQuantity, setAvailableQuantity] = useState(0); // To store available quantity
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/inventory-item/getAll');
        setOptions(response.data);

        const token = localStorage.getItem('token');
        const profile = await LoginService.getYourProfile(token);
        setProfileInfo(profile.users);
        setStockOut(preStockOut => ({ ...preStockOut, userId: profile.users.userId }));

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleItemChange = async (event, value) => {
    if (value) {
      setSelectedItemId(value.itemId);
      setStockOut({ ...stockOut, itemId: value.itemId });

      // Fetch available quantity for the selected item
      try {
        const response = await axios.get(`http://localhost:8080/inventory-item/getById/${value.itemId}`);
        setAvailableQuantity(response.data.quantity);
      } catch (error) {
        console.error('Error fetching item details:', error);
      }
    } else {
      setSelectedItemId(null);
      setStockOut({ ...stockOut, itemId: "" });
      setAvailableQuantity(0);
    }
  };

  const onInputChange = (e) => {
    setStockOut({ ...stockOut, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (parseInt(outQty) >= availableQuantity) {
      Swal.fire({
        title: "Error!",
        text: "Quantity Out should be less than the available quantity in the inventory. Available Quantity : "+ availableQuantity,
        icon: "error"
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('department', department);
      formData.append('date', date);
      formData.append('description', description);
      formData.append('outQty', outQty);
      formData.append('itemId', itemId);
      formData.append('userId', userId);
      formData.append('file', file);

      const result = await axios.post("http://localhost:8080/stock-out/add", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/stockOut');
      Swal.fire({
        title: "Done !",
        text: "Stock-Out Successfully Submitted !",
        icon: "success"
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to submit Stock-Out. Please try again.",
        icon: "error"
      });
    }
  };

  const validateInputs = () => {
    const errors = {};
    if (!department) {
      errors.department = 'Department is required';
    }
    if (!date) {
      errors.date = 'Date is required';
    }
    if (!outQty) {
      errors.outQty = 'Quantity out is required';
    }
    if (!itemId) {
      errors.itemId = 'Item ID is required';
    }
    if (outQty < 0) {
      errors.outQty = 'Quantity should be positive value';
    }
    return errors;
  };

  const handleFileChange = (e) => {
    setStockOut({ ...stockOut, file: e.target.files[0] });
  };

  return (
    <form className="grid grid-cols-8 p-10 bg-white gap-y-10 rounded-2xl ml-14 mr-14" onSubmit={(e) => onSubmit(e)}>
      <h1 className="col-span-4 pt-2 text-3xl font-bold ">New Stock-Out</h1>

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="name" className="flex-none w-32 text-black ">
          Item Name
        </InputLabel>
        <div>
          <Autocomplete
            disablePortal
            options={options}
            getOptionLabel={(option) => option.itemName}
            onChange={handleItemChange}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Item Name" helperText='Please select the Item Name.' />}
            size='small'
          />
        </div>
      </div>

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="name" className="flex-none w-32 text-black ">
          Item ID
        </InputLabel>
        <div>
          <Autocomplete
            disabled
            options={[{ itemId: selectedItemId }]}
            getOptionLabel={(option) => option.itemId}
            name='itemId'
            value={{ itemId: selectedItemId }}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Item ID"
              error={!!errors.itemId}
              helperText={errors.itemId} />}
            size='small'
          />
        </div>
      </div>

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="name" className="flex-none w-32 text-black ">
          Department
        </InputLabel>
        <div>
          <FormControl style={{ width: '300px' }}>
            <Select value={department} onChange={(e) => onInputChange(e)} size='small' name='department'
              error={!!errors.department}
              helperText={errors.department}>
              <MenuItem value="Software Engineering">Software Engineering</MenuItem>
              <MenuItem value="Product Management">Product Management</MenuItem>
              <MenuItem value="UI/UX Department">UI/UX Department</MenuItem>
              <MenuItem value="Quality Assurance">Quality Assurance</MenuItem>
              <MenuItem value="Customer Service">Customer Service</MenuItem>
              <MenuItem value="Human Resource">Human Resource</MenuItem>
              <MenuItem value="Finance & Administration">Finance & Administration</MenuItem>
              <MenuItem value="Research & Development">Research & Development</MenuItem>
            </Select>
            <Typography variant='caption' className='text-red-600'>{errors.department}</Typography>
          </FormControl>
        </div>
      </div>

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="name" className="flex-none w-32 text-black ">
          Date
        </InputLabel>
        <div>
          <TextField
            style={{ width: '300px' }}
            label="Date"
            name='date'
            value={date}
            size='small'
            error={!!errors.date}
            helperText={errors.date}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
      </div>

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="name" className="flex-none w-32 text-black ">
          Quantity Out
        </InputLabel>
        <div>
          <TextField
            size='small'
            placeholder='Enter Quantity Out'
            type='Number'
            name='outQty'
            value={outQty}
            error={!!errors.outQty}
            helperText={errors.outQty}
            onChange={(e) => onInputChange(e)} />
        </div>
      </div>

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="name" className="flex-none w-32 text-black ">
          Description
        </InputLabel>
        <div>
          <TextField
            label="Description"
            name='description'
            multiline
            rows={6}
            placeholder='Enter Description Here...'
            style={{ width: '500px' }}
            value={description}
            onChange={(e) => onInputChange(e)}
          />
        </div>
      </div>

      <div className="flex-row col-span-10 col-start-1 ">
        <Typography display='block' gutterBottom>Attach File(s) to inventory stock-out </Typography>
        <input type='file' onChange={handleFileChange} className="mt-4 mb-2"></input>
        <Typography variant='caption' display='block' gutterBottom>You can upload a maximum 10MB file.</Typography>
      </div>

      <div className='flex col-start-7 gap-6'>
        <Button className="text-white bg-blue-600 rounded "
          variant='contained'
          type='submit'
        >Submit</Button>
        <Button className="rounded"
          variant='outlined'
          onClick={() => navigate("/stockOut")}
        >Cancel</Button>
      </div>
    </form>
  );
};

export default NewStockOut;
