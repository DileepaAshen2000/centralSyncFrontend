import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControl, Select, MenuItem, TextField, Grid, Box, Typography, Button } from '@mui/material';



const NewRequest = () => { // Declaring NewRequest component
  // State variables to manage form inputs
  //const [itemId, setItemID] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  //const [employeeName, setEmpName] = useState("");
  //const [employeeID, setEmpID] = useState("");
  //const [department, setDepartment] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  // Function to handle form submission
  const handleClick = (e) => {
    e.preventDefault();
    const inventoryRequest = {
     // itemId,
      itemName,
      quantity,
      reason,
      description,
      //employeeName,
     // employeeID,
      //department,
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

  // const handleFileChange = (e) => {
  //   set({ ...adj, file: e.target.files[0] });
  // };
  return (
    <Box className='p-10 bg-white rounded-2xl ml-14 mr-14'>
      <Box className="pb-4">
        <h1 className="pt-2 pb-3 text-3xl font-bold ">New Request</h1>
      </Box>

      <>
        {/* Form for input fields */}
        <form>
          <Grid container spacing={2} padding={4} >

           

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
            <Typography display='block' gutterBottom>Attach File(s) to inventory request  </Typography>
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
