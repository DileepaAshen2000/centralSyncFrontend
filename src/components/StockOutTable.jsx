import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useEffect, useState } from 'react'

const columns = [
  { field: 'id', headerName: 'Item ID', width: 150 },
  { field: 'name', headerName: 'Item Name', width: 180 },
  { field: 'department', headerName: 'Department', width: 300 },
  { field: 'quantity', headerName: 'Quantity', width: 150 },
  { field: 'date', headerName: 'Date', width: 150 },
];



export default function StockOutTable() {
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