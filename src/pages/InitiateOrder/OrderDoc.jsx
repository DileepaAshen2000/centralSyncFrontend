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
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Print from "@mui/icons-material/Print";
import ReactToPrint from "react-to-print";
import axios from "axios";
import ArrowBack from "@mui/icons-material/ArrowBack";

const ViewOrderDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const printRef = useRef();
  const { orderID } = useParams();

  const [order, setOrder] = useState({
    vendorName: "",
    companyName: "",
    vendorEmail: "",
    mobile: "",
    date: "",
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
    date,
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

  const handleMarkAsReviewed = async () => {
    try {
      await axios.patch(`http://localhost:8080/orders/review/${orderID}`);
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };
  const handleMarkAsCompleted = async () => {
    try {
      await axios.patch(`http://localhost:8080/orders/complete/${orderID}`);
      navigate(-1);
    } catch (error) {
      console.log(error);
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
                <li className="font-bold">Date</li>
              </ul>
              <ul className="flex flex-col gap-2">
                <li>{orderID}</li>
                <li>{vendorName}</li>
                <li>{companyName}</li>
                <li>{vendorEmail}</li>
                <li>{mobile}</li>
                <li>{date}</li>
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
                <Typography variant="subtitle1" className="text-red-500">
                  {description}
                </Typography>
              </div>
            </div>
          )}
          {/* buttons */}
          <div className="mt-6 flex items-center justify-between">
            {status !== "COMPLETED" && (
              <Button
                variant="contained"
                color="primary"
                className="mr-4 rounded bg-green-300 text-green-800 hover:text-white hover:bg-green-600 font-bold"
                onClick={handleMarkAsCompleted}
              >
                Mark as Completed
              </Button>
            )}
            {status === "PENDING" && (
              <Button
                variant="contained"
                color="primary"
                className="mr-4 rounded   bg-blue-300 text-blue-800 hover:text-white hover:bg-blue-600 font-bold"
                onClick={handleMarkAsReviewed}
              >
                Mark as Reviewed
              </Button>
            )}
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
        <div ref={printRef} className="p-10 bg-white rounded-2xl ml-14 mr-14">
          <Typography variant="h4" className="font-bold mb-6">
            Order Details
          </Typography>

          <div className=" flex flex-col items-end justify-end  ">
            <section className="flex flex-row gap-10">
              <ul className="flex flex-col col-span-2 gap-2 ">
                <li className="font-bold">Order Id</li>
                <li className="font-bold">Vendor Name</li>
                <li className="font-bold">Company Name</li>
                <li className="font-bold">Email Address</li>
                <li className="font-bold"> Mobile</li>
                <li className="font-bold">Date</li>
              </ul>
              <ul className="flex flex-col gap-2">
                <li>{orderID}</li>
                <li>{vendorName}</li>
                <li>{companyName}</li>
                <li>{vendorEmail}</li>
                <li>{mobile}</li>
                <li>{date}</li>
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
                <Typography variant="subtitle1" className="text-red-500">
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
