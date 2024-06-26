import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button, Stack, Select } from "@mui/material";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import Swal from "sweetalert2";
import LoginService from "../Login/LoginService";

const columns = [
  { field: "id", headerName: "ID", width: 200 },
  { field: "date", headerName: "Date", width: 200 },
  { field: "itemName", headerName: "Item Name", width: 200 },
  { field: "itemBrand", headerName: "Item Brand", width: 200 },
  { field: "ticketStatus", headerName: "Status", width: 200 }
];

const MyTicketList = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [fetchData, setFetchData] = useState(false);
  const [profileInfo, setProfileInfo] = useState({});
  const navigate = useNavigate();
  const { ID } = useParams();
  const [rows, setRows] = useState([]);

  const isAdmin = LoginService.isAdmin();
  const isRequestHandler = LoginService.isReqHandler();
  const isEmployee = LoginService.isEmployee();

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  useEffect(() => {
    if (profileInfo.userId) {
      fetchTickets(profileInfo.userId);
    }
  }, [profileInfo.userId]);

  const fetchProfileInfo = async () => {
    try {
      const token = localStorage.getItem("token");  
      const response = await LoginService.getYourProfile(token);
      setProfileInfo(response.users);
    } catch (error) {
      console.error("Error fetching profile information:", error);
    }
  };

  const fetchTickets = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/ticket/${userId}`);
      const data = response.data.map((ticket) => ({
        id: ticket.ticketId,
        topic: ticket.topic,
        date: ticket.date,
        itemName: ticket.itemId.itemName,
        itemBrand: ticket.itemId.brand,
        ticketStatus:
          isEmployee && (ticket.ticketStatus === "SENT_TO_ADMIN" || ticket.ticketStatus === "ACCEPTED")
            ? "Pending"
            : ticket.ticketStatus === "REJECTED_A" || ticket.ticketStatus === "REJECTED_R"
            ? "Rejected"
            : ticket.ticketStatus,
      }));
      setRows(data);
    } catch (error) {
      console.log(error);
    }
  }

  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const handleRowSelectionModelChange = (newSelectedRow) => {
    setRowSelectionModel(newSelectedRow);
  };

  const handleDelete = async () => {
    const ticketId = rowSelectionModel[0];
    console.log(ticketId);

    try {
      await axios.delete(`http://localhost:8080/ticket/delete/${ticketId}`);
      await fetchTickets(profileInfo.userId);

      Swal.fire({
        icon: "success",
        title: "Tickets deleted successfully",
        text: "Selected tickets have been deleted.",
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: "Failed to delete selected tickets.",
      });
    }
  };

  const handleEdit = () => {
    if (rowSelectionModel.length > 0) {
      const selectedUserId = rowSelectionModel[0];
      navigate("/ticket/editticket/" + selectedUserId);
    } else {
      navigate("/newUser");
    }
  };

  const handleView = () => {
    if (rowSelectionModel.length > 0) {
      const selectedUserId = rowSelectionModel[0];
      navigate("/ticket/ticketdoc/" + selectedUserId);
    }
  };

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <Box className="flex pb-2">
        {rowSelectionModel.length > 0 && (
          <>
            {rows.some(row => row.id === rowSelectionModel[0] && row.ticketStatus === "PENDING") && (
              <div className="grid grid-cols-11 grid-rows-1 gap-y-7 gap-x-[5] mb-2 ">
              <div className="col-start-9">
                <Button
                  variant="contained"
                  className="bg-blue-600 px-6 py-2 text-white rounded left-[68%] w-[150px] ml-[70px] "
                  onClick={handleEdit}
                >
                  Edit
                </Button>
              </div>
              </div>
            )}
            {isRequestHandler && rows.some(row => row.id === rowSelectionModel[0] && row.ticketStatus === "ACCEPTED") && (
              <div className="grid grid-cols-11 grid-rows-1 gap-y-7 gap-x-[5] mb-2 ">
              <div className="col-start-9">
                <Button
                  variant="contained"
                  className="bg-blue-600 px-6 py-2 text-white rounded left-[68%] w-[150px] ml-[70px]"
                  onClick={handleView}
                >
                  View
                </Button>
              </div>
              </div>
            
            )}
            
          </>
       
        )}
        {rowSelectionModel.length === 0 && (
          <div className="grid grid-cols-11 grid-rows-1 gap-y-7 gap-x-6 mb-3">
            <div className="col-start-9">
              <Button
                variant="contained"
                className="bg-blue-600 px-6 py-2 text-white rounded left-[68%] w-[150px] ml-[70px]"
                onClick={() => navigate("/newTicket")}
              >
                New Ticket
              </Button>
            </div>
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
};

export default MyTicketList;
