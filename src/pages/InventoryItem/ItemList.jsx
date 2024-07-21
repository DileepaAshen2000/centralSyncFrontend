import * as React from "react";
import Box from "@mui/material/Box";
import { Button, CircularProgress, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginService from "../Login/LoginService";

const getStatusClass = (status) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-500 text-black font-bold w-[90px]";
    case "INACTIVE":
      return "bg-red-500 text-black font-bold w-[90px]";
  }
};

const columns = [
  {
    field: "id",
    headerName: "Item ID",
    minwidth: 50,
    editable: false,
    flex: 0.5,
  },
  {
    field: "item_name",
    headerName: "Item Name",
    minwidth: 220,
    editable: false,
    flex: 1.25,
  },
  {
    field: "brand",
    headerName: "Brand",
    minwidth: 150,
    editable: false,
    flex: 1,
  },
  {
    field: "model",
    headerName: "Model",
    minwidth: 200,
    editable: false,
    flex: 1,
  },
  {
    field: "group",
    headerName: "Group",
    minwidth: 300,
    editable: false,
    flex: 1.5,
  },

  {
    field: "quantity",
    headerName: "Quantity",
    type: "number",
    minwidth: 100,
    editable: false,
    flex: 0.5,
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

const ItemDataGrid = () => {
  const navigate = useNavigate();
  const isAdmin = LoginService.isAdmin();
  const [loading, setLoading] = useState();
  const [rows, setRows] = useState([]);

  const categoryMapping = {
    COMPUTERS_AND_LAPTOPS: "Computers & Laptops",
    COMPUTER_ACCESSORIES: "Computer Accessories",
    PRINTERS_AND_SCANNERS: "Printers & Scanners",
    COMPUTER_HARDWARE: "Computer Hardware",
    FURNITURE: "Furniture",
    OFFICE_SUPPLIES: "Office supplies",
    OTHER: "Other",
  };
  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8080/inventory-item/getAll"
        );
        console.log(response.data);
        const data = response.data.map((item) => ({
          id: item.itemId,
          item_name: item.itemName,
          model: item.model,
          group: categoryMapping[item.itemGroup],
          brand: item.brand,
          quantity: item.quantity,
          status: item.status,
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

  const handleClick = (params) => {
    const selectedItemId = params.id;
    navigate("/item/view-item/" + selectedItemId);
  };

  return (
    <Box className="h-[400px] w-full h-full">
      {isAdmin && (
         <Button
            variant="contained"
            className="bg-blue-600 px-6 py-2 text-white rounded left-[85%] w-[145px]"
             onClick={() => navigate("/item/add-item")}
        >
          Add items
        </Button>
      )}
      <Box className="bg-[#3f51b5] text-white font-medium p-4  mb-0 mt-8 flex items-center justify-center">
        <p>Inventory Item List</p>
      </Box>
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
                pageSize: 10,
              },
            },
          }}
          autoHeight
          pageSizeOptions={[10]}
          onRowClick={handleClick}
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

export default ItemDataGrid;
