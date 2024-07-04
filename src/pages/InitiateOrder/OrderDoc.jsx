import {
  Button,
  Typography,
  Backdrop,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const ViewOrderDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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

  
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/orders/deleteOrder/${orderID}`);
      Swal.fire({
        title: "Deleted!",
        text: "Order has been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate(-1);
      });
    } catch (error) {
      let errorMessage = "An error occurred while deleting the order.";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Order not found.";
        } else if (error.response.status === 400) {
          errorMessage =
            "Order cannot be deleted because its status is PENDING.";
        }
      }
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const getStatusChipColor = (status) => {
    return status === "COMPLETED"
      ? "bg-green-500"
      : status === "REVIEWED"
      ? "bg-blue-500"
      : status === "PENDING"
      ? "bg-yellow-500"
      : "bg-gray-400";
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="p-10 bg-white rounded-2xl ml-14 mr-14">
          <Typography variant="h4" className="font-bold mb-6">
            Order Details
          </Typography>
          <div className=" flex flex-col items-end justify-end  ">
            <section className="flex flex-row gap-10">
              <ul className="flex flex-col col-span-2 gap-2 ">
                <li className="font-bold">Vendor Name</li>
                <li className="font-bold">Company Name</li>
                <li className="font-bold">Email Address</li>
                <li className="font-bold"> Mobile</li>
                <li className="font-bold">Date</li>
              </ul>
              <ul className="flex flex-col gap-2">
                <li>{vendorName}</li>
                <li>{companyName}</li>
                <li>{vendorEmail}</li>
                <li>{mobile}</li>
                <li>{date}</li>
                <li>
                  <Chip
                    label={`Status: ${status}`}
                    className={`${getStatusChipColor(status)} text-white`}
                  />
                </li>
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
          <div className="mt-6">
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
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate(-1)}
              className="justify-end"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewOrderDetails;
