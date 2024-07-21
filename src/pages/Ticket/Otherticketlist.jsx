import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button, Stack, Select,CircularProgress} from "@mui/material";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import Swal from "sweetalert2";
import LoginService from "../Login/LoginService";

const getStatusClass = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-500 text-black w-[120px] font-bold";
    case "COMPLETED":
      return "bg-green-500 text-black text-sm w-[120px] font-bold";
    case "IN PROGRESS":
      return "bg-blue-500 text-black w-[120px] font-bold";
    case "REJECTED":
      return "bg-red-500 text-black w-[120px] font-bold";
    case "ACCEPTED":
      return "bg-green-500 text-black w-[120px] font-bold";
    case "SENT TO ADMIN":
      return "bg-purple-500 text-black font-bold w-[120px]";

    default:
      return "bg-blue-500 text-white w-[120px] font-bold";
     
  }
};

const columns = [
  { field: "id", headerName: "ID", width: 200 },
  { field: "date", headerName: "Date", width: 200 },
  { field: "itemName", headerName: "Item Name", width: 200 },
  { field: "itemBrand", headerName: "Item Brand", width: 200 },
  {
    field: "ticketStatus",
    headerName: "Status",
    width: 200,
    renderCell: (params) => (
      <div
        className={`p-2 rounded text-center ${getStatusClass(params.value)}`}
      >
        {params.value}
      </div>
    ),
  },

  //{ field: 'status', headerName: 'Status', width: 130 },
];

const Ticket = () => {
  const navigate = useNavigate();
  const { ID } = useParams();
  const [rows, setRows] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState({});
  const [profileInfo, setProfileInfo] = useState({});
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    axios
      .get("http://localhost:8080/ticket/getAll")
      .then((response) => {
        const data = response.data
          .filter((ticket) => {
            if (isAdmin) {
              return (
                ticket.user.role === "REQUEST_HANDLER" ||
                ticket.ticketStatus === "SENT_TO_ADMIN" ||
                ticket.ticketStatus === "ACCEPTED" ||
                ticket.ticketStatus === "REJECTED_A"||
                ticket.previousStatus === "ACCEPTED" 
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
                ? "PENDING"
              :isAdmin && ticket.previousStatus === "ACCEPTED"
                ? "ACCEPTED"
                : ticket.ticketStatus === "REJECTED_A" ||
                  ticket.ticketStatus === "REJECTED_R"
                ? "REJECTED"
                : ticket.ticketStatus === "SENT_TO_ADMIN"
                ? "SENT TO ADMIN"
                : ticket.ticketStatus === "IN_PROGRESS"
                ? "IN PROGRESS"
                : ticket.ticketStatus,
            statusUpdateTime: ticket.statusUpdateTime,
          }))
          const sortedData=data.sort((a, b) => new Date(b.statusUpdateTime) - new Date(a.statusUpdateTime));
        setRows(sortedData);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const handleRowSelectionModelChange = (newSelectedRow) => {
    setRowSelectionModel(newSelectedRow);
  };

  const handleView = () => {
    if (rowSelectionModel > 0) {
      const selectedTicketId = rowSelectionModel[0];
      navigate("/ticket/ticketdoc/" + selectedTicketId);
    }
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
                  ? "PENDING"
                  : ticket.ticketStatus === "REJECTED_A" ||
                    ticket.ticketStatus === "REJECTED_R"
                  ? "REJECTED"
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
          <div className="grid grid-cols-11 grid-rows-1 gap-y-7 gap-x-[5] mb-2 ">
            <div className="col-start-9">
              <Button
                variant="contained"
                className="bg-blue-600 px-6 py-2 text-white rounded left-[68%] w-[180px] ml-10"
                onClick={handleView}
              >
                View
              </Button>
            </div>
            
          </div>
        )}
      </Box>

      <h1 className="text-white bg-[#3f51b5] p-3 text-center text-xl">Others' Issue Tickets</h1>
      {loading ? (
        <div className="flex justify-center mostRequestedItems-center">
          <CircularProgress />
        </div>
      ):(
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

export default Ticket;
