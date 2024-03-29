import React, { useEffect, useState } from 'react';
import { FormControl, Select, MenuItem, TextField, Grid, Box, Typography, Button } from '@mui/material';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24)
];

const EditAdjustment = () => {

  let navigate = useNavigate();

  const {adjId} = useParams(); // To get the id from the url
  const [adj,setAdj] = useState({  // create state for adjustment, initial state is empty with object.
    reason:"",
    date:"",
    description:"",
    newQuantity:"",
    name:"",
    group:""
  })

  const{reason,date,description,newQuantity,name,group} = adj;
  
  //Add onChange event to the input fields
  const onInputChange=(e)=>{
    setAdj({...adj,[e.target.name]:e.target.value});
  };

  useEffect(() => {
    loadAdjustment();
  },[]);

  const onSubmit=async(e)=>{
    e.preventDefault(); // To remove unwanted url tail part
    await axios.put(`http://localhost:8080/adjustment/updateById/${adjId}`,adj); // To send data to the server
    console.log(adj);
    navigate('/adjustment');
  };

  const loadAdjustment = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/adjustment/getById/${adjId}`);
      setAdj(result.data);  // Make sure the fetched data structure matches the structure of your state
    } catch (error) {
      console.error('Error loading adjustment:', error);
    }
  }

  return (
    <Box className='p-10 bg-white rounded-2xl ml-14 mr-14'>
      <Box className="pb-4">
        <h1 className="pt-2 pb-3 text-3xl font-bold ">Edit Adjustment</h1>
      </Box>
      <form onSubmit={(e)=> onSubmit(e)}>
        <Grid container spacing={2}  padding={4} >

            <Grid container display='flex' mt={4}>
                <Grid item sm={2} xs={2}>
                    <Typography>Adjustment ID</Typography>
                </Grid>
                <Grid item sm={9} xs={9}>
                    <TextField
                    style={{ width: '300px' }}
                    name='id'
                    label='Adjustment ID'
                    size='small'
                    value={adjId}
                    onChange={(e)=>onInputChange(e)}
                    InputProps={{
                        readOnly: true,
                      }}
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
                    name='id'
                    label='Item ID'
                    size='small'
                    
                    onChange={(e)=>onInputChange(e)}
                    InputProps={{
                        readOnly: true,
                      }}
                    />
                </Grid>
            </Grid>

            <Grid container display='flex' mt={4}>
                <Grid item sm={2} xs={2}>
                    <Typography>Item Name</Typography>
                </Grid>
                <Grid item sm={9} xs={9}>
                <TextField
                    style={{ width: '300px' }}
                    name='name'
                    label='Item Name'
                    size='small'
                    value={name}
                    onChange={(e)=>onInputChange(e)}
                    InputProps={{
                        readOnly: true,
                      }}
                    />
                </Grid>
            </Grid>

            <Grid container display='flex' mt={4}>
                <Grid item sm={2} xs={2}>
                    <Typography>Group</Typography>
                </Grid>
                <Grid item sm={9} xs={9}>
                    <TextField
                        style={{ width: '300px' }}
                        label='Group'
                        value={group}
                        onChange={(e)=>onInputChange(e)}
                        name='group'
                        size='small' 
                        InputProps={{
                            readOnly: true,
                          }}
                    />
                </Grid>
            </Grid>
          
          {/* <Grid container display='flex'mt={4}>
            <Grid item sm={2} xs={2}>
              <Typography>Group</Typography>
            </Grid>
            <Grid item sm={9} xs={9}>
              <FormControl style={{ width: '300px' }}>
                <Select size='small' name='group'>
                  <MenuItem value="option1">Option 1</MenuItem>
                  <MenuItem value="option2">Option 2</MenuItem>
                  <MenuItem value="option3">Option 3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid> */}
          
          
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
                <Select value={reason} onChange={(e)=>onInputChange(e)} size='small' name='reason'>
                  <MenuItem value="reason1">Reason 1</MenuItem>
                  <MenuItem value="reason2">Reason 2</MenuItem>
                  <MenuItem value="reason3">Reason 3</MenuItem>
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
                // id="outlined-multiline-static"
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
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.calories}</TableCell>
                      <TableCell align="right"><TextField size='small' placeholder='Enter New Qty' type='Number' name='newQuantity' value={newQuantity} onChange={(e)=>onInputChange(e)}></TextField></TableCell>
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
          <input type='file' className="mt-4 mb-2" ></input>
          <Typography variant='caption' display='block' gutterBottom>You can upload a maximum of 5 files, 5MB each</Typography>
        </Box>
        <div className='flex gap-6 mt-6 ml-[70%]'>
            <Button className="px-6 py-2 text-white bg-blue-600 rounded"
               variant='contained'
               type='submit'
                >edit & submit</Button>

            <Button className="px-6 py-2 rounded"
               variant='outlined'
               onClick={() => navigate("/adjustment")}
                >cancel</Button>
        </div>
      </form>
    </Box>
  );
};

export default EditAdjustment;
