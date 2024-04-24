import React from 'react'
import Box from '@mui/material/Box';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';


// Define columns for the DataGrid component
const columns = [
  { field: 'id', headerName: 'Request ID', width: 150 },
  { field: 'reason', headerName: 'Reason', width: 180 },
  { field: 'department', headerName: 'Department', width: 300 },
  { field: 'employeeName', headerName: 'Role', width: 150 },
  { field: 'status', headerName: 'Status', width: 100 },
];

// Define a functional component named Table
function Table() {
  // Initialize navigation functionality from React Router DOM
  const navigate = useNavigate();
    // Initialize state to hold data for the table rows
  const [rows, setData] = useState([])

   // Fetch data from the backend API when the component mounts
  useEffect(() => {
    axios.get('http://localhost:8080/request/getAll')
      .then((response) => {
        // Map the response data to match the table columns
      const data = response.data.map((inventoryRequest,index) => ({
        id: index+1,
        reason: inventoryRequest.reason,
        department: inventoryRequest.department,
        employeeName: inventoryRequest.employeeName,
        status: inventoryRequest.reqStatus,
      }));
      // Set the mapped data to the state variable
      setData(data);
      console.log(data);
      })
      // Handle any errors from the API call
      .catch((error) => {
        console.log(error);
      });
  }, [])

   // Render the table component with the fetched data
    return (
      <div>
        <DataGrid
          rows={rows}
          columns={columns}
          onRowClick={(row) => {
            navigate(`/employee/in-request-document/${row.id}`)
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
 
  
// Define a functional component named EmployeeInRequestList
const EmployeeInRequestList = () => {

  const navigate = useNavigate();
  return (
<Box>
<div class ="flex justify-end ...">
<Button className="text-white
       bg-blue-600 rounded
        hover:bg-blue-300"
        onClick={() => navigate("/in-request/create-new-in-request")}
        >Create New Inventrory Request</Button>
        </div>
<Box className="flex pb-4">
    <Box>
      <h1 className="pt-2 pb-3 text-3xl font-bold ">Request List</h1>
      <p>Here is a list of all request</p>
    </Box> 
</Box>
<Table/>
</Box>
)
}
export default EmployeeInRequestList
