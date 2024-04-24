import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Grid, Box, Typography, Button } from '@mui/material';
import axios from "axios";



const EditInventoryRequest = () => {
  // Define state variables to hold form data
  const [itemId, setItemId] = useState("")
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [employeeName, setEmpName] = useState("");
  const [employeeID, setemployeeID] = useState("");
  const [department, setDepartment] = useState("");

  // Get the request ID from the URL params
  const { reqId } = useParams();

  // Initialize navigate function from react-router-dom
  const navigate = useNavigate();

  // Fetch the request data from the backend
  useEffect(() => {
    axios
      .get(`http://localhost:8080/request/getById/${reqId}`)
      .then((response) => {
        //Extract the data from the response and set the state variables
        const data = {
          id: response.data.id,
          itemId: response.data.itemId,
          itemName: response.data.itemName,
          quantity: response.data.quantity,
          date: response.data.date,
          reason: response.data.reason,
          description: response.data.description,
          employeeName: response.data.employeeName,
          employeeID: response.data.employeeID,
          department: response.data.department,
        };
        setItemId(data.itemId);
        setItemName(data.itemName);
        setQuantity(data.quantity);
        setDate(data.date);
        setReason(data.reason);
        setDescription(data.description);
        setEmpName(data.employeeName);
        setemployeeID(data.employeeID);
        setDepartment(data.department);

      })
      .catch((error) => {
        console.log(error);
      });
  }, [reqId]);

  // Function to handle form submission and update request
  const handleSave = (e) => {
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

    axios
      .put(`http://localhost:8080/request/updateById/${reqId}`, inventoryRequest)
      .then(() => {
        console.log("Successfully updated");
      })
      .catch((error) => {
        console.log(error);
      });
  };


  return (
    <>
      <form inRequest>
        <Box className='p-10 bg-white rounded-2xl ml-14 mr-14'>
          <Box className="pb-4">
            <h1 className="pt-2 pb-3 text-3xl font-bold ">Edit Request</h1>
          </Box>
          {/* Inputs for InRequest ID and Employee Name */}
          <Grid container spacing={2} padding={4} >

            <Grid container display='flex' mt={4}>
              <Grid item sm={1.5}>
                <Typography>InRequest ID</Typography>
              </Grid>
              <Grid item sm={4.5}>
                <TextField
                  size='small'
                  style={{ width: '300px' }}
                  inputProps={{
                    readOnly: true,
                    style: { color: 'gray' },
                  }}
                  value={reqId}
                />
              </Grid>

              <Grid item sm={1.5}>
                <Typography>Emp. Name</Typography>
              </Grid>
              <Grid item sm={4.5}>
                <TextField
                  size='small'
                  style={{ width: '300px' }}
                  inputProps={{
                    readOnly: true,
                    style: { color: 'gray' },
                  }}
                  value={employeeName}
                  onChange={(e) => setEmpName(e.target.value)}
                />
              </Grid>
            </Grid>

            {/* Inputs for Item and Emp.ID*/}
            <Grid container display='flex' mt={4}>
              <Grid item sm={1.5}>
                <Typography>Item Name</Typography>
              </Grid>
              <Grid item sm={4.5}>
                <TextField
                  size='small'
                  style={{ width: '300px' }}
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </Grid>

              <Grid item sm={1.5}>
                <Typography>Emp.ID</Typography>
              </Grid>
              <Grid item sm={4.5}>
                <TextField
                  size='small'
                  style={{ width: '300px' }}
                  value={employeeID}
                  onChange={(e) => setemployeeID(e.target.value)}
                />
              </Grid>
            </Grid>


            {/* Inputs for Quantity and Department*/}
            <Grid container display='flex' mt={4}>

              <Grid item sm={1.5}>
                <Typography>Quantity</Typography>
              </Grid>
              <Grid item sm={4.5}>
                <TextField
                  id='quan'
                  value={quantity}
                  style={{ width: '300px' }}
                  onChange={(e) => setQuantity(e.target.value)}
                  name='id'
                  size='small'
                />
              </Grid>

              <Grid item sm={1.5}>
                <Typography>Department</Typography>
              </Grid>
              <Grid item sm={4.5}>
                <TextField
                  id='dep'
                  value={department}
                  style={{ width: '300px' }}
                  name='id'
                  size='small'
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </Grid>

            </Grid>

            {/* Inputs for Date*/}
            <Grid container display='flex' mt={4}>
              <Grid item sm={1.5}>
                <Typography>Date</Typography>
              </Grid>
              <Grid item sm={4.5}>
                <TextField
                  style={{ width: '300px' }}
                  type='date'
                  size='small'
                  InputLabelProps= // To shrink the label
                  {{ shrink: true }}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Grid>
            </Grid>
            {/* Inputs for Reason*/}
            <Grid container display='flex' mt={4}>
              <Grid item sm={1.5}>
                <Typography>Reason</Typography>
              </Grid>
              <Grid item sm={4.5}>
                <TextField
                  size='small'
                  value={reason}
                  style={{ width: '300px' }}
                  onChange={(e) => setReason(e.target.value)}
                />
              </Grid>
            </Grid>

            {/* Inputs for Description*/}
            <Grid container display='flex' mt={4}>
              <Grid item sm={1.5}>
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
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Attach File(s) to inventory request */}
          <Box>
            <Typography display='block' gutterBottom>Attach File(s) to inventory Request </Typography>
            <input type='file' className="mt-4 mb-2" ></input>
            <Typography variant='caption' display='block' gutterBottom>You can upload a maximum of 5 files, 5MB each</Typography>
          </Box>

          {/* Save and Cancel buttons */}
          <div className='flex gap-6 mt-6 ml-[70%]'>

            <Button className="px-6 py-2 text-white bg-blue-600 rounded"
              variant='contained'
              type='submit'
              onClick={handleSave}
            >Save</Button>

            <Button className="px-6 py-2 rounded"
              variant='outlined'
              onClick={() => navigate("/inventory-request")}
            >cancel</Button>
          </div>

        </Box>
      </form>
    </>
  );
};
export default EditInventoryRequest;
