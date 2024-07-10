import React, { useState, useEffect, useRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography, Button, Alert, AlertTitle, CircularProgress, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactToPrint from 'react-to-print';
import LoginService from '../Login/LoginService';
import { set } from 'date-fns';
import { Token, TramRounded } from '@mui/icons-material';


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
  }
  else if (reqStatus === 'REJECTED') {
    return (
      <Alert severity="error" sx={{ width: '300px', margin: 5 }}>
         <AlertTitle>Rejected</AlertTitle>
        <div>Updated: Date {date}</div>
        <div style={{ marginLeft: '67px' }}>Time {time}</div>
      </Alert>
    );
  } else if (reqStatus === 'DISPATCHED') {
    return (
      <Alert severity="success" sx={{ width: '300px', margin: 5 }}>
        <AlertTitle>Dispatched</AlertTitle>
        <div>Updated: Date {date}</div>
        <div style={{ marginLeft: '67px' }}>Time {time}</div>
      </Alert>
    );
  }
  else if (reqStatus === 'DELIVERED') {
    return (
      <Alert severity="info" sx={{ width: '300px', margin: 5, backgroundColor: '#DFF2BF' }}>
        <AlertTitle>Delivered</AlertTitle>
        <div>Updated: Date {date}</div>
        <div style={{ marginLeft: '67px' }}>Time {time}</div>
      </Alert>
    );
  }else if (reqStatus === 'RECEIVED') {
    return (
      <Alert
        severity="info"
        sx={{
          width: '300px',
          margin: 5,
          backgroundColor: '#7a7a7a',
          color: 'black'
        }}
      >
        <AlertTitle>Received</AlertTitle>
        <div>Updated: Date {date}</div>
        <div style={{ marginLeft: '67px' }}>Time {time}</div>
      </Alert>
    );
  }
  else if (reqStatus === 'WANT_TO_RETURN_ITEM') {
    return (
      <Alert
        severity="info"
        sx={{
          width: '300px',
          margin: 5,
          backgroundColor: '#D3D3D3',
          color: 'black'
        }}
      >
        <AlertTitle>Want to retun item</AlertTitle>
        <div>Updated: Date {date}</div>
        <div style={{ marginLeft: '67px' }}>Time {time}</div>
      </Alert>
    );
  }
};

const isEmployee = LoginService.isEmployee();
const isAdmin = LoginService.isAdmin();
const isReqHandler = LoginService.isReqHandler();

