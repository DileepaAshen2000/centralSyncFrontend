import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography, Button } from '@mui/material';
import { useState,useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


// Function of request status color seal
const buttonColor = (reqStatus) => {
  const commonStyles = "w-40 h-10 m-5 text-center rounded-full";
  if (reqStatus === 'pending') {
    return <div className={`flex justify-center items-center text-blue-800 bg-blue-300 ${commonStyles}`}>Pending</div>;
  } else if (reqStatus === 'accepted') {
    return <div className={`flex justify-center items-center text-green-800 bg-green-300 ${commonStyles}`}>Accepted</div>;
  } else if (reqStatus === 'rejected') {
    return <div className={`flex justify-center items-center text-red-800 bg-red-300 ${commonStyles}`}>Rejected</div>;
  }
  else if (reqStatus === 'sentToAdmin') {
    return <div className={`flex justify-center items-center text-yellow-800 bg-yellow-300 ${commonStyles}`}>sentToAdmin</div>;
  }
}


const RequestHandlerInRequestDocument = () => {

   // Extracting request ID from URL parameters
  const { reqId } = useParams();

    // State variables
  const [inventoryRequest, setInventoryRequest] = useState(false);
  const navigate = useNavigate();
  const [note, setNote] = useState('');

  // Fetch inventory request details from the backend API
  useEffect(() => {
    const fetchInvetoryRequest = async () => {
      try {
        const response = await fetch(`http://localhost:8080/request/getById/${reqId}`);
        const data = await response.json();
        setInventoryRequest(data);
      } catch (error) {
        console.error('Error fetching inventory Request details:', error);
      }
    };
    fetchInvetoryRequest();
  }, [reqId]);

   // Function to handle accepting a inRequest
  const handleAccept = () => {
    axios
      .patch("http://localhost:8080/request/updateStatus/accept/" + reqId)
      .then(() => {
        setInventoryRequest(!inventoryRequest);
        navigate("/admin-inventory-request-list", { inventoryRequest });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Function to handle rejecting a inRequest
  const handleReject = () => {
    axios
      .patch("http://localhost:8080/request/updateStatus/reject/" + reqId)
      .then(() => {
        setInventoryRequest(!inventoryRequest);
        navigate("/admin-inventory-request-list", { inventoryRequest });
      })
      .catch((error) => {
        console.log(error);
      });
};

// Function to handle sending a inRequest sent to admin
const handleSendToAdmin = () => {
  axios
    .patch("http://localhost:8080/request/updateStatus/sendToAdmin/" + reqId)
    .then(() => {
      setInventoryRequest(!inventoryRequest);
      navigate("/admin-inventory-request-list", { inventoryRequest });
    })
    .catch((error) => {
      console.log(error);
    });
};

 

  /*const sendNoteEmail = (email, subject, body) => {
    axios.post("http://localhost:8080/request/mailing", {
   email:email,
    subject:subject,
   body :body,
  }).then(() => {
    console.log("Note email sent successfully");
  })
  .catch((error) => {
    console.error('Error sending note email:', error);
  });
};*/

 // Function to handle printing
  const handlePrint = () => { };

  return (
    <div>
      <main>

        <div className="flex items-end justify-end p-6 mr-10 space-x-10 ...">
        {inventoryRequest && inventoryRequest.reqStatus === 'pending' &&(
        <Button className="px-6 py-2 text-white bg-blue-600 rounded"
            variant='contained'
            type='submit'
            onClick={() => navigate(`/in-request/edit-request/${reqId}`)}
          >Edit</Button>

          )}
          <Button className="px-6 py-2 text-white bg-blue-600 rounded"
            variant='contained'
            type='submit'
            onClick={handlePrint}
          >print</Button>
          </div>
        

        <div className="p-10 ml-6 mr-6 bg-white">
          <div>
            {/* Displaying request status seal*/}
            <section>
              {buttonColor(inventoryRequest.reqStatus)}
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
                <li>{inventoryRequest.reqId}</li>
                <li>{inventoryRequest.date}</li>
                <li>{inventoryRequest.reason}</li>
                <li>{inventoryRequest.department}</li>
                <li>{inventoryRequest.employeeName}</li>
                <li>{inventoryRequest.employeeID}</li>
                {console.log(inventoryRequest)}
              </ul>
            </section>
          </div>

           {/* Displaying table of items */}
          <TableContainer component={Paper} className="p-8 mt-8">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow className=" bg-zinc-800">
                  <TableCell align="right" className="text-white">#</TableCell>
                  <TableCell align="right" className="text-white">Item ID</TableCell>
                  <TableCell align="right" className="text-white">Item Name</TableCell>
                  <TableCell align="right" className="text-white">Requested Qunantity</TableCell>
                  <TableCell align="right" className="text-white">Item Group</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="right">{inventoryRequest.reqId}</TableCell>
                  <TableCell align="right">{inventoryRequest.itemId}</TableCell>
                  <TableCell align="right">{inventoryRequest.itemName}</TableCell>
                  <TableCell align="right">{inventoryRequest.quantity}</TableCell>
                  <TableCell align="right">{inventoryRequest.itemGroup}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

 {/* Displaying inventory Request description */}
          <div className="mt-16 mb-32">
            <Typography variant="body1" gutterBottom>Description : </Typography>
            <div className="w-2/3">
              <Typography variant="body2">{inventoryRequest.description}</Typography>
            </div>
          </div>
        </div>

 {/* Input for adding a note */}
        <div className='flex gap-6 mt-6 ml-6'>
          <h4>Note :</h4>
          <textarea
            className="w-2/3 h-20 p-2 mt-2 border-2 border-gray-300 rounded-md"
            placeholder='Write something here..'
            value={note}
            onChange={(e) => setNote(e.target.value)}>
          </textarea>
        </div>

{/*Buttons for sending to admin, accepting, rejecting and cancel*/}
        <div className='flex justify-end gap-4 ml-[60%] mt-6'>

        {inventoryRequest && inventoryRequest.reqStatus === 'pending' &&(<>
          <Button className="px-6 py-2 hover:bg-white text-yellow-800 bg-yellow-300 rounded"
            variant='contained'
            type='submit'
            onClick={() => {
              handleSendToAdmin();
              //sendNoteEmail("maleeshavidurath@gmail.com", "Note for Inventory Request", note);
            }}

          >Send To Admin</Button>
          <Button className="px-6 py-2 hover:bg-white text-green-800 bg-green-300 rounded"
            variant='contained'
            type='submit'
            onClick={() => {
              handleAccept();
              //sendNoteEmail("maleeshavidurath@gmail.com", "Note for Inventory Request", note);
            }}

          >Accept</Button>
          <Button className="px-6 py-2 hover:bg-white text-red-800 bg-red-300 rounded"
            variant='contained'
            type='submit'
            onClick={() => {
              handleReject();
              //sendNoteEmail("maleeshavidurath@gmail.com", "Note for Inventory Request", note);
            }}

          >Reject</Button>
          </>)}
          <Button className="px-6 py-2  hover:bg-white rounded"
            variant='outlined'
            type='submit'
            onClick={() => navigate("/in-requestHandler-in-request-list")}
          >cancel</Button>
        </div>
      </main>
    </div>
  )
}

export default RequestHandlerInRequestDocument