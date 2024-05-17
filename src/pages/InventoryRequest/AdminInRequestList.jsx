import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

// Define columns for the DataGrid component
const columns = [
  { field: 'id', headerName: 'InRequest ID', width: 150 },
  { field: 'reason', headerName: 'Reason', width: 180 },
  { field: 'department', headerName: 'Department', width: 300 },
  { field: 'employeeName', headerName: 'Role', width: 150 },
  { field: 'status', headerName: 'Status', width: 100 },
];

// Define a functional component named MyRequestTable
function OnsiteInventoryRequestTable() {
  const navigate = useNavigate();
  const [rows, setData] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8080/request/getAll')
      .then((response) => {
        // Map response data to match DataGrid columns
        const data = response.data.map((inventoryRequest, index) => ({
          id: index + 1,
          reason: inventoryRequest.reason,
          department: inventoryRequest.department,
          employeeName: inventoryRequest.employeeName,
          status: inventoryRequest.reqStatus,
        }));
        setData(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [])


  return (
    <div>
      {/* Render DataGrid with fetched data */}
      <DataGrid
        rows={rows}
        columns={columns}
        onRowClick={(row) => {
          navigate(`/in-request-handler/in-request-document/${row.id}`)
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
function WorkFromHomeInventroyRequestTable() {
  const navigate = useNavigate();
  const [rows, setData] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8080/request/getAll')
      .then((response) => {
        // Map response data to match DataGrid columns
        const data = response.data.map((inventoryRequest, index) => ({
          id: index + 1,
          reason: inventoryRequest.reason,
          department: inventoryRequest.department,
          employeeName: inventoryRequest.employeeName,
          status: inventoryRequest.reqStatus,
        }));
        setData(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [])


  return (
    <div>
      {/* Render DataGrid with fetched data */}
      <DataGrid
        rows={rows}
        columns={columns}
        onRowClick={(row) => {
          navigate(`/inventory-request/request-document/${row.id}`)
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
  const [value, setValue] = React.useState('1');// State for currently selected tab

  // Handle tab change event
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      

      {/* Render tabs */}
      <h1 className="pt-2 pb-3 text-3xl font-bold ">&nbsp;&nbsp;Inventory Request Lists</h1>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Work From Home Inventroy Request Table" value="1" />
            <Tab label="Onsite Inventory Request Table" value="2" />
          </TabList>
        </Box>

        {/* Render tab panels */}
        <TabPanel value="1">
          <WorkFromHomeInventroyRequestTable/>
        </TabPanel>
        <TabPanel value="2"><OnsiteInventoryRequestTable/></TabPanel>
      </TabContext>
    </Box>
  );
}
