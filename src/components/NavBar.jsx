import React, { useState, useEffect, useRef } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import myLogo from "../assests/logo1.png";
import MenuIcon from "@mui/icons-material/Menu";
import SideBar from "./SideBar";
import { Button, InputBase } from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import HistoryIcon from "@mui/icons-material/History";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { Link, useNavigate } from "react-router-dom";
import LoginService from "../pages/Login/LoginService";
import SearchBar from "./SearchBar";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import Avatar from "@mui/material/Avatar";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function NavBar() {
  const navigate = useNavigate();
  const isAuthenticated = LoginService.isAuthenticated();
  const [profileInfo, setProfileInfo] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false); // State to control notifications visibility
  const stompClientRef = useRef(null);

  useEffect(() => {
    fetchProfileInfo();
    connectWebSocket();
    return () => {
      disconnectWebSocket();
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to logout this user?"
    );
    if (confirmDelete) {
      LoginService.logout();
      navigate("/");
    }
  };

  const fetchProfileInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await LoginService.getYourProfile(token);
      setProfileInfo(response.users);
    } catch (error) {
      console.error("Error fetching profile information:", error);
    }
  };

  const connectWebSocket = () => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      stompClient.subscribe("/topic/notifications", (message) => {
        try {
          const notification = JSON.parse(message.body);
          console.log("Received notification:", notification);
          setNotificationCount((prevCount) => prevCount + 1);
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            notification,
          ]);
        } catch (error) {
          console.error("Error parsing notification message:", error);
        }
      });
    };

    stompClient.activate();
    stompClientRef.current = stompClient;
  };

  const disconnectWebSocket = () => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
    }
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className="bg-white z-50">
        <Toolbar>
          <img src={myLogo} alt="Inventory Logo" className="w-32 h-auto " />
          <h4 className="hidden text-xl font-bold text-blue-800 md:block">
            CENTRAL SYNC
          </h4>
          <SearchBar />
          <Box sx={{ flexGrow: 2 }} />
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: "20px" }}>
            <IconButton
              size="large"
              aria-label="show new notifications"
              color="inherit"
              className="hidden md:block"
              onClick={toggleNotifications} // Add onClick handler to toggle notifications
            >
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon className="text-black" />
              </Badge>
            </IconButton>
            <div className="flex items-center">
              {profileInfo ? (
                <h4 className="text-black text-bold ">
                  {profileInfo.firstName} {profileInfo.lastName}
                </h4>
              ) : (
                <h4 className="text-black ">Loading...</h4>
              )}
            </div>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={toggleSidebar}
              color="inherit"
              className="hidden md:block"
            >
              {profileInfo.imagePath && (
                <Avatar
                  alt="Profile pic"
                  src={`http://localhost:8080/user/display/${profileInfo.userId}`}
                  sx={{ width: 50, height: 50 }}
                />
              )}
            </IconButton>
          </Box>
          <div
            className="text-black cursor-pointer text- md:hidden"
            onClick={toggleMenu}
          >
            <MenuIcon />
          </div>
        </Toolbar>
      </AppBar>

      {/* Notifications list */}
      {notificationsOpen && (
        <Box className="absolute right-0 mt-2 w-80 bg-white border border-gray-300 z-40 rounded-md shadow-lg">
          <Box className="p-2">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="body2" color="textSecondary">
                      {notification.message}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Box className="p-2">
                <Typography variant="body2" color="textSecondary">
                  No notifications
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}

      <div className="relative">
    
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-30"  style={{ top: "75px" }}></div>}

      <div
        className={`w-80 absolute right-0 h-screen z-50 bg-[#D0D0D0] text-black ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-col gap-10 p-6">
          <div className="flex gap-4">
            
            <div className="font-bold text-sm">
              
              <h2>{profileInfo ? profileInfo.username : "Loading..."}</h2>
              <h4>{profileInfo ? profileInfo.role : "Loading..."}</h4>
              <h2>{profileInfo ? profileInfo.userId : "Loading..."}</h2>
            </div>
          </div>
          <div>
            <div className="pb-4">
              <Link to="/userprofile/editprofile">
                <Button
                  variant="outlined"
                  className="bg-white w-[100%] h-[45px] text-black hover:text-[#D9D9D9] hover:bg-black border-none rounded-none justify-start space-x-5 "
                  onClick={() => setSidebarOpen(false)}
                >
                  <AccountCircleOutlinedIcon />
                  <span>Edit Profile</span>
                </Button>
              </Link>
            </div>
            <div className="pb-4">
              <Link to="/history/:userId">
                <Button
                  variant="outlined"
                  className="bg-white w-[100%] h-[45px] text-black hover:text-[#D9D9D9] hover:bg-black border-none rounded-none justify-start space-x-5"
                  onClick={() => setSidebarOpen(false)}
                >
                  <HistoryIcon />
                  <span>View History</span>
                </Button>
              </Link>
            </div>
            <div className="pb-4">
              <Link to="/userprofile/changepassword">
                <Button
                  variant="outlined"
                  className="bg-white w-[100%] h-[45px] text-black hover:text-[#D9D9D9] hover:bg-black border-none rounded-none justify-start space-x-5"
                  onClick={() => setSidebarOpen(false)}
                >
                  <KeyOutlinedIcon />
                  <span>Change Password</span>
                </Button>
              </Link>
            </div>
            <div className="pb-4">
              {isAuthenticated && (
                <Link to="/" onClick={handleLogout}>
                  <Button
                    variant="outlined"
                    className="bg-white w-[100%] h-[45px] text-black hover:text-[#D9D9D9] hover:bg-black border-none rounded-none justify-start space-x-5"
                  >
                    <LogoutOutlinedIcon />
                    <span>Logout</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

      <div
        className={`${menuOpen ? "block" : "hidden"} md:hidden bg-slate-300 `}
      >
        <SideBar />
      </div>
    </Box>
  );
}
