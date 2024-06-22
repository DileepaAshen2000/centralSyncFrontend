import React, { useState, useEffect, useRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactToPrint from 'react-to-print';

// Function to render status color seal
const buttonColor = (reqStatus) => {
  const commonStyles = "w-40 h-10 m-5 text-center rounded-full flex justify-center items-center";

  if (reqStatus === 'PENDING') {
    return <div className={`${commonStyles} bg-yellow-400 text-black`}>Pending</div>;
  } else if (reqStatus === 'REJECTED') {
    return <div className={`${commonStyles} bg-red-500 text-white`}>Rejected</div>;
  } else if (reqStatus === 'sentToAdmin') {
    return <div className={`${commonStyles} bg-gray-500 text-white`}>Sent to Admin</div>;
  }
};

const WorkFromHomeRequestDocument = () => {
  const { reqId } = useParams();

  const [inventoryRequest, setInventoryRequest] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();
  const [note, setNote] = useState('');
  const printRef = useRef();
  const [email, setEmail] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchInventoryRequest = async () => {
      try {
        const response = await fetch(`http://localhost:8080/request/getById/${reqId}`);
        const data = await response.json();
        setInventoryRequest(data);

        const userResponse = await fetch(`http://localhost:8080/user/users/${data.userId}`);
        const userData = await userResponse.json();
        setUserDetails(userData);
      } catch (error) {
        console.error('Error fetching inventory request details:', error);
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

  const role = localStorage.getItem('role');

  return (
    <div>
      <main>
        <div className="flex items-end justify-end p-6 mr-10 space-x-10 ...">
          {inventoryRequest && inventoryRequest.reqStatus === 'PENDING' && role !== ('ADMIN' ||'REQUEST_HANDLER') && (
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

        <div ref={printRef} className="p-10 ml-6 mr-6 bg-white">
          <div>
            <section>
              <div className="w-full bg-green-700 text-white text-center py-4">
                <header className="text-3xl font-bold">DELIVERY REQUEST</header>
              </div>
              {inventoryRequest && buttonColor(inventoryRequest.reqStatus)}
            </section>
          </div>

          <div>
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
                <li>{inventoryRequest?.reqId}</li>
                <li>{inventoryRequest?.dateTime}</li>
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
                  <TableCell align="right" className="text-white">#</TableCell>
                  <TableCell align="right" className="text-white">Item ID</TableCell>
                  <TableCell align="right" className="text-white">Item Name</TableCell>
                  <TableCell align="right" className="text-white">Requested Quantity</TableCell>
                  <TableCell align="right" className="text-white">Item Group</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="right">{inventoryRequest?.reqId}</TableCell>
                  <TableCell align="right">{inventoryRequest?.itemId}</TableCell>
                  <TableCell align="right">{inventoryRequest?.itemName}</TableCell>
                  <TableCell align="right">{inventoryRequest?.quantity}</TableCell>
                  <TableCell align="right">{inventoryRequest?.itemGroup}</TableCell>
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
            </div>
          )}
        </div>

        {inventoryRequest?.reqStatus === 'PENDING' && (
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
          {inventoryRequest && inventoryRequest.reqStatus === 'PENDING' && (
            <>

              <Button
                className="px-6 py-2 bg-orange-500 text-white hover:bg-orange-400"
                variant='contained'
                type='submit'
                onClick={handleOpenDialog}
              >
                Dispatch
              </Button>

              <Button
                className="px-6 py-2 bg-red-500 text-white hover:bg-red-400"
                variant='contained'
                type='submit'
                onClick={() => {
                  handleReject();
                }}
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
      </main>
    </div>
  );
}

export default WorkFromHomeRequestDocument;
