// import React, { useState } from 'react';
// import { Select, MenuItem, TextField, Typography, Button ,Autocomplete,InputLabel } from '@mui/material';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import { useEffect } from 'react';
// import LoginService from '../Login/LoginService';

// const NewReservation = () => {

//   let navigate = useNavigate();
//   const [profileInfo, setProfileInfo] = useState({});
//   const [res,setRes] = useState({  // create state for reservation, initial state is empty with object.
//     quantity:"",
//     reason:"",
//     start:"",
//     end:"",
//     status:"",
//     itemId:"",
//     userId:"",
//     file: null
//   })
//   const [item,setItem] = useState({ // create state for item, initial state is empty with object.
//     itemName:"",
//     quantity:""
//   })
//   const [errors, setErrors] = useState({}); // State to manage errors for input fields
//   const [options, setOptions] = useState([]);
//   const [selectedItemId, setSelectedItemId] = useState("Select an Item");
  
//   const{reason,start,end,quantity,status,itemId,userId,file} = res; // Destructure the res state

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/inventory-item/getAll');
//         setOptions(response.data);

//         const token = localStorage.getItem('token');
//         const profile = await LoginService.getYourProfile(token);
//         setProfileInfo(profile.users);
//         setRes(prevRes => ({ ...prevRes, userId: profile.users.userId }));
        
//       } catch (error) {
//         console.error('Error fetching item details:', error);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleItemChange = (event, value) => {
//     if (value) {
//       setSelectedItemId(value.itemId);
//       setRes({ ...res, itemId: value.itemId }); // Update the itemId in the res state
//       fetchItemDetails(value.itemId);
//     } else {
//       setSelectedItemId(null);
//       setRes({ ...res, itemId: "" });
//     }
    
//   };
  
//   // Fetch the item details
//   const fetchItemDetails = async (itemId) => {
//     try {
//       const response = await axios.get(`http://localhost:8080/inventory-item/getById/${itemId}`);
//       setItem({ ...item, quantity: response.data.quantity }); 
//     } catch (error) {
//       console.error('Error fetching item details:', error);
//     }
//   };

//   const onInputChange = async (e) => {
//     const { name, value } = e.target;
//     let updatedRes = { ...res, [name]: value };
//     if (name === "quantity") {
//       updatedRes.reservationQuantity = value - item.quantity;
//     }
//     setRes(updatedRes);
//     setErrors({ ...errors, [name]: '' });
//   };

//   const onSubmit=async(e)=>{
//     e.preventDefault();
//     const validationErrors = validateInputs();
//     console.log(Object.keys(validationErrors).length)
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('reason', reason);
//       formData.append('start', start);
//       formData.append('end', end);
//       formData.append('quantity', reservationQuantity);
//       formData.append('itemId', itemId);
//       formData.append('userId', userId);
//       formData.append('file', file); // Append the file to the formData

//       console.log(formData);
//       console.log(userId);

//       const result = await axios.post("http://localhost:8080/adjustment/add", formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       navigate('/reservation');// To navigate to the reservation page
//       Swal.fire({
//         title: "Done!",
//         text: "Reservation Successfully Submitted!",
//         icon: "success"
//       });
//     } catch (error) {
//       console.error("Error:", error);
//       Swal.fire({
//         title: "Error!",
//         text: "Failed to submit Reservation. Please try again.",
//         icon: "error"
//       });
//     }
//   }

//   // Validate the input fields
//   const validateInputs = () => {
//     const errors = {};
//     if (!reason) {
//       errors.reason = 'Reason is required';
//     }
//     if (!date) {
//       errors.start = 'Date is required';
//     }
    
//     if (!end) {
//       errors.end = 'Date is required';
//     }
//     if (!itemId) {
//       errors.itemId = 'Item ID is required';
//     }
    
//     return errors;
//   };

//   const handleFileChange = (e) => {
//     setRes({ ...res, file: e.target.files[0] });
//   };

