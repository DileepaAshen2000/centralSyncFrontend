import * as React from "react";
import Box from "@mui/material/Box";
import { Button, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    field: "vendor_name",
    headerName: "Vendor Name",
    minwidth: 200,
    editable: false,
    flex: 1,
  },
  {
    field: "date_completed",
    headerName: "Date Completed",
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
      <div className="p-2 rounded text-center bg-green-400 text-black text-sm w-[95px]">
        {params.value}
      </div>
    ),
  },
];

const CompleteOrders = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/orders/getAll");
        const data = response.data
          .filter((order) => order.status === "COMPLETED")
          .map((order) => ({
            id: order.orderId,
            email_address: order.vendorEmail,
            vendor_name: order.vendorName,
            date_completed: order.dateCompleted,
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

 

  const handleRowClick = (params) => {
    const selectedItemId = params.row.id;
    console.log("ID", selectedItemId);
    navigate("/order/view-order/" + selectedItemId);
  };

  return (
    <Box className="h-[400px] w-full">
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
          onRowClick={handleRowClick}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              borderBottom: "2px solid #000",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #ddd",
            },
            "& .MuiDataGrid-row": {
              borderBottom: "2px solid #000",
            },
            "& .MuiDataGrid-root": {
              border: "2px solid #000",
            },
          }}
        />
      )}
    </Box>
  );
};

export default CompleteOrders;
