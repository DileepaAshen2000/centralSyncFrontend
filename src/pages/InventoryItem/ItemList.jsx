import * as React from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const columns = [
  { field: "id", headerName: "Item ID", width: 150 },
  {
    field: "item_name",
    headerName: "Item Name",
    minwidth: 200,
    editable: false,
    flex: 1,
  },
  {
    field: "group",
    headerName: "Group",
    minwidth: 200,
    editable: false,
    flex: 1,
  },
  {
    field: "quantity",
    headerName: "Quantity",
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

const ItemDataGrid = () => {
  const navigate = useNavigate();

 
  const [rows, setRows] = useState([]); 

 
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/inventory-item/getAll"
        );
        console.log(response.data);
        const data = response.data.map((item) => ({
          id: item.itemId,
          item_name: item.itemName,
          group: item.itemGroup,
          quantity: item.quantity,
          status: item.status,
        }));
        
        setRows(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleRowSelectionModelChange = (newSelectedRow) => {
    setRowSelectionModel(newSelectedRow);
  };

  const handleView = () => {
    const selectedItemId = rowSelectionModel[0];
    navigate("/item/view-item/" + selectedItemId);
  };

  const handleEdit = () => {
    const selectedItemId = rowSelectionModel[0];
    navigate("/item/edit-item/" + selectedItemId);
  };

  return (
    <Box className="h-[400px] w-full">
      <Box className="py-4">
        <h1 className="block text-3xl font-bold">All items</h1>
        <p className="inline-block">Here are all inventory items!!</p>
        {rowSelectionModel > 0 ? (
          <>
            <Button
              variant="contained"
              className="bg-blue-600  py-2 text-white rounded left-[40%] w-[145px]"
              onClick={handleEdit}
            >
              Edit
            </Button>

            <Button
              variant="contained"
              className="bg-blue-600  py-2 text-white rounded left-[48%] w-[145px]"
              onClick={handleView}
            >
              View
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            className="bg-blue-600 px-6 py-2 text-white rounded left-[62%] w-[145px]"
            onClick={() => navigate("/item/add-item")}
          >
            Add items
          </Button>
        )}
      </Box>

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
        checkboxSelection
        disableRowSelectionOnClick
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={handleRowSelectionModelChange}
      />
    </Box>
  );
};

export default ItemDataGrid;
