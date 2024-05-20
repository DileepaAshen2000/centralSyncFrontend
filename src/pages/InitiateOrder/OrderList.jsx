import * as React from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

//Define columns of the datagrid
const columns = [
  { field: "id", headerName: "Order ID", width: 150 },
  {
    field: "email_address",
    headerName: "Email Address",
    minwidth: 200,
    editable: false,
    flex: 1,
  },
  {
    field: "vendor_name",
    headerName: "Vendor Name",
    minwidth: 200,
    editable: false,
    flex: 1,
  },
  {
    field: "date",
    headerName: "Date",
    type: "number",
    minwidth: 150,
    editable: true,
    flex: 1,
  },
  {
    field: "status",
    headerName: "Status",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    minwidth: 200,
    flex: 1,
  },
];

const OrderDataGrid = () => {
  const navigate = useNavigate();

  // State for storing the rows of the data grid
  const [rows, setRows] = useState([]);

// Fetching data from the API
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/orders/getAll");
      const data = response.data.map((order) => ({
        id: order.orderId,
        email_address: order.vendorEmail,
        vendor_name: order.vendorName,
        date: order.date,
        status: order.status,
      }));
      setRows(data);
    } catch (error) {
      console.log(error);
    }
  };

  fetchData();
}, []);


  // State for storing the selected rows of the data grid
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  // Handler for changing the selected rows
  const handleRowSelectionModelChange = (newSelectedRow) => {
    setRowSelectionModel(newSelectedRow);
  };

  // Handler for viewing the selected order
  const handleView = () => {
    const selectedItemId = rowSelectionModel[0];
    navigate("/order/view-order/" + selectedItemId);
  };

  // Handler for editing the selected order
  const handleEdit = () => {
    const selectedItemId = rowSelectionModel[0];
    navigate("/order/edit-order/" + selectedItemId);
  };

  return (
    <Box className="h-[400px] w-full">
      <Box className="py-4">
        <h1 className="block text-3xl font-bold">Orders</h1>
        <p className="inline-block">Here are all orders!!</p>
        {rowSelectionModel > 0 ? (
          <>
            <Button
              variant="contained"
              className="bg-blue-600 px-6 py-2 text-white rounded left-[45%] w-[145px]"
              onClick={handleEdit}
            >
              Edit
            </Button>

            <Button
              variant="contained"
              className="bg-blue-600  py-2 text-white rounded left-[55%] w-[145px]"
              onClick={handleView}
            >
              View
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            className="bg-blue-600 px-6 py-2 text-white rounded left-[70%] w-[145px]"
            onClick={() => navigate("/order/new-order")}
          >
            New Order
          </Button>
        )}
      </Box>

      {/* Data grid component */}
      <DataGrid
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
        onRowSelectionModelChange={handleRowSelectionModelChange}
      />
    </Box>
  );
};

export default OrderDataGrid;
