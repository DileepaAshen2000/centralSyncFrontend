import React, { useState } from 'react';
import { FormControl, Select, MenuItem, TextField, Grid, Box, Typography, Button } from '@mui/material';
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

function createData(name, calories, fat, carbs) {
  return { name, calories, fat, carbs };
}

const rows = [
  createData('Computer SSD HD', 159, 6.0, 24)
];

const NewAdjustment = () => {

  let navigate = useNavigate();
  const [adj,setAdj] = useState({  // create state for adjustment, initial state is empty with object.
    reason:"",
    date:"",
    description:"",
    newQuantity:"",
    itemId:""
  })

  const{reason,date,description,newQuantity,itemId} = adj; // Destructure the state
  
  //Add onChange event to the input fields
  const onInputChange=(e)=>{
    setAdj({...adj,[e.target.name]:e.target.value});
  };

  const onSubmit=async(e)=>{
    e.preventDefault(); // To remove unwanted url tail part
    const result = await axios.post("http://localhost:8080/adjustment/add",adj) // To send data to the server
    console.log(result.data)
    navigate('/adjustment') // To navigate to the adjustment page
  }

  // handle the onClick event of Submit button
  const handleClick = () => {
    Swal.fire({
      title: "Good Job!",
      text: "You submitted the Adjustment!",
      icon: "success"
    });
    
  }

  return (
    <Box className='p-10 bg-white rounded-2xl ml-14 mr-14'>
      <Box className="pb-4">
        <h1 className="pt-2 pb-3 text-3xl font-bold ">New Adjustment</h1>
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
              <Typography>Reason</Typography>
            </Grid>
            <Grid item sm={9} xs={9}>
              <FormControl style={{ width: '300px' }}>
                <Select  value={reason} onChange={(e)=>onInputChange(e)} size='small' name='reason'>
                  <MenuItem value="reason1">Damaged Item</MenuItem>
                  <MenuItem value="reason2">Stolen Item</MenuItem>
                  <MenuItem value="reason3">Others</MenuItem>
                </Select>
              </FormControl>
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

          <Box mt={4} className='pl-44'>
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
                  {rows.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      {/* item name */}
                      <TableCell component="th" scope="row">
                        {row.name}  
                      </TableCell>
                      {/* available Qty */}
                      <TableCell align="right">{row.calories}</TableCell>
                      {/* new Qty */}
                      <TableCell align="right">
                        <TextField size='small' placeholder='Enter New Qty' type='Number' name='newQuantity' value={newQuantity} onChange={(e)=>onInputChange(e)}></TextField>
                      </TableCell>
                      {/* adjust Qty */}
                      <TableCell align="right">{row.carbs}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
        <Box>
          <Typography display='block' gutterBottom>Attach File(s) to inventory adjustment </Typography>
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
               onClick={() => navigate("/adjustment")}
                >cancel</Button>
        </div>
      </form>
    </Box>
  );
};

export default NewAdjustment;
