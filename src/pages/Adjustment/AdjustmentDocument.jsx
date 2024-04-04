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

function createData(id, name, avaQty, newQty, adjQty) {
  return { id, name, avaQty, newQty, adjQty };
}

const rows = [
  createData('I2000020', "Moveble Chair", 25, 20 , -5),
];

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
    name:"",
    group:"",
    status:"",
    itemID:""
  })

const{reason,date,description,newQuantity,name,group,status,itemId} = adj;

useEffect(() => {
  loadAdjustment();
},[]);

//get selected adjustment data
const loadAdjustment = async () => {
  try {
    const result = await axios.get(`http://localhost:8080/adjustment/getById/${adjId}`);
    setAdj(result.data);  // Make sure the fetched data structure matches the structure of your state
  } catch (error) {
    console.error('Error loading adjustment:', error);
  }
}

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
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="right">{itemId}</TableCell>
                    <TableCell align="right">{row.name}</TableCell>
                    <TableCell align="right">{row.avaQty}</TableCell>
                    <TableCell align="right">{newQuantity}</TableCell>
                    <TableCell align="right">{newQuantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="mt-16 mb-32">
            <Typography variant="body1" gutterBottom>Description : </Typography>
            <div className="w-2/3">
              <Typography variant="body2">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
                blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
                neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
                quasi quidem quibusdam.{description}</Typography>
            </div>
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
