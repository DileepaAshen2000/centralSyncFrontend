import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";

const columns = [
  { field: 'itemId', headerName: 'Item ID', width: 150 },
  { field: 'itemName', headerName: 'Item Name', width: 200 },
  {
    field: 'quantity',
    headerName: 'Quantity',
    width: 120,
    renderCell: (params) => (
      <Typography color="red">{params.value}</Typography>
    ),
  },
];

const LowStockTable = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/inventory-item/low-stock-items")
      .then((response) => {
        const data = response.data.map((item) => ({
          id: item.itemId,
          itemId: item.itemId,
          itemName: item.itemName,
          quantity: item.availableQuantity,
        }));
        setRows(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Box className="flex-row w-full space-y-4 bg-white rounded-lg shadow-lg">
      <h1 className="p-2 pl-4 text-sm text-left bg-red-200">Low Stock Items</h1>
      <DataGrid
        className='shadow-lg'
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 3,
            },
          },
        }}
        autoHeight
        pageSizeOptions={[3]}
        disableRowSelectionOnClick
        disableMultipleSelection={true} 
      />
    </Box>
  );
};

export default LowStockTable;
