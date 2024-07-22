import * as React from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginService from "../Login/LoginService";

const getStatusClass = (status) => {
  switch (status) {
    case "ACCEPTED":
      return "bg-green-500 text-white w-[90px]";
    case "REJECTED":
      return "bg-red-500 text-white text-sm w-[90px]";
    case "PENDING":
      return "bg-blue-500 text-white text-sm w-[90px]";
  }
};

const columns = [
  { field: 'id', headerName: 'Reference No.', width: 150 },
  { field: 'reason', headerName: 'Reason', width: 180 },
  { field: 'description', headerName: 'Description', width: 250 },
  { field: 'adjusted_Qty', headerName: 'Adjusted_Qty', width: 150 },
  { field: 'date', headerName: 'Date', width: 150 },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => (
      <div className={`p-2 rounded text-center ${getStatusClass(params.value)}`}>
        {params.value}
      </div>
    ),
  },
];

const AdminAdjustment = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const profile = await LoginService.getYourProfile(token);
        const userId = profile.users.userId;

        const response = await axios.get(`http://localhost:8080/adjustment/getAllById/${userId}`);
        const data = response.data.map((adj) => ({
          id: adj.adjId,
          reason: adj.reason,
          description: adj.description,
          adjusted_Qty: adj.adjustedQuantity,
          date: adj.date,
          status: adj.status
        }));

        // Sort the data to have PENDING adjustments at the beginning
        data.sort((a, b) => {
          if (a.status === "PENDING" && b.status !== "PENDING") {
            return -1;
          } else if (a.status !== "PENDING" && b.status === "PENDING") {
            return 1;
          } else {
            return 0;
          }
        });

        setRows(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
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
      <Box className="flex p-4 space-x-96">
        {rowSelectionModel.length > 0 ? (
          <div className="flex items-center ">
            {rows.find(row => row.id === rowSelectionModel[0]).status === "PENDING" && (
              <Button
                variant="contained"
                className="bg-blue-600 py-2 text-white rounded w-[auto]"
                onClick={handleClick}
              >
                Edit
              </Button>
            )}
            <div className="pl-10">
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
          <div className="flex items-center">
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
        disableMultipleSelection={true} // Prevent multiple row selection
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={handlerowSelectionModelChange}
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f5f5',
            borderBottom: '2px solid #000',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #ddd',
          },
          '& .MuiDataGrid-row': {
            borderBottom: '2px solid #000',
          },
          '& .MuiDataGrid-root': {
            border: '2px solid #000',
          },
        }}
      />
    </Box>
  );
};
export default AdminAdjustment;
