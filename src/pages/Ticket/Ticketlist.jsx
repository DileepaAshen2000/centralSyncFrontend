import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate ,useParams} from 'react-router-dom';  
import {TextField , Button, Stack, Select } from "@mui/material";
import { useEffect, useState } from 'react'
import Box from "@mui/material/Box";
import axios from "axios";
import Swal from "sweetalert2";

const columns = [
  { field: 'id', headerName: 'ID', width: 200 },
  { field: 'topic', headerName: 'Topic', width: 200 },
  { field: 'date', headerName: 'Date', width: 200 },
 
 
  //{ field: 'status', headerName: 'Status', width: 130 },
  
  
];

const Ticket= () => {

  const navigate= useNavigate();

  const [rows, setRows] = useState([])
  const [selectedRows, setSelectedRows] = useState([]);
  const [fetchData, setFetchData] = useState(false);
  const { ID } = useParams();
useEffect(() => {
  axios
  .get("http://localhost:8080/ticket/getAll")
  .then((response) => {
    const data = response.data.map((ticket) => ({
      id: ticket.ticketId,
      topic:ticket.topic,
      date: ticket.date,
      
    }));
    setRows(data);
  })
  .catch((error) => {
    console.log(error);
  });
}, []);

const [rowSelectionModel, setRowSelectionModel] = useState([]);
const handleRowSelectionModelChange = (newSelectedRow) => {
  setRowSelectionModel(newSelectedRow);
};

const handleDelete = () => {
    try {
      axios
        .delete(`http://localhost:8080/ticket/delete/${ID}`)
        .then(() => {
          setFetchData(!fetchData);
          navigate({ fetchData })
          
        });
    } catch (error) {
      console.log(error);
    }
  };

const handleViewClick = () => {
  if (rowSelectionModel > 0) {
    const selectedUserId = rowSelectionModel[0];
    navigate("/user/editUser" + selectedUserId);
  } else {
    navigate("/newUser");
  }
};



  return (
    
    <Box
      sx={{
        height: 400,
        width: "100%",
      }}
    >
       <Box className='flex pt-2 pb-2'>
        <h1 className="inline-block p-4 text-3xl font-bold">Maintenance Ticket</h1>
        {rowSelectionModel > 0 ? (
            <div className="flex items-center gap-4 ml-[48%]">
                <Button
                    variant="contained"
                    className="bg-blue-600 px-6 py-2 text-white rounded left-[68%]"
                    onClick={handleDelete}
                >
                    Delete
                </Button>

                
            </div>
        ) : (
          <div className="grid grid-cols-6 grid-rows-1 gap-y-7 gap-x-6 mt-12 ">
          <div className="col-start-6">
          <Button
            variant="contained"
            className="bg-blue-600 w-[150px] rounded text-white h-10"
            onClick={() => navigate("/newTicket")}
          >
          
            New Ticket
          </Button>
          </div>
          </div>
        )}
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        autoHeight
        pageSizeOptions={[5, 10]}
        checkboxSelection 
        disableRowSelectionOnClick
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={handleRowSelectionModelChange}
      />
      </Box>

     
         
    
  );
}
export default Ticket;