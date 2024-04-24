import * as React from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const columns = [
    { field: 'id', headerName: 'Adjustment ID', width: 150 },
    { field: 'reason', headerName: 'Reason', width: 180 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'adjusted_Qty', headerName: 'Adjusted_Qty', width: 150 },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'status', headerName: 'Status', width: 100 },
  ];

const AdjustmentList = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8080/adjustment/getAll")
      .then((response) => {
        const data = response.data.map((adj) => ({
            id: adj.adjId,
            reason: adj.reason,
            description: adj.description,
            adjusted_Qty: adj.newQuantity,
            date: adj.date,
            status:adj.status
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

  const handleClick = () => {
    if (rowSelectionModel > 0) {
      const selectedAdjId = rowSelectionModel[0];
      console.log("selected adj id :" + selectedAdjId);
      navigate("/adjustment/editadjustment/" + selectedAdjId);
    } else {
      navigate("/newadjustment");
    }
  };
  
  const handleViewClick = () => {
    if (rowSelectionModel > 0) {
      const selectedAdjId = rowSelectionModel[0];
      navigate("/adjustment/" + selectedAdjId);
    } else {
      navigate("/newadjustment");
    }
  };

  return (
    <Box className="h-[400px] w-full flex-row space-y-4">
      <Box className="flex py-4 space-x-96">
        <div>
          <h1 className="inline-block text-3xl font-bold">All Adjustment</h1>
          <p>Here are all Adjustment</p>
        </div>
        {rowSelectionModel > 0 ? (
          <div className="flex items-center gap-2 ">
            {rows.find(row => row.id === rowSelectionModel[0]).status === "PENDING" && (
              <Button
                variant="contained"
                className="bg-blue-600 py-2 text-white rounded w-[auto]"
                onClick={handleClick}
              >
                Edit
              </Button>
            )}
            <div className="flex items-center pl-72">
              <Button
                variant="contained"
                className="bg-blue-600  py-2 text-white rounded w-[auto]"
                onClick={handleViewClick}
              >
                View
              </Button>
            </div>
            
          </div>
        ) : (
          
          <div className="flex items-center pl-72">
            <Button
              variant="contained"
              className="bg-blue-600 py-2 text-white rounded w-[auto]"
              onClick={() => navigate("/newadjustment")}
            >
            New Adjustment
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
          disableMultipleSelection={true} // Prevent multiple row selection
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={handlerowSelectionModelChange}
        />
    </Box>
  );
};
export default AdjustmentList;
