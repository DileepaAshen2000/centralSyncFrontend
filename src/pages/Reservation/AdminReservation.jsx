// import React from 'react'
// import R_Table from '../../components/R_Table'
// import { Box } from '@mui/material'
// // import Button from '../../components/InventoryRequest/Button' 
// import Button from '@mui/material/Button'
// import { useNavigate } from 'react-router-dom'
// import My_Reservation from '../../components/My_Reservation'

// const AdminReservation = () => {
//   const navigate = useNavigate();
//   return (
//     <Box>
//         <Box className="flex pb-4 gap-96">
//             <Box>
//               <h1 className="pt-2 pb-3 text-3xl font-bold ">My Reservation</h1>
//               <p>Here is a list of all my reservation</p>
//             </Box>
//             <Box className="flex items-center">
//               <Button className="px-6 py-2 text-white bg-blue-600 rounded"
//                variant='contained'
//                onClick={() => navigate("/newreservation")}
//                 >New Reservation</Button>
//             </Box>
//         </Box>
//         <My_Reservation/>
//         <h1 className="pt-2 pb-3 text-3xl font-bold ">Reservation</h1>
//               <p>Here is a list of all reservation</p>
//               <R_Table/>
//     </Box>
//   )
// }

// export default AdminReservation


import * as React from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginService from "../Login/LoginService";

const columns = [
    { field: 'id', headerName: 'Reservation ID', width: 150 },
    { field: 'quantity', headerName: 'Quantity', width: 180 },
    { field: 'reason', headerName: 'Reason', width: 280 },
    { field: 'start', headerName: 'Start_Date', width: 150 },
    { field: 'end', headerName: 'End_Date', width: 150 },
    { field: 'status', headerName: 'Status', width: 100 },
  ];

const AdminReservation = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        const profile = await LoginService.getYourProfile(token);
        const userId = profile.users.userId;

        const response = await axios.get(`http://localhost:8080/reservation/getAllById/${userId}`);
        const data = response.data.map((res) => ({
          id: res.resId,
          quantity: res.reservationQuantity,
          reason: res.reason,
          start: res.startDate,
          end: res.endDate,
          status: res.status
        }));
        setRows(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const handlerowSelectionModelChange = (newSelectedRow) => {
    setRowSelectionModel(newSelectedRow);
  };

  const handleClick = () => {
    if (rowSelectionModel > 0) {
      const selectedResId = rowSelectionModel[0];
      console.log("selected res id :" + selectedResId);
      navigate("/reservation/editreservation/" + selectedResId);
    } else {
      navigate("/newreservation");
    }
  };
  
  const handleViewClick = () => {
    if (rowSelectionModel > 0) {
      const selectedResId = rowSelectionModel[0];
      navigate("/reservation/" + selectedResId);
    } else {
      navigate("/newreservation");
    }
  };

  return (
    <Box className="h-[400px] w-full flex-row space-y-4">
      <Box className="flex p-4 space-x-96">
        
        {rowSelectionModel > 0 ? (
          <div className="flex items-center ">
            {rows.find(row => row.id === rowSelectionModel[0]).status === "PENDING" && (
              <Button
                variant="contained"
                className="bg-blue-600 py-2 text-white rounded w-[auto]"
                onClick={handleClick}
              >
                Edit
              </Button>
            )}
            
            <div className="pl-10">
              <Button
                variant="contained"
                className="bg-blue-600  py-2 text-white rounded w-[auto]"
                onClick={handleViewClick}
              >
                View
              </Button>
            </div>
            
            
          </div>
        ) : (
          
          <div className="flex items-center">
            <Button
              variant="contained"
              className="bg-blue-600 py-2 text-white rounded w-[auto]"
              onClick={() => navigate("/newreservation")}
            >
            New Reservation
            </Button>
          </div>
          
        )}
      </Box>

        <DataGrid className='shadow-lg'
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          autoHeight
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          disableMultipleSelection={true} // Prevent multiple row selection
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={handlerowSelectionModelChange}
        />
    </Box>
  );
};
export default AdminReservation;