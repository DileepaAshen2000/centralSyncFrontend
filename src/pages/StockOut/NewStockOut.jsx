import React, { useState , useEffect} from 'react';
import { FormControl, Select, MenuItem, TextField, Grid, Box, Typography, Button, Autocomplete } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const NewStockOut = () => {

  let navigate = useNavigate();
  const [stockOut,setStockOut] = useState({  // create state for adjustment, initial state is empty with object.
    department:"",
    date:"",
    description:"",
    outQty:"",
    itemId:""
  })

  const{department,date,description,outQty,itemId} = stockOut; // Destructure the state

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
      setStockOut({ ...stockOut, itemId: value.itemId }); // Update the itemId in the adj state
    } else {
      setSelectedItemId(null);
      setStockOut({ ...stockOut, itemId: "" });
    }
    
  };
  
  //Add onChange event to the input fields
  const onInputChange=(e)=>{
    setStockOut({...stockOut,[e.target.name]:e.target.value});
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const onSubmit=async(e)=>{
    // e.preventDefault(); // To remove unwanted url tail part
    // const result = await axios.post("http://localhost:8080/stock-out/add",stockOut) // To send data to the server
    // console.log(result.data)
    // navigate('/stockOut') // To navigate to the stockin page

    e.preventDefault(); // To remove unwanted url tail part
    const validationErrors = validateInputs();
    console.log(Object.keys(validationErrors).length)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log('error');
      return;
    }

    try {
      // Your axios post request here
      const result = await axios.post("http://localhost:8080/stock-out/add",stockOut);
      console.log(result.data);
      Swal.fire({
        title: "Done !",
        text: "You submitted a Stock-Out!",
        icon: "success"
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to submit Stock-Out. Please try again later.",
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
    return errors;
  };
  
  return (
    <Box className='p-10 bg-white rounded-2xl ml-14 mr-14'>
      <Box className="pb-4">
        <h1 className="pt-2 pb-3 text-3xl font-bold ">New Stock-Out</h1>
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
                <Autocomplete
                  disablePortal
                  options={options} 
                  getOptionLabel={(option) => option.itemName}
                  onChange={handleItemChange}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Item Name"  helperText='Please select the Item Name.'/>}
                  size='small' 
                />
            </Grid>
          </Grid>
          
          <Grid container display='flex' mt={4}>
            <Grid item sm={2} xs={2}>
              <Typography>Item ID</Typography>
            </Grid>
            <Grid item sm={9} xs={9}> 
              <Autocomplete
                disabled
                options={[{ itemId: selectedItemId }]} // Provide the selected itemId as an option
                getOptionLabel={(option) => option.itemId} // Display itemId in the Autocomplete
                name='itemId' // Add name to the Autocomplete
                value={{ itemId: selectedItemId }} // Set the value to the selected itemId
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Item ID" 
                  error={!!errors.itemId}
                  helperText={errors.itemId} />}
                size='small'
              />
            </Grid>
          </Grid>

          <Grid container display='flex' mt={4}>
            <Grid item sm={2} xs={2}>
              <Typography>Department</Typography>
            </Grid>
            <Grid item sm={9} xs={9}>
              <FormControl style={{ width: '300px' }}>
                <Select  value={department} onChange={(e)=>onInputChange(e)} size='small' name='department'
                error={!!errors.department}
                helperText={errors.department}>
                  <MenuItem value="Department 01">Department 01</MenuItem>
                  <MenuItem value="Department 02">Department 02</MenuItem>
                  <MenuItem value="Department 03">Department 03</MenuItem>
                </Select>
              </FormControl>
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
              <Typography>Quantity Out</Typography>
            </Grid>
            <Grid item sm={9} xs={9}>
                <TextField 
                size='small' 
                placeholder='Enter Quantity Out' 
                type='Number' 
                name='outQty' 
                value={outQty} 
                error={!!errors.outQty}
                helperText={errors.outQty}
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
                >Stock Out</Button>
            <Button className="px-6 py-2 rounded"
               variant='outlined'
               onClick={() => navigate("/stockOut")}
                >cancel</Button>
        </div>
      </form>
    </Box>
  );
};

export default NewStockOut;
