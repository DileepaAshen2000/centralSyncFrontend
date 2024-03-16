import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Stack, Select } from "@mui/material";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";

const columns = [
  { field: "id", headerName: "ID", width: 200 },
  { field: "employeesName", headerName: "Employees Name", width: 200 },
  { field: "email", headerName: "Email Address", width: 230 },
  { field: "department", headerName: "Department", width: 200 },
  { field: "role", headerName: "Role", width: 200 },
  //{ field: 'status', headerName: 'Status', width: 130 },
];

export default function UserTable() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8080/user/getAll")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const mappedData = data.map((user, index) => ({
          id: index + 102,
          employeesName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          department: user.department,
          role: user.role,
          status: user.status,
        }));
        setRows(mappedData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const handleRowSelectionModelChange = (newSelectedRow) => {
    setRowSelectionModel(newSelectedRow);
  };

  const handleClick = () => {
    if (rowSelectionModel > 0) {
      const selectedItemId = rowSelectionModel[0];
      navigate("/user/users/" + selectedItemId);
    } else {
      navigate("/user/add");
    }
  };

  return (
    <Box
      sx={{
        height: 400,
        width: "100%",
      }}
    >
      <Box>
        {rowSelectionModel > 0 ? (
          <div className="pb-5 pl-[1000px]">
            <Button
              type="submit"
              variant="outlined"
              className="bg-[#007EF2] w-[150px]  rounded-md text-white hover:text-[#007EF2]"
              onClick={handleClick}
            >
              View User
            </Button>
          </div>
        ) : (
          <div className="pb-5 pl-[1000px]">
            <Button
              type="submit"
              variant="outlined"
              className="bg-[#007EF2] w-[150px]  rounded-md text-white hover:text-[#007EF2]"
              onClick={() => navigate("/newUser")}
            >
              Add Employee
            </Button>
          </div>
        )}
      </Box>
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
      />
    </Box>
  );
}
