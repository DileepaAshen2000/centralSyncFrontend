import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Button,Alert,AlertTitle } from '@mui/material';


const TicketDocument = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ticket ID from the URL
  const [ticket, setTicket] = useState({
    date: "",
    description: "",
    topic: "",
    ticketStatus:"",
    itemId: "",
  });

  const [item, setItem] = useState({
    itemName: "",
    brand: "",
  });

  useEffect(() => {
    loadTicket();
  }, []);

  const loadTicket = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/ticket/tickets/${id}`);
      setTicket(result.data);
      //console.log(result.data);
      
      const itemId = result.data.itemId;  
      //console.log("Item id",itemId.itemId);
      const result1 = await axios.get(`http://localhost:8080/inventory-item/getById/${itemId.itemId}`);
      setItem(result1.data);
      //console.log(result1.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Handle ticket send to admin
  const handleSendToAdmin = () => {
    axios
      .patch(`http://localhost:8080/ticket/sendtoadmin/${id}`)
      .then(() => {

        navigate("/ticket");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Handle ticket Review
  const handleReview = () => {
    axios
      .patch(`http://localhost:8080/ticket/review/${id}`)
      .then(() => {

        navigate("/ticket");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getticketStatus = (ticketStatus) => {
    if (ticketStatus === "REVIEWED") {
      return <Alert severity="success" sx={{ width: '300px' }}><AlertTitle>Reviewed</AlertTitle></Alert>;
    } else if (ticketStatus === "SEND_TO_ADMIN") {
      return <Alert severity="info" sx={{ width: '300px' }}><AlertTitle>Sent to Admin</AlertTitle></Alert>;
    } else {
      return <Alert severity="info" sx={{ width: '300px' }}><AlertTitle>Pending</AlertTitle></Alert>;
    }
  }

  

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
        <header className="text-3xl">Maintenance Ticket Details</header>
      </div>
      
      <main>
        <div className="p-10 ml-6 mr-6 bg-white">
        <div>
            <section>
              {getticketStatus(ticket.ticketStatus)}
            </section>
          </div>
          <div>
            <section className="flex flex-row items-end justify-end mt-4 mb-10">
              <header className="text-3xl">Maintenance Ticket</header>
            </section>
            <section className="flex flex-row items-end justify-end gap-10">
              <ul className='flex flex-col gap-2'>
                <li className="font-bold">Ticket No</li>
                <li className="font-bold">Created by</li>
                <li className="font-bold">Item Name</li>
                <li className="font-bold">Item Brand</li>
                <li className="font-bold">Date</li>
              </ul>
              <ul className='flex flex-col gap-2'>
                <li>{id}</li>
                <li>Dileepa Ashen</li>
                <li>{item.itemName}</li>
                <li>{item.brand}</li>
                <li>{ticket.date}</li>
              </ul>
            </section>
          </div>

          <div className="mt-16 mb-32">
            <Typography variant="body1" gutterBottom>Description : </Typography>
            <div className="w-2/3">
              <Typography variant="body2">{ticket.description}</Typography>
            </div>
          </div>
          <div>
            <Typography variant="caption" gutterBottom>Generated Date/Time : </Typography>
            <Typography variant="caption" gutterBottom>{formattedDateTime}</Typography>
          </div>
        </div>

        <div className="grid grid-cols-6 grid-rows-1 gap-y-7 gap-x-[0.65rem] mt-12">
        <div className='col-start-4'>
          <Button className="px-3 py-2 rounded w-[150px] h-[42px] bg-blue-600 text-[14px] text-white hover:text-blue-600"
                  variant='outlined'
                  type='submit'
                  onClick={handleSendToAdmin}
          >Send to Admin</Button>
        </div>
        <div className='col-start-5'>
          <Button className="px-6 py-2 rounded w-[150px] bg-blue-600 text-white  hover:text-blue-600"
                  variant='outlined'
                  type='submit'
                  onClick={handleReview}
          >Review</Button>
        </div>
        <div className='col-start-6'>
          <Button className="px-6 py-2 rounded w-[150px]"
                  variant='outlined'
                  type='submit'
                  onClick={() => navigate("/ticket")}
          >cancel</Button>
        </div>
        </div>
      </main>
    </div>
  );
};

export default TicketDocument;
