import {
  Button,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert,
  AlertTitle,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Print from "@mui/icons-material/Print";
import ReactToPrint from "react-to-print";
import axios from "axios";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Swal from "sweetalert2";

const ViewOrderDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const printRef = useRef();
  const { orderID } = useParams();
  const [note, setNote] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogAction, setDialogAction] = useState(null);

  const [order, setOrder] = useState({
    vendorName: "",
    companyName: "",
    vendorEmail: "",
    mobile: "",
    dateInitiated: "",
    lastStatusUpdate: "",
    itemName: "",
    brandName: "",
    quantity: "",
    description: "",
    status: "",
  });

  const {
    vendorName,
    companyName,
    vendorEmail,
    mobile,
    dateInitiated,
    lastStatusUpdate,
    itemName,
    brandName,
    quantity,
    description,
    status,
  } = order;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/orders/getById/${orderID}`
        );
        setOrder(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderID]);

  const handleOpenDialog = (title, action) => {
    setDialogTitle(title);
    setDialogAction(() => action);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setNote("");
  };

  const handleConfirmAction = async () => {
    console.log("Note at confirmation:", note); // Debugging line

    try {
      if (dialogAction) {
        await dialogAction(note); // Pass the note to the dialog action
      } else {
        await dialogAction();
      }

      handleCloseDialog();
    } catch (error) {
      console.log(error);
    }
  };
  const handleMarkAsReviewed = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `http://localhost:8080/orders/review/${orderID}`
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Order marked as reviewed",
        });
      }
      navigate(-1);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Cannot perform the action",
      });
    } finally {
      setLoading(true);
    }
  };
  const handleMarkAsCompleted = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `http://localhost:8080/orders/complete/${orderID}`
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Order marked as completed",
        });
      }
      navigate(-1);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Cannot perform the action",
      });
      console.log(error);
    } finally {
      setLoading(true);
    }
  };
  const handleMarkAsCancelled = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `http://localhost:8080/orders/cancel/${orderID}`
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Order marked as cancelled",
        });
      }
      navigate(-1);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Cannot perform the action",
      });
      console.log(error);
    } finally {
      setLoading(true);
    }
  };

  const handleMarkAsProblemReported = async (note) => {
    setLoading(true);
    console.log("Note at confirmation:", note); // Debugging line
    try {
      const response = await axios.patch(
        `http://localhost:8080/orders/problemReported/${orderID}`,
        { note: note }, // Send note as a JSON object
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Order marked as problem reported",
        });
      }
      navigate(-1);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Cannot perform the action",
      });
      console.log(error);
    } finally {
      setLoading(true);
    }
  };

  const handleMarkAsResolved = async () => {
    setLoading(true);

    try {
      const response = await axios.patch(
        `http://localhost:8080/orders/resolve/${orderID}`
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Order marked as resolved",
        });
      }
      navigate(-1);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Cannot perform the action",
      });
      console.log(error);
    } finally {
      setLoading(true);
    }
  };
  const getOrderStatus = (status) => {
    if (status === "COMPLETED") {
      return (
        <Alert severity="success" sx={{ width: "300px" }}>
          <AlertTitle>Completed</AlertTitle>
        </Alert>
      );
    } else if (status === "REVIEWED") {
      return (
        <Alert severity="info" sx={{ width: "300px" }}>
          <AlertTitle>Reviewed</AlertTitle>
        </Alert>
      );
    } else if (status === "PENDING") {
      return (
        <Alert severity="warning" sx={{ width: "300px" }}>
          <AlertTitle>Pending</AlertTitle>
        </Alert>
      );
    } else if (status === "CANCELLED") {
      return (
        <Alert severity="error" sx={{ width: "300px" }}>
          <AlertTitle>Cancelled</AlertTitle>
        </Alert>
      );
    } else if (status === "PROBLEM_REPORTED") {
      return (
        <Alert severity="error" sx={{ width: "300px" }}>
          <AlertTitle>Problem Reported</AlertTitle>
        </Alert>
      );
    } else if (status === "RESOLVED") {
      return (
        <Alert severity="info" sx={{ width: "300px" }}>
          <AlertTitle>Resolved</AlertTitle>
        </Alert>
      );
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="p-10 bg-white rounded-2xl shadow-lg mx-auto ">
          <div className="flex items-center mb-6">
            <IconButton onClick={() => navigate(-1)} className="mr-2">
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" className="font-bold flex-1">
              Order Details
            </Typography>
            <div className="ml-auto">{getOrderStatus(order.status)}</div>
          </div>

          <div className=" flex flex-col items-end justify-end  ">
            <section className="flex flex-row gap-10">
              <ul className="flex flex-col col-span-2 gap-2 ">
                <li className="font-bold">Order Id</li>
                <li className="font-bold">Vendor Name</li>
                <li className="font-bold">Company Name</li>
                <li className="font-bold">Email Address</li>
                <li className="font-bold"> Mobile</li>
                <li className="font-bold">Date Initiated</li>
                {status !== "PENDING" && (
                  <li className="font-bold">
                    Last Status Update to <br />
                    {status}{" "}
                  </li>
                )}
              </ul>
              <ul className="flex flex-col gap-2">
                <li>{orderID}</li>
                <li>{vendorName}</li>
                <li>{companyName}</li>
                <li>{vendorEmail}</li>
                <li>{mobile}</li>
                <li>{dateInitiated}</li>
                {status !== "PENDING" && <li>{lastStatusUpdate}</li>}
              </ul>
            </section>

            <TableContainer component={Paper} className="p-8 mt-6">
              <Table>
                <TableHead>
                  <TableRow className=" bg-zinc-800">
                    <TableCell className="text-white">
                      <strong>Item Name</strong>
                    </TableCell>
                    <TableCell className="text-white">
                      <strong>Brand Name</strong>
                    </TableCell>
                    <TableCell className="text-white">
                      <strong>Quantity</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{itemName}</TableCell>
                    <TableCell>{brandName}</TableCell>
                    <TableCell>{quantity}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          {description !== "" && (
            <div className="mt-10 mb-30">
              <Typography variant="h6" className="font-bold" gutterBottom>
                Description :{" "}
              </Typography>
              <div className="w-2/3">
                <Typography variant="subtitle1" className="text-gray-500">
                  {description}
                </Typography>
              </div>
            </div>
          )}

          {/* buttons */}
          <div className="mt-6 flex items-center justify-between">
            {status !== "COMPLETED" && status !== "CANCELLED" && (
              <Button
                variant="contained"
                color="primary"
                className="mr-4 rounded bg-green-300 text-green-800 hover:text-white hover:bg-green-600 font-bold"
                onClick={() =>
                  handleOpenDialog("Mark as Completed", handleMarkAsCompleted)
                }
              >
                Mark as Completed
              </Button>
            )}
            {status !== "REVIEWED" &&
              status !== "CANCELLED" &&
              status !== "COMPLETED" && (
                <Button
                  variant="contained"
                  color="primary"
                  className="mr-4 rounded   bg-blue-300 text-blue-800 hover:text-white hover:bg-blue-600 font-bold"
                  onClick={() =>
                    handleOpenDialog("Mark as Reviewed", handleMarkAsReviewed)
                  }
                >
                  Mark as Reviewed
                </Button>
              )}
            {status === "PROBLEM_REPORTED" && status !== "RESOLVED" && (
              <Button
                variant="contained"
                color="primary"
                className="mr-4 rounded bg-purple-300 text-purple-800 hover:text-white hover:bg-purple-600 font-bold"
                onClick={() =>
                  handleOpenDialog("Mark as Resolved", handleMarkAsResolved)
                }
              >
                Mark as Resolved
              </Button>
            )}
            {status !== "COMPLETED" && status !== "CANCELLED" && (
              <Button
                variant="contained"
                color="primary"
                className="mr-4 rounded bg-red-300 text-red-800 hover:text-white hover:bg-red-600 font-bold"
                onClick={() =>
                  handleOpenDialog("Mark as Cancelled", handleMarkAsCancelled)
                }
              >
                Mark as Cancelled
              </Button>
            )}
            {status !== "PROBLEM_REPORTED" && status !== "CANCELLED" && (
              <Button
                variant="contained"
                color="primary"
                className="mr-4 rounded bg-yellow-300 text-yellow-800 hover:text-white hover:bg-yellow-600 font-bold"
                onClick={() =>
                  handleOpenDialog(
                    "Mark as Problem Reported",
                    handleMarkAsProblemReported
                  )
                }
              >
                Mark as Problem Reported
              </Button>
            )}
            {/* Confirmation Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to {dialogTitle.toLowerCase()}?
                </DialogContentText>
                {dialogTitle.includes("Problem Reported") && (
                  <TextField
                    label="Enter note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                  No
                </Button>
                <Button onClick={handleConfirmAction} color="primary">
                  Yes
                </Button>
              </DialogActions>
            </Dialog>

            <ReactToPrint
              trigger={() => (
                <Button variant="outlined" className=" rounded-sm ml-auto">
                  <Print />
                  Print
                </Button>
              )}
              content={() => printRef.current}
            />
          </div>
        </div>
      )}

      {/* Print view of the doc */}
      <div className="hidden">
        <div ref={printRef} className="p-10 bg-white rounded-2xl  mx-auto">
          <div className="flex items-center mb-6">
            <Typography variant="h4" className="font-bold mb-6">
              Order Details
            </Typography>
            <div className="ml-auto">{getOrderStatus(order.status)}</div>
          </div>

          <div className=" flex flex-col items-end justify-end  ">
            <section className="flex flex-row gap-10">
              <ul className="flex flex-col col-span-2 gap-2 ">
                <li className="font-bold">Order Id</li>
                <li className="font-bold">Vendor Name</li>
                <li className="font-bold">Company Name</li>
                <li className="font-bold">Email Address</li>
                <li className="font-bold"> Mobile</li>
                <li className="font-bold">Date Initiated</li>
                {status !== "PENDING" && (
                  <li className="font-bold">Last Status Update to {status} </li>
                )}
              </ul>
              <ul className="flex flex-col gap-2">
                <li>{orderID}</li>
                <li>{vendorName}</li>
                <li>{companyName}</li>
                <li>{vendorEmail}</li>
                <li>{mobile}</li>
                <li>{dateInitiated}</li>
                {status !== "PENDING" && <li>{lastStatusUpdate}</li>}
              </ul>
            </section>

            <TableContainer component={Paper} className="p-8 mt-6">
              <Table>
                <TableHead>
                  <TableRow className=" bg-zinc-800">
                    <TableCell className="text-white">
                      <strong>Item Name</strong>
                    </TableCell>
                    <TableCell className="text-white">
                      <strong>Brand Name</strong>
                    </TableCell>
                    <TableCell className="text-white">
                      <strong>Quantity</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{itemName}</TableCell>
                    <TableCell>{brandName}</TableCell>
                    <TableCell>{quantity}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          {description !== "" && (
            <div className="mt-10 mb-30">
              <Typography variant="h6" className="font-bold" gutterBottom>
                Description :{" "}
              </Typography>
              <div className="w-2/3">
                <Typography variant="subtitle1" className="text-gray-500">
                  {description}
                </Typography>
              </div>
            </div>
          )}
          <Typography variant="caption" gutterBottom>
            Computer Generated Document By CENTRAL SYNC &#174; | No Signature
            Required.
          </Typography>
        </div>
      </div>
    </>
  );
};

export default ViewOrderDetails;
