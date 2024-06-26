import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Button,
  TextField,
  Alert,
  AlertTitle,
} from "@mui/material";
import LoginService from "../Login/LoginService";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const TicketDocument = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ticket ID from the URL
  const [note, setNote] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [showCompletionDate, setShowCompletionDate] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [ticket, setTicket] = useState({
    date: "",
    description: "",
    topic: "",
    ticketStatus: "",
    itemId: "",
    note: "",
  });

  const [item, setItem] = useState({
    itemName: "",
    brand: "",
  });
  const isAdmin = LoginService.isAdmin();
  const isRequestHandler = LoginService.isReqHandler();

  useEffect(() => {
    loadTicket();
  }, []);

  const loadTicket = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8080/ticket/tickets/${id}`
      );
      setTicket(result.data);
      //console.log(result.data);

      const itemId = result.data.itemId;
      //console.log("Item id",itemId.itemId);
      const result1 = await axios.get(
        `http://localhost:8080/inventory-item/getById/${itemId.itemId}`
      );
      setItem(result1.data);
      //console.log(result1.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  // Handle ticket send to admin
  const handleSendToAdmin = () => {
    axios
      .patch(`http://localhost:8080/ticket/sendtoadmin/${id}`, { note })
      .then(() => {
        navigate("/ticket");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Handle ticket Accept
  const handleAccept = () => {
    axios
      .patch(`http://localhost:8080/ticket/accept/${id}`, { note })
      .then(() => {
        navigate("/ticket");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleInprogress = () => {
    setShowCompletionDate(true);
  };

  // Handle ticket In Progress with Completion Date
  const handleInprogressWithDate = () => {
    axios
      .patch(`http://localhost:8080/ticket/inprogress/${id}`, {
        note,
        completionDate,
      })
      .then(() => {
        navigate("/ticket");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleRejectByAdmin = () => {
    setShowNoteInput(true);
  };
  // Handle ticket Reject By Admin
  const handleRejectByAdminwithNote = () => {
    axios
      .patch(`http://localhost:8080/ticket/adminreject/${id}`, { note })
      .then(() => {
        navigate("/ticket");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Handle ticket Reject By RequestHandler
  const handleRejectByRequestHandler = () => {
    axios
      .patch(`http://localhost:8080/ticket/requesthandlerreject/${id}`, {
        note,
      })
      .then(() => {
        navigate("/ticket");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Handle ticket Complete
  const handleComplete = () => {
    axios
      .patch(`http://localhost:8080/ticket/complete/${id}`, { note })
      .then(() => {
        navigate("/ticket");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getticketStatus = (ticketStatus) => {
    if (ticketStatus === "COMPLETED") {
      return (
        <Alert
          severity="success"
          sx={{ width: "300px" }}
          icon={<CheckCircleIcon />}
        >
          <AlertTitle>Completed</AlertTitle>
        </Alert>
      );
    } else if (ticketStatus === "SENT_TO_ADMIN") {
      return (
        <Alert
          severity="info"
          sx={{ width: "300px" }}
          icon={<SupervisorAccountIcon />}
        >
          <AlertTitle>Sent to Admin</AlertTitle>
        </Alert>
      );
    } else if (ticketStatus === "PENDING") {
      return (
        <Alert severity="info" sx={{ width: "300px" }}>
          <AlertTitle>Pending</AlertTitle>
        </Alert>
      );
    } else if (ticketStatus === "ACCEPTED") {
      return (
        <Alert
          severity="success"
          sx={{ width: "300px" }}
          icon={<CheckCircleOutlineIcon />}
        >
          <AlertTitle>Accepted</AlertTitle>
        </Alert>
      );
    } else if (ticketStatus === "IN_PROGRESS") {
      return (
        <Alert
          severity="warning"
          sx={{ width: "300px" }}
          icon={<HourglassEmptyIcon />}
        >
          <AlertTitle>In Progress</AlertTitle>
        </Alert>
      );
    } else if (ticketStatus === "REJECT_A") {
      return (
        <Alert severity="error" sx={{ width: "300px" }}>
          <AlertTitle>Rejected</AlertTitle>
        </Alert>
      );
    } else {
      return (
        <Alert severity="error" sx={{ width: "300px" }}>
          <AlertTitle>Rejected</AlertTitle>
        </Alert>
      );
    }
  };

  // Get the current date and time
  const currentDate = new Date();

  // Extract components of the date and time
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based, so add 1
  const day = currentDate.getDate().toString().padStart(2, "0");
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const seconds = currentDate.getSeconds().toString().padStart(2, "0");

  // Format the date and time as needed
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return (
    <div>
      <div>
        <header className="text-3xl">Issue Ticket Details</header>
      </div>

      <main>
        <div className="p-10 ml-6 mr-6 bg-white mt-6">
          <div>
            <section>{getticketStatus(ticket.ticketStatus)}</section>
          </div>
          <div>
            <section className="flex flex-row items-end justify-end mt-4 mb-10 mr-16 ">
              <header className="text-3xl font-semibold">Issue Ticket</header>
            </section>
            <section className="flex flex-row items-end justify-end gap-10">
              <ul className="flex flex-col gap-2">
                <li className="font-bold">Ticket No</li>
                <li className="font-bold">Created by</li>
                <li className="font-bold">Item Name</li>
                <li className="font-bold">Item Brand</li>
                <li className="font-bold">Date</li>
              </ul>
              <ul className="flex flex-col gap-2">
                <li>{id}</li>
                <li>Dileepa Ashen</li>
                <li>{item.itemName}</li>
                <li>{item.brand}</li>
                <li>{ticket.date}</li>
              </ul>
            </section>
          </div>

          <div className="mt-10 mb-30">
            <Typography variant="h6" className="font-bold" gutterBottom>
              Description :{" "}
            </Typography>
            <div className="w-2/3">
              <Typography variant="subtitle1" className="text-red-500">
                {ticket.description}
              </Typography>
            </div>
          </div>
         {isAdmin && <>
          {ticket.note && (
            <div className="mt-4 mb-4">
              <Typography variant="h6" className="font-bold" gutterBottom>
                Note from Request Handler:
              </Typography>
              <Typography variant="subtitle1" className="text-red-500">
                {ticket.note}
              </Typography>
            </div>
          )}
          </>
         }
          <div>
            <Typography variant="caption" gutterBottom>
              Generated Date/Time :{" "}
            </Typography>
            <Typography variant="caption" gutterBottom>
              {formattedDateTime}
            </Typography>
          </div>
        </div>

        {/*Admin workflow*/}
        {isAdmin && (
          <>
            {(ticket.ticketStatus === "PENDING" ||
              ticket.ticketStatus === "SENT_TO_ADMIN") &&
              !showNoteInput && (
                <div>
                  <div className="grid grid-cols-6 grid-rows-1 gap-y-7 gap-x-[0.65rem] mt-12">
                    <div className="col-start-4">
                      <Button
                        className="px-6 py-2 rounded w-[150px] bg-blue-600 text-white hover:text-blue-600"
                        variant="outlined"
                        type="submit"
                        onClick={handleAccept}
                      >
                        Accept
                      </Button>
                    </div>
                    <div className="col-start-5">
                      <Button
                        className="px-6 py-2 rounded w-[150px]"
                        variant="outlined"
                        type="submit"
                        onClick={handleRejectByAdmin}
                      >
                        Reject
                      </Button>
                    </div>
                    <div className="col-start-6">
                      <Button
                        className="px-6 py-2 rounded w-[150px]"
                        variant="outlined"
                        type="submit"
                        onClick={() => navigate("/ticket")}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            {showNoteInput && (
              <div>
                <div className="grid grid-cols-12 grid-rows-1 gap-y-7 mt-10">
                  <div className="col-span-3">
                    <Typography variant="subtitle1" className="font-semibold">
                      Additional Note :
                    </Typography>
                  </div>
                  <div className="col-span-3 col-start-4">
                    <textarea
                      className="w-[600px] h-20 p-2 mt-2 border-2 border-gray-300 rounded-md"
                      placeholder="Add notes here.."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="grid grid-cols-6 grid-rows-1 gap-y-7 gap-x-[0.65rem] mt-12">
                  <div className="col-start-5">
                    <Button
                      className="px-6 py-2 rounded w-[150px]"
                      variant="outlined"
                      type="submit"
                      onClick={handleRejectByAdminwithNote}
                    >
                      Reject
                    </Button>
                  </div>
                  <div className="col-start-6">
                    <Button
                      className="px-6 py-2 rounded w-[150px]"
                      variant="outlined"
                      type="submit"
                      onClick={() => navigate("/ticket")}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {(ticket.ticketStatus === "ACCEPTED" ||
              ticket.ticketStatus === "REJECTED_A")&& (
                <div className="grid grid-cols-6 grid-rows-1 gap-y-7 gap-x-[0.65rem] mt-12">
                  <div className="col-start-6">
                    <Button
                      className="px-6 py-2 rounded w-[150px]"
                      variant="outlined"
                      type="submit"
                      onClick={() => navigate("/ticket")}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
          </>
        )}

        {/*Request Handler workflow*/}

        {isRequestHandler && (
          <>
            {ticket.ticketStatus === "PENDING" && (
              <div>
                <div className="grid grid-cols-12 grid-rows-1 gap-y-7 mt-10">
                  <div className="col-span-3">
                    <Typography variant="subtitle1" className="font-semibold">
                      Additional Note :
                    </Typography>
                  </div>
                  <div className="col-span-3 col-start-4">
                    <textarea
                      className="w-[600px] h-20 p-2 mt-2 border-2 border-gray-300 rounded-md"
                      placeholder="Add notes here.."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                {!showCompletionDate && (
                  <div className="grid grid-cols-6 grid-rows-1 gap-y-7 gap-x-[0.65rem] mt-12">
                    <div className="col-start-3">
                      <Button
                        className="px-3 py-2 rounded w-[172px] h-[42px] bg-blue-600 text-[14px] text-white hover:text-blue-600"
                        variant="outlined"
                        type="submit"
                        onClick={handleSendToAdmin}
                      >
                        Send to Admin
                      </Button>
                    </div>
                    <div className="col-start-4">
                      <Button
                        className="px-6 py-2 rounded w-[172px] bg-blue-600 text-white hover:text-blue-600"
                        variant="outlined"
                        type="submit"
                        onClick={handleInprogress}
                      >
                        Start Progress
                      </Button>
                    </div>
                    <div className="col-start-5">
                      <Button
                        className="px-6 py-2 rounded w-[172px] bg-blue-600 text-white hover:text-blue-600"
                        variant="outlined"
                        type="submit"
                        onClick={handleRejectByRequestHandler}
                      >
                        Reject
                      </Button>
                    </div>
                    <div className="col-start-6">
                      <Button
                        className="px-6 py-2 rounded w-[172px]"
                        variant="outlined"
                        type="submit"
                        onClick={() => navigate("/ticket")}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                {showCompletionDate && (
                  <div>
                    <div className="grid grid-cols-12 grid-rows-1 gap-y-7 mt-1">
                      <div className="col-span-3">
                        <Typography
                          variant="subtitle1"
                          className="font-semibold"
                        >
                          Expected Completion Date :
                        </Typography>
                      </div>
                      <div className="col-start-4">
                        <TextField
                          type="date"
                          className="w-[220px] mt-2 border-2 border-gray-300 bg-white"
                          value={completionDate}
                          onChange={(e) => setCompletionDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-6 grid-rows-1 gap-y-7 gap-x-[0.65rem] mt-12">
                      <div className="col-start-5">
                        <Button
                          className="px-6 py-2 rounded w-[172px] bg-blue-600 text-white hover:text-blue-600"
                          variant="outlined"
                          type="submit"
                          onClick={handleInprogressWithDate}
                        >
                          Start Progress
                        </Button>
                      </div>
                      <div className="col-start-6">
                        <Button
                          className="px-6 py-2 rounded w-[172px] text-md"
                          variant="outlined"
                          type="submit"
                          onClick={() => navigate("/ticket/ticketdoc/:id")}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {ticket.ticketStatus === "ACCEPTED" && (
              <div>
                <div className="flex gap-6 mt-6 ml-6">
                  <h4>Note :</h4>
                  <textarea
                    className="w-2/3 h-20 p-2 mt-2 border-2 border-gray-300 rounded-md"
                    placeholder="Write something here.."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  ></textarea>
                </div>
                {!showCompletionDate && (
                  <div className="grid grid-cols-6 grid-rows-1 gap-y-7 gap-x-[0.65rem] mt-12">
                    <div className="col-start-5">
                      <Button
                        className="px-6 py-2 rounded w-[172px] bg-blue-600 text-white hover:text-blue-600"
                        variant="outlined"
                        type="submit"
                        onClick={handleInprogress}
                      >
                        Start Progress
                      </Button>
                    </div>
                    <div className="col-start-6">
                      <Button
                        className="px-6 py-2 rounded w-[172px]"
                        variant="outlined"
                        type="submit"
                        onClick={() => navigate("/ticket")}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {showCompletionDate && (
                  <div>
                    <div className="flex gap-6 mt-6 ml-6">
                      <h4>Completion Date :</h4>
                      <TextField
                        type="date"
                        className="w-2/3 mt-2"
                        value={completionDate}
                        onChange={(e) => setCompletionDate(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-6 grid-rows-1 gap-y-7 gap-x-[0.65rem] mt-12">
                      <div className="col-start-5">
                        <Button
                          className="px-6 py-2 rounded w-[150px] bg-blue-600 text-white hover:text-blue-600"
                          variant="outlined"
                          type="submit"
                          onClick={handleInprogressWithDate}
                        >
                          Submit
                        </Button>
                      </div>
                      <div className="col-start-6">
                        <Button
                          className="px-6 py-2 rounded w-[150px] text-md"
                          variant="outlined"
                          type="submit"
                          onClick={() => navigate("/ticket")}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {ticket.ticketStatus === "IN_PROGRESS" && (
              <div>
                <div className="grid grid-cols-12 grid-rows-1 gap-y-7 mt-10">
                  <div className="col-span-2">
                    <Typography variant="subtitle1" className="font-semibold">
                      Additional Note :
                    </Typography>
                  </div>
                  <div className="col-span-3 col-start-3">
                    <textarea
                      className="w-[600px] h-20 p-2 mt-2 border-2 border-gray-300 rounded-md"
                      placeholder="Add notes here.."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="grid grid-cols-6 grid-rows-1 gap-y-7 gap-x-[0.65rem] mt-12">
                  <div className="col-start-5">
                    <Button
                      className="px-6 py-2 rounded w-[150px] bg-blue-600 text-white hover:text-blue-600"
                      variant="outlined"
                      type="submit"
                      onClick={handleComplete}
                    >
                      Complete
                    </Button>
                  </div>
                  <div className="col-start-6">
                    <Button
                      className="px-6 py-2 rounded w-[150px]"
                      variant="outlined"
                      type="submit"
                      onClick={() => navigate("/ticket")}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {(ticket.ticketStatus === "COMPLETED" ||
              ticket.ticketStatus === "SENT_TO_ADMIN" ||
              ticket.ticketStatus === "REJECT_A" ||
              ticket.ticketStatus === "REJECT_R") && (
              <div className="grid grid-cols-6 grid-rows-1 gap-y-7 gap-x-[0.65rem] mt-12">
                <div className="col-start-6">
                  <Button
                    className="px-6 py-2 rounded w-[150px]"
                    variant="outlined"
                    type="submit"
                    onClick={() => navigate("/ticket")}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default TicketDocument;
