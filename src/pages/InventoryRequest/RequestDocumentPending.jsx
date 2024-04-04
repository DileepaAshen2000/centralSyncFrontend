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
//Utility Functions section
const buttonColor=(reqStatus)=>{
  if(reqStatus === 'pending'){
    return <button className="w-40 h-10 m-5 text-blue-800 bg-blue-300 rounded-2xl">Pending</button>;
  } else if(reqStatus === 'accepted'){
    return <button className="w-40 h-10 m-5 text-green-800 bg-green-300 rounded-2xl">Accepted</button>;
  } else if (reqStatus === 'rejected'){
    return <button className="w-40 h-10 m-5 text-red-800 bg-red-300 rounded-2xl">Rejected</button>;
  }
}

const rows = [
  createData('I2000020', "Moveble Chair", 25, 20 , -5),
];

const handlePrint=()=>{
  window.print();
}


const InventoryRequestDocument = () => {

  const navigate = useNavigate();

  const {reqId} = useParams(); // To get the id from the url
  const [req,setReq] = useState({  // create state for inventory request, initial state is empty with object.
    reason:"",
    date:"",
    description:"",
    newQuantity:"",
    name:"",
    group:"",
    reqStatus:"",
    itemID:""
  })

const{reason,date,description,newQuantity,name,group,reqStatus,itemId} = req;

useEffect(() => {
  loadInventoryRequest();
},[]);

//get selected adjustment data
const loadInventoryRequest = async () => {
  try {
    const result = await axios.get(`http://localhost:8080/request/getById/3`);
    setReq(result.data);  // Make sure the fetched data structure matches the structure of your state
  } catch (error) {
    console.error('Error loading inventory request:', error);
  }


}

  return (
    <div>
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
          
          {buttonColor(req.reqStatus)}
            </section>
          </div>
          <div>
            <section className="flex flex-row items-end justify-end mb-6">
              <header className="text-3xl">INVENTORY REQUEST</header>
            </section>
            <section className="flex flex-row items-end justify-end gap-10">
              <ul className='flex flex-col gap-2'>
                <li className="font-bold">Ref. No</li>
                <li className="font-bold">Date</li>
                <li className="font-bold">Reason</li>
                <li className="font-bold">Department</li>
                <li className="font-bold">Created By</li>
                <li className="font-bold">Emp. ID</li>
              </ul>
              <ul className='flex flex-col gap-2'>
                <li>1</li>
                <li>{date}</li>
                <li>{reason}</li>
                <li>HR</li>
                <li>Kamal</li>
                <li>EM2020001</li>
                
              </ul>
            </section>
          </div>
          <TableContainer component={Paper} className="p-8 mt-8">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow className=" bg-zinc-800">
                <TableCell align="right" className="text-white">#</TableCell>
                  <TableCell align="right" className="text-white">Item ID</TableCell>
                  <TableCell align="right" className="text-white">Item Name</TableCell>
                  <TableCell align="right" className="text-white">Requested Qunantity</TableCell>
                  <TableCell align="right" className="text-white">Brand</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="right">{itemId}</TableCell>
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
                  >Accept</Button>
          <Button className="px-6 py-2 text-white bg-blue-600 rounded"
                variant='contained'
                type='submit'
                  >Reject</Button>
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

export default InventoryRequestDocument