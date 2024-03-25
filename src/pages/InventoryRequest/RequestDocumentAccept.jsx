import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react'
import Button from '../../components/InventoryRequest/Button';
import {
  Box,
} from '@mui/material';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';

import axios from 'axios';




function createData(id, name, avaQty, newQty, adjQty) {
  return { id, name, avaQty, newQty, adjQty };
}

const rows = [
  createData('I2000020', "Moveble Chair", 25, 20 , -5),
];


const RequestDocumentAccept = () => {

  const [rows, setData] = useState([])
  useEffect(() => {
      axios.get('http://localhost:8080/request/getAll')
          .then((response) => {

              const data = response.data.map((user, index) => ({

                  id: index + 1,
                  refNo: user.refNo, // Assuming a "refNo" property in the response data
                  date: user.date, // Assuming a "date" property in the response data
                  reason: user.reason,
                  department: user.depName,
                  createdBy: user.createdBy, // Assuming a "createdBy" property in the response data
                  status: user.reqStatus,
                  empID: user.empID,
              }));
              setData(data);
              console.log(data);
          })
          .catch((error) => {
              console.log(error);
          });
  }, [])
  return (

   
    <div> 
      
      <Box className="bg-slate-300 p-4 ...">
                            <div className='flex items-end justify-end space-x-4 ...'>
                            <Button>Accept</Button>
                            <Button>Reject</Button>
                            <Button><LocalPrintshopIcon className='mr-1'></LocalPrintshopIcon>&nbsp;&nbsp;Print</Button>                            
                        </div>
                </Box>       
      <main>


        <div className="p-10 ml-1 mr-1 bg-slate-200 ">
          <div>
            <section>
              <button className="w-40 h-10 m-5 bg-green-500 rounded-2xl">Accepted</button>
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
                <li className="font-bold">Emp.ID</li>
              </ul>
              <ul className='flex flex-col gap-2'>
                <li>IR2003001</li>
                <li>2024-02-26</li>
                <li>For Office Use</li>
                <li>HR</li>
                <li>Kamal</li>
                <li>EM20232001</li>
              </ul>
            </section>
          </div>
          <TableContainer component={Paper} className="p-8 mt-8">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow className=" bg-zinc-800">
                <TableCell align="right" className="text-white">#</TableCell>
                  <TableCell align="right" className="text-white">Item ID</TableCell>
                  <TableCell align="right" className="text-white">Item & Description</TableCell>
                  <TableCell align="right" className="text-white">Requested Quantity</TableCell>
                  <TableCell align="right" className="text-white">Brand</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="right">{row.id}</TableCell>
                    <TableCell align="right">{row.name}</TableCell>
                    <TableCell align="right">{row.avaQty}</TableCell>
                    <TableCell align="right">{row.newQty}</TableCell>
                    <TableCell align="right">{row.adjQty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="mt-6">
            <Typography variant="body1" gutterBottom>Description : </Typography>
            <div className="w-2/3">
              <Typography variant="body2">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
                blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
                neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
                quasi quidem quibusdam.</Typography>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default RequestDocumentAccept
