import * as React from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const columns = [
    { field: 'id', headerName: 'StockIn ID', width: 150 },
    { field: 'itemId', headerName: 'Item ID', width: 180 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'quantity', headerName: 'Quantity In', width: 150 },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'location', headerName: 'Location', width: 100 },
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
    <Box
      sx={{
        height: 400,
        width: "100%",
      }}
    >
      <Box className='flex pt-2 pb-2'>
        <h1 className="inline-block p-4 text-3xl font-bold">Stock In</h1>
        {/* <p>Here are all Stock In</p> */}
        {rowSelectionModel > 0 ? (
            <div className="flex items-center gap-4 ml-[48%]">
                <Button
                    variant="contained"
                    className="px-6 py-2 text-white bg-blue-600 rounded ml-60"
                    onClick={handleViewClick}
                >
                    View
                </Button>
            </div>
        ) : (
          <Button
            variant="contained"
            className="bg-blue-600 px-6 text-white rounded left-[72%]"
            onClick={() => navigate("/new-stockin")}
          >
            New Stock-In
          </Button>
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
export default StockInList;
