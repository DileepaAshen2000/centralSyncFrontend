import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'RequestID', width: 130 },
  { field: 'reason', headerName: 'Reason', width: 130 },
  { field: 'department', headerName: 'Department', width: 200 },
  { field: 'role', headerName: 'Role', width: 200 },
  {field: 'status',headerName: 'Status',width: 90,},

];

const rows = [
  { id: "R001", reason: 'Out of stock', department: 'Technology Department', role: 'Head of Technolgy', status: 'Pending'},
  { id: "R002", reason: 'Out of stock', department: 'Technology Department', role: 'Head of Technolgy', status: 'Pending'},
  { id: "R003", reason: 'Out of stock', department: 'Technology Department', role: 'Head of Technolgy', status: 'Accepted'},
  { id: "R004", reason: 'Out of stock', department: 'Technology Department', role: 'Head of Technolgy', status: 'Rejected'},
  { id: "R005", reason: 'Out of stock', department: 'Technology Department', role: 'Head of Technolgy', status: 'Rejected'},
];

export default function Table() {
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