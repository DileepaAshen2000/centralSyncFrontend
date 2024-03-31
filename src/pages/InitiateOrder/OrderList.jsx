import * as React from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

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
    field: "vendor",
    headerName: "Vendor",
    minwidth: 200,
    editable: false,
    flex: 1,
  },
  {
    field: "topic",
    headerName: "Topic",
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

  const [rows, setRows] = useState([]);
  const { fetchData } = useParams();
  useEffect(() => {
    axios
      .get("http://localhost:8080/orders/getAll")
      .then((response) => {
        const data = response.data.map((order, index) => ({
          id: order.orderId,
          email_address: order.vendorEmail,
          vendor: order.vendorName,
          topic: order.description,
          status: order.status,
        }));
        setRows(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [fetchData]);

  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const handleRowSelectionModelChange = (newSelectedRow) => {
    setRowSelectionModel(newSelectedRow);
  };

  const handleView = () => {
    const selectedItemId = rowSelectionModel[0];
    navigate("/order/view-order/" + selectedItemId);
  };

  const handleEdit=()=>{
    const selectedItemId = rowSelectionModel[0];
    navigate("/order/edit-order/" + selectedItemId);
  }

  return (
    <Box className="h-[400px] w-full">
      <Box>
        <h1 className="inline-block text-3xl font-bold p-4">Orders</h1>
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
              className="bg-blue-600  py-2 text-white rounded left-[54%] w-[145px]"
              onClick={handleView}
            >
              View
            </Button>
          </>
         
        ) : (
          <Button
            variant="contained"
            className="bg-blue-600 px-6 py-2 text-white rounded left-[69%] w-[145px]"
            onClick={() => navigate("/order/new-order")}
          >
            New Order
          </Button>
        )}
      </Box>

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
