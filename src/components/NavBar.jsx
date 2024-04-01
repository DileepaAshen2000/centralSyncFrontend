import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import myLogo from "../assests/logo1.png";
import MenuIcon from "@mui/icons-material/Menu";
import SideBar from "./SideBar";
import { useState } from "react";
import { TextField, Button, Stack, Select } from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import HistoryIcon from "@mui/icons-material/History";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate } from "react-router-dom";
 
import { BrowserRouter as Router, Link } from "react-router-dom";
 

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
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function NavBar() {
   
  // sidebar open and close for profile section
  const [SidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!SidebarOpen);
  };

  // Side bar handling for navigation section
  const [Open, setOpen] = useState(false);
  const toggleMenu = () => {
    setOpen(!Open);
  };

  const navigate = useNavigate();
  const handleHistoryButtonClick = () => {
    navigate("/history");
    console.log("Navigating to history page");
   
  };

  return (
     
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" className="bg-white">
          <Toolbar>
            <img src={myLogo} alt="Inventory Logo" className="w-32 h-auto " />
            <h4 className="hidden text-xl font-bold text-blue-800 md:block">
              CENTRAL SYNC
            </h4>
            <Search className="box-border bg-white border-2 rounded-2xl">
              <SearchIconWrapper>
                <SearchIcon className="text-gray-500 " />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                className="text-gray-500 "
              />
            </Search>
            <Box sx={{ flexGrow: 2 }} />
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: "20px" }}>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
                className="hidden md:block"
              >
                <Badge badgeContent={10} color="error">
                  <NotificationsIcon className="text-black " />
                </Badge>
              </IconButton>
              <div className="flex items-center">
                <h4 className="text-black ">Dileepa Ashen</h4>
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
                <AccountCircle className="text-3xl text-black" />
              </IconButton>
            </Box>

            <div
              className="text-black cursor-pointer text- md:hidden"
              onClick={toggleMenu}
            >
              <MenuIcon></MenuIcon>
            </div>
          </Toolbar>
        </AppBar>

        {/* Sidebar Content */}
        <div
          className={` w-80 absolute right-0 h-screen bg-[#F1ECEC] text-black ${
            SidebarOpen ? "block" : "hidden"
          }  `}
        >
          <div className="flex flex-col gap-10 p-10 pl-4">
            <div className="flex gap-4">
              <div>Profile Picture</div>
              <div>
                <h2>User Name</h2>
                <h4>User Role</h4>
              </div>
            </div>
            <div>
              <div className="pb-4">
                <Button
                  variant="outlined"
                  className="bg-[#D9D9D9] w-[287px] h-[45px]  text-black  hover:text-[#D9D9D9] hover:bg-black border-none  rounded-none justify-start space-x-5 "
                >
                  <AccountCircleOutlinedIcon />
                  <span>Edit Profile</span>
                </Button>
              </div>
              <div className="pb-4">
               
                <Button
                  variant="outlined"
                  className="bg-[#D9D9D9] w-[287px] h-[45px]  text-black  hover:text-[#D9D9D9] hover:bg-black border-none  rounded-none justify-start space-x-5"
                  onClick={() => handleHistoryButtonClick()}
                >
                
                  <HistoryIcon />
                  <span>View History</span>
                </Button>
               
              </div>
              <div className="pb-4">
                <Button
                  variant="outlined"
                  className="bg-[#D9D9D9] w-[287px] h-[45px]  text-black  hover:text-[#D9D9D9] hover:bg-black border-none  rounded-none justify-start space-x-5"
                   
                >

                  <KeyOutlinedIcon />
                  <span>Change Password</span>
                </Button>
              </div>
              <div className="pb-4">
                <Button
                  variant="outlined"
                  className="bg-[#D9D9D9] w-[287px] h-[45px]  text-red-600  hover:text-[#D9D9D9] hover:bg-black border-none  rounded-none justify-start space-x-5"
                >
                  <LogoutOutlinedIcon className="text-red-600" />
                  <span>Log out</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* side bar mobile menu */}
        <div className={`${Open ? "block" : "hidden"} md:hidden bg-slate-300 `}>
          <SideBar></SideBar>
        </div>
      </Box>
  
  );
}
