import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useEffect, useState } from 'react'

const columns = [
  { field: 'id', headerName: 'Adjustment ID', width: 150 },
  { field: 'reason', headerName: 'Reason', width: 180 },
  { field: 'description', headerName: 'Description', width: 300 },
  { field: 'adjusted_Qty', headerName: 'Adjusted_Qty', width: 150 },
  { field: 'date', headerName: 'Date', width: 150 },
  { field: 'adjustment_Status', headerName: 'Adjustment_Status', width: 100 },
];



export default function Table() {
const [rows, setData] = useState([])
useEffect(() => {
  axios.get('http://localhost:8080/adjustment/getAll')
    .then((response) => {
   
    const data = response.data.map((adj) => ({
      
      id: adj.adjId,
      reason: adj.reason,
      description: adj.description,
      adjusted_Qty: adj.newQuantity,
      date: adj.date,
      adjustment_Status: adj.status,

    }));
    setData(data);
    })
    .catch((error) => {
      console.log(error);
    });
}, [])

  return (
    <div>
    
      <DataGrid
      className='shadow-lg'
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