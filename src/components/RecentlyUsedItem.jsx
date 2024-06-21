import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

const columns = [
  { field: 'itemId', headerName: 'Item ID', width: 150 },
  { field: 'itemName', headerName: 'Item Name', width: 200 },
  { field: 'stockOut', headerName: 'Stock Out', width: 120 },
];

const RecentlyUsedItem = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/stock-out/recently-used")
      .then((response) => {
        const data = response.data.map((item) => ({
          id: item.itemId,
          itemId: item.itemId,
          itemName: item.itemName,
          stockOut: item.totalStockOut,
        }));
        setRows(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Box className="flex-row w-full space-y-4 bg-white rounded-lg shadow-lg">
      <h1 className="p-2 pl-4 text-sm text-left bg-green-200">Recently Used Items</h1>
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

export default RecentlyUsedItem;
