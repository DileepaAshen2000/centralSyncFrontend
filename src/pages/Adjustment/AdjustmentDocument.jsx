import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography,Button } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

const handlePrint=()=>{
  window.print();
}
const AdjustmentDocument = () => {
  const navigate = useNavigate();
  const {adjId} = useParams(); // get the adjustment id from the url
  const [adj,setAdj] = useState({  // create state for adjustment, initial state is empty with object.
    reason:"",
    date:"",
    description:"",
    newQuantity:"",
    status:"",
    itemID:""
  })

const{reason,date,description,newQuantity,status,itemId} = adj;

const [item,setItem] = useState({  // create state for adjustment, initial state is empty with object.
  itemName:"",
  quantity:""
})
const{itemName,quantity} = item;

useEffect(() => {
  loadAdjustment();
},[]);

//get selected adjustment data
const loadAdjustment = async () => {
  try {
    const result = await axios.get(`http://localhost:8080/adjustment/getById/${adjId}`);
    setAdj(result.data);  // Make sure the fetched data structure matches the structure of your state

    const result1 = await axios.get(`http://localhost:8080/inventory-item/getById/${itemId}`);
    setItem(result1.data);
    console.log(result1.data); 
    
  } catch (error) {
    console.error('Error loading adjustment:', error);
  }
}

  // Get the current date and time
  const currentDate = new Date();

  // Extract components of the date and time
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so add 1
  const day = currentDate.getDate().toString().padStart(2, '0');
  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');

  // Format the date and time as needed
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return (
    <div>
      <div>
        <header className="text-3xl">Adjustment Details</header>
      </div>
      
      <main>
        <div className="flex items-end justify-end p-6 mr-10">
          <Button className="px-6 py-2 text-white bg-blue-600 rounded"
              variant='contained'
              type='submit'
              onClick={handlePrint}
          >print</Button>
        </div>
        <div className="p-10 ml-6 mr-6 bg-white">
          <div>
            <section>
              <button className="w-40 h-10 m-5 text-blue-800 bg-blue-300 rounded-2xl">{status}</button>
            </section>
          </div>
          <div>
            <section className="flex flex-row items-end justify-end mb-6">
              <header className="text-3xl">INVENTORY ADJUSTMENT</header>
            </section>
            <section className="flex flex-row items-end justify-end gap-10">
              <ul className='flex flex-col gap-2'>
                <li className="font-bold">Ref. No</li>
                <li className="font-bold">Reason</li>
                <li className="font-bold">Adjustment Type</li>
                <li className="font-bold">Created By</li>
                <li className="font-bold">Date</li>
              </ul>
              <ul className='flex flex-col gap-2'>
                <li>{adjId}</li>
                <li>{reason}</li>
                <li>Quantity</li>
                <li>Dileepa Ashen</li>
                <li>{date}</li>
              </ul>
            </section>
          </div>
          <TableContainer component={Paper} className="p-8 mt-8">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow className=" bg-zinc-800">
                  <TableCell align="right" className="text-white">Item ID</TableCell>
                  <TableCell align="right" className="text-white">Item & Description</TableCell>
                  <TableCell align="right" className="text-white">Quantity Available</TableCell>
                  <TableCell align="right" className="text-white">New Quantity On Hand</TableCell>
                  <TableCell align="right" className="text-white">Adjusted Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                  <TableRow>
                    <TableCell align="right">{itemId}</TableCell>
                    <TableCell align="right">{itemName}</TableCell>
                    <TableCell align="right">{quantity}</TableCell>
                    <TableCell align="right">{newQuantity}</TableCell>
                    <TableCell align="right">{newQuantity - quantity}</TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <div className="mt-16 mb-32">
            <Typography variant="body1" gutterBottom>Description : </Typography>
            <div className="w-2/3">
              <Typography variant="body2">{description}</Typography>
            </div>
          </div>
          <div>
            <Typography variant="caption" gutterBottom>Generated Date/Time : </Typography>
            <Typography variant="caption" gutterBottom>{formattedDateTime}</Typography>
          </div>
        </div>

        <div className='flex gap-6 mt-6 ml-6'>
          <h4>Note :</h4>
          <textarea className="w-2/3 h-20 p-2 mt-2 border-2 border-gray-300 rounded-md" placeholder='Write something here..'></textarea>
        </div>

        <div className='flex gap-4 ml-[60%] mt-6'>
          <Button className="px-6 py-2 text-white bg-blue-600 rounded"
                variant='contained'
                type='submit'
                  >approve & adjust</Button>
          <Button className="px-6 py-2 text-white bg-blue-600 rounded"
                variant='contained'
                type='submit'
                  >reject</Button>
          <Button className="px-6 py-2 rounded"
                variant='outlined'
                type='submit'
                onClick={() => navigate("/adjustment")}
                  >cancel</Button>
        </div>
      </main>
    </div>
  )
}

export default AdjustmentDocument
