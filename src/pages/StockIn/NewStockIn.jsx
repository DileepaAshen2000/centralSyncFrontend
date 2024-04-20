import React, { useState , useEffect} from 'react';
import { FormControl, Select, MenuItem, TextField, Grid, Box, Typography, Button, Autocomplete } from '@mui/material';
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
    // e.preventDefault(); // To remove unwanted url tail part
    // const result = await axios.post("http://localhost:8080/stock-in/add",stockIn) // To send data to the server
    // console.log(result.data)
    // navigate('/stockIn') // To navigate to the stockin page

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
      Swal.fire({
        title: "Done !",
        text: "You submitted a stock-in!",
        icon: "success"
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to submit Stock-In. Please try again later.",
        icon: "error"
      });
    }
  }

  // handle the onClick event of Submit button
  // const handleClick = () => {
  //   Swal.fire({
  //     title: "Good Job!",
  //     text: "You Added a New Stock!",
  //     icon: "success"
  //   });
    
  // }

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
    <Box className='p-10 bg-white rounded-2xl ml-14 mr-14'>
      <Box className="pb-4">
        <h1 className="pt-2 pb-3 text-3xl font-bold ">New Stock-In</h1>
      </Box>
      <form onSubmit={(e)=> onSubmit(e)}>
        <Grid container spacing={2}  padding={4} >
          <Grid container display='flex'>
            <Grid item sm={2} xs={2}>
              <Typography>Group</Typography>
            </Grid>
            <Grid item sm={9} xs={9}>   
              <FormControl style={{ width: '300px' }}>
                <Select size='small' name='group'>
                  <MenuItem value="option1">Group 1</MenuItem>
                  <MenuItem value="option2">Group 2</MenuItem>
                  <MenuItem value="option3">Group 3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Grid container display='flex' mt={4}>
            <Grid item sm={2} xs={2}>
              <Typography>Item Name</Typography>
            </Grid>
            <Grid item sm={9} xs={9}>
              {/* <TextField
                style={{ width: '300px' }}
                label="Item Name"
                type="search"
                name='itemName'
                size='small'  
                helperText='Please select the item name.'     
              /> */}
                <Autocomplete
                  disablePortal
                  options={options} 
                  getOptionLabel={(option) => option.itemName}
                  onChange={handleItemChange}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Item Name"  helperText='Please select the item name.'/>}
                  size='small' 
                />
            </Grid>
          </Grid>
          
          <Grid container display='flex' mt={4}>
            <Grid item sm={2} xs={2}>
              <Typography>Item ID</Typography>
            </Grid>
            <Grid item sm={9} xs={9}>
              {/* <TextField
              style={{ width: '300px' }}
               label="Item ID" 
               name='itemId'
               size='small'
               value={itemId}
               onChange={(e)=>onInputChange(e)}
              /> */}

              <Autocomplete
                disabled
                options={[{ itemId: selectedItemId }]} // Provide the selected itemId as an option
                getOptionLabel={(option) => option.itemId} // Display itemId in the Autocomplete
                name='itemId' // Add name to the Autocomplete
                value={{ itemId: selectedItemId }} // Set the value to the selected itemId
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Item ID" error={!!errors.itemId}
                helperText={errors.itemId}/>}
                size='small'
              />
            </Grid>
          </Grid>
          
          <Grid container display='flex' mt={4}>
            <Grid item sm={2} xs={2}>
              <Typography>Date</Typography>
            </Grid>
            <Grid item sm={9} xs={9}>
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
            </Grid>
          </Grid>

          
          <Grid container display='flex' mt={4}>
            <Grid item sm={2} xs={2}>
              <Typography>Location</Typography>
            </Grid>
            <Grid item sm={9} xs={9}>
              <FormControl style={{ width: '300px' }}>
                <Select  value={location} onChange={(e)=>onInputChange(e)} size='small' name='location' 
                error={!!errors.location}
                helperText={errors.location}>
                  <MenuItem value="Store 01">Store 01</MenuItem>
                  <MenuItem value="Store 02">Store 02</MenuItem>
                  <MenuItem value="Store 03">Store 03</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container display='flex' mt={4}>
            <Grid item sm={2} xs={2}>
              <Typography>Quantity In</Typography>
            </Grid>
            <Grid item sm={9} xs={9}>
                <TextField 
                size='small' 
                placeholder='Enter Quantity In' 
                type='Number' 
                name='inQty' 
                value={inQty} 
                error={!!errors.inQty}
                helperText={errors.inQty}
                onChange={(e)=>onInputChange(e)}/>
                
            </Grid>
          </Grid>
          
          <Grid container display='flex' mt={4}>
            <Grid item sm={2} xs={2}>
              <Typography>Description</Typography>
            </Grid>
            <Grid item sm={9} xs={9}>
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
            </Grid>
          </Grid>
        </Grid>
        <Box>
          <Typography display='block' gutterBottom>Attach File(s) to inventory stock-in </Typography>
          <input type='file' className="mt-4 mb-2"></input>
          <Typography variant='caption' display='block' gutterBottom>You can upload a maximum of 5 files, 5MB each</Typography>
        </Box>
        <div className='flex gap-6 mt-6 ml-[70%]'>
            <Button className="px-6 py-2 text-white bg-blue-600 rounded"
               variant='contained'
               type='submit'
                >Stock In</Button>
            <Button className="px-6 py-2 rounded"
               variant='outlined'
               onClick={() => navigate("/stockIn")}
                >cancel</Button>
        </div>
      </form>
    </Box>
  );
};

export default NewStockIn;
