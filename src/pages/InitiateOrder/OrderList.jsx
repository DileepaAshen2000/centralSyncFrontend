import * as React from "react";
import Box from "@mui/material/Box";
import { Button, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const getStatusClass = (status) => {
  switch (status) {
    case "REVIEWED":
      return "bg-green-500 text-black w-[90px]";
    case "PENDING":
      return "bg-yellow-400 text-black text-sm w-[90px]";  
  }
};

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
    minwidth: 200,
    flex: 1,
    renderCell: (params) => (
      <div
        className={`p-2 rounded text-center ${getStatusClass(params.value)}`}
      >
        {params.value}
      </div>
    ),
  },
];

const OrderDataGrid = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  const handleRowSelectionModelChange = (newSelectedRow) => {
    setRowSelectionModel(newSelectedRow);
  };

  const handleView = () => {
    const selectedItemId = rowSelectionModel[0];
    navigate("/order/view-order/" + selectedItemId);
  };

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
            {/* <Button
              variant="contained"
              className="bg-blue-600 px-6 py-2 text-white rounded left-[45%] w-[145px]"
              onClick={handleEdit}
            >
              Edit
            </Button> */}

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
      {loading ? (
        <div className="flex justify-center mostRequestedItems-center">
          <CircularProgress />
        </div>
      ) : (
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
      )}
    </Box>
  );
};

export default OrderDataGrid;
