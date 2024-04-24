import React from 'react'
import Box from '@mui/material/Box';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const columns = [
  { field: 'id', headerName: 'Request ID', width: 150 },
  { field: 'reason', headerName: 'Reason', width: 180 },
  { field: 'department', headerName: 'Department', width: 300 },
  { field: 'employeeName', headerName: 'Role', width: 150 },
  { field: 'status', headerName: 'Status', width: 100 },
];


function Table() {
  const navigate = useNavigate();
  const [rows, setData] = useState([])
  useEffect(() => {
    axios.get('http://localhost:8080/request/getAll')
    
      .then((response) => {
     
      const data = response.data.map((inventoryRequest,index) => ({
        
        id: index+1,
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
