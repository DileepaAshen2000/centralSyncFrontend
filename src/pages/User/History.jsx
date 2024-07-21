import React, { useEffect, useState } from "react";
import axios from "axios";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import Chip from "@mui/material/Chip";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import LoginService from "../Login/LoginService";
import UserIcon from "@mui/icons-material/Person";
import TicketIcon from "@mui/icons-material/ConfirmationNumber";
import StockIcon from "@mui/icons-material/Inventory";
import ReservationIcon from "@mui/icons-material/Book";
import ItemIcon from "@mui/icons-material/Category";
import OrderIcon from "@mui/icons-material/ShoppingCart";
import AdjustmentIcon from "@mui/icons-material/Tune";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ReviewIcon from "@mui/icons-material/RateReview";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LockIcon from "@mui/icons-material/Lock";
import image from "../../assests/cursor.png";
import Avatar from "@mui/material/Avatar";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Popover from "@mui/material/Popover";
import {CircularProgress,Backdrop
} from "@mui/material";

const UserActivityHistory = () => {
  const [activityLogs, setActivityLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedWord, setSelectedWord] = useState([]);
  const [noActivitiesFound, setNoActivitiesFound] = useState(false);
  const navigate = useNavigate();
  const [profileInfo, setProfileInfo] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverContent, setPopoverContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  useEffect(() => {
    if (profileInfo.userId) {
      fetchActivityLogs(profileInfo.userId);
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

  // Fetch user activity logs from the backend API
  const fetchActivityLogs = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/user-activity-log/${userId}`
      );
      setActivityLogs(response.data);
      setFilteredLogs(response.data.reverse());
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching user activity logs:", error);
    }
    finally{
      setLoading(false);
    };
  };

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    filterLogs(date === null ? null : date, selectedWord);
  };

  const handleWordChange = (word) => {
    setSelectedWord(word);
    filterLogs(selectedDate, word);
  };

  const filterLogs = (date, word) => {
    let filtered = activityLogs;

    // Filter by date if date is selected
    if (date) {
      filtered = filtered.filter((log) => {
        const logDate = new Date(log.date);
        return (
          logDate.getDate() === date.getDate() &&
          logDate.getMonth() === date.getMonth() &&
          logDate.getFullYear() === date.getFullYear()
        );
      });
    }

    // Filter by keyword
    if (word) {
      filtered = filtered.filter((log) =>
        log.action.toLowerCase().includes(String(word).toLowerCase())
      );
    }

    if (filtered.length === 0) {
      setNoActivitiesFound(true);
    } else {
      setNoActivitiesFound(false);
    }

    setFilteredLogs(filtered);
  };

  const handlePopoverOpen = async (event, entityId, action) => {
    setAnchorEl(event.currentTarget);
    const content = await handleActionClick(entityId, action);
    setPopoverContent(content);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverContent("");
  };

  const open = Boolean(anchorEl);

  // Function to handle action click
  const handleActionClick = async (entityId, action) => {
    let popoverContent = "";

    try {
      if (action.includes("User") || action.includes("user")) {
        const response = await axios.get(
          `http://localhost:8080/user/users/${entityId}`
        );
        popoverContent = `User Id: ${entityId}\n Name: ${response.data.firstName} ${response.data.lastName}\n
                               Role: ${response.data.role}\n
                               Status: ${response.data.status}`;
      } else if (action.includes("ticket")) {
        const response = await axios.get(
          `http://localhost:8080/ticket/tickets/${entityId}`
        );
        popoverContent = `Ticket ID:${entityId}\n Status:${response.data.ticketStatus}\n Item Name:${response.data.itemId.itemName}\nItem Brand:${response.data.itemId.brand}\n`;
      } else if (action.includes("Stock In")) {
        const response = await axios.get(
          `http://localhost:8080/stock-in/getById/${entityId}`
        );
        popoverContent = `StockIn ID:${entityId}\n Location:${response.data.location}\n Item Name:${response.data.itemId.itemName}`;
      } else if (action.includes("Stock Out")) {
        const response = await axios.get(
          `http://localhost:8080/stock-out/getById/${entityId}`
        );
        popoverContent = `Stock Out ID: ${entityId}\n Department:${response.data.department}\nItem Name:${response.data.itemId.itemName}\n`;
      } else if (action.includes("Reservation")) {
        const response = await axios.get(
          `http://localhost:8080/ticket/tickets/${entityId}`
        );
        popoverContent = `Ticket ID ${entityId}\n Status:${response.data.ticketStatus}\n Topic:${response.data.itemName}\nTopic:${response.data.itemBrand}\n`;
      } else if (action.includes("Request")) {
        const response = await axios.get(
          `http://localhost:8080/reuest/getById/${entityId}`
        );
        popoverContent = `Request ID ${entityId}\n Status:${response.data.reqStatus}\n Reason:${response.data.reason}\nTopic:${response.data.itemId.itemName}\n`;
      } else if (action.includes("Item")) {
        const response = await axios.get(
          `http://localhost:8080/inventory-item/getById/${entityId}`
        );
        popoverContent = `item Id ${entityId}\n Status:${response.data.status}\n Item Name:${response.data.itemName}\nItem Brand:${response.data.brand}\n`;
      } else if (action.includes("Order") || action.includes("order")) {
        const response = await axios.get(
          `http://localhost:8080/orders/getById/${entityId}`
        );
        popoverContent = `Order Id ${entityId}\n Status:${response.data.status}\n Item Name:${response.data.itemName}\nBrand Name:${response.data.brandname}\nVendor Name:${response.data.vendorName}\n`;
      } else if (
        action.includes("Adjustment") ||
        action.includes("adjustment")
      ) {
        const response = await axios.get(
          `http://localhost:8080/adjustment/getById/${entityId}`
        );
        popoverContent = `Adjustment Id: ${entityId}\n Status:${response.data.status}\n Topic:${response.data.reason}\nitemId:${response.data.itemId}\n`;
      } else if (action.includes("Password")) {
        popoverContent = `Password succesfully changed`;
      } else if (action.includes("Profile")) {
        popoverContent = `Profile updated succesfully`;
      } else {
        popoverContent = `Details for action: ${action}`;
      }
    } catch (error) {
      popoverContent = "Data not found for this action";
    }

    return popoverContent;
  };

  const getIcon = (action) => {
    switch (true) {
      case action.includes("inactive"):
        return <BlockIcon className="text-red-500 rounded-full h-7 w-7" />;
      case action.includes("deleted"):
        return <DeleteIcon className="text-red-500 rounded-full h-7 w-7" />;
      case action.includes("approved") ||
        action.includes("accepted") ||
        action.includes("Completed"):
        return (
          <CheckCircleIcon className="text-green-800 rounded-full h-7 w-7" />
        );
      case action.includes("rejected"):
        return <CancelIcon className="text-red-500 rounded-full h-7 w-7" />;
      case action.includes("password") || action.includes("Password"):
        return <LockIcon className="text-red-500 rounded-full h-7 w-7" />;
      case action.includes("reviewed"):
        return <ReviewIcon className="text-blue-500 rounded-full h-7 w-7" />;
      case action.includes("User") || action.includes("user"):
        return <UserIcon className="text-green-500 rounded-full h-7 w-7" />;
      case action.includes("ticket"):
        return <TicketIcon className="text-yellow-500 rounded-full h-7 w-7" />;
      case action.includes("Stock In"):
      case action.includes("Stock Out"):
        return <StockIcon className="text-purple-500 rounded-full h-7 w-7" />;
      case action.includes("request"):
        return <InventoryIcon className="text-orange-500 rounded-full h-7 w-7" />;
      case action.includes("Reservation"):
        return (
          <ReservationIcon className="text-yellow-500 rounded-full h-7 w-7" />
        );
      case action.includes("delivered"):
        return (
          <LocalShippingIcon className="text-blue-600 rounded-full h-7 w-7" />
        );
      case action.includes("item") || action.includes("Item"):
        return <ItemIcon className="text-blue-700 rounded-full h-7 w-7" />;
      case action.includes("Order") || action.includes("order"):
        return <OrderIcon className="text-green-700 rounded-full h-7 w-7" />;
      case action.includes("Adjustment") || action.includes("adjustment"):
        return <AdjustmentIcon className="text-blue-800 rounded-full h-7 w-7" />;

      case action.includes("Profile"):
        return (
          <ManageAccountsIcon className="text-purple-600 rounded-full h-7 w-7" />
        );

      default:
        return <TimelineDot className="text-red-500 rounded-full h-7 w-7" />;
    }
  };

  return (
    <React.Fragment>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="pt-5 pb-10">
          <div className="bg-white  flex flex-col rounded-xl shadow-md min-h-screen ">
            <div className="bg-blue-300">
              <h1 className="p-4 text-4xl font-bold">Recent Activities</h1>
              <div className="grid grid-cols-8 grid-rows-1  gap-x-[0.25rem] pt-5 ">
                <div className="pl-5 col-span-1 px-11 pb-2">
                  {profileInfo.imagePath && (
                    <Avatar
                      alt="Profile pic"
                      src={`http://localhost:8080/user/display/${profileInfo.userId}`}
                      sx={{ width: 100, height: 100 }}
                    />
                  )}
                </div>
                <div className="col-span-2">
                  <Typography variant="h6" className="font-semibold">
                    {profileInfo.firstName} {profileInfo.lastName}
                  </Typography>
                  <Typography variant="h6" className="font-semibold">
                    {profileInfo.userId}
                  </Typography>
                  <Typography variant="subtitle1" className="font-semibold">
                    {profileInfo.role}
                  </Typography>
                </div>
                <div className="col-start-5 col-span-1">
                  <DatePicker
                    label="Search by Date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="w-[250px] bg-slate-200 border"
                    renderInput={(params) => <TextField {...params} />}
                    clearable={true}
                  />
                </div>
                <div className="col-start-7 col-span-1 gap-2">
                  <TextField
                    label="Search by Activity"
                    value={selectedWord}
                    onChange={(e) => handleWordChange(e.target.value)}
                    className="w-[250px] bg-slate-200"
                  />
                </div>
              </div>
              <div>
                <hr className="border-black border-2" />
              </div>
            </div>
            <div className="grid grid-cols-12 grid-rows-1  gap-x-1 pt-5 ">
              <div className="col-span-1">
                <img
                  src={image}
                  className="w-[90px] h-[50px] pl-10  pt-2"
                  alt="image"
                />
              </div>
              <div className="col-span-5">
                <Typography variant="h6" className="pt-4 text-blue-800">
                  To find out more details, click on Activity
                </Typography>
              </div>
            </div>
            {loading ? (
        <div className="flex justify-center mostRequestedItems-center">
          <CircularProgress />
        </div>
      ):(<>
            <Timeline className="pt-12">
            
              {filteredLogs.map((log) => (
                <TimelineItem key={log.userId}>
                  <TimelineOppositeContent className="flex-none w-1/5">
                    <Chip
                      label={
                        <>
                          {log.date}
                          {"  "}

                          {log.time}
                        </>
                      }
                      component="a"
                      variant="outlined"
                      data-aos="zoom-in"
                      className="w-[500px] h-[50px]   text-black  space-x-5 border-none text-sm "
                    />
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot
                      className="bg-transparent shadow-none  h-6"
                      data-aos="zoom-in"
                    >
                      {getIcon(log.action)}
                    </TimelineDot>
                    <TimelineConnector
                      className="bg-black"
                      data-aos="zoom-in"
                    />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Chip
                      label={log.action}
                      component="a"
                      href="#basic-chip"
                      variant="outlined"
                      data-aos="zoom-in"
                      className="w-[310px] h-[50px] rounded-lg border-black font-semibold text-black  space-x-5 shadow-xl hover:bg-blue-500"
                      clickable
                      onClick={(e) =>
                        handlePopoverOpen(e, log.entityId, log.action)
                      }
                    />
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
            <div className="flex justify-center items-center h-full pb-[30%] ">
              {noActivitiesFound && (
                <div>
                  <Typography
                    variant="h5"
                    className="p-4 text-red-500 tracking-wider"
                  >
                    No activities found.
                  </Typography>
                </div>
              )}
            </div>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <div className="p-5">
                <Typography variant="subtitle2" className="">
                  {popoverContent.split("\n").map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </Typography>
              </div>
            </Popover>
            </>
          )}
          </div>
          
      
      
        </div>
      </LocalizationProvider>
    </React.Fragment>
  );
};

export default UserActivityHistory;
