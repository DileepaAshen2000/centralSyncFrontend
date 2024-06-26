import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { Button, CircularProgress } from '@mui/material';
import LoginService from '../Login/LoginService'; // Ensure the path is correct

// Define a functional component named Table
function Table({ isEmployee, isOnlineEmployee }) {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = LoginService.returnUserID();
        const response = await axios.get(`http://localhost:8080/request/user/${userId}`);
        
        const data = response.data.map((inventoryRequest, index) => {
          const createdDate = new Date(
            ...inventoryRequest.createdDateTime.slice(0, 6)
          );
          return {
            id: index + 1,
            date: createdDate.toLocaleDateString('en-US'),
            time: createdDate.toLocaleTimeString('en-US'),
            reason: inventoryRequest.reason,
            status: inventoryRequest.reqStatus,
            createdDateTime: createdDate,
          };
        });
        console.log(data);

        // Sort data by createdDateTime
        data.sort((a, b) => b.createdDateTime - a.createdDateTime);
        
        // Update IDs after sorting
        const sortedData = data.map((item, index) => ({
          ...item,
          id: index + 1,
        }));

        setRows(sortedData);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Failed to fetch inventory requests:', error);
        setLoading(false); // Set loading to false if there's an error
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Define columns for the DataGrid component
  const columns = [
    { field: 'id', headerName: isEmployee && isOnlineEmployee ? 'Delivery Request No:' : 'Inventory Request No:', width: 200 },
    { field: 'date', headerName: 'Date', width: 200 },
    { field: 'time', headerName: 'Time', width: 200 },
    { field: 'reason', headerName: 'Reason', width: 200 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 200,
      renderCell: (params) => {
        const status = params.value;
        let backgroundColor;
        switch (status) {
          case 'PENDING':
            backgroundColor = 'lightblue';
            break;
          case 'ACCEPTED':
            backgroundColor = 'lightgreen';
            break;
          case 'REJECTED':
            backgroundColor = 'lightcoral';
            break;
          case 'SENT_TO_ADMIN':
            backgroundColor = 'lightyellow';
            break;
          default:
            backgroundColor = 'white';
        }
        return (
          <Box 
            sx={{ 
              padding: '4px 8px', 
              borderRadius: '4px', 
              textAlign: 'center', 
              fontWeight: 'bold',
              backgroundColor 
            }}
          >
            {status}
          </Box>
        );
      }
    },
  ];

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
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f5f5',
            borderBottom: '2px solid #000',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #ddd',
          },
          '& .MuiDataGrid-row': {
            borderBottom: '2px solid #000',
          },
          '& .MuiDataGrid-root': {
            border: '2px solid #000',
          }
        }}
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
            className="text-white bg-blue-600 rounded hover:bg-blue-400"
            onClick={() => navigate('/in-request/create-new-in-request')}
          >
            Create New Delivery Request
          </Button>
        ) : (
          <Button
            className="text-white bg-blue-600 rounded hover:bg-blue-400"
            onClick={() => navigate('/in-request/create-new-in-request')}
          >
            Create New Inventory Request
          </Button>
        )}
      </div>
      {isEmployee && isOnlineEmployee ?(
        <>
          <Box className="flex flex-col items-center pb-4">
            <Box className="w-full bg-green-900 text-white text-center py-4 m-4">
              <header className="text-3xl font-bold">My Delivery Request List</header>
            </Box>
          </Box>
          <p>Here is a list of all Delivery requests</p>
        </>
      ) : (
        <>
          <Box className="flex flex-col items-center pb-4">
            <Box className="w-full bg-blue-900 text-white text-center py-4 m-4">
              <header className="text-3xl font-bold">My Inventory Request List</header>
            </Box>
          </Box>
          <p>Here is a list of all Inventory requests</p>
        </>
      )}
      <Table isEmployee={isEmployee} isOnlineEmployee={isOnlineEmployee} />
    </Box>
  );
};

export default EmployeeInRequestList;
