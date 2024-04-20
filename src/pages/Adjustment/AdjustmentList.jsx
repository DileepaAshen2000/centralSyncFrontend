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
    <Box
      sx={{
        height: 400,
        width: "100%",
      }}
    >
      <Box className='flex pt-2 pb-2'>
        <h1 className="inline-block p-4 text-3xl font-bold">Adjustment</h1>
        {/* <p>Here are all Adjustment</p> */}
        {rowSelectionModel > 0 ? (
            <div className="flex items-center gap-4 ml-[48%]">
                <Button
                    variant="contained"
                    className="bg-blue-600 px-6 py-2 text-white rounded left-[68%]"
                    onClick={handleClick}
                >
                    Edit
                </Button>

                <Button
                    variant="contained"
                    className="bg-blue-600 px-6 py-2 text-white rounded left-[68%]"
                    onClick={handleViewClick}
                >
                    View
                </Button>
            </div>
        ) : (
          <Button
            variant="contained"
            className="bg-blue-600 text-white rounded left-[62%]"
            onClick={() => navigate("/newadjustment")}
          >
            New Adjustment
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
export default AdjustmentList;
