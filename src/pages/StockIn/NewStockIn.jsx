import React, { useState , useEffect} from 'react';
import { FormControl, Select, MenuItem, TextField, InputLabel, Typography, Button, Autocomplete } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const NewStockIn = () => {

  let navigate = useNavigate();
  const [stockIn,setStockIn] = useState({  // create state for adjustment, initial state is empty with object.
    location:"",
    date:"",
    description:"",
    inQty:"",
    itemId:""
  })

  const{location,date,description,inQty,itemId} = stockIn; // Destructure the state

  // item fetching
  const [options, setOptions] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/inventory-item/getAll');
        setOptions(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  const handleItemChange = (event, value) => {
    if (value) {
      setSelectedItemId(value.itemId);
      setStockIn({ ...stockIn, itemId: value.itemId }); // Update the itemId in the adj state
      // fetchItemDetails(value.itemId);
    } else {
      setSelectedItemId(null);
      setStockIn({ ...stockIn, itemId: "" });
    }
    
  };
  
  //Add onChange event to the input fields
  const onInputChange=(e)=>{
    setStockIn({...stockIn,[e.target.name]:e.target.value});
    setErrors({ ...errors, [e.target.name]: '' }); 
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
      const result = await axios.post("http://localhost:8080/stock-in/add",stockIn);
      console.log(result.data);
      navigate('/stockIn') // To navigate to the stockin page
      Swal.fire({
        title: "Done !",
        text: "Stock-In Successfully Submitted!",
        icon: "success"
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to submit Stock-In. Please try again.",
        icon: "error"
      });
    }
  }

  const validateInputs = () => {
    const errors = {};
    if (!location) {
      errors.location = 'Location is required';
    }
    if (!date) {
      errors.date = 'Date is required';
    }
    if (!inQty) {
      errors.inQty = 'Quantity In is required';
    }
    return errors;
  };

  return (
      <form onSubmit={(e)=> onSubmit(e)} className="grid grid-cols-8 p-10 bg-white gap-y-10 rounded-2xl ml-14 mr-14">
          <h1 className="col-span-4 pt-2 text-3xl font-bold ">New Stock-In</h1>
        
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
                  renderInput={(params) => <TextField {...params} label="Item Name"  helperText='Please select the item name.'/>}
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
                options={[{ itemId: selectedItemId }]} // Provide the selected itemId as an option
                getOptionLabel={(option) => option.itemId} // Display itemId in the Autocomplete
                name='itemId' // Add name to the Autocomplete
                value={{ itemId: selectedItemId }} // Set the value to the selected itemId
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Item ID" 
                error={!!errors.itemId}
                helperText={errors.itemId}/>}
                size='small'
              />
              <Typography variant='caption' className='text-red-600'>{errors.itemId}</Typography>
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
                type="date"
                value={date}
                onChange={(e)=>onInputChange(e)}
                size='small'
                error={!!errors.date}
                helperText={errors.date}
                InputLabelProps={{ // To shrink the label
                  shrink: true,
                }}
              />
            </div>
          </div>
      
          <div className="flex items-center col-span-4 col-start-1">
            <InputLabel htmlFor="name" className="flex-none w-32 text-black ">
              Location
            </InputLabel>
            <div>
              <FormControl style={{ width: '300px' }}>
                <Select  value={location} onChange={(e)=>onInputChange(e)} size='small' name='location' 
                error={!!errors.location}
                helperText={errors.location}>
                  <MenuItem value="Store A">Store A</MenuItem>
                  <MenuItem value="Store B">Store B</MenuItem>
                  <MenuItem value="Store C">Store C</MenuItem>
                </Select>
                <Typography variant='caption' className='text-red-600'>{errors.location}</Typography>
              </FormControl>
            </div>
            
          </div>

          <div className="flex items-center col-span-4 col-start-1">
            <InputLabel htmlFor="name" className="flex-none w-32 text-black ">
              Quantity In
            </InputLabel>
            <div>
                <TextField 
                  size='small' 
                  placeholder='Enter Quantity In' 
                  type='Number' 
                  name='inQty' 
                  value={inQty} 
                  error={!!errors.inQty}
                  helperText={errors.inQty}
                  onChange={(e)=>onInputChange(e)}/>      
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
                onChange={(e)=>onInputChange(e)}
              />
            </div>
          </div>
        
        <div className="flex-row col-span-10 col-start-1 ">
          <Typography display='block' gutterBottom>Attach File(s) to inventory stock-in </Typography>
          <input type='file' className="mt-4 mb-2"></input>
          <Typography variant='caption' display='block' gutterBottom>You can upload a maximum of 5 files, 5MB each</Typography>
        </div>
        
        <div className='flex col-start-7 gap-6'>
          <Button className="text-white bg-blue-600 rounded "
            variant='contained'
            type='submit'
              >Submit</Button>
          <Button className="rounded"
            variant='outlined'
            onClick={() => navigate("/stockIn")}
              >cancel</Button>
        </div>
      </form>
  );
};

export default NewStockIn;
