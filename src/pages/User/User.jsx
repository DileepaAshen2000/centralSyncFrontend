import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';  
import {TextField , Button, Stack, Select } from "@mui/material";
import { useEffect, useState } from 'react'
import Box from "@mui/material/Box";
import axios from "axios";

const columns = [
  { field: 'id', headerName: 'ID', width: 200 },
  { field: 'employeesName', headerName: 'Employees Name', width: 200 },
  { field: 'email', headerName: 'Email Address', width: 230 },
  { field: 'department', headerName: 'Department', width: 200 },
  { field: 'role', headerName: 'Role', width: 200 },
  //{ field: 'status', headerName: 'Status', width: 130 },
  
  
];

export default function User() {

  const navigate= useNavigate();

  const [rows, setRows] = useState([])
  const [selectedRows, setSelectedRows] = useState([]);
useEffect(() => {
  axios.get('http://localhost:8080/user/getAll')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
   
      const mappedData= data.map((user,index) => ({
      
      id: index+1,
      employeesName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      department: user.department,
      role: user.role,
      status: user.status
    }));
    setRows(mappedData);
    })
    .catch((error) => {
      console.log(error);
    });
}, []);

const [rowSelectionModel, setRowSelectionModel] = useState([]);
const handleRowSelectionModelChange = (newSelectedRow) => {
  setRowSelectionModel(newSelectedRow);
};

const handleClick = () => {
  if (rowSelectionModel > 0) {
    const selectedUserId = rowSelectionModel[0];
    navigate("/user/editUser/" + selectedUserId);
  } else {
    navigate("/newUser");
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
        <h1 className="inline-block p-4 text-3xl font-bold">User</h1>
        {rowSelectionModel > 0 ? (
            <div className="flex items-center gap-4 ml-[48%]">
                <Button
                    variant="contained"
                    className="bg-blue-600 px-6 py-2 text-white rounded left-[68%]"
                    onClick={handleClick}
                >
                    Edit
                </Button>

                <Button
                    variant="contained"
                    className="bg-blue-600 px-6 py-2 text-white rounded left-[68%]"
                    onClick={handleClick}
                >
                    View
                </Button>
            </div>
        ) : (
          <div className="grid grid-cols-6 grid-rows-1 gap-y-7 gap-x-6 mt-12 ">
          <div className="col-start-6">
          <Button
            variant="contained"
            className="bg-blue-600 w-[150px] rounded text-white h-10"
            onClick={() => navigate("/newUser")}
          >
          
            New User
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