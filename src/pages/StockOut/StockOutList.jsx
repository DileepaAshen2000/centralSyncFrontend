import * as React from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const columns = [
    { field: 'id', headerName: 'Stock-Out ID', width: 120 },
    { field: 'itemId', headerName: 'Item ID', width: 120 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'quantity', headerName: 'Quantity Out', width: 150 },
    { field: 'date', headerName: 'Date', width: 160 },
    { field: 'department', headerName: 'Department', width: 180 }
  ];

const StockOutList = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8080/stock-out/getAll")
      .then((response) => {
        const data = response.data.map((stockOut) => ({
            id: stockOut.soutId,
            itemId: stockOut.itemId.itemId,
            description: stockOut.description,
            quantity: stockOut.outQty,
            date: stockOut.date,
            department:stockOut.department
        }));
        setRows(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const handlerowSelectionModelChange = (newSelectedRow) => {
    setRowSelectionModel(newSelectedRow);
  };

  const handleViewClick = () => {
    if (rowSelectionModel > 0) {
      const selectedStockOutId = rowSelectionModel[0];
      navigate("/stockOut/" + selectedStockOutId);
    } else {
      navigate("/stockOut");
    }
  };

  return (
    <Box className="h-[400px] w-full flex-row space-y-4">
      <Box className='flex py-4 space-x-96"'>
        <div>
          <h1 className="inline-block text-3xl font-bold">Stock Out</h1>
          <p>Here are all Stock-Out</p>
        </div>
        {rowSelectionModel > 0 ? (
            <div className="flex items-center ml-[75%]">
                <Button
                    variant="contained"
                    className="bg-blue-600 py-2  text-white rounded w-[auto]"
                    onClick={handleViewClick}
                >
                    View
                </Button>
            </div>
        ) : (
          <div className="flex items-center ml-[70%]">
            <Button
              variant="contained"
              className="bg-blue-600 py-2  text-white rounded w-[auto]"
              onClick={() => navigate("/new-stockout")}
            >
              New Stock-Out
            </Button>
          </div>
        )}
      </Box>

      <DataGrid className='shadow-lg'
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        autoHeight
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={handlerowSelectionModelChange}
      />
    </Box>
  );
};
export default StockOutList;
