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
  useEffect(() => {
    axios
      .get("http://localhost:8080/inventory-item/getAll")
      .then((response) => {
        const data = response.data.map((item, index) => ({
          id: index + 1,
          item_name: item.itemName,
          group: item.itemGroup,
          quantity: item.quantity,
          status: item.status,
        }));
        setRows(data);
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
      navigate("/item/edit-item/" + selectedItemId);
    } else {
      navigate("/item/add-item");
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
        <h1 className="inline-block text-3xl font-bold p-4">All items</h1>
        {rowSelectionModel > 0 ? (
          <Button
            variant="contained"
            className="bg-blue-600 px-6 py-2 text-white rounded left-[72%]"
            onClick={handleClick}
          >
            View Details
          </Button>
        ) : (
          <Button
            variant="contained"
            className="bg-blue-600 px-6 py-2 text-white rounded left-[72%]"
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

export default ItemDataGrid;
