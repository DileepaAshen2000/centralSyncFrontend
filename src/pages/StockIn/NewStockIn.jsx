import React, { useState , useEffect} from 'react';
import { FormControl, Select, MenuItem, TextField, InputLabel, Typography, Button, Autocomplete } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import LoginService from '../Login/LoginService';

const NewStockIn = () => {

  let navigate = useNavigate();
  const [profileInfo,setProfileInfo] = useState();
  const [backEndErrors, setBackEndErrors] = useState({}); 
  const [stockIn,setStockIn] = useState({  // create state for adjustment, initial state is empty with object.
    location:"",
    date:new Date().toISOString().split("T")[0], // Set to today's date
    description:"",
    inQty:"",
    itemId:"",
    userId:"",
    file:null
  })

  const{location,date,description,inQty,itemId,userId,file} = stockIn; // Destructure the state

  // item fetching
  const [options, setOptions] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/inventory-item/getAll');
        setOptions(response.data);
        
        const token = localStorage.getItem('token');
        const profile = await LoginService.getYourProfile(token);
        setProfileInfo(profile.users);
        setStockIn(preStockIn => ({ ...preStockIn, userId: profile.users.userId }));
        
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
    e.preventDefault();
    const validationErrors = validateInputs();
    console.log(Object.keys(validationErrors).length)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // return;
    }

    try {
      // const result = await axios.post("http://localhost:8080/stock-in/add",stockIn);
      // console.log(result.data);
      const formData = new FormData();
      formData.append('location', location);
      formData.append('date', date);
      formData.append('description', description);
      formData.append('inQty', inQty);
      formData.append('itemId', itemId);
      formData.append('userId', userId);
      formData.append('file', file); // Append the file to the formData

      const result = await axios.post("http://localhost:8080/stock-in/add", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      navigate('/stockIn') // To navigate to the stockin page
      Swal.fire({
        title: "Done !",
        text: "Stock-In Successfully Submitted.!",
        icon: "success"
      });
      setBackEndErrors({}); // Clear the errors
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log(error.response.data);
        setBackEndErrors(error.response.data);
      }else{
        console.error("Error:", error);
        console.log(error.response.data);
        Swal.fire({
          title: "Error!",
          text: "Failed to submit Stock-In. Please try again.",
          icon: "error"
        });
      }
    }
  }

  // const onSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append(
  //     "stockIn",
  //     new Blob(
  //       [
  //         JSON.stringify({
  //           location,
  //           date,
  //           description,
  //           inQty,
  //           itemId,
  //           userId,
  //         }),
  //       ],
  //       { type: "application/json" }
  //     )
  //   );
  //   if (file) {
  //     formData.append("file", file);
  //   }
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:8080/stock-in/add",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     if (response.status === 201) {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Success!",
  //         text: "Item successfully added!",
  //       });
  //       // setFetchData(!fetchData);
  //       navigate("/item");
  //     }
  //   } catch (error) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error!",
  //       text: "Failed to add new item. Please check your inputs.",
  //     });
  //     if (error.response && error.response.status === 400) {
  //       setErrors(error.response.data);
  //     }
  //   }
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
    if (!itemId) {
      errors.itemId = 'Item ID is required';
    }
    if (inQty<0){
      errors.inQty = 'Quantity should be positive value'
    }
    return errors;
  };

  // Function to handle file selection
  const handleFileChange = (e) => {
    setStockIn({ ...stockIn, file: e.target.files[0] }); // Update file state with the selected file
  };

  return (
      <form onSubmit={(e)=> onSubmit(e)} className="grid grid-cols-8 p-10 bg-white gap-y-10 rounded-2xl ml-14 mr-14">
          <h1 className="col-span-4 pt-2 text-3xl font-bold ">New Stock-In</h1>
        
          <div className="flex items-center col-span-4 col-start-1">
            <InputLabel htmlFor="name" className="flex-none w-32 text-black ">
              Item Name
            </InputLabel>
            <div>
                <Autocomplete
                  disablePortal
                  options={options} 
                  getOptionLabel={(option) => option.itemName}
                  onChange={handleItemChange}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Item Name"  helperText='Please select the item name.'/>}
                  size='small' 
                />
            </div>
          </div>
          
          <div className="flex items-center col-span-4 col-start-1">
            <InputLabel htmlFor="name" className="flex-none w-32 text-black ">
              Item ID
            </InputLabel>
            <div>
              <Autocomplete
                disabled
                options={[{ itemId: selectedItemId }]} // Provide the selected itemId as an option
                getOptionLabel={(option) => option.itemId} // Display itemId in the Autocomplete
                name='itemId' // Add name to the Autocomplete
                value={{ itemId: selectedItemId }} // Set the value to the selected itemId
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Item ID" 
                error={!!errors.itemId}
                helperText={errors.itemId}/>}
                size='small'
              />
            </div>
          </div>
          
          <div className="flex items-center col-span-4 col-start-1">
            <InputLabel htmlFor="name" className="flex-none w-32 text-black ">
              Date
            </InputLabel>
            <div>
              <TextField
                style={{ width: '300px' }}
                label="Date"
                name='date'
                value={date}
                // onChange={(e)=>onInputChange(e)}
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
            <InputLabel htmlFor="name" className="flex-none w-32 text-black ">
              Location
            </InputLabel>
            <div>
              <FormControl style={{ width: '300px' }}>
                <Select  value={location} onChange={(e)=>onInputChange(e)} size='small' name='location' 
                error={!!errors.location}
                helperText={errors.location}>
                  <MenuItem value="Store A">Store A</MenuItem>
                  <MenuItem value="Store B">Store B</MenuItem>
                  <MenuItem value="Store C">Store C</MenuItem>
                </Select>
                <Typography variant='caption' className='text-red-600'>{errors.location}</Typography>
              </FormControl>
            </div>
            
          </div>

          <div className="flex items-center col-span-4 col-start-1">
            <InputLabel htmlFor="name" className="flex-none w-32 text-black ">
              Quantity In
            </InputLabel>
            <div>
                <TextField 
                  size='small' 
                  placeholder='Enter Quantity In' 
                  type='Number' 
                  name='inQty' 
                  value={inQty} 
                  error={!!errors.inQty}
                  helperText={errors.inQty}
                  onChange={(e)=>onInputChange(e)}/>      
            </div>
          </div>
          
          <div className="flex items-center col-span-4 col-start-1">
            <InputLabel htmlFor="name" className="flex-none w-32 text-black ">
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
              {backEndErrors.description && <span>{backEndErrors.description}</span>}
            </div>
          </div>
        
        <div className="flex-row col-span-10 col-start-1 ">
          <Typography display='block' gutterBottom>Attach File(s) to inventory stock-in </Typography>
          <input type='file' onChange={handleFileChange} className="mt-4 mb-2"></input>
          <Typography variant='caption' display='block' gutterBottom>You can upload a maximum of 1 file, 5MB each</Typography>
        </div>
        
        <div className='flex col-start-7 gap-6'>
          <Button className="text-white bg-blue-600 rounded "
            variant='contained'
            type='submit'
              >Submit</Button>
          <Button className="rounded"
            variant='outlined'
            onClick={() => navigate("/stockIn")}
              >cancel</Button>
        </div>
      </form>
  );
};

export default NewStockIn;
