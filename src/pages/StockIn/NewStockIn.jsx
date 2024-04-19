import React, { useState } from 'react';
import { FormControl, Select, MenuItem, TextField, Grid, Box, Typography, Button } from '@mui/material';
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
  
  //Add onChange event to the input fields
  const onInputChange=(e)=>{
    setStockIn({...stockIn,[e.target.name]:e.target.value});
  };

  const onSubmit=async(e)=>{
    e.preventDefault(); // To remove unwanted url tail part
    const result = await axios.post("http://localhost:8080/stock-in/add",stockIn) // To send data to the server
    console.log(result.data)
    navigate('/stockIn') // To navigate to the stockin page
  }

  // handle the onClick event of Submit button
  const handleClick = () => {
    Swal.fire({
      title: "Good Job!",
      text: "You Added a New Stock!",
      icon: "success"
    });
    
  }

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
              <TextField
                style={{ width: '300px' }}
                label="Item Name"
                type="search"
                name='itemName'
                size='small'  
                helperText='Please select the item name.'     
              />
            </Grid>
          </Grid>
          
          <Grid container display='flex' mt={4}>
            <Grid item sm={2} xs={2}>
              <Typography>Item ID</Typography>
            </Grid>
            <Grid item sm={9} xs={9}>
              <TextField
              style={{ width: '300px' }}
               label="Item ID" 
               name='itemId'
               size='small'
               value={itemId}
               onChange={(e)=>onInputChange(e)}
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
                <Select  value={location} onChange={(e)=>onInputChange(e)} size='small' name='location'>
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
              onClick={handleClick}
                >submit</Button>
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
