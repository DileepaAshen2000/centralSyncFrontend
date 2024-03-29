import React, { useEffect,useState } from 'react';
import { useParams} from "react-router-dom";
import { FormControl, Select, MenuItem, TextField, Grid, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from "axios";



const EditInventoryRequest = () => {
  const { ID } = useParams();
  const [isEditable, setIsEditable] = useState(true);
    const [itemName, setItemName] = useState("select an item group");
    const [quantity, setQuantity] = useState("");
    const [date, setDate] = useState("");
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [empName, setEmpName] = useState("");
    const [empID, setEmpID] = useState("");
    const [department, setDepartment] = useState("");
  


  
    const navigate = useNavigate();
  
    useEffect(() => {
      axios
        .get("http://localhost:8080/request/getById/" + ID)
        .then((response) => {
          const data = {
            itemName: response.data.itemName,
            quantity: response.data.quantity,
            date:response.data.date,
            reason: response.data.reason,
            discription: response.data.discription,
            empName: response.data.empName,
            empID: response.data.empID,
            department: response.data.department,
          };
  
          setItemName(data.itemName);
          setQuantity(data.quantity);
          setDate(data.date);
          setReason(data.reason);
          setDescription(data.discription);
          setEmpName(data.empName);
          setEmpID(data.empID);
          setDepartment(data.department);
         
        })
        .catch((error) => {
          console.log(error);
        });
    }, [ID]);
 
    const handleEdit = () => {
      console.log("Edit button clicked");
      setIsEditable(!isEditable);
      console.log(isEditable);
    };
    const handleSave = () => {
      const inventoryRequest = {
        itemName,
        quantity,
        date,
        reason,
        description,
        empName,
        empID,
        department,
      };
  
      axios
        .put("http://localhost:8080/request/updateById/" + ID, inventoryRequest)
        .then(() => {
          console.log("Successfully updated");
          navigate("/inventory-request");
        })
        .catch((error) => {
          console.log(error);
        });
  
      
    };
  


  return (
    <form req>
    <Box className='p-10 bg-white rounded-2xl ml-14 mr-14'>
      <Box className="pb-4">
        <h1 className="pt-2 pb-3 text-3xl font-bold ">Edit Request</h1>
      </Box>
     


        <Grid container spacing={2} padding={4} >

            <Grid container display='flex' mt={4}>
            <Grid item sm={1.5}>
              <Typography>Item ID</Typography>
            </Grid>
            <Grid item sm={4.5}>
              <TextField
               style={{ width: '300px' }}
          value={ID}
          id="id"
          size='small'
              />
            </Grid>

            <Grid item sm={1.5}>
                <Typography>Emp. Name</Typography>
                </Grid>
                <Grid item sm={4.5}>
                <TextField
                id='empN'
                value={empName}
                  style={{ width: '300px' }}
                 onChange={(e) => setEmpName(e.target.value)}
                  size='small'
                /> 
               </Grid>
            </Grid>
           
          
          <Grid container display='flex' mt={4}>
          <Grid item sm={1.5}>
              <Typography>Item Name</Typography>
         </Grid>
         <Grid item sm={4.5}>
              <TextField
              id='iName'
              value={itemName}
                style={{ width: '300px' }}
                name='id'
                size='small'
                onChange={(e) => setItemName(e.target.value)}
              />
          </Grid>

          <Grid item sm={1.5}>
              <Typography>Emp.ID</Typography>
         </Grid>
         <Grid item sm={4.5}>
              <TextField
                id='eid'
                value={empID}
                style={{ width: '300px' }}
                name='id'
                size='small'
                onChange={(e) => setEmpID(e.target.value)}
              />
          </Grid>
          </Grid>

          

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




   

          <Grid container display='flex' mt={4}>
            <Grid item sm={1.5}>
              <Typography>Date</Typography>
            </Grid>
            <Grid item sm={4.5}>
              <TextField
               id='dt'
                style={{ width: '300px' }}
                name='date'
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                size='small'
                InputLabelProps={{ // To shrink the label
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>

          <Grid container display='flex' mt={4}>
            <Grid item sm={1.5}>
              <Typography>Reason</Typography>
            </Grid>
           
              <Grid item sm={4.5}>
                <FormControl style={{ width: '300px' }}>
                  <Select value={reason} onChange={(e) => setReason(e.target.value)} size='small' name='reason'>
                    <MenuItem value="reason1">Reason 1</MenuItem>
                    <MenuItem value="reason2">Reason 2</MenuItem>
                    <MenuItem value="reason3">Reason 3</MenuItem>
                  </Select>
                </FormControl>
             
            </Grid>
          </Grid>






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
        <Box>
          <Typography display='block' gutterBottom>Attach File(s) to inventory adjustment </Typography>
          <input type='file' className="mt-4 mb-2" ></input>
          <Typography variant='caption' display='block' gutterBottom>You can upload a maximum of 5 files, 5MB each</Typography>
        </Box>
        <div className='flex gap-6 mt-6 ml-[70%]'>
          <Button className="px-6 py-2 text-white bg-blue-600 rounded"
            variant='contained'
            type='submit'
            onClick={handleSave}
          >submit</Button>

          <Button className="px-6 py-2 rounded"
            variant='outlined'
            onClick={() => navigate("/inventory-request")}
          >cancel</Button>
        </div>
   
    </Box>
    </form>
  );
};

export default EditInventoryRequest;
