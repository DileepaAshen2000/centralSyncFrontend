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

// Define a functional component named Table to display data with a loading state
function Table({ rows, columns, loading, onRowClick }) {
  // Show a loading spinner if data is being fetched
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Display the DataGrid with rows and columns once the data is fetched
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
}

// Define the main component for displaying employee requests and items
const EmployeeInRequestList = () => {
  const navigate = useNavigate();
  const [isEmployee, setIsEmployee] = useState(false);
  const [isOnlineEmployee, setIsOnlineEmployee] = useState(false);
  const [value, setValue] = useState('1');
  const [requestRows, setRequestRows] = useState([]);
  const [itemsRows, setItemsRows] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingItems, setLoadingItems] = useState(true);

  // useEffect to check employee status and fetch request data when component mounts
  useEffect(() => {
    checkEmployeeStatus();
    fetchRequestsData();
  }, []);

  // Function to check if the user is an employee and if they are online
  const checkEmployeeStatus = () => {
    setIsEmployee(LoginService.isEmployee());
    setIsOnlineEmployee(LoginService.isOnlineEmployee());
  };

  // Function to fetch item details by itemId
  const fetchItemDetails = async (itemId) => {
    try {
      const response = await axios.get(`http://localhost:8080/inventory-item/getById/${itemId}`);
      return response.data.itemName;
    } catch (error) {
      console.error(`Failed to fetch item details for itemId ${itemId}:`, error);
      return '';
    }
  };

  // Function to fetch request data from the server
  const fetchRequestsData = async () => {
    try {
      const userId = LoginService.returnUserID();
      const response = await axios.get(`http://localhost:8080/request/user/${userId}`);
      let data = formatRequestsData(response.data);

      if (isOnlineEmployee) {
        // Filter out requests with status "DISPATCHED" or "RECEIVED" if the user is an online employee
        data = data.filter(request => request.status !== 'DISPATCHED' && request.status !== 'RECEIVED');
      } else {
        // Filter out requests with workSite "ONSITE" and status "RECEIVED" or "DISPATCHED" if the user is not an online employee
        data = data.filter(request => !(request.workSite === 'ONSITE' && (request.status === 'RECEIVED' || request.status === 'DISPATCHED')));
      }

      setRequestRows(data);
      setLoadingRequests(false);

      // Filter the requests for items in hand
      const receivedItems = data.filter(item => item.status === 'RECEIVED');

      // Fetch item names for the received items
      const itemDetailsPromises = receivedItems.map(item => fetchItemDetails(item.itemId));
      const itemNames = await Promise.all(itemDetailsPromises);

      // Add item names to the received items
      const receivedItemsWithNames = receivedItems.map((item, index) => ({
        ...item,
        itemName: itemNames[index],
      }));

      setItemsRows(receivedItemsWithNames);
      setLoadingItems(false);
    } catch (error) {
      console.error('Failed to fetch inventory requests:', error);
      setLoadingRequests(false);
      setLoadingItems(false);
    }
  };

  // Function to format the request data
  const formatRequestsData = (data) => {
    return data
      .map((inventoryRequest, index) => {
        const createdDate = new Date(
          ...inventoryRequest.creationDateTime.slice(0, 6)
        );
        return {
          id: index + 1,
          date: createdDate.toLocaleDateString('en-US'),
          time: createdDate.toLocaleTimeString('en-US'),
          reason: inventoryRequest.reason,
          status: inventoryRequest.reqStatus,
          quantity: inventoryRequest.quantity,
          createdDateTime: createdDate,
          receivedDate: inventoryRequest.updateDateTime ? new Date(...inventoryRequest.updateDateTime.slice(0, 6)).toLocaleDateString('en-US') : '',
          itemId: inventoryRequest.itemId, // Add itemId for later use
          workSite: inventoryRequest.workSite, // Add workSite for filtering
          reqId: inventoryRequest.reqId, // Add reqId for navigation
        };
      })
      .sort((a, b) => b.createdDateTime - a.createdDateTime)
      .map((item, index) => ({
        ...item,
        id: index + 1,
      }));
  };

  // Handler for changing the tab
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Define columns for the requests table
  const requestColumns = [
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
        // Determine the background color based on the status
        switch (status) {
          case 'PENDING':
            backgroundColor = '#ADD8E6'; // lightblue
            break;
          case 'ACCEPTED':
            backgroundColor = '#90EE90'; // lightgreen
            break;
          case 'REJECTED':
            backgroundColor = '#F08080'; // lightcoral
            break;
          case 'SENT_TO_ADMIN':
            backgroundColor = '#FFFFE0'; // lightyellow
            break;
          case 'DISPATCHED':
            backgroundColor = '#FFA07A'; // light orange
            break;
            case 'RECEIVED':
              backgroundColor = '#D8BFD8'; // thistle
              break;
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

  // Define columns for the items table
  const itemsColumns = [
    { field: 'id', headerName: 'No:', width: 200 },
    { field: 'itemName', headerName: 'Item Name', width: 250 },
    { field: 'date', headerName: 'Received Date', width: 300 },
    { field: 'quantity', headerName: 'Requested Quantity', width: 250 },
  ];

  return (
    <Box>
      <div className="flex justify-end">
        <Button
          className="text-white bg-blue-600 rounded hover:bg-blue-400"
          onClick={() => navigate('/in-request/create-new-in-request')}
        >
          {isEmployee && isOnlineEmployee ? 'Create New Delivery Request' : 'Create New Inventory Request'}
        </Button>
      </div>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="My Requests" value="1" />
            <Tab label="Items in My Hand" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          {isEmployee && isOnlineEmployee ? (
            <SectionHeader title="My Delivery Request List" color="#006400" />
          ) : (
            <SectionHeader title="My Inventory Request List" color="#00008B" />
          )}
          <Table rows={requestRows} columns={requestColumns} loading={loadingRequests} onRowClick={(params) => navigate(`/employee/in-request-document/${params.row.reqId}`)} />
        </TabPanel>
        <TabPanel value="2">
        {isEmployee && isOnlineEmployee ? (
          <SectionHeader title="Items In My Home" color="#6a1b9a" />
        ) : (
<SectionHeader title="Items In My Hand" color="#6a1b9a" />
        )}
          <Table rows={itemsRows} columns={itemsColumns} loading={loadingItems} onRowClick={(params) => navigate(`/employee/in-request-document/${params.row.reqId}`)} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

// SectionHeader component for consistent header styling
const SectionHeader = ({ title, color }) => (
  <Box className="flex flex-col items-center pb-4">
    <Box className="w-full text-white text-center py-4 m-4" sx={{ backgroundColor: color }}>
      <header className="text-3xl font-bold">{title}</header>
    </Box>
  </Box>
);

export default EmployeeInRequestList;
