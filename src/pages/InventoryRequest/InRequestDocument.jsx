import React, { useState, useEffect, useRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Alert, AlertTitle, CircularProgress, Box, Snackbar } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactToPrint from 'react-to-print';

const formatDateTime = (dateTimeArray) => {
  if (!dateTimeArray) return '';
  const [year, month, day, hour, minute, second] = dateTimeArray;
  const date = `${year}-${month}-${day}`;
  const time = `${hour}:${minute}:${second}`;
  return { date, time };
};

const buttonColor = (reqStatus, updateDateTime) => {
  const { date, time } = formatDateTime(updateDateTime);

  if (reqStatus === 'PENDING') {
    return (
      <Alert severity="info" sx={{ width: '300px', margin: 5 }}>
        <AlertTitle>Pending</AlertTitle>
        <div>Updated: Date {date}</div>
        <div style={{ marginLeft: '67px' }}>Time {time}</div>
      </Alert>
    );
  } else if (reqStatus === 'REJECTED') {
    return (
      <Alert severity="error" sx={{ width: '300px', margin: 5 }}>
        <div>Updated: Date {date}</div>
        <div style={{ marginLeft: '67px' }}>Time {time}</div>
      </Alert>
    );
  } else if (reqStatus === 'ACCEPTED') {
    return (
      <Alert severity="success" sx={{ width: '300px', margin: 5 }}>
        <div>Updated: Date {date}</div>
        <div style={{ marginLeft: '67px' }}>Time {time}</div>
      </Alert>
    );
  } else if (reqStatus === 'SENT_TO_ADMIN') {
    return (
      <Alert severity="warning" sx={{ width: '300px', margin: 5 }}>
        <div>Updated: Date {date}</div>
        <div style={{ marginLeft: '67px' }}>Time {time}</div>
      </Alert>
    );
  }
};

