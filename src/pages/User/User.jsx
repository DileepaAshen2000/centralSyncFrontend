import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Stack, Select,CircularProgress} from "@mui/material";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import LoginService from "../Login/LoginService";

const getStatusClass = (status) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-500 text-black w-[90px] font-bold";
    case "INACTIVE":
      return "bg-red-500 text-black text-sm w-[90px] font-bold";  
  }
};

const columns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "employeesName", headerName: "Employees Name", width: 200 },
  { field: "email", headerName: "Email Address", width: 250 },
  { field: "department", headerName: "Department", width: 150},
  { field: "role", headerName: "Role", width: 150 },
  {
    field: "status",
    headerName: "Status",
    width: 200,
    renderCell: (params) => (
      <div
        className={`p-2 rounded text-center ${getStatusClass(params.value)}`}
      >
        {params.value}
      </div>
    ),
  },
];

export default function User() {
  const navigate = useNavigate();
  const isRequestHandler = LoginService.isReqHandler();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8080/user/getAll")
      .then((response) => {
        console.log(response.data)
        const data = response.data.map((user) => ({
          id: user.userId,
          employeesName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          department: user.department,
          role: user.role,
          status: user.status,
        }));
        setRows(data);
      })
      
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
      
      
      
  }, []);

  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const handleRowSelectionModelChange = (newSelectedRow) => {
    setRowSelectionModel(newSelectedRow);
  };

  const handleClick = () => {
    if (rowSelectionModel > 0) {
      const selectedUserId = rowSelectionModel[0];
      navigate("/user/editUser/" + selectedUserId);
    } else {
      navigate("/newUser");
    }
  };

  const handleViewClick = () => {
    if (rowSelectionModel > 0) {
      const selectedUserId = rowSelectionModel[0];
      navigate("/user/users/" + selectedUserId);
    } else {
      navigate("/newUser");
    }
  };

  return (
    <Box
      sx={{
        height: 400,
        width: "100%",
      }}
    >    
 
       
       
        {rowSelectionModel > 0 ? (
          <div className="grid grid-cols-6 grid-rows-1 gap-y-7 gap-x-[0.25rem] mt-3 mb-6">
          <div className="col-start-4">
          {!isRequestHandler && (
            <Button
              variant="contained"
              className="bg-blue-600 px-6 py-2 text-white rounded left-[68%] w-[150px] ml-[70px]"
              onClick={handleClick}
            >
              Edit
            </Button>
          )}
          </div> 
        
          <div className="col-start-5">
            <Button
              variant="contained"
              className="bg-blue-600 px-6 py-2 text-white rounded left-[68%] ml-[70px] w-[150px]"
              onClick={handleViewClick}
            >
              View
            </Button>
          </div>
          </div>
        ) : (
          <div className="grid grid-cols-6 grid-rows-1 gap-y-7  gap-x-[0.25rem] mt-3 mb-6 ml-[70px]">
            <div className="col-start-6">
              {!isRequestHandler && (
                <Button
                  variant="contained"
                  className="bg-blue-600 w-[150px] rounded text-white h-10"
                  onClick={() => navigate("/newUser")}
                >
                  New User
                </Button>
              )}
              
            </div>
          </div>
        )}
        {loading ? (
        <div className="flex justify-center mostRequestedItems-center">
          <CircularProgress />
        </div>
      ):(
      <>
        <h1 className="text-white bg-[#3f51b5] p-3 text-center text-xl">All Users</h1>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        autoHeight
        pageSizeOptions={[5, 10]}
        checkboxSelection
        disableRowSelectionOnClick
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={handleRowSelectionModelChange}
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
       </>
      )}
      
    </Box>
   
  );
}
