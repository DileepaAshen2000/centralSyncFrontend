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
      <div
        className={`p-2 rounded text-center ${getStatusClass(params.value)}`}
      >
        {params.value}
      </div>
    ),
  },
];

const UserAdjustment = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [profileInfo, setProfileInfo] = useState(null);

  useEffect(() => {
    fetchProfileInfo();
    const fetchAdjustments = async () => {
      try {
        const response = await axios.get("http://localhost:8080/adjustment/getAll");
        const filteredData = response.data
          .filter(adj => adj.userId !== 1) // Filter out adjustments created by the admin (1 is the admin userId)
          .map(adj => ({
            id: adj.adjId,
            reason: adj.reason,
            description: adj.description,
            adjusted_Qty: adj.adjustedQuantity,
            date: adj.date,
            status: adj.status
          }));

        // Sort the data to have PENDING adjustments at the beginning
        filteredData.sort((a, b) => {
          if (a.status === "PENDING" && b.status !== "PENDING") {
            return -1;
          } else if (a.status !== "PENDING" && b.status === "PENDING") {
            return 1;
          } else {
            return 0;
          }
        });

        setRows(filteredData);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchAdjustments();
  }, []);

  const fetchProfileInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await LoginService.getYourProfile(token);
      setProfileInfo(response.users);
    } catch (error) {
      console.error('Error fetching profile information:', error);
    }
  };

  const handlerowSelectionModelChange = (newSelectedRow) => {
    setRowSelectionModel(newSelectedRow);
  };

  const handleViewClick = () => {
    if (rowSelectionModel.length > 0) {
      const selectedAdjId = rowSelectionModel[0];
      navigate("/adjustment/" + selectedAdjId);
    } else {
      navigate("/newadjustment");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box className="h-[400px] w-full flex-row space-y-4">
      <Box className="flex p-4 space-x-96">
        {rowSelectionModel.length > 0 ? (
          <div className="flex items-center">
            <div className="pl-10">
              <Button
                variant="contained"
                className="bg-blue-600 py-2 text-white rounded w-[auto]"
                onClick={handleViewClick}
              >
                View
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <h1>Created By Employee or Request Handler</h1>
          </div>
        )}
      </Box>

      <Box className="bg-[#3f51b5] text-white font-medium p-4  mb-0 mt-8 flex items-center justify-center">
        <p>Employee & Request Handler Adjustment List</p>
      </Box>
      <DataGrid
        className="shadow-lg"
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

export default UserAdjustment;
