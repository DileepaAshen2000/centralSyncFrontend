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
const StockOutDocument = () => {
  const navigate = useNavigate();
  const {soutId} = useParams(); // get the StockOut id from the url
  const [stockOut,setStockOut] = useState({  // create state for StockOut, initial state is empty with object.
    date:"",
    description:"",
    outQty:"",
    department:"",
    itemId:""
  })

const{date,description,outQty,department,itemId} = stockOut;

const [item,setItem] = useState({  // create state for stockOut, initial state is empty with object.
  itemName:"",
  quantity:"",
  itemGroup:""
})
const{itemName,quantity,itemGroup} = item;

useEffect(() => {
  loadStockOut();
},[]);

//get selected StockIn data
const loadStockOut = async () => {
  try {
    const result = await axios.get(`http://localhost:8080/stock-out/getById/${soutId}`);
    setStockOut(result.data);  // Make sure the fetched data structure matches the structure of your state
    
    const result1 = await axios.get(`http://localhost:8080/inventory-item/getById/${result.data.itemId}`);
    setItem(result1.data);
  } catch (error) {
    console.error('Error loading Stock-Out:', error);
  }
}

const handleFileDownload = async () => {
  try {
    const response = await axios.get("http://localhost:8080/stock-out/getFileById/" + soutId, {
      responseType: 'blob'
    });

    // Create a blob object from the response data
    const blob = new Blob([response.data], { type: 'application/pdf' }); // Ensure the blob is treated as a PDF
    // Create a temporary URL for the blob object
    const url = window.URL.createObjectURL(blob);
    // Create an anchor tag
    const link = document.createElement('a');
    // Set the href attribute to the URL of the blob
    link.href = url;
    // Set the download attribute to specify the file name with .pdf extension
    link.download = 'CentralSync_Document.pdf'; // Specify .pdf extension for the downloaded file
    // Simulate a click on the anchor tag to trigger the download
    document.body.appendChild(link);
    link.click();
    // Remove the anchor tag from the document
    document.body.removeChild(link);
    // Release the temporary URL
    window.URL.revokeObjectURL(url);
    
    alert('PDF file download successful !!');
  } catch (error) {
    console.error('Error downloading PDF file:', error);
  }
};
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
        <header className="text-3xl">Stock-Out Details</header>
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
            <section className="flex flex-row items-end justify-end mt-4 mb-10">
              <header className="text-3xl">Stock-Out Report</header>
            </section>
            <section className="flex flex-row items-end justify-end gap-10">
              <ul className='flex flex-col gap-2'>
                <li className="font-bold">Ref. No</li>
                <li className="font-bold">Group</li>
                <li className="font-bold">Created By</li>
                <li className="font-bold">Date</li>
              </ul>
              <ul className='flex flex-col gap-2'>
                <li>{soutId}</li>
                <li>{itemGroup}</li>
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
                  <TableCell align="right" className="text-white">Item Name</TableCell>
                  <TableCell align="right" className="text-white">Department</TableCell>
                  <TableCell align="right" className="text-white">Quantity Out</TableCell>
                  <TableCell align="right" className="text-white">New Quantity On Hand</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                  <TableRow>
                    <TableCell align="right">{itemId}</TableCell>
                    <TableCell align="right">{itemName}</TableCell>
                    <TableCell align="right">{department}</TableCell>
                    <TableCell align="right">{outQty}</TableCell>
                    <TableCell align="right">{quantity - outQty}</TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <div className="mt-16">
            <Typography variant="body1" gutterBottom>Description : </Typography>
            <div className="w-2/3">
              <Typography variant="body2">{description}</Typography>
            </div>
          </div>
          <div className='mt-8'>
            <h1>Download File :</h1>
            <button onClick={handleFileDownload}><u><span className="text-blue-800">Click to download</span></u></button>
          </div>
          <div className='mt-16'>
            <Typography variant="caption" gutterBottom>Generated Date/Time : </Typography>
            <Typography variant="caption" gutterBottom>{formattedDateTime}</Typography>
          </div>
          <Typography variant="caption" gutterBottom>Computer Generated Report By CENTRAL SYNC &#174; | No Signature Required.</Typography>
        </div>

        <div className='flex ml-[86%] mt-6'>
          <Button className="px-6 py-2 rounded"
                variant='outlined'
                type='submit'
                onClick={() => navigate("/stockOut")}
                  >cancel</Button>
        </div>
      </main>
    </div>
  )
}
export default StockOutDocument;
