import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useEffect, useState } from 'react'


const columns = [
  { field: 'id', headerName: 'Request ID', width: 150 },
  { field: 'reason', headerName: 'Reason', width: 180 },
  { field: 'department', headerName: 'Department', width: 300 },
  { field: 'employeeName', headerName: 'Role', width: 150 },
  { field: 'reqStatus', headerName: 'Status', width: 100 },
];


export default function Table() {
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
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
    
  );
}