const InRequestDocument = () => {
  const { reqId } = useParams();
  const [inventoryRequest, setInventoryRequest] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(true); // New state for loading
  const navigate = useNavigate();
  const [note, setNote] = useState('');
  const printRef = useRef();
  const [email, setEmail] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchInventoryRequest = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch(`http://localhost:8080/request/getById/${reqId}`);
        const data = await response.json();
        setInventoryRequest(data);

        const userResponse = await fetch(`http://localhost:8080/user/users/${data.userId}`);
        const userData = await userResponse.json();
        setUserDetails(userData);

        const itemResponse = await fetch(`http://localhost:8080/inventory-item/getById/${data.itemId}`);
        const itemData = await itemResponse.json();
        setItemDetails(itemData);
      } catch (error) {
        console.error('Error fetching inventory request details:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchInventoryRequest();
  }, [reqId]);

  const handleDispatch = (email) => {
    axios
      .patch(`http://localhost:8080/request/updateStatus/dispatch/${reqId}?email=${email}`)
      .then(() => {
        setInventoryRequest(!inventoryRequest);
        setDialogOpen(false);
        navigate(`/new-stockout`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleReject = () => {
    axios
      .patch(`http://localhost:8080/request/updateStatus/reject/${reqId}`)
      .then(() => {
        setInventoryRequest(!inventoryRequest);
        navigate("/admin-inventory-request-list");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmitEmail = () => {
    handleDispatch(email);
  };

  const handleSendNote = () => {
    if (note.trim() !== '') {
      axios
        .post(`http://localhost:8080/request/sendSimpleEmail`, { note })
        .then(() => {
          alert('Note sent successfully');
        })
        .catch((error) => {
          console.error('Error sending note:', error);
        });
    } else {
      alert('Please write a note before sending.');
    }
  };

  const handleFileDownload = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/request/getFileById/${reqId}`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Inventory_Request_Document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setOpen(true);
    } catch (error) {
      console.error('Error downloading PDF file:', error);
    }
  };

  const handleClose = (event, reason) => {
    if (reason !== 'clickaway') setOpen(false);
  };

  const role = localStorage.getItem('role');

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <main>
        <div className="flex items-end justify-end p-6 mr-10 space-x-10">
          {inventoryRequest && inventoryRequest.reqStatus === 'PENDING' && role !== ('ADMIN' || 'REQUEST_HANDLER') && (
            <Button
              className="px-6 py-2 text-white bg-blue-600 rounded"
              variant='contained'
              type='submit'
              onClick={() => navigate(`/in-request/edit-request/${reqId}`)}
            >
              Edit
            </Button>
          )}
          <ReactToPrint
            trigger={() => (
              <Button className="px-6 py-2 text-white bg-blue-600 rounded" variant='contained'>
                Print
              </Button>
            )}
            content={() => printRef.current}
          />
        </div>

        <div ref={printRef} className="p-10 ml-6 mr-6 bg-white"
          style={{ width: '1000px', height: '1000px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
          <div>
            <section>
              <div className="w-full bg-blue-900 text-white text-center py-4">
                <header className="text-3xl font-bold">INVENTORY REQUEST</header>
              </div>
              {inventoryRequest && buttonColor(inventoryRequest.reqStatus, inventoryRequest.updateDateTime)}
            </section>
          </div>

          <div>
            <section className="flex flex-row items-end justify-end gap-10">
              <ul className='flex flex-col gap-2'>
                <li className="font-bold">Ref. No</li>
                <li className="font-bold">Created Date</li>
                <li className="font-bold">Created Time</li>
                <li className="font-bold">Reason</li>
                <li className="font-bold">Department</li>
                <li className="font-bold">Created By</li>
                <li className="font-bold">Emp.ID</li>
              </ul>
              <ul className='flex flex-col gap-2'>
                <li>{inventoryRequest?.reqId}</li>
                <li>{inventoryRequest ? formatDateTime(inventoryRequest.updateDateTime).date : ''}</li>
                <li>{inventoryRequest ? formatDateTime(inventoryRequest.updateDateTime).time : ''}</li>
                <li>{inventoryRequest?.reason}</li>
                <li>{userDetails?.department}</li>
                <li>{userDetails?.firstName}</li>
                <li>{userDetails?.userId}</li>
              </ul>
            </section>
          </div>

          <TableContainer component={Paper} className="p-8 mt-8">
            <Table sx={{ minWidth: 500 }} aria-label="simple table">
              <TableHead>
                <TableRow className=" bg-zinc-800">
                  <TableCell align="center" className="text-white">Item ID</TableCell>
                  <TableCell align="center" className="text-white">Item Name</TableCell>
                  <TableCell align="center" className="text-white">Requested Quantity</TableCell>
                  <TableCell align="center" className="text-white">Item Group</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center">{inventoryRequest?.itemId}</TableCell>
                  <TableCell align="center">{itemDetails?.itemName}</TableCell>
                  <TableCell align="center">{inventoryRequest?.quantity}</TableCell>
                  <TableCell align="center">{itemDetails?.itemGroup}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {inventoryRequest?.description && (
            <div className="mt-16 mb-32">
              <Typography variant="body1" gutterBottom>Description :</Typography>
              <div className="w-2/3">
                <Typography variant="body2">{inventoryRequest?.description}</Typography>
              </div>
              <div className='mt-6'>
                <h1>Download File:</h1>
                <button onClick={handleFileDownload}><u><span className="text-blue-800">Click to download</span></u></button>
              </div>
            </div>
          )}
        </div>

        {inventoryRequest?.reqStatus === 'PENDING' && role !== 'EMPLOYEE' && (
          <div className='flex gap-6 mt-6 ml-6'>
            <h4>Note :</h4>
            <div className="flex w-2/3">
              <textarea
                className="w-full h-20 p-2 mt-2 border-2 border-gray-300 rounded-md"
                placeholder='Write something here..'
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <Button
                className="ml-2 px-4 py-2 text-white bg-blue-600 rounded"
                variant='contained'
                onClick={handleSendNote}
                style={{ height: 'fit-content', alignSelf: 'center' }}
              >
                Send
              </Button>
            </div>
          </div>
        )}

        <div className='flex justify-end gap-4 ml-[60%] mt-6'>
          {inventoryRequest && inventoryRequest.reqStatus === 'PENDING' && role !== 'EMPLOYEE' && (
            <>
              <Button
                className="px-6 py-2 bg-green-500 text-white hover:bg-green-400"
                variant='contained'
                type='submit'
                onClick={handleOpenDialog}
              >
                Accept
              </Button>

              <Button
                className="px-6 py-2 bg-red-500 text-white hover:bg-red-400"
                variant='contained'
                type='submit'
                onClick={handleReject}
              >
                Reject
              </Button>
            </>
          )}
          <Button
            className="px-6 py-2 hover:bg-white-400"
            variant='outlined'
            type='submit'
            onClick={() => navigate("/employee-in-request-list")}
          >
            Cancel
          </Button>
        </div>

        {/* Dialog for email input */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Enter Email Address</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the delivery service's email address to send a confirmation link.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
              value={email}
              onChange={handleEmailChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSubmitEmail}>Submit</Button>
            <Button onClick={handleCloseDialog}>Cancel</Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message="File downloaded successfully"
          action={
            <Button color="inherit" size="small" onClick={handleClose}>
              Close
            </Button>
          }
        />
      </main>
    </div>
  );
}

export default InRequestDocument;
