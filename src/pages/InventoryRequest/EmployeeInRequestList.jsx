import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import LoginService from '../Login/LoginService'; // Ensure the path is correct

// Define columns for the DataGrid component
const columns = [
  { field: 'id', headerName: 'Inventory Request No:', width: 200 },
  { field: 'date', headerName: 'Date', width: 200 },
  { field: 'time', headerName: 'Time', width: 200 },
  { field: 'reason', headerName: 'Reason', width: 200 },
  { field: 'status', headerName: 'Status', width: 200 },
];

// Define a functional component named Table
function Table() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = LoginService.returnUserID();
        const response = await axios.get(`http://localhost:8080/request/user/${userId}`);
        const data = response.data.map((inventoryRequest, index) => ({
          id: index + 1,
          date: new Date(inventoryRequest.dateTime).toLocaleDateString('en-US'),
          time: new Date(inventoryRequest.dateTime).toLocaleTimeString('en-US'),
          reason: inventoryRequest.reason,
          status: inventoryRequest.reqStatus,
        }));

        // Sort data by date and time
        data.sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));
        
        // Update IDs after sorting
        const sortedData = data.map((item, index) => ({
          ...item,
          id: index + 1,
        }));

        setRows(sortedData);
      } catch (error) {
        console.error('Failed to fetch inventory requests:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <DataGrid
        rows={rows}
        columns={columns}
        onRowClick={(params) => navigate(`/employee/in-request-document/${params.row.id}`)}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
}

// Define a functional component named EmployeeInRequestList
const EmployeeInRequestList = () => {
  const navigate = useNavigate();
  const [isEmployee, setIsEmployee] = useState(false);
  const [isOnlineEmployee, setIsOnlineEmployee] = useState(false);

  useEffect(() => {
    const checkEmployeeStatus = () => {
      setIsEmployee(LoginService.isEmployee());
      setIsOnlineEmployee(LoginService.isOnlineEmployee());
    };

    checkEmployeeStatus();
  }, []);

  return (
    <Box>
      <div className="flex justify-end">
        {isEmployee && isOnlineEmployee ? (
          <Button
            className="text-white bg-blue-600 rounded hover:bg-blue-300"
            onClick={() => navigate('/in-request/create-new-in-request')}
          >
            Create New Delivery Request
          </Button>
        ) : (
          <Button
            className="text-white bg-blue-600 rounded hover:bg-blue-300"
            onClick={() => navigate('/in-request/create-new-in-request')}
          >
            Create New Inventory Request
          </Button>
        )}
      </div>
      <Box className="flex pb-4">
        <Box>
          <h1 className="pt-2 pb-3 text-3xl font-bold">Inventory Request List</h1>
          <p>Here is a list of all Inventory requests</p>
        </Box>
      </Box>
      <Table />
    </Box>
  );
};

export default EmployeeInRequestList;