const getInventoryRequestListLink = () => {
  if (isAdmin) return "/admin-in-request-list";
  if (isReqHandler) return "/requestHandler/in-request-list";
  if (isEmployee) return "/employee-in-request-list";
  return "/default-request-list";
};
const DeRequestDocument = () => {
  const { reqId } = useParams();
  const [inventoryRequest, setInventoryRequest] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [note, setNote] = useState('');
  const printRef = useRef();


  const [open, setOpen] = useState(false);
  const [openID, setOpenID] = useState(false);
  const[openSA, setOpenSA] = useState(false);
  const[openRD, setOpenRD] = useState(false);
  const[openAD, setOpenAD] = useState(false);
 ;
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClickItemReturn = () => { 
    setOpenID(true); 
  };

  const handleClickReceived = () => {
    setOpenRD(true);
  };



  const handleOpenDialog = () => {
    setOpenRD(true);
  };

 

  
  

  const handleClose = () => {
    setOpenID(false);
    setOpenRD(false);
    setOpenSA(false);
    setOpenAD(false);
  };

  const [workSite, setWorkSite] = useState('');

  const fetchWorkSite = () => {
    setWorkSite(workSite);
  };

  useEffect(() => {
    fetchWorkSite();
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

  const fetchAdminDetails = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/users/1');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin details:', error);
      return null;
    }
  };

  const handleReceived = () => {
    axios
      .patch(`http://localhost:8080/request/updateStatus/received/${reqId}`)
      .then(() => {
        setInventoryRequest(!inventoryRequest);
        navigate("/employee-de-request-list");
      })
      .catch((error) => {
        console.log(error);
      });
  };




  const handleItemReturn = async () => {
    try {

      const adminDetails = await fetchAdminDetails();
      if (!adminDetails) {
        throw new Error('Failed to fetch admin details');
      }
      const emailSubject = `Want To Item Returning: Ref No ${inventoryRequest.reqId}`;

      const emailBody = `
        <h2>Want To Return Item</h2>
        <p>The user has confirmed Want to Return item with the following details:</p>
        <table border="1" cellpadding="5" cellspacing="0">
          <tr><th>Ref No:</th><td>${inventoryRequest.reqId}</td></tr>
          <tr><th>Emp. ID:</th><td>${userDetails.userId}</td></tr>
          <tr><th>User Name:</th><td>${userDetails.firstName} ${userDetails.lastName}</td></tr>
          <tr><th>Department:</th><td>${userDetails.department}</td></tr>
          <tr><th>Item ID:</th><td>${inventoryRequest.itemId}</td></tr>
          <tr><th>Item Name:</th><td>${itemDetails.itemName}</td></tr>
          <tr><th>Item Group:</th><td>${itemDetails.itemGroup}</td></tr>
          <tr><th>Quantity:</th><td>${inventoryRequest.quantity}</td></tr>
        </table>
      `;

      await axios.post('http://localhost:8080/request/sendMimeEmail',null, {
        params: {
        toEmail: adminDetails.email,
        subject: emailSubject,
        body: emailBody,
        }
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }

    // Update item return status
    axios
      .patch(`http://localhost:8080/request/updateStatus/ItemWantToReturn/${reqId}`)
      .then(() => {
        setInventoryRequest(!inventoryRequest);
        navigate(`/employee/in-request-document/${reqId}`);
        handleClose(); // Close the dialog
      })
      .catch((error) => {
        console.log(error);
      });
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
      {role === 'EMPLOYEE' && (
        <div>
          <p className='text-gray-500'>Any Inquiry,</p>
          <Button className="px-6 py-2 hover:bg-white-400" variant='outlined' onClick={() => navigate("/newTicket")}>
            Create A Ticket
          </Button>
        </div>
      )}
      <main>
        <div className="flex items-end justify-end p-6 mr-10 space-x-10">
          {inventoryRequest.reqStatus === 'PENDING' && role === 'EMPLOYEE' && (
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
              
                
               
                <div className="w-full  bg-green-900 text-white text-center py-4">
                  <header className="text-3xl font-bold">Delivery Request</header>
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
                <li className="font-bold">Department</li>
                <li className="font-bold">Created By</li>
                <li className="font-bold">Emp.ID</li>
              </ul>
              <ul className='flex flex-col gap-2'>
                <li>{inventoryRequest?.reqId}</li>
                <li>{inventoryRequest ? formatDateTime(inventoryRequest.updateDateTime).date : ''}</li>
                <li>{inventoryRequest ? formatDateTime(inventoryRequest.updateDateTime).time : ''}</li>
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
          

          <div className="mt-16 mb-32">
          <section className="flex flex-row gap-1 mb-3">
              <ul className='flex flex-col'>
                <li className="font-bold">Reason:</li>
              </ul>
              <ul className='flex flex-col'>
                <li>{inventoryRequest?.reason}</li>
              </ul>
            </section>
       
          {inventoryRequest?.description && (
           <>
              <Typography level="title-lg"><b>Description :</b></Typography>
              <div className="w-2/3">
                <Typography level="body-lg">{inventoryRequest?.description}</Typography>
              </div>
              </>
            )}
            
             { inventoryRequest?.filePath && (<div className='mt-6'>
                <h1>Download File:</h1>
                <button onClick={handleFileDownload}> 
                  <u><span className="text-blue-800">Click to download attched file with Inventory Request</span></u></button>
              </div>)}
              <div className='mt-20 float-right ...'>
                <Typography variant="caption" gutterBottom>
                  Computer Generated Report By CENTRAL SYNC &#174; | No Signature Required.
                </Typography>
              </div>
            </div>
         

        </div>



        <div className='flex justify-end gap-4 ml-[50%] mt-6'>
        {(inventoryRequest.reqStatus === 'DELIVERED') && 
          (
            <>
              <Button
                className="px-6 py-2 bg-gray-500 text-white hover:bg-gray-400"
                variant='contained'
                type='submit'
                onClick={handleClickReceived}
              >
                Received
              </Button>
            </>
          )}
           <Dialog
            open={openRD}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle>
              {"Are you sure you successfully Recieved received requested item?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                (By clicking on "Yes" you will mark your confirming you received delivered item successfully.)
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleReceived} color="primary" autoFocus>
                Yes
              </Button>
              <Button onClick={handleClose} color="primary">
                No
              </Button>
            </DialogActions>
          </Dialog>
          
          {(inventoryRequest.reqStatus === 'ACCEPTED' || inventoryRequest.reqStatus === 'RECEIVED') && role === 'EMPLOYEE'  &&(
            <>
              <Button
                className="px-6 py-2 bg-purple-500 text-white hover:bg-purple-400"
                variant='variant'
                type='submit'
                onClick={handleClickItemReturn}
              >
                Return Item
              </Button>
            </>)}
          <Dialog
            open={openID}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle>
              {"Are you sure you want to return this Item to Company?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                By clicking on "Yes" you will mark your confirming return the item.<br />
                (After one or two days you will be contacted by the company admin section)
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                No
              </Button>
              <Button onClick={handleItemReturn} color="primary" autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
          <Button
            className="px-6 py-2 hover:bg-white-400"
            variant='outlined'
            type='submit'
            onClick={() => navigate("/employee-de-request-list")}
          >
            Cancel
          </Button>
        </div>


      </main>
    </div>
  );
}

export default DeRequestDocument;
