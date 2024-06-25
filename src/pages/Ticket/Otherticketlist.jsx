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
  { field: "topic", headerName: "Topic", width: 200 },
  { field: "date", headerName: "Date", width: 200 },
  { field: "itemName", headerName: "Item Name", width: 200 },
  { field: "itemBrand", headerName: "Item Brand", width: 200 },
  { field: "ticketStatus", headerName: "Status", width: 200 },

  //{ field: 'status', headerName: 'Status', width: 130 },
];

const Ticket = () => {
  const navigate = useNavigate();
  const { ID } = useParams();
  const [rows, setRows] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState({});
  const [profileInfo, setProfileInfo] = useState({});

  const isAdmin = LoginService.isAdmin();
  const isRequestHandler = LoginService.isReqHandler();

  useEffect(() => {
    const fetchProfileInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await LoginService.getYourProfile(token);
        console.log("Profile Info Response:", response);
        setProfileInfo(response.users);
      } catch (error) {
        console.error("Error fetching profile information:", error);
      }
    };

    fetchProfileInfo();
  }, []);

  useEffect(() => {
    //console.log("Profile Info:", profileInfo);
    if (profileInfo.userId) {
      fetchTickets();
    }
  }, [profileInfo]);

  const fetchTickets = () => {
    axios
      .get("http://localhost:8080/ticket/getAll")
      .then((response) => {
        const data = response.data
          .filter((ticket) => {
            if (isAdmin) {
              return (
                ticket.user.role === "REQUEST_HANDLER" ||
                ticket.ticketStatus === "SENT_TO_ADMIN"||
                ticket.ticketStatus === "ACCEPTED"||
                ticket.ticketStatus === "REJECTED_A"

              );
            } else {
              console.log("user" + ticket.user.userId);
              console.log("profile" + profileInfo.userId);
              return ticket.user.userId !== profileInfo.userId;
            }
          })
          .map((ticket) => ({
            id: ticket.ticketId,
            topic: ticket.topic,
            date: ticket.date,
            itemName: ticket.itemId.itemName,
            itemBrand: ticket.itemId.brand,
            ticketStatus:
              isAdmin && ticket.ticketStatus === "SENT_TO_ADMIN"
                ? "Pending"
                : ticket.ticketStatus === "REJECTED_A" ||
                  ticket.ticketStatus === "REJECTED_R"
                ? "Rejected"
                : ticket.ticketStatus,
          }));
        setRows(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const handleRowSelectionModelChange = (newSelectedRow) => {
    setRowSelectionModel(newSelectedRow);
  };

  const handleDelete = () => {
    const ticketId = rowSelectionModel[0];
    console.log(ticketId);

    axios
      .delete("http://localhost:8080/ticket/delete/" + ticketId)
      .then((response) => {
        // Reload tickets after deletion
        axios.get("http://localhost:8080/ticket/getAll").then((response) => {
          const data = response.data
            .filter((ticket) => ticket.userId !== loggedInUserId)
            .map((ticket) => ({
              id: ticket.ticketId,
              topic: ticket.topic,
              date: ticket.date,
              itemName: ticket.itemId.itemName,
              itemBrand: ticket.itemId.brand,
              ticketStatus:
              isAdmin && ticket.ticketStatus === "SENT_TO_ADMIN"
                ? "Pending"
                : ticket.ticketStatus === "REJECTED_A" ||
                  ticket.ticketStatus === "REJECTED_R"
                ? "Rejected"
                : ticket.ticketStatus,
            }));
          setRows(data);
        });
        setRowSelectionModel([]);
        Swal.fire({
          icon: "success",
          title: "Ticket deleted successfully",
          text: "Selected ticket have been deleted.",
        });
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Delete failed",
          text: "Failed to delete selected tickets.",
        });
      });
  };

  return (
    <Box
      sx={{
        height: 400,
        width: "100%",
      }}
    >
      <Box className="flex pt-2 pb-2">
        {rowSelectionModel > 0 && (
          <div className="flex items-center gap-4 ml-[48%]">
            <Button
              variant="contained"
              className="bg-blue-600 px-6 py-2 text-white rounded left-[68%]"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        ) 
        }
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

export default Ticket;