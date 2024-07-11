// import React, { useEffect, useState } from 'react';
// import { InputLabel, Select, MenuItem, TextField, Typography, Button } from '@mui/material';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';
// import Swal from 'sweetalert2';

// const EditReservation = () => {

//   let navigate = useNavigate();
//   const {resId} = useParams(); // To get the id from the url
//   const [res,setRes] = useState({  // create state for reservation, initial state is empty with object.
//     reason:"",
//     date:new Date().toISOString().split("T")[0], // Set to today's date
//     description:"",
//     reservationQuantity:0,
//     newQuantity:"",
//     itemId:"",
//     file:null
//   })
//   const{reason,date,description,newQuantity,adjustedQuantity,itemId,file} = adj;
  
//   const [item,setItem] = useState({  // create state for item, initial state is empty with object.
//     itemName:"",
//     quantity:"",
//     itemGroup:""
//   })
//   const{itemName,quantity,itemGroup} = item;
//   const [errors, setErrors] = useState({}); // State to manage errors for input fields
//   const [flag,setFlag] = useState(0); // To check whether the input fields are changed or not
  
//   const onInputChange = async (e) => {  //new new
//     const { name, value } = e.target;
//     let updatedAdj = { ...adj, [name]: value };
//     if (name === "newQuantity") {
//       updatedAdj.adjustedQuantity = value - item.quantity;
//     }
//     setAdj(updatedAdj);
//     setErrors({ ...errors, [name]: '' });
//     setFlag(1);
//   };

//   useEffect(() => {
//     loadAdjustment();
//   },[]);

//   const onSubmit=async(e)=>{
//     if(flag === 1){
//       e.preventDefault(); // To remove unwanted url tail part
//       const validationErrors = validateInputs();
//       console.log(Object.keys(validationErrors).length)
//       if (Object.keys(validationErrors).length > 0) {
//         setErrors(validationErrors);
//         return;
//       }

//       try {
//         const formData = new FormData();
//         formData.append('reason', reason);
//         formData.append('date', date);
//         formData.append('description', description);
//         formData.append('adjustedQuantity', adjustedQuantity);
//         formData.append('itemId', itemId);
//         formData.append('file', file); // Append the file to the formData

//         const result = await axios.put(`http://localhost:8080/adjustment/updateById/${adjId}`, formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
      
//         navigate('/adjustment');
//         Swal.fire({
//           title: "Done!",
//           text: "Adjustment Successfully Editted !",
//           icon: "success"
//         });
//       } catch (error) {
//         console.error("Error:", error);
//         Swal.fire({
//           title: "Error!",
//           text: "Failed to Edit Adjustment. Please try again later.",
//           icon: "error"
//         });
//       }
//     }else{
//       navigate('/adjustment');
//       Swal.fire({
//         title: "No Changes ?",
//         text: "No any changes Found.",
//         icon: "question"
//       });
//     } 
//   };

//   // Validate the input fields
//   const validateInputs = () => {
//     const errors = {};
//     if (!reason) {
//       errors.reason = 'Reason is required';
//     }
//     if (!date) {
//       errors.date = 'Date is required';
//     }
    
//     if (!newQuantity) {
//       errors.newQuantity = 'New Quantity is required';
//     }
//     if (!itemId) {
//       errors.itemId = 'Item ID is required';
//     }
//     if (newQuantity<0){
//       errors.newQuantity = 'Quantity should be positive value'
//     }
    
//     return errors;
//   };

//   const handleFileChange = (e) => {
//     setAdj({ ...adj, file: e.target.files[0] });
//     setFlag(1);
//   };

//   const loadAdjustment = async () => {
//     try {
//       const result = await axios.get(`http://localhost:8080/adjustment/getById/${adjId}`);
//       setAdj(result.data);  // Make sure the fetched data structure matches the structure of your state
      
//       // Fetch item details based on itemId
//       const result1 = await axios.get(`http://localhost:8080/inventory-item/getById/${result.data.itemId}`);
//       setItem(result1.data);

//     } catch (error) {
//       console.error('Error loading adjustment:', error);
//     }
//   }
  
//   return (
//     <form className="grid grid-cols-8 p-10 bg-white gap-y-10 rounded-2xl ml-14 mr-14" onSubmit={(e)=> onSubmit(e)}>
//       <h1 className="col-span-4 pt-2 text-3xl font-bold ">Edit Adjustment</h1>

//       <div className="flex items-center col-span-4 col-start-1">
//         <InputLabel htmlFor="adjId" className="flex-none w-32 text-black ">
//           Adjustment ID
//         </InputLabel>
//         <div>
//           <TextField
//               style={{ width: '300px' }}
//               name='id'
//               label='Adjustment ID'
//               size='small'
//               value={adjId}
//               onChange={(e)=>onInputChange(e)}
//               InputProps={{
//                 readOnly: true,
//               }}
//             />
//         </div>
//       </div>
      
