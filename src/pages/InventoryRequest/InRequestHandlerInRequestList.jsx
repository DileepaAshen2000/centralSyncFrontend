import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Button } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

const columns = [
  { field: 'id', headerName: 'InRequest ID', width: 150 },
  { field: 'reason', headerName: 'Reason', width: 180 },
  { field: 'department', headerName: 'Department', width: 300 },
  { field: 'employeeName', headerName: 'Role', width: 150 },
  { field: 'status', headerName: 'Status', width: 100 },
];

function MyRequestTable() {
  const navigate = useNavigate();
  const [rows, setData] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8080/request/getAll')

      .then((response) => {

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

function EmployeeRequestTable() {
  const navigate = useNavigate();
  const [rows, setData] = useState([])
  useEffect(() => {
    axios.get('http://localhost:8080/request/getAll')

      .then((response) => {

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
export default function LabTabs() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const navigate = useNavigate();

  return (
    
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <div class ="flex justify-end ...">
      {value !== '2' && (
      <Button className="text-white
       bg-blue-600 rounded
        hover:bg-blue-300"
        onClick={() => navigate("/inventory-request/create-new-request")}
        >Create New Inventrory Request</Button>
        
      )}
      </div>
      <h1 className="pt-2 pb-3 text-3xl font-bold ">&nbsp;&nbsp;Inventory Request Lists</h1>
        
      
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="My Inventory Request List" value="1" />
            <Tab label="Employee Inventroy Request List" value="2" />
           
          </TabList>
        </Box>
        <TabPanel value="1">
        <MyRequestTable/>
</TabPanel>
        <TabPanel value="2"><EmployeeRequestTable/></TabPanel>
      
      </TabContext>
    </Box>
  );
}
