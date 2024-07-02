import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { Button, CircularProgress, Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import LoginService from '../Login/LoginService'; // Ensure the path is correct

// Table component to display data with a loading state
const Table = ({ rows, columns, loading, onRowClick }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <DataGrid
        rows={rows}
        columns={columns}
        onRowClick={onRowClick}
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
          },
        }}
      />
    </div>
  );
};

// SectionHeader component for displaying section headers
const SectionHeader = ({ title, color }) => (
  <Box sx={{ backgroundColor: color, padding: '16px', textAlign: 'center', color: 'white' }}>
    <h2>{title}</h2>
  </Box>
);

// Main component for displaying employee requests and items
const RequestHandlerInRequestList = () => {
  const navigate = useNavigate();
  const [isReqHandler, setIsReqHandler] = useState(false);
  const [value, setValue] = useState('1');
  const [reviewingRequestRows, setReviewingRequestRows] = useState([]);
  const [myRequestRows, setMyRequestRows] = useState([]);
  const [itemsOnHandRows, setItemsOnHandRows] = useState([]); // New state for items on hand
  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    checkEmployeeStatus();
    fetchRequestsData();
  }, []);

  const checkEmployeeStatus = () => {
    setIsReqHandler(LoginService.isReqHandler());
  };

  const fetchRequestsData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/request/getAll');
      let data = formatRequestsData(response.data);

      // Filtering requests based on role
      const reviewingRequests = data.filter(item => item.role === 'EMPLOYEE');
      console.log('Reviewing Requests:', reviewingRequests);
      const myRequests = data.filter(item => item.role === 'REQUEST_HANDLER' && item.status !== 'ACCEPTED' && item.status !== 'WANT_TO_RETURN_ITEM'); // Filter out ACCEPTED and WANT_TO_RETURN_ITEM statuses
      const itemsOnHand = data.filter(item => item.role === 'REQUEST_HANDLER' && (item.status === 'ACCEPTED' || item.status === 'WANT_TO_RETURN_ITEM')); // Filter for items on hand
      

      // Add sequential IDs
      setReviewingRequestRows(reviewingRequests.map((item, index) => ({ ...item, id: index + 1 })));
      setMyRequestRows(myRequests.map((item, index) => ({ ...item, id: index + 1 })));
      setItemsOnHandRows(itemsOnHand.map((item, index) => ({ ...item, id: index + 1 })));
      
      setLoadingRequests(false);
    } catch (error) {
      console.error('Failed to fetch inventory requests:', error);
      setLoadingRequests(false);
    }
  };
  useEffect(() => {
    checkEmployeeStatus();
    fetchRequestsData();
  }, []);
  
  useEffect(() => {
    console.log('ReviewingRequestRows State:', reviewingRequestRows);
    
  }, [reviewingRequestRows]);

  const formatRequestsData = (data) => {
    return data
      .map((inventoryRequest, index) => {
        const createdDate = new Date(
          ...inventoryRequest.creationDateTime.slice(0, 6)
        );
        return {
          id: index + 1, // Temporary ID, will be reassigned later
          date: createdDate.toLocaleDateString('en-US'),
          time: createdDate.toLocaleTimeString('en-US'),
          reason: inventoryRequest.reason,
          status: inventoryRequest.reqStatus,
          quantity: inventoryRequest.quantity,
          createdDateTime: createdDate,
          receivedDate: inventoryRequest.updateDateTime ? new Date(...inventoryRequest.updateDateTime.slice(0, 6)).toLocaleDateString('en-US') : '',
          itemId: inventoryRequest.itemId,
          itemName: inventoryRequest.itemName,  // Assuming the itemName field exists in your data
          workSite: inventoryRequest.workSite,
          reqId: inventoryRequest.reqId,
          role: inventoryRequest.role,  // Adding role field
        };
      })
      .sort((a, b) => b.createdDateTime - a.createdDateTime);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const columns = [
    { field: 'id', headerName: 'Inventory Request No:', width: 200 },
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
            backgroundColor = '#ADD8E6';
            break;
          case 'ACCEPTED':
            backgroundColor = '#90EE90';
            break;
          case 'REJECTED':
            backgroundColor = '#F08080';
            break;
          case 'SENT_TO_ADMIN':
            backgroundColor = '#FFFFE0';
            break;
          case 'WANT_TO_RETURN_ITEM':
            backgroundColor = '#FFCC00';
            break;
          default:
            backgroundColor = '#FFFFFF';
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

  // New columns for "Items On My Hand"
  const itemsOnHandColumns = [
    { field: 'id', headerName: 'Inventory Request No:', width: 200 },
    { field: 'itemName', headerName: 'Item Name', width: 250 },
    { field: 'date', headerName: 'Received Date', width: 300 },
    { field: 'quantity', headerName: 'Requested Quantity', width: 250 },
  ];

  const filteredReviewingRequestRows = reviewingRequestRows
  .filter(row => row.status !== 'WANT_TO_RETURN_ITEM')
  .sort((a, b) => {
    // *** Sorting logic to move 'PENDING' status rows to the top ***
    if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
    if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
    return 0;
  });

  return (
    <Box sx={{ width: '100%' }}>
      <div className="flex justify-end">
        <Button
          className="text-white bg-blue-600 rounded hover:bg-blue-400"
          onClick={() => navigate('/in-request/create-new-in-request')}
        >
          Create New Inventory Request
        </Button>
      </div>
      
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Employee Requests" value="1"/>
            <Tab label="My Requests" value="2" />
            <Tab label="Items On My Hand" value="3" /> {/* New tab for Items On My Hand */}
          </TabList>
        </Box>
        <TabPanel value="1">
          <SectionHeader title="Employee Inventory Requests List" color="#3f51b5" />
          <Table 
            rows={filteredReviewingRequestRows} 
            columns={columns} 
            loading={loadingRequests} 
            onRowClick={(params) => navigate(`/employee/in-request-document/${params.row.reqId}`)} 
          />
        </TabPanel>

        <TabPanel value="2">
          <SectionHeader title="My Inventory Requests" color="#3f51b5" />
          <Table 
            rows={myRequestRows} 
            columns={columns} 
            loading={loadingRequests} 
            onRowClick={(params) => navigate(`/employee/in-request-document/${params.row.reqId}`)} 
          />
        </TabPanel>

        <TabPanel value="3"> {/* New TabPanel for Items On My Hand */}
          <SectionHeader title="Items On My Hand" color="#3f51b5" />
          <Table 
            rows={itemsOnHandRows} 
            columns={itemsOnHandColumns} 
            loading={loadingRequests} 
            onRowClick={(params) => navigate(`/employee/in-request-document/${params.row.reqId}`)} 
          />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default RequestHandlerInRequestList;