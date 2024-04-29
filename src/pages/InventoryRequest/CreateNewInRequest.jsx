import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControl, Select, MenuItem, TextField, Grid, Box, Typography, Button } from '@mui/material';



const NewRequest = () => { // Declaring NewRequest component
  // State variables to manage form inputs
  const [itemId, setItemID] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [employeeName, setEmpName] = useState("");
  const [employeeID, setEmpID] = useState("");
  const [department, setDepartment] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  // Function to handle form submission
  const handleClick = (e) => {
    e.preventDefault();
    const inventoryRequest = {
      itemId,
      itemName,
      quantity,
      date,
      reason,
      description,
      employeeName,
      employeeID,
      department,
    };
    console.log(inventoryRequest);

    // Sending POST request to backend with form data
    fetch("http://localhost:8080/request/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inventoryRequest),
    }).then((response) => {
      if (response.ok) {
        console.log("New inventory request added");
      } else {
        response.json().then(errors => {
          setErrors(errors);
        });
      }
    });
  };


  return (
    <Box className='p-10 bg-white rounded-2xl ml-14 mr-14'>
      <Box className="pb-4">
        <h1 className="pt-2 pb-3 text-3xl font-bold ">New Request</h1>
      </Box>

      <>
        {/* Form for input fields */}
        <form>
          <Grid container spacing={2} padding={4} >

            {/* Input fields for Item ID and Employee Name */}
            <Grid container display='flex' mt={4}>
              <Grid item sm={1.5}>
                <Typography>Item ID</Typography>
              </Grid>
              <Grid item sm={4.5}>
                {errors.itemId && <div className="text-[#FC0000] text-sm">{errors.itemId}</div>}
                <TextField
                  id='iid'
                  value={itemId}
                  style={{ width: '300px' }}
                  onChange={(e) => setItemID(e.target.value)}
                  name='itemId'
                  size='small'
                />
              </Grid>

              <Grid item sm={1.5}>
                <Typography>Emp. Name</Typography>
              </Grid>
              <Grid item sm={4.5}>
                {errors.employeeName && <div className="text-[#FC0000] text-sm">{errors.employeeName}</div>}
                <TextField
                  id='empN'
                  value={employeeName}
                  style={{ width: '300px' }}
                  onChange={(e) => setEmpName(e.target.value)}
                  name='empName'
                  size='small'
                />
              </Grid>

            </Grid>

            {/* Input fields for Item Name and Emp.ID */}
            <Grid container display='flex' mt={4}>

              <Grid item sm={1.5}>
                <Typography>Item Name</Typography>
              </Grid>
              <Grid item sm={4.5}>
                {errors.itemName && <div className="text-[#FC0000] text-sm">{errors.itemName}</div>}
                <TextField
                  id='iName'
                  value={itemName}
                  style={{ width: '300px' }}
                  name='itemName'
                  size='small'
                  onChange={(e) => setItemName(e.target.value)}
                />
              </Grid>

              <Grid item sm={1.5}>
                <Typography>Emp.ID</Typography>
              </Grid>
              <Grid item sm={4.5}>
                {errors.employeeID && <div className="text-[#FC0000] text-sm">{errors.employeeID}</div>}
                <TextField
                  id='eid'
                  value={employeeID}
                  style={{ width: '300px' }}
                  name='empID'
                  size='small'
                  onChange={(e) => setEmpID(e.target.value)}
                />
              </Grid>

            </Grid>

            {/* Input fields for Quantity and Department */}
            <Grid container display='flex' mt={4}>

              <Grid item sm={1.5}>
                <Typography>Quantity</Typography>
              </Grid>
              <Grid item sm={4.5}>
                {errors.quantity && <div className="text-[#FC0000] text-sm">{errors.quantity}</div>}
                <TextField
                  id='quan'
                  value={quantity}
                  style={{ width: '300px' }}
                  onChange={(e) => setQuantity(e.target.value)}
                  name='quantity'
                  size='small'
                />
              </Grid>

              <Grid item sm={1.5}>
                <Typography>Department</Typography>
              </Grid>
              <Grid item sm={4.5}>
                {errors.department && <div className="text-[#FC0000] text-sm">{errors.department}</div>}
                <FormControl style={{ width: '300px' }}>
                  <Select value={department} onChange={(e) => setDepartment(e.target.value)} size='small' name='department'>
                    <MenuItem value="finance">Finance Department</MenuItem>
                    <MenuItem value="logistic">Logistic Department</MenuItem>
                    <MenuItem value="software">Software Department</MenuItem>
                    <MenuItem value="ai">AI Department</MenuItem>
                    <MenuItem value="health">Health Care Department</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

            </Grid>

            {/* Input fields for Date*/}
            <Grid container display='flex' mt={4}>

              <Grid item sm={1.5}>
                <Typography>Date</Typography>
              </Grid>
              <Grid item sm={4.5}>
                {errors.date && <div className="text-[#FC0000] text-sm">{errors.date}</div>}
                <TextField
                  id='dt'
                  style={{ width: '300px' }}
                  name='date'
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  size='small'
                />
              </Grid>
            </Grid>

            {/* Input fields Reason */}
            <Grid container display='flex' mt={4}>
              <Grid item sm={1.5}>
                <Typography>Reason</Typography>
              </Grid>
              <Grid item sm={4.5}>
                {errors.reason && <div className="text-[#FC0000] text-sm">{errors.reason}</div>}
                <TextField
                  id='reason'
                  value={reason}
                  style={{ width: '300px' }}
                  onChange={(e) => setReason(e.target.value)}
                  name='reason'
                  size='small'
                />
              </Grid>
            </Grid>

            {/* Input fields Description */}
            <Grid container display='flex' mt={4}>
              <Grid item sm={1.5}>
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
                  onChange={(e) => setDescription(e.target.value)
                  }
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Attach file section */}
          <Box>
            <Typography display='block' gutterBottom>Attach File(s) to inventory adjustment </Typography>
            <input type='file' className="mt-4 mb-2" ></input>
            <Typography variant='caption' display='block' gutterBottom>You can upload a maximum of 5 files, 5MB each</Typography>
          </Box>

          {/* Submit and Cancel buttons */}
          <div className='flex gap-6 mt-6 ml-[70%]'>

            <Button className="px-6 py-2 text-white bg-blue-600 rounded"
              variant='contained'
              type='submit'
              onClick={handleClick}
            >submit
            </Button>

            <Button className="px-6 py-2 rounded"
              variant='outlined'
              onClick={() => navigate("/inventory-request")}
            >cancel
            </Button>
          </div>
        </form>
      </>
    </Box>
  );
};

export default NewRequest;
