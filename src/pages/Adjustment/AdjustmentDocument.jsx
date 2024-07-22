import React, { useRef, useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Typography, Button, Alert, AlertTitle } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import Swal from 'sweetalert2';
import LoginService from '../Login/LoginService';

const AdjustmentDocument = () => {
  const [fetchData, setFetchData] = useState(false);
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { adjId } = useParams(); // get the adjustment id from the URL
  const [adj, setAdj] = useState({ // create state for adjustment, initial state is empty object
    reason: "",
    date: "",
    description: "",
    adjustedQuantity: "",
    status: "",
    itemId: "",
    userId: "",
    filePath: null
  });
  const { reason, date, description, adjustedQuantity, status, itemId, userId, filePath } = adj;
  const [item, setItem] = useState({ // create state for item, initial state is empty object
    itemName: "",
    brand: "",
    model: "",
    quantity: ""
  });
  const { itemName, quantity, brand, model } = item;
  const [user, setUser] = useState({ // create state for user details
    firstName: "",
    lastName: ""
  });
  const { firstName, lastName } = user;
  const isAdmin = LoginService.isAdmin();
  const printRef = useRef();

  useEffect(() => {
    loadAdjustment();
  }, [adjId]);

  // get selected adjustment data
  const loadAdjustment = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/adjustment/getById/${adjId}`);
      setAdj(result.data); // make sure the fetched data structure matches the structure of your state
      const result1 = await axios.get(`http://localhost:8080/inventory-item/getById/${result.data.itemId}`);
      setItem(result1.data);
      const userResult = await axios.get(`http://localhost:8080/user/users/${result.data.userId}`);
      setUser(userResult.data);
    } catch (error) {
      console.error('Error loading adjustment:', error);
    }
  };

  const currentDate = new Date();

  // Extract components of the date and time
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so add 1
  const day = currentDate.getDate().toString().padStart(2, '0');
  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  const handleAccept = () => {
    axios
      .patch("http://localhost:8080/adjustment/updateStatus/accept/" + adjId, { note })
      .then(() => {
        setFetchData(!fetchData);
        Swal.fire({
          title: "Success",
          text: "Adjustment Accepted Successfully!",
          icon: "success",
        });
        navigate("/adjustment", { fetchData });
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          title: "Error!",
          text: `${error.response.data}`,
          icon: "error",
        });
      });
  };

  const handleReject = () => {
    axios
      .patch("http://localhost:8080/adjustment/updateStatus/reject/" + adjId, { note })
      .then(() => {
        setFetchData(!fetchData);
        navigate("/adjustment", { fetchData });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getStatus = (status) => {
    if (status === "ACCEPTED") {
      return <Alert severity="success" sx={{ width: '300px' }}><AlertTitle>Accepted</AlertTitle></Alert>;
    } else if (status === "REJECTED") {
      return <Alert severity="error" sx={{ width: '300px' }}><AlertTitle>Rejected</AlertTitle></Alert>;
    } else {
      return <Alert severity="info" sx={{ width: '300px' }}><AlertTitle>Pending</AlertTitle></Alert>;
    }
  };

  const handleFileDownload = async () => {
    try {
      const response = await axios.get("http://localhost:8080/adjustment/getFileById/" + adjId, {
        responseType: 'blob'
      });

      // Create a blob object from the response data
      const blob = new Blob([response.data], { type: 'application/pdf' }); // Ensure the blob is treated as a PDF
      const url = window.URL.createObjectURL(blob); // Create a temporary URL for the blob object
      const link = document.createElement('a'); // Create an anchor tag
      link.href = url; // Set the href attribute to the URL of the blob
      link.download = 'CentralSync_Document.pdf'; // Specify .pdf extension for the downloaded file
      document.body.appendChild(link); // Simulate a click on the anchor tag to trigger the download
      link.click();
      document.body.removeChild(link); // Remove the anchor tag from the document
      window.URL.revokeObjectURL(url); // Release the temporary URL

      setOpen(true);
    } catch (error) {
      console.error('Error downloading PDF file:', error);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

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
        <div ref={printRef} className="p-10 ml-6 mr-6 bg-white">
          <div className="w-full py-4 text-center text-white bg-blue-900">
            <header className="text-3xl font-bold">INVENTORY ADJUSTMENT</header>
          </div>
          <div className='mt-6'>
            <section>
              {getStatus(status)}
            </section>
          </div>
          <div>
            <section className="flex flex-row items-end justify-end gap-10">
              <ul className='flex flex-col gap-2'>
                <li className="font-bold">Reference No</li>
                <li className="font-bold">Reason</li>
                <li className="font-bold">Adjustment Type</li>
                <li className="font-bold">Created By</li>
                <li className="font-bold">Date</li>
              </ul>
              <ul className='flex flex-col gap-2'>
                <li>{adjId}</li>
                <li>{reason}</li>
                <li>Quantity</li>
                <li>{firstName} {lastName}</li>
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
                  <TableCell align="right" className="text-white">Item Details</TableCell>
                  <TableCell align="right" className="text-white">Adjusted Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="right">{itemId}</TableCell>
                  <TableCell align="right">{itemName}</TableCell>
                  <TableCell align="right">{brand} - {model}</TableCell>
                  <TableCell align="right">{adjustedQuantity}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <div className="mt-16 mb-32">
            <Typography variant="body1" gutterBottom>Description : </Typography>
            <div className="w-2/3">
              <Typography variant="body2">{description}</Typography>
            </div>
            {filePath && (
              <div className='mt-6'>
                <h1>Download File :</h1>
                <button onClick={handleFileDownload}><u><span className="text-blue-800">Click to download</span></u></button>
              </div>
            )}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert
                onClose={handleClose}
                severity="success"
                variant="filled"
                sx={{ width: '100%' }}
              >
                Inventory Document download successful !!
              </Alert>
            </Snackbar>
          </div>
          <div>
            <Typography variant="caption" gutterBottom>Generated Date/Time : </Typography>
            <Typography variant="caption" gutterBottom>{formattedDateTime}</Typography>
          </div>
          <Typography variant="caption" gutterBottom>Computer Generated Report By CENTRAL SYNC &#174; | No Signature Required.</Typography>
        </div>

        {/* Footer part */}
        {isAdmin && (
          <div>
            {status === 'PENDING' && (
              <div>
                <div className='flex gap-6 mt-6 ml-6'>
                  <h4>Note :</h4>
                  <textarea className="w-2/3 h-20 p-2 mt-2 border-2 border-gray-300 rounded-md" placeholder='Write something here..'
                    value={note}
                    onChange={(e) => setNote(e.target.value)}></textarea>
                </div>

                <div className='flex gap-4 ml-[60%] mt-6'>
                  <Button className="px-6 py-2 font-bold text-green-800 bg-green-300 rounded hover:text-white hover:bg-green-600"
                    variant='contained'
                    type='submit'
                    onClick={handleAccept}
                  >approve & adjust</Button>
                  <Button className="px-6 py-2 font-bold text-red-800 bg-red-300 rounded hover:text-white hover:bg-red-600"
                    variant='contained'
                    type='submit'
                    onClick={handleReject}
                  >reject</Button>
                  <Button className="px-6 py-2 rounded"
                    variant='outlined'
                    type='submit'
                    onClick={() => navigate("/adjustment")}
                  >cancel</Button>
                </div>
              </div>
            )}
            {status !== 'PENDING' && (
              <div className='flex gap-4 ml-[86%] mt-6'>
                <Button className="px-6 py-2 rounded"
                  variant='outlined'
                  type='submit'
                  onClick={() => navigate("/adjustment")}
                >cancel</Button>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default AdjustmentDocument;
