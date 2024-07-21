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
function Table({ rows, columns, loading, onRowClick }) {
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
}

// Main component for displaying employee requests and items
const EmployeeDeRequestList = () => {
  const navigate = useNavigate();
  const [isEmployee, setIsEmployee] = useState(false);
  const [isReqHandler, setIsReqHandler] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [value, setValue] = useState('1');
  const [requestRows, setRequestRows] = useState([]);
  const [itemsRows, setItemsRows] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingItems, setLoadingItems] = useState(true);

    //state variables for counts
    const [pendingCount, setPendingCount] = useState(0);
    const [rejectedCount, setRejectedCount] = useState(0);
    const [receivedCount, setReceivedCount] = useState(0);
    const [dispatchedCount, setDispatchedCount] = useState(0);
    const [deliveredCount, setDeliveredCount] = useState(0);
    const [wantToReturnCount, setWantToReturnCount] = useState(0);

  useEffect(() => {
    checkEmployeeStatus();
    fetchRequestsData();
  }, []);

  const checkEmployeeStatus = () => {
    setIsEmployee(LoginService.isEmployee());
    setIsReqHandler(LoginService.isReqHandler());
    setIsAdmin(LoginService.isAdmin());
  };

  const fetchItemDetails = async (itemId) => {
    try {
      const response = await axios.get(`http://localhost:8080/inventory-item/getById/${itemId}`);
      return response.data.itemName;
    } catch (error) {
      console.error(`Failed to fetch item details for itemId ${itemId}:`, error);
      return '';
    }
  };

  const fetchRequestsData = async () => {
    try {
      const userId = LoginService.returnUserID();
      const response = await axios.get(`http://localhost:8080/request/user/${userId}`);
      let data = formatRequestsData(response.data);

       // Calculate counts
       setPendingCount(data.filter(item => item.status === 'PENDING').length);
       setRejectedCount(data.filter(item => item.status === 'REJECTED').length);
       setWantToReturnCount(data.filter(item => item.status === 'WANT_TO_RETURN_ITEM').length);
       setReceivedCount(data.filter(item => item.status === 'RECEIVED').length);
        setDispatchedCount(data.filter(item => item.status === 'DISPATCHED').length);
        console.log(data.filter(item => item.status === 'DISPATCHED').length);
        setDeliveredCount(data.filter(item => item.status === 'DELIVERED').length);



      const acceptedItems = data.filter(item => item.status === 'ACCEPTED' || item.status === 'WANT_TO_RETURN_ITEM');
      const acceptedItemDetailsPromises = acceptedItems.map(item => fetchItemDetails(item.itemId));
      const acceptedItemNames = await Promise.all(acceptedItemDetailsPromises);

      const acceptedItemsWithNames = acceptedItems.map((item, index) => ({
        ...item,
        itemName: acceptedItemNames[index],
      }));

      setRequestRows(data);
      setLoadingRequests(false);

      const receivedItems = data.filter(item => item.status === 'RECEIVED');
      const itemDetailsPromises = receivedItems.map(item => fetchItemDetails(item.itemId));
      const itemNames = await Promise.all(itemDetailsPromises);

      const receivedItemsWithNames = receivedItems.map((item, index) => ({
        ...item,
        itemName: itemNames[index],
      }));

      setItemsRows(receivedItemsWithNames.concat(acceptedItemsWithNames));
      setLoadingItems(false);

    } catch (error) {
      console.error('Failed to fetch inventory requests:', error);
      setLoadingRequests(false);
      setLoadingItems(false);
    }
  };

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
          itemName: inventoryRequest.itemName,
          status: inventoryRequest.reqStatus,
          quantity: inventoryRequest.quantity,
          createdDateTime: createdDate,
          receivedDate: inventoryRequest.updateDateTime ? new Date(...inventoryRequest.updateDateTime.slice(0, 6)).toLocaleDateString('en-US') : '',
          itemId: inventoryRequest.itemId,
          workSite: inventoryRequest.workSite,
          reqId: inventoryRequest.reqId,
        };
      })
      .sort((a, b) => {
        // Sort by status "PENDING" first, then by creation date
        if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
        if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
        if (a.status === 'DISPATCHED' && b.status !== 'DISPATCHED') return -1;
        if (a.status !== 'DISPATCHED' && b.status === 'DISPATCHED') return 1;
        if (a.status === 'DELIVERED' && b.status !== 'DELIVERED') return -1;
        if (a.status !== 'DELIVERED' && b.status === 'DELIVERED') return 1;
        if (a.status === 'RECEIVED' && b.status !== 'RECEIVED') return -1;
        if (a.status !== 'RECEIVED' && b.status === 'RECEIVED') return 1;
      })
      .map((item, index) => ({
        ...item,
        id: index + 1,
      }));
  };


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const requestColumns = [
    { field: 'reqId', headerName: 'Request Id', width: 200 },
    { field: 'date', headerName: 'Date', width: 200 },
    { field: 'time', headerName: 'Time', width: 200 },
    { field: 'itemName', headerName: 'Item Name', width: 200 },
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
          case 'REJECTED':
            backgroundColor = '#F08080';
            break;
       case 'WANT_TO_RETURN_ITEM':
            backgroundColor = '#af5c9b';
            break;
            case 'RECEIVED':
              backgroundColor = '#4540bd';
              break;
              case 'DELIVERED':
                backgroundColor = '#90EE90';
                break;
                case 'DISPATCHED':
                  backgroundColor = '#FFA500';
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

  const itemsColumns = [
    { field: 'reqId', headerName: 'Request Id', width: 180 },
    { field: 'itemName', headerName: 'Item Name', width: 180 },
    { field: 'date', headerName: 'Received Date', width: 180},
    { field: 'quantity', headerName: 'Requested Quantity', width: 180 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 210,
      renderCell: (params) => {
        const status = params.value;
        let backgroundColor;
        switch (status) {
          case 'PENDING':
            backgroundColor = '#ADD8E6';
            break;
          case 'REJECTED':
            backgroundColor = '#F08080';
            break;
            case 'RECEIVED':
            backgroundColor = '#7a7a7a';
            break;
            case 'DELIVERED':
              backgroundColor = '#90EE90';
              break;
          case 'WANT_TO_RETURN_ITEM':
            backgroundColor = '#af5c9b';
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


  const filteredRequestRows = requestRows
  .filter(row => row.status !== 'RECEIVED' && row.status !== 'WANT_TO_RETURN_ITEM')
  .map((item, index) => ({ ...item, id: index + 1 }));

const formattedItemsRows = itemsRows.map((item, index) => ({
  ...item,
  id: index + 1,
}));
  return (
    <Box sx={{ width: '100%' }}>
      <div className="flex justify-end">
        <Button
          className="text-white bg-blue-600 rounded hover:bg-blue-400"
          onClick={() => navigate('/in-request/create-new-in-request')}
        >
          Create New Delivery Request
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
        <SectionHeader title="Delivery Requests" color="#006400" />
          <Table 
            rows={filteredRequestRows} 
            columns={requestColumns} 
            loading={loadingRequests} 
            onRowClick={(params) => navigate(`/employee/de-request-document/${params.row.reqId}`)} 
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px' }}>
            <CountBox title="Pending Requests" count={pendingCount} backgroundColor="#ADD8E6" />
            <CountBox title="Rejected Requests" count={rejectedCount} backgroundColor="#F08080" />
            <CountBox title="Received Requests" count={receivedCount} backgroundColor="#4540bd" />
            <CountBox title="Dispatched Requests" count={dispatchedCount} backgroundColor="#FFA500" />
            <CountBox title="Delivered Requests" count={deliveredCount} backgroundColor="#90EE90" />
          </Box>
        </TabPanel>

        <TabPanel value="2">
          <SectionHeader title="Items In My Hand" color="#6a1b9a" />
          <Table 
            rows={formattedItemsRows} 
            columns={itemsColumns} 
            loading={loadingItems} 
            onRowClick={(params) => navigate(`/employee/de-request-document/${params.row.reqId}`)} 
          />
           <Box sx={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px' }}>
            <CountBox title="Recieved Requests" count={receivedCount} backgroundColor="#7a7a7a" />
            <CountBox title="Want To Return Item Requests" count={wantToReturnCount} backgroundColor="#af5c9b" />
          
          </Box>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

// SectionHeader component for displaying section headers
const SectionHeader = ({ title, color }) => {
  return (
    <Box sx={{ backgroundColor: color, padding: '16px', textAlign: 'center', color: 'white' }}>
      <h2>{title}</h2>
    </Box>
  );
};

// New code for CountBox component
const CountBox = ({ title, count, backgroundColor }) => {
  if (count === 0) {
    return null; // Return null to hide the box if count is 0
  }

  return (
    <Box sx={{
      textAlign: 'center',
      textStyle: 'bold',
      padding: '16px',
      borderRadius: '8px',
      backgroundColor: backgroundColor
    }}>
      <h3>{title}</h3>
      <p>{count}</p>
    </Box>
  );
};


export default EmployeeDeRequestList;