//   return (
//     <form className="grid grid-cols-12 p-10 bg-white gap-y-10 rounded-2xl ml-14 mr-14" onSubmit={(e)=> onSubmit(e)}>
//       <h1 className="col-span-4 pt-2 text-3xl font-bold ">New Reservation</h1>

//       <div className="flex items-center col-span-4 col-start-1">
//         <InputLabel htmlFor="itemName" className="flex-none w-32 text-black ">
//           Item Name
//         </InputLabel>
//         <div>
//           <Autocomplete
//             disablePortal
//             options={options} 
//             getOptionLabel={(option) => option.itemName}
//             onChange={handleItemChange}
//             sx={{ width: 300 }}
//             renderInput={(params) => <TextField {...params} label="Item Name"  helperText='Please select the item name.'/>}
//             size='small' 
//             type='search'
//           />
//         </div>
//       </div>
      
//       <div className="flex items-center col-span-4 col-start-1">
//         <InputLabel htmlFor="itemId" className="flex-none w-32 text-black ">
//           Item ID
//         </InputLabel>
//         <div>
//           <Autocomplete
//             disabled
//             options={[{ itemId: selectedItemId }]} // Provide the selected itemId as an option
//             getOptionLabel={(option) => option.itemId} // Display itemId in the Autocomplete
//             name='itemId' 
//             value={{ itemId: selectedItemId }} // Set the value to the selected itemId
//             sx={{ width: 300 }}
//             renderInput={(params) => <TextField {...params} label="Item ID" 
//             error={!!errors.itemId} helperText={errors.itemId}/>}
//             size='small'
//           />
//         </div>
//       </div>
      
//       <div className="flex items-center col-span-4 col-start-1">
//         <InputLabel htmlFor="date" className="flex-none w-32 text-black ">
//           Start Date
//         </InputLabel>
//         <div>
//           <TextField
//             style={{ width: '300px' }}
//             label="Date"
//             name='date'
//             value={date}
//             size='small'
//             error={!!errors.date}
//             helperText={errors.date}
//             InputLabelProps={{ // To shrink the label
//               shrink: true,
//             }}
//           />
//         </div>
//       </div>
//       <div className="flex items-center col-span-4 col-start-1">
//         <InputLabel htmlFor="date" className="flex-none w-32 text-black ">
//           End Date
//         </InputLabel>
//         <div>
//           <TextField
//             style={{ width: '300px' }}
//             label="Date"
//             name='date'
//             value={date}
//             size='small'
//             error={!!errors.date}
//             helperText={errors.date}
//             InputLabelProps={{ // To shrink the label
//               shrink: true,
//             }}
//           />
//         </div>
//       </div>

//       <div className="flex items-center col-span-4 col-start-1">
//         <InputLabel htmlFor="reason" className="flex-none w-32 text-black ">
//           Reason
//         </InputLabel>
//         <div className="flex-grow">
//           <Select  value={reason} onChange={(e)=>onInputChange(e)} size='small' name='reason' 
//             error={!!errors.reason}
//             helperText={errors.reason}
//             className="w-[300px] h-10  bg-white">
//             <MenuItem value="Damaged Item">Damaged Item</MenuItem>
//             <MenuItem value="Stolen Item">Stolen Item</MenuItem>
//             <MenuItem value="Others">Others</MenuItem>
//           </Select>
//           <Typography variant='caption' className='text-red-600'>{errors.reason}</Typography>
//         </div>
//       </div>

//       <div className="flex-row col-span-10 col-start-1 ">
//         <Typography display='block' gutterBottom>Attach File(s) to inventory reservation </Typography>
//         <input type='file' className="mt-4 mb-2" onChange={handleFileChange}></input>
//         <Typography variant='caption' display='block' gutterBottom>You can upload a maximum of 1 file, 5MB each</Typography>
//       </div>

      
//         <Button className="col-start-10 text-white bg-blue-600 rounded"
//           variant='contained'
//           type='submit'
//         >submit</Button>
//         <Button className="col-start-12 rounded"
//           variant='outlined'
//           onClick={() => navigate("/reservation")}
//         >cancel</Button>
//     </form>
//   );
// };

// export default NewReservation;
