import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Autocomplete,
  Box,
  MenuItem,
  Select,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const EditTicket = () => {
  const { ID } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [itemId, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [brand, setBrand] = useState("");
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState([]);
  const [fetchData, setFetchData] = useState(false);

  // Fetch options for the Autocomplete
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get("http://localhost:8080/inventory-item/getAll");
        setOptions(response.data);
        console.log("Options fetched: ", response.data);
      } catch (error) {
        console.error("Error fetching item data:", error);
      }
    };
    fetchOptions();
  }, []);

  // Fetch ticket details
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/ticket/tickets/${ID}`);
        const { topic, description, date, itemId } = response.data;
        setTopic(topic);
        setDescription(description);
        setDate(date);
        setItemId(itemId);
      } catch (error) {
        console.error("Error fetching ticket details:", error);
      }
    };

    fetchTicketDetails();
  }, [ID]);

  // Update itemName and brand when itemId changes
  useEffect(() => {
    if (itemId) {
      const selectedItem = options.find((option) => option.id === itemId);
      if (selectedItem) {
        setItemName(selectedItem.itemName);
        setBrand(selectedItem.brand);
      }
    }
  }, [itemId, options]);

  // Handle item selection
  const handleItemChange = (event, value) => {
    if (value) {
      console.log("Selected item: ", value);
      setItemId(value.id);
      setItemName(value.itemName);
      setBrand(value.brand);
    } else {
      setItemId("");
      setItemName("");
      setBrand("");
    }
  };

  // Handle form submission
  const handleClick = async (e) => {
    e.preventDefault();
    const ticket = {
      topic,
      description,
      date,
      itemName,
      brand,
      itemId
    };

    try {
      const response = await axios.put(`http://localhost:8080/ticket/update/${ID}`, ticket);
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Ticket successfully updated!",
        });
        setFetchData(!fetchData);
        navigate("/ticket", { fetchData });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update Ticket. Please check your inputs.",
      });
      if (error.response) {
        setErrors(error.response.data);
      }
    }
  };

  return (
    <form className="grid grid-cols-8 p-10 bg-white gap-y-10 rounded-2xl ml-14 mr-14" onSubmit={(e)=> onSubmit(e)}>
      <h1 className="col-span-4 pt-2 text-3xl font-bold ">Edit Adjustment</h1>

      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="adjId" className="flex-none w-32 text-black ">
          Adjustment ID
        </InputLabel>
        <div>
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
        </div>
      </div>
      
      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="itemId" className="flex-none w-32 text-black ">
          Item ID
        </InputLabel>
        <div>
          <TextField
            style={{ width: '300px' }}
            name='itemId'
            label='Item ID'
            size='small'
            value={itemId}
            onChange={(e)=>onInputChange(e)}
            error={!!errors.itemId}
            helperText={errors.itemId}
            InputProps={{
                readOnly: true,
            }} 
          />
        </div>
      </div>
      
      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="date" className="flex-none w-32 text-black ">
          Item Name
        </InputLabel>
        <div>
          <TextField
            style={{ width: '300px' }}
            name='name'
            label='Item Name'
            size='small'
            value={itemName}
            onChange={(e)=>onInputChange(e)}
            InputProps={{
                readOnly: true,
            }}
          />
        </div>
      </div>
      
      <div className="flex items-center col-span-4 col-start-1">
        <InputLabel htmlFor="date" className="flex-none w-32 text-black ">
          Date
        </InputLabel>
        <div>
        <TextField
          style={{ width: '300px' }}
          label="Date"
          name='date'
          value={date}
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
        <InputLabel htmlFor="reason" className="flex-none w-32 text-black ">
          Reason
        </InputLabel>
        <div className="flex-grow">
          <Select value={reason} onChange={(e)=>onInputChange(e)} size='small' name='reason'
            error={!!errors.reason}
            helperText={errors.reason}
            className="w-[300px] h-10 bg-white">
            <MenuItem value="Damaged Item">Damaged Item</MenuItem>
            <MenuItem value="Stolen Item">Stolen Item</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </Select>
        </div>
      </div>

      <div className="flex col-span-4 col-start-1 ">
        <InputLabel
          htmlFor="description"
          className="flex-none w-32 mt-0 text-black"
        >
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

      <div className="flex col-span-4 col-start-1 ">
        <InputLabel
          htmlFor="description"
          className="flex-none w-32 mt-0 text-black"
        >
          Item Details
        </InputLabel>
        <div>
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
                <TableRow>
                    <TableCell component="th" scope="row">
                      {itemName}
                    </TableCell>
                    <TableCell align="right">{quantity}</TableCell>
                    <TableCell align="right"><TextField size='small' placeholder='Enter New Qty' type='Number' name='newQuantity' value={quantity + adjustedQuantity} onChange={(e)=>onInputChange(e)}
                      error={!!errors.newQuantity}
                      helperText={errors.newQuantity}></TextField></TableCell>
                    <TableCell align="right">{adjustedQuantity}</TableCell>
                  </TableRow>
              </TableBody>  
            </Table>
          </TableContainer>
        </div>
      </div>

      <div className="flex-row col-span-10 col-start-1 ">
        <Typography display='block' gutterBottom>Attach File(s) to inventory adjustment </Typography>
        <input type='file' onChange={handleFileChange} className="mt-4 mb-2"></input>
        <Typography variant='caption' display='block' gutterBottom>You can upload a maximum 10MB file.</Typography>
      </div>

      <div className='flex col-start-7 gap-6'>
        <Button className="col-start-6 text-white bg-blue-600 rounded row-start-10"
            variant='contained'
            type='submit'
          >Edit</Button>
          <Button className="col-start-8 rounded row-start-10"
            variant='outlined'
            onClick={() => navigate("/adjustment")}
          >cancel</Button>
      </div>
    </form>
  );
};

export default EditTicket;
