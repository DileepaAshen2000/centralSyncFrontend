import * as React from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const columns = [
    { field: 'id', headerName: 'StockIn ID', width: 120 },
    { field: 'itemId', headerName: 'Item ID', width: 120 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'quantity', headerName: 'Quantity In', width: 150 },
    { field: 'date', headerName: 'Date', width: 160 },
    { field: 'location', headerName: 'Location', width: 180 },
  ];

const StockInList = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8080/stock-in/getAll")
      .then((response) => {
        const data = response.data.map((stockIn) => ({
            id: stockIn.sinId,
            itemId: stockIn.itemId,
            description: stockIn.description,
            quantity: stockIn.inQty,
            date: stockIn.date,
            location:stockIn.location
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
      const selectedStockInId = rowSelectionModel[0];
      navigate("/stockIn/" + selectedStockInId);
    } else {
      navigate("/stockIn");
    }
  };

  return (
    <Box className="h-[400px] w-full flex-row space-y-4">
      <Box className='flex py-4 space-x-96"'>
        <div>
          <h1 className="inline-block text-3xl font-bold">Stock In</h1>
          <p>Here are all Stock-In</p>
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
              onClick={() => navigate("/new-stockin")}
            >
              New Stock-In
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
              pageSize: 10,
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
export default StockInList;
