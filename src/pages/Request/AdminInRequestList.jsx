import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

// Define columns for the DataGrid component
const columns = [
  { field: 'id', headerName: 'Inventory Request No:', width: 200 },
  { field: 'date', headerName: 'Date', width: 200 },
  { field: 'time', headerName: 'Time', width: 200 },
  { field: 'reason', headerName: 'Reason', width: 200 },
  { field: 'status', headerName: 'Status', width: 200 },
];

// Fetch data function
const fetchData = async (setInventoryRows, setDeliveryRows) => {
  try {
    const response = await axios.get('http://localhost:8080/request/getAll');
    const requests = response.data;
    console.log(requests);

    const data = await Promise.all(
      requests.map(async (request, index) => {
        try {
          const userResponse = await axios.get(`http://localhost:8080/user/users/${request.userId}`);
          const userData = userResponse.data;
          console.log(userData);

          return {
            id: index + 1,
            date: new Date(request.dateTime).toLocaleDateString('en-US'),
            time: new Date(request.dateTime).toLocaleTimeString('en-US'),
            reason: request.reason,
            status: request.reqStatus,
            workSite: userData.workSite, // Include work site status
          };
        } catch (userError) {
          console.error(`Failed to fetch user details for userId ${request.userId}:`, userError);
          return null; // Return null if fetching user details fails
        }
      })
    );

    // Filter out null values (failed fetches)
    const filteredData = data.filter((item) => item !== null);

    // Sort data by date and time
    filteredData.sort((a, b) => new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`));

    // Update IDs after sorting
    // const sortedData = filteredData.map((item, index) => ({
    //   ...item,
    //   id: index + 1,
    // }));

    // Split data into inventory and delivery requests based on work site status
    const inventoryRequests = filteredData.filter((item) => item.workSite === 'ONSITE');
    const deliveryRequests = filteredData.filter((item) => item.workSite === 'ONLINE');

    setInventoryRows(inventoryRequests);
    setDeliveryRows(deliveryRequests);
  } catch (error) {
    console.error('Failed to fetch inventory requests:', error);
  }
};

// Define a functional component named InventoryRequestTable
function InventoryRequestTable({ rows }) {
  const navigate = useNavigate();

  return (
    <div>
      {/* Render DataGrid with fetched data */}
      <DataGrid
        rows={rows}
        columns={columns}
        onRowClick={(params) => {
          navigate(`/employee/in-request-document/${params.id}`);
        }}
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

// Component to display employee inventory request list
function DeliveryRequestTable({ rows }) {
  const navigate = useNavigate();

  return (
    <div>
      {/* Render DataGrid with fetched data */}
      <DataGrid
        rows={rows}
        columns={columns}
        onRowClick={(params) => {
          navigate(`/employee/delivery-request-document/${params.id}`);
        }}
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

// Main component rendering tabs and respective tables
export default function LabTabs() {
  const [value, setValue] = React.useState('1'); // State for currently selected tab
  const [inventoryRows, setInventoryRows] = useState([]);
  const [deliveryRows, setDeliveryRows] = useState([]);

  useEffect(() => {
    fetchData(setInventoryRows, setDeliveryRows);
  }, []);

  // Handle tab change event
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      {/* Render tabs */}
      <h1 className="pt-2 pb-3 text-3xl font-bold">&nbsp;&nbsp;Inventory Request Lists</h1>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange}>
            <Tab label="Delivery Request Table" value="1" />
            <Tab label="Inventory Request Table" value="2" />
          </TabList>
        </Box>

        {/* Render tab panels */}
        <TabPanel value="1">
          <DeliveryRequestTable rows={deliveryRows} />
        </TabPanel>
        <TabPanel value="2">
          <InventoryRequestTable rows={inventoryRows} />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