//       <div className="flex items-center col-span-4 col-start-1">
//         <InputLabel htmlFor="itemId" className="flex-none w-32 text-black ">
//           Item ID
//         </InputLabel>
//         <div>
//           <TextField
//             style={{ width: '300px' }}
//             name='itemId'
//             label='Item ID'
//             size='small'
//             value={itemId}
//             onChange={(e)=>onInputChange(e)}
//             error={!!errors.itemId}
//             helperText={errors.itemId}
//             InputProps={{
//                 readOnly: true,
//             }} 
//           />
//         </div>
//       </div>
      
//       <div className="flex items-center col-span-4 col-start-1">
//         <InputLabel htmlFor="date" className="flex-none w-32 text-black ">
//           Item Name
//         </InputLabel>
//         <div>
//           <TextField
//             style={{ width: '300px' }}
//             name='name'
//             label='Item Name'
//             size='small'
//             value={itemName}
//             onChange={(e)=>onInputChange(e)}
//             InputProps={{
//                 readOnly: true,
//             }}
//           />
//         </div>
//       </div>
      
//       <div className="flex items-center col-span-4 col-start-1">
//         <InputLabel htmlFor="date" className="flex-none w-32 text-black ">
//           Date
//         </InputLabel>
//         <div>
//         <TextField
//           style={{ width: '300px' }}
//           label="Date"
//           name='date'
//           value={date}
//           size='small'
//           error={!!errors.date}
//           helperText={errors.date}
//           InputLabelProps={{ // To shrink the label
//             shrink: true,
//           }}
//         />
//         </div>
//       </div>

//       <div className="flex items-center col-span-4 col-start-1">
//         <InputLabel htmlFor="reason" className="flex-none w-32 text-black ">
//           Reason
//         </InputLabel>
//         <div className="flex-grow">
//           <Select value={reason} onChange={(e)=>onInputChange(e)} size='small' name='reason'
//             error={!!errors.reason}
//             helperText={errors.reason}
//             className="w-[300px] h-10 bg-white">
//             <MenuItem value="Damaged Item">Damaged Item</MenuItem>
//             <MenuItem value="Stolen Item">Stolen Item</MenuItem>
//             <MenuItem value="Others">Others</MenuItem>
//           </Select>
//         </div>
//       </div>

//       <div className="flex col-span-4 col-start-1 ">
//         <InputLabel
//           htmlFor="description"
//           className="flex-none w-32 mt-0 text-black"
//         >
//           Description
//         </InputLabel>
//         <div>
//           <TextField
//             label="Description"
//             name='description'
//             multiline
//             rows={6}
//             placeholder='Enter Description Here...'
//             style={{ width: '500px' }}
//             value={description}
//             onChange={(e)=>onInputChange(e)}
//           />
//         </div>
//       </div>

//       <div className="flex col-span-4 col-start-1 ">
//         <InputLabel
//           htmlFor="description"
//           className="flex-none w-32 mt-0 text-black"
//         >
//           Item Details
//         </InputLabel>
//         <div>
//           <TableContainer component={Paper}>
//             <Table sx={{ minWidth: 650, border:2 }} aria-label="simple table">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Item Details</TableCell>
//                   <TableCell align="right">Quantity Available</TableCell>
//                   <TableCell align="right">New Quantity</TableCell>
//                   <TableCell align="right">Adjusted Quantity</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 <TableRow>
//                     <TableCell component="th" scope="row">
//                       {itemName}
//                     </TableCell>
//                     <TableCell align="right">{quantity}</TableCell>
//                     <TableCell align="right"><TextField size='small' placeholder='Enter New Qty' type='Number' name='newQuantity' value={quantity + adjustedQuantity} onChange={(e)=>onInputChange(e)}
//                       error={!!errors.newQuantity}
//                       helperText={errors.newQuantity}></TextField></TableCell>
//                     <TableCell align="right">{adjustedQuantity}</TableCell>
//                   </TableRow>
//               </TableBody>  
//             </Table>
//           </TableContainer>
//         </div>
//       </div>

//       <div className="flex-row col-span-10 col-start-1 ">
//         <Typography display='block' gutterBottom>Attach File(s) to inventory adjustment </Typography>
//         <input type='file' onChange={handleFileChange} className="mt-4 mb-2"></input>
//         <Typography variant='caption' display='block' gutterBottom>You can upload a maximum of 5 files, 5MB each</Typography>
//       </div>

//       <div className='flex col-start-7 gap-6'>
//         <Button className="col-start-6 text-white bg-blue-600 rounded row-start-10"
//             variant='contained'
//             type='submit'
//           >Edit</Button>
//           <Button className="col-start-8 rounded row-start-10"
//             variant='outlined'
//             onClick={() => navigate("/adjustment")}
//           >cancel</Button>
//       </div>
//     </form>
//   );
// };

// export default EditReservation;