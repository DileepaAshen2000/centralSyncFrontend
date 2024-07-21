import {
  Typography,
  Backdrop,
  CircularProgress,
  Paper,
  IconButton,
  Alert,
  AlertTitle,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LoginService from "../Login/LoginService";

const ViewItemDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { itemID } = useParams();
  const isAdmin = LoginService.isAdmin();
  const isEmployee=LoginService.isEmployee();
  const [usageDetails, setUsageDetails] = useState([]);
  const [inventoryItem, setInventoryItem] = useState({
    itemName: "",
    itemGroup: "",
    unit: "",
    model: "",
    brand: "",
    dimension: "",
    weight: "",
    description: "",
    quantity: "",
    status: "",
    image: null,
  });

  const {
    itemName,
    itemGroup,
    unit,
    model,
    brand,
    dimension,
    weight,
    description,
    quantity,
    status,
    image,
  } = inventoryItem;

  useEffect(() => {
    const fetchItemDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/inventory-item/getById/${itemID}`
        );
        const item = {
          itemName: response.data.itemName,
          itemGroup: response.data.itemGroup,
          brand: response.data.brand,
          model: response.data.model,
          unit: response.data.unit,
          dimension: response.data.dimension || "",
          weight: response.data.weight || "",
          description: response.data.description,
          quantity: response.data.quantity,
          status: response.data.status,
          image: response.data.image,
        };
        console.log(response.data);
        setInventoryItem(item);

        // Fetch usage details
        const usageResponse = await axios.get(
          `http://localhost:8080/request/getUsageById/${itemID}`
        );
        // Group by user and aggregate quantities
        const groupedUsage = usageResponse.data.reduce((acc, usage) => {
          const { userId, userName, userEmail,department, quantity } = usage;
          if (!acc[userId]) {
            acc[userId] = { userName, userEmail,department, totalQuantity: 0 };
          }
          acc[userId].totalQuantity += quantity;
          return acc;
        }, {});
        setUsageDetails(Object.values(groupedUsage));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemID]);

  return (
    <>
      <div className="p-6 bg-white rounded-xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" className="font-bold flex-1">
              Item Details
            </Typography>
          </div>
          {isAdmin && (
            <Button
              variant="contained"
              color="primary"
              className="mr-4 rounded bg-blue-300 text-blue-800 hover:text-white hover:bg-blue-600 font-bold"
              onClick={() => navigate("/item/edit-item/" + itemID)}
            >
              Edit Item
            </Button>
          )}
        </div>

        {status && (
          <Alert
            severity={status === "ACTIVE" ? "success" : "warning"}
            className="flex-none mb-6"
          >
            <AlertTitle>{status}</AlertTitle>
            {status === "ACTIVE"
              ? "This item is currently active."
              : "This item is currently inactive."}
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            {inventoryItem.image && (
              <Paper elevation={3} className="p-4 text-center">
                <img
                  src={`data:image/*;base64,${inventoryItem.image}`}
                  alt="Item"
                  className="w-full h-auto max-w-md rounded-lg mx-auto"
                />
              </Paper>
            )}
          </div>
          <div className=" flex flex-col  justify-end  ">
            <section className="flex flex-row gap-10">
              <ul className="flex flex-col gap-2 ">
                <li className="font-bold">Item Id</li>
                <li className="font-bold">Item Name</li>
                <li className="font-bold">Item Group</li>
                <li className="font-bold">Brand</li>
                <li className="font-bold">Model </li>
                <li className="font-bold"> Unit</li>
                {dimension && dimension.trim() !== "" && (
                  <li className="font-bold">Dimension</li>
                )}
                {weight && weight.trim() !== "" && (
                  <li className="font-bold">Weight</li>
                )}
                <li className="font-bold">Quantity Available</li>
                <li className="font-bold">Description</li>
              </ul>
              <ul className="flex flex-col gap-2">
                <li>{itemID}</li>
                <li>{itemName}</li>
                <li>{itemGroup.replaceAll("_", " ")}</li>
                <li>{brand}</li>
                <li>{model}</li>
                <li>{unit}</li>
                {dimension && dimension.trim() !== "" && <li>{dimension}</li>}
                {weight && weight.trim() !== "" && <li >{weight}</li>}
                <li className="mb-3 mt-3">{quantity}</li>
              

                <li>{description}</li>
              </ul>
            </section>
          </div>
        </div>

       {!isEmployee && itemGroup!=="OFFICE_SUPPLIES" && ( <div className="mt-8">
          <Typography variant="h5" className="font-bold mb-4">
            Usage Details
          </Typography>
          <List>
            {usageDetails.length > 0 ? (
              usageDetails.map((usage) => (
                <ListItem key={usage.userId} className="bg-gray-100 mb-2 p-4 rounded-lg shadow-md">
                  <ListItemText
                    primary={`User: ${usage.userName} (${usage.userEmail})`}
                    secondary={`${usage.department} Department |  Quantity Held: ${usage.totalQuantity}`}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No usage details available for this item." />
              </ListItem>
            )}
          </List>
        </div>
)}
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default ViewItemDetails;
