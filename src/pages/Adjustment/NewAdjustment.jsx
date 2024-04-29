import React, { useState } from 'react';
import { Select, MenuItem, TextField, Typography, Button ,Autocomplete,InputLabel } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useEffect } from 'react';

const NewAdjustment = () => {

  let navigate = useNavigate();
  const [adj,setAdj] = useState({  // create state for adjustment, initial state is empty with object.
    reason:"",
    date:new Date().toISOString().split("T")[0], // Set to today's date
    description:"",
    newQuantity:"",
    itemId:""
  })
  const [item,setItem] = useState({ // create state for item, initial state is empty with object.
    itemName:"",
    quantity:""
  })
  const [errors, setErrors] = useState({}); // State to manage errors for input fields
  const [options, setOptions] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  
  const{reason,date,description,newQuantity,itemId} = adj; // Destructure the adj state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/inventory-item/getAll');
        setOptions(response.data);
      } catch (error) {
        console.error('Error fetching item details:', error);
      }
    };

    fetchData();
  }, []);

  const handleItemChange = (event, value) => {
    if (value) {
      setSelectedItemId(value.itemId);
      setAdj({ ...adj, itemId: value.itemId }); // Update the itemId in the adj state
      fetchItemDetails(value.itemId);
    } else {
      setSelectedItemId(null);
      setAdj({ ...adj, itemId: "" });
    }
    
  };
  
  // Fetch the item details
  const fetchItemDetails = async (itemId) => {
    try {
      const response = await axios.get(`http://localhost:8080/inventory-item/getById/${itemId}`);
      setItem({ ...item, quantity: response.data.quantity }); // Update the newQuantity in the adj state
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
  }
  //Add onChange event to the input fields
  const onInputChange= async (e)=>{
    setAdj({...adj,[e.target.name]:e.target.value});
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error when input changes
  };

  const onSubmit=async(e)=>{
    e.preventDefault();
    const validationErrors = validateInputs();
    console.log(Object.keys(validationErrors).length)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const result = await axios.post("http://localhost:8080/adjustment/add", adj);
      console.log(result);
      navigate('/adjustment');// To navigate to the adjustment page
      Swal.fire({
        title: "Done!",
        text: "Adjustment Successfully Submitted!",
        icon: "success"
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to submit Adjustment. Please try again.",
        icon: "error"
      });
    }
  }

  // Validate the input fields
  const validateInputs = () => {
    const errors = {};
    if (!reason) {
      errors.reason = 'Reason is required';
    }
    if (!date) {
      errors.date = 'Date is required';
    }
    
    if (!newQuantity) {
      errors.newQuantity = 'New Quantity is required';
    }
    if (!itemId) {
      errors.itemId = 'Item ID is required';
    }
    if (newQuantity<0){
      errors.newQuantity = 'Quantity should be positive value'
    }
    
    return errors;
  };

  return (
    <form className="grid grid-cols-12 p-10 bg-white gap-y-10 rounded-2xl ml-14 mr-14" onSubmit={(e)=> onSubmit(e)}>
      <h1 className="col-span-4 pt-2 text-3xl font-bold ">New Adjustment</h1>

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="itemName" className="flex-none w-32 text-black ">
          Item Name
        </InputLabel>
        <div>
          <Autocomplete
            disablePortal
            options={options} 
            getOptionLabel={(option) => option.itemName}
            onChange={handleItemChange}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Item Name"  helperText='Please select the item name.'/>}
            size='small' 
            type='search'
          />
        </div>
      </div>
      
      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="itemId" className="flex-none w-32 text-black ">
          Item ID
        </InputLabel>
        <div>
          <Autocomplete
            disabled
            options={[{ itemId: selectedItemId }]} // Provide the selected itemId as an option
            getOptionLabel={(option) => option.itemId} // Display itemId in the Autocomplete
            name='itemId' // Add name to the Autocomplete
            value={{ itemId: selectedItemId }} // Set the value to the selected itemId
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Item ID" 
            error={!!errors.itemId} helperText={errors.itemId}/>}
            size='small'
          />
        </div>
      </div>
      
      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="date" className="flex-none w-32 text-black ">
          Date
        </InputLabel>
        <div>
          <TextField
            style={{ width: '300px' }}
            label="Date"
            name='date'
            value={date}
            size='small'
            // onChange={(e)=>onInputChange(e)}
            error={!!errors.date}
            helperText={errors.date}
            InputLabelProps={{ // To shrink the label
              shrink: true,
            }}
          />
        </div>
      </div>

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="reason" className="flex-none w-32 text-black ">
          Reason
        </InputLabel>
        <div className="flex-grow">
          <Select  value={reason} onChange={(e)=>onInputChange(e)} size='small' name='reason' 
            error={!!errors.reason}
            helperText={errors.reason}
            className="w-[300px] h-10  bg-white">
            <MenuItem value="Damaged Item">Damaged Item</MenuItem>
            <MenuItem value="Stolen Item">Stolen Item</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </Select>
          <Typography variant='caption' className='text-red-600'>{errors.reason}</Typography>
        </div>
      </div>

      <div className="flex col-span-4 col-start-1 ">
        <InputLabel
          htmlFor="description"
          className="flex-none w-32 mt-0 text-black"
        >
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
            onChange={(e)=>onInputChange(e)}
          />
        </div>
      </div>

      <div className="flex col-span-4 col-start-1 ">
        <InputLabel
          htmlFor="itemDetails"
          className="flex-none w-32 mt-0 text-black"
        >
          Item Details
        </InputLabel>
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650, border:2 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Item Details</TableCell>
                  <TableCell align="right">Quantity Available</TableCell>
                  <TableCell align="right">New Quantity</TableCell>
                  <TableCell align="right">Adjusted Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {/* item name */}
                  <TableCell component="th" scope="row">
                  {options.find(option => option.itemId === selectedItemId)?.itemName || 'Loading...'}
                  </TableCell>
                  {/* available Qty */}
                  <TableCell align="right">
                    {item.quantity}
                  </TableCell>
                  {/* new Qty */}
                  <TableCell align="right">
                    <TextField size='small' placeholder='Enter New Qty' type='Number' name='newQuantity' value={newQuantity} onChange={(e)=>onInputChange(e)} 
                      error={!!errors.newQuantity}
                      helperText={errors.newQuantity}></TextField>
                  </TableCell>
                  {/* adjusted Qty */}
                  <TableCell align="right">{adj.newQuantity - item.quantity}</TableCell>
                </TableRow>
              </TableBody>
              </Table>
          </TableContainer>
        </div>
      </div>

      <div className="flex-row col-span-10 col-start-1 ">
        <Typography display='block' gutterBottom>Attach File(s) to inventory adjustment </Typography>
        <input type='file' className="mt-4 mb-2"></input>
        <Typography variant='caption' display='block' gutterBottom>You can upload a maximum of 5 files, 5MB each</Typography>
      </div>

      
        <Button className="col-start-10 text-white bg-blue-600 rounded"
          variant='contained'
          type='submit'
        >submit</Button>
        <Button className="col-start-12 rounded"
          variant='outlined'
          onClick={() => navigate("/adjustment")}
        >cancel</Button>
    </form>
  );
};

export default NewAdjustment;
