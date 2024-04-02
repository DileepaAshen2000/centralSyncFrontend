import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography,Button } from '@mui/material';

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
              <button className="w-40 h-10 m-5 text-blue-800 bg-blue-300 rounded-2xl">Pending</button>
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
                <li>AD2024001</li>
                <li>Damaged Item</li>
                <li>Quantity</li>
                <li>Dileepa Ashen</li>
                <li>2024-02-26</li>
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

          <div className="mt-16 mb-32">
            <Typography variant="body1" gutterBottom>Description : </Typography>
            <div className="w-2/3">
              <Typography variant="body2">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
                blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
                neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
                quasi quidem quibusdam.</Typography>
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
                  >cancel</Button>
        </div>
        
      </main>
    </div>
  )
}

export default AdjustmentDocument
