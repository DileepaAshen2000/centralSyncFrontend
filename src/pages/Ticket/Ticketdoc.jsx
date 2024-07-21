import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import {
  Typography,
  Button,
  TextField,
  Alert,
  AlertTitle,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Backdrop,
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
  const [error, setError] = useState("");
  const [dateerror, setDateError] = useState("");
  const [rejecterror, setRejectError] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [showCompletionDate, setShowCompletionDate] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [profileInfo, setProfileInfo] = useState({});
  const [openRA, setOpenRA] = useState(false);
  const [openRR, setOpenRR] = useState(false);
  const [openSA, setOpenSA] = useState(false);
  const [openSP, setOpenSP] = useState(false);
  const [openA, setOpenA] = useState(false);
  const [openC, setOpenC] = useState(false);
  const [loading, setLoading] = useState(false);

  const [ticket, setTicket] = useState({
    date: "",
    description: "",
    topic: "",
    ticketStatus: "",
    itemId: "",
    note: "",
    user: "",
    previousStatus: "",
  });

  const [item, setItem] = useState({
    itemName: "",
    brand: "",
    model: "",
  });
  const isAdmin = LoginService.isAdmin();
  const isRequestHandler = LoginService.isReqHandler();

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const fetchProfileInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await LoginService.getYourProfile(token);
      setProfileInfo(response.users);
    } catch (error) {
      console.error("Error fetching profile information:", error);
    }
  };

  useEffect(() => {
    loadTicket();
  }, []);

  const loadTicket = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleClickRejectAdmin = () => {
    if (!note.trim()) {
      setRejectError("Please add a note before reject.");
      return;
    }
    setRejectError("");
    setOpenRA(true);
  };

  const handleClickRejectRequestHandler = () => {
    if (!note.trim()) {
      setRejectError("Please add a note before reject.");
      return;
    }
    setRejectError("");
    setOpenRR(true);
  };
  const handleClickSendtoAdmin = () => {
    if (!note.trim()) {
      setError("Please add a note before sending to admin.");
      return;
    }
    setError("");
    setOpenSA(true);
  };

  const handleClickStartProgress = () => {
    if (!completionDate.trim()) {
      setDateError("Please add completion date.");
      return;
    }

    const completionDateObj = new Date(completionDate);
    const currentDate = new Date();

    if (completionDateObj <= currentDate) {
      setDateError("Completion date must not be in the past.");
      return;
    }

    setDateError("");
    setOpenSP(true);
  };

  const handleCompletionDateChange = (e) => {
    const newCompletionDate = e.target.value;
    setCompletionDate(newCompletionDate);

    if (!newCompletionDate.trim()) {
      setDateError("Please add completion date.");
    } else {
      const completionDateObj = new Date(newCompletionDate);
      const currentDate = new Date();

      if (completionDateObj <= currentDate) {
        setDateError("Completion date should not be in the past.");
      } else {
        setDateError("");
      }
    }
  };

  const handleClickAccept = () => {
    setOpenA(true);
  };

  const handleClickComplete = () => {
    setOpenC(true);
  };

  const handleClose = () => {
    setOpenRA(false);
    setOpenRR(false);
    setOpenSA(false);
    setOpenSP(false);
    setOpenA(false);
    setOpenC(false);
  };

  // Handle ticket send to admin
  const handleSendToAdmin = () => {
    setLoading(true);
    axios
      .patch(`http://localhost:8080/ticket/sendtoadmin/${id}`, { note })
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Ticket sent to admin succesfully!",
          });
          navigate(-1);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Handle ticket Accept
  const handleAccept = () => {
    setLoading(true);
    axios
      .patch(`http://localhost:8080/ticket/accept/${id}`, { note })
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Ticket status updated succesfully!",
          });
          navigate("/ticket");
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to update status",
        });
        console.log(error);
      })
      .finally(() => {
        setLoading(false); // Set loading to false after the request is completed
      });
  };
  const handleInprogress = () => {
    setShowCompletionDate(true);
  };

  // Handle ticket In Progress with Completion Date
  const handleInprogressWithDate = () => {
    setLoading(true);
    axios
      .patch(`http://localhost:8080/ticket/inprogress/${id}`, {
        note,
        completionDate,
      })
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Ticket status updated succesfully!",
          });
          navigate("/ticket");
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to update status",
        });
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRejectByAdmin = () => {
    setShowNoteInput(true);
  };
  // Handle ticket Reject By Admin
  const handleRejectByAdminwithNote = () => {
    setLoading(true);
    axios
      .patch(`http://localhost:8080/ticket/adminreject/${id}`, { note })
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Ticket status updated succesfully!",
          });
          navigate("/ticket");
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to update status",
        });
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Handle ticket Reject By RequestHandler
  const handleRejectByRequestHandler = () => {
    setLoading(true);
    axios
      .patch(`http://localhost:8080/ticket/requesthandlerreject/${id}`, {
        note,
      })
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Ticket status updated succesfully!",
          });
          navigate(-1);
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to update status",
        });
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Handle ticket Complete
  const handleComplete = () => {
    setLoading(true);
    axios
      .patch(`http://localhost:8080/ticket/complete/${id}`, { note })
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Ticket status updated succesfully!",
          });
          navigate(-1);
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to update status",
        });
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
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
                <li className="font-bold">Item Model</li>
                <li className="font-bold">Date</li>
                <li className="font-bold">Topic</li>
              </ul>
              <ul className="flex flex-col gap-2">
                <li>{id}</li>
                <li>
                  {ticket.user.firstName} {ticket.user.lastName}
                </li>
                <li>{item.itemName}</li>
                <li>{item.brand}</li>
                <li>{item.model}</li>
                <li>{ticket.date}</li>
                <li className="font-bold text-red-600">{ticket.topic}</li>
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
          {isAdmin && (
            <>
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
          )}
          <div>
            <Typography variant="caption" gutterBottom>
              Generated Date/Time :{" "}
            </Typography>
            <Typography variant="caption" gutterBottom>
              {formattedDateTime}
            </Typography>
          </div>
        </div>
        <Dialog
          open={openRA}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>{"Are you want to reject the ticket?"}</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              No
            </Button>
            <Button
              onClick={handleRejectByAdminwithNote}
              color="primary"
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openRR}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>{"Are you want to reject the ticket?"}</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              No
            </Button>
            <Button
              onClick={handleRejectByRequestHandler}
              color="primary"
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openSA}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>{"Are you want to Send to Admin?"}</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              No
            </Button>
            <Button onClick={handleSendToAdmin} color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openSP}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>{"Are you want to Start Progress?"}</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              No
            </Button>
            <Button
              onClick={handleInprogressWithDate}
              color="primary"
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openA}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>{"Are you sure want to Accept the ticket?"}</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              No
            </Button>
            <Button onClick={handleAccept} color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openC}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>
            {"Are you sure want to Complete the Progress?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              No
            </Button>
            <Button onClick={handleComplete} color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>

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
                        className="px-6 py-2 rounded w-[150px] bg-green-300 text-green-800 hover:text-white hover:bg-green-600 font-bold"
                        variant="contained"
                        type="submit"
                        onClick={handleClickAccept}
                      >
                        Accept
                      </Button>
                    </div>
                    <div className="col-start-5">
                      <Button
                        className="px-6 py-2 rounded w-[150px] bg-red-300 text-red-800 hover:text-white hover:bg-red-600 font-bold"
                        variant="contained"
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
                        onClick={() => navigate(-1)}
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
                {rejecterror && (
                  <div className="text-red-600 mt-1 text-bold text-sm ml-[280px]">
                    {rejecterror}
                  </div>
                )}
                <div className="grid grid-cols-6 grid-rows-1 gap-y-7 gap-x-[0.65rem] mt-12">
                  <div className="col-start-5">
                    <Button
                      className="px-6 py-2 rounded w-[150px] bg-red-300 text-red-800 hover:text-white hover:bg-red-600 font-bold"
                      variant="contained"
                      type="submit"
                      onClick={handleClickRejectAdmin}
                    >
                      Reject
                    </Button>
                  </div>
                  <div className="col-start-6">
                    <Button
                      className="px-6 py-2 rounded w-[150px]"
                      variant="outlined"
                      type="submit"
                      onClick={() => navigate(setShowNoteInput(false))}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {(ticket.ticketStatus === "ACCEPTED" ||
              ticket.ticketStatus === "REJECTED_A" ||
              ticket.previousStatus === "ACCEPTED") && (
              <div className="grid grid-cols-6 grid-rows-1 gap-y-7 gap-x-[0.65rem] mt-12">
                <div className="col-start-6">
                  <Button
                    className="px-6 py-2 rounded w-[150px]"
                    variant="outlined"
                    type="submit"
                    onClick={() => navigate(-1)}
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
                {rejecterror && (
                  <div className="text-red-600 mt-1 text-bold text-sm ml-[280px]">
                    {rejecterror}
                  </div>
                )}
                {error && (
                  <div className="text-red-600 mt-1 text-bold text-sm ml-[280px]">
                    {error}
                  </div>
                )}
                {!showCompletionDate && (
                  <div className="grid grid-cols-6 grid-rows-1 gap-y-7 gap-x-[0.65rem] mt-12">
                    {ticket.user.role !== "ADMIN" && (
                      <div className="col-start-3">
                        <Button
                          className="px-3 py-2 rounded w-[172px] h-[42px] bg-blue-300 text-[14px] text-blue-800 hover:text-white hover:bg-blue-600"
                          variant="contained"
                          type="submit"
                          onClick={handleClickSendtoAdmin}
                        >
                          Send to Admin
                        </Button>
                      </div>
                    )}
                    <div className="col-start-4">
                      <Button
                        className="px-6 py-2 rounded w-[172px]  bg-yellow-300 text-yellow-800 hover:text-white hover:bg-yellow-600"
                        variant="contained"
                        type="submit"
                        onClick={handleInprogress}
                      >
                        Start Progress
                      </Button>
                    </div>
                    <div className="col-start-5">
                      <Button
                        className="px-6 py-2 rounded w-[172px]  bg-red-300 text-red-800 hover:text-white hover:bg-red-600 font-bold"
                        variant="contained"
                        type="submit"
                        onClick={handleClickRejectRequestHandler}
                      >
                        Reject
                      </Button>
                    </div>
                    <div className="col-start-6">
                      <Button
                        className="px-6 py-2 rounded w-[172px]"
                        variant="outlined"
                        type="submit"
                        onClick={() => navigate(-1)}
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
                          onChange={handleCompletionDateChange}
                        />
                      </div>
                    </div>
                    {dateerror && (
                      <div className="text-red-600 mt-1 ml-[280px] text-sm">
                        {dateerror}
                      </div>
                    )}
                    <div className="grid grid-cols-6 grid-rows-1 gap-y-7 gap-x-[0.65rem] mt-12">
                      <div className="col-start-5">
                        <Button
                          className="px-6 py-2 rounded w-[172px]  bg-yellow-300 text-yellow-800 hover:text-white hover:bg-yellow-600"
                          variant="contained"
                          type="submit"
                          onClick={handleClickStartProgress}
                        >
                          Start Progress
                        </Button>
                      </div>
                      <div className="col-start-6">
                        <Button
                          className="px-6 py-2 rounded w-[172px] text-md"
                          variant="outlined"
                          type="submit"
                          onClick={() => setShowCompletionDate(false)}
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
                    <div className="col-start-5">
                      <Button
                        className="px-6 py-2 rounded w-[172px] bg-yellow-300 text-yellow-800 hover:text-white hover:bg-yellow-600"
                        variant="contained"
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
                        onClick={() => navigate(-1)}
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
                    {dateerror && (
                      <div className="text-red-600 mt-1 ml-[280px] text-sm">
                        {dateerror}
                      </div>
                    )}
                    <div className="grid grid-cols-6 grid-rows-1 gap-y-7 gap-x-[0.65rem] mt-12">
                      <div className="col-start-5">
                        <Button
                          className="px-6 py-2 rounded w-[150px] bg-blue-600 text-white hover:text-blue-600"
                          variant="outlined"
                          type="submit"
                          onClick={handleClickStartProgress}
                        >
                          Submit
                        </Button>
                      </div>
                      <div className="col-start-6">
                        <Button
                          className="px-6 py-2 rounded w-[150px] text-md"
                          variant="outlined"
                          type="submit"
                          onClick={() => navigate(-1)}
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
                      className="px-6 py-2 rounded w-[150px]  bg-green-300 text-green-800 hover:text-white hover:bg-green-600 font-bold"
                      variant="contained"
                      type="submit"
                      onClick={handleClickComplete}
                    >
                      Complete
                    </Button>
                  </div>
                  <div className="col-start-6">
                    <Button
                      className="px-6 py-2 rounded w-[150px]"
                      variant="outlined"
                      type="submit"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {(ticket.ticketStatus === "COMPLETED" ||
              ticket.ticketStatus === "SENT_TO_ADMIN" ||
              ticket.ticketStatus === "REJECTED_A" ||
              ticket.ticketStatus === "REJECTED_R") && (
              <div className="grid grid-cols-6 grid-rows-1 gap-y-7 gap-x-[0.65rem] mt-12">
                <div className="col-start-6">
                  <Button
                    className="px-6 py-2 rounded w-[150px]"
                    variant="outlined"
                    type="submit"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 20 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </main>
    </div>
  );
};

export default TicketDocument;
