import React, { useRef, useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import LoginService from '../Login/LoginService';

const StockOutDocument = () => {
  const navigate = useNavigate();
  const { soutId } = useParams(); // Get the StockOut ID from the URL
  const [stockOut, setStockOut] = useState({  // Create state for StockOut, initial state is empty object
    date: "",
    description: "",
    outQty: "",
    department: "",
    filePath: null,
    itemId: {} , // Initialize itemId as an empty object
    userId:{},
    generatedBy:""
  });

  const { date, description, outQty, department, itemId,userId,generatedBy,filePath} = stockOut;
  const printRef = useRef();

  useEffect(() => {
    loadStockOut();
  }, []);

  // Get selected StockOut data
  const loadStockOut = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/stock-out/getById/${soutId}`);
      setStockOut(result.data); 
      // console.log(stockOut.data);

      const token = localStorage.getItem('token');
      const profile = await LoginService.getYourProfile(token);
      setStockOut(preStockOut => ({ ...preStockOut, generatedBy: profile.users.userId }));
      
    } catch (error) {
      console.error('Error loading Stock-Out:', error);
    }
  };

  const handleFileDownload = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/stock-out/getFileById/${soutId}`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'CentralSync_Document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert('PDF file download successful !!');
    } catch (error) {
      console.error('Error downloading PDF file:', error);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');
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
          >Print</Button>
        </div>
        <div ref={printRef} className="p-10 ml-6 mr-6 bg-white">
          <div className="w-full py-4 text-center text-white bg-green-800">
            <header className="text-3xl font-bold">STOCK-OUT REPORT</header>
          </div>
          <div className='mt-10'>
            <section className="flex flex-row items-end justify-end gap-10">
              <ul className='flex flex-col gap-2'>
                <li className="font-bold">Reference No.</li>
                <li className="font-bold">Group</li>
                <li className="font-bold">Created By</li>
                <li className="font-bold">Date</li>
                <li className="font-bold">User ID</li>
              </ul>
              <ul className='flex flex-col gap-2'>
                <li>{soutId}</li>
                <li>{itemId.itemGroup}</li>
                <li>{userId.firstName} {userId.lastName}</li>
                <li>{date}</li>
                <li>{generatedBy}</li>
              </ul>
            </section>
          </div>
          <TableContainer component={Paper} className="p-8 mt-8">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow className=" bg-zinc-800">
                  <TableCell align="right" className="text-white">Item ID</TableCell>
                  <TableCell align="right" className="text-white">Item Name</TableCell>
                  <TableCell align="right" className="text-white">Item Details</TableCell>
                  <TableCell align="right" className="text-white">Department</TableCell>
                  <TableCell align="right" className="text-white">Quantity Out</TableCell>
                  <TableCell align="right" className="text-white">New Quantity On Hand</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                  <TableRow>
                    <TableCell align="right">{itemId.itemId}</TableCell> {/* Access itemId.id */}
                    <TableCell align="right">{itemId.itemName}</TableCell>
                    <TableCell align="right">{itemId.brand} - {itemId.model}</TableCell>
                    <TableCell align="right">{department}</TableCell>
                    <TableCell align="right">{outQty}</TableCell>
                    <TableCell align="right">{itemId.quantity}</TableCell>
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
          {filePath && (
            <div className='mt-8'>
              <h1>Download File :</h1>
              <button onClick={handleFileDownload}><u><span className="text-blue-800">Click to download</span></u></button>
            </div>
          )}
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
                  >Cancel</Button>
        </div>
      </main>
    </div>
  );
};

export default StockOutDocument;
