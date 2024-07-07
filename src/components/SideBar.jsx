import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PersonIcon from "@mui/icons-material/Person";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginService from "../pages/Login/LoginService";

const SideBar = () => {
  const [openInventory, setOpenInventory] = useState(false);
  const [openRequestReservation, setOpenRequestReservation] = useState(false);
  const [openReport, setOpenReport] = useState(false);

  const navigate = useNavigate();

  const isEmployee = LoginService.isEmployee();
  const isAdmin = LoginService.isAdmin();
  const isReqHandler = LoginService.isReqHandler();

  const handleInventoryClick = () => {
    setOpenInventory(!openInventory);
  };

  const handleRequestReservationClick = () => {
    setOpenRequestReservation(!openRequestReservation);
  };

  const handleReportClick = () => {
    setOpenReport(!openReport);
  };

   {/* Inventroy request section routing according to login role */}
   const getInventoryRequestListLink = () => {
    if (isAdmin) return "/admin-in-request-list";
    if (isReqHandler) return "/requestHandler/in-request-list";
    if (isEmployee) return "/employee-in-request-list";
    return "/default-request-list";
  };


  return (
    <List className="mx-2 mt-2">
      {/* Dashboard sections */}
      <a href="/admin-dashboard">
        <ListItem
          button
          className="rounded-lg hover:bg-blue-100 focus:bg-blue-400"
        >
          <DashboardIcon></DashboardIcon>
          <ListItemText primary="Dashboard" className="pl-4 pr-4" />
        </ListItem>
      </a>

      {/* Inventory */}
      <ListItem
        button
        onClick={handleInventoryClick}
        className="rounded-lg hover:bg-blue-100 focus:bg-blue-400"
      >
        <InventoryIcon></InventoryIcon>
        <ListItemText primary="Inventory" className="pl-4 pr-4" />
        {openInventory ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={openInventory} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <a href="/item">
            <ListItem button className="pl-8 rounded-lg">
              <ListItemText primary="Item" />
            </ListItem>
          </a>
          <a href="/adjustment">
            <ListItem button className="pl-8 rounded-lg">
              <ListItemText primary="Adjustment" />
            </ListItem>
          </a>
          {!isEmployee && (
            <a href="/stockIn">
              <ListItem button className="pl-8 rounded-lg">
                <ListItemText primary="Stock In" />
              </ListItem>
            </a>
          )}
          {!isEmployee && (
            <a href="/stockOut">
              <ListItem button className="pl-8 rounded-lg">
                <ListItemText primary="Stock Out" />
              </ListItem>
            </a>
          )}
        </List>
      </Collapse>

      {/* User */}
      {!isEmployee && (
        <a href="/user">
          <ListItem
            button
            className="rounded-lg hover:bg-blue-100 focus:bg-blue-400"
          >
            <PersonIcon></PersonIcon>
            <ListItemText primary="User" className="pl-4 pr-4" />
          </ListItem>
        </a>
      )}

      {/* Request & Reservation with dropdown and sub-parts */}
      <ListItem
        button
        onClick={handleRequestReservationClick}
        className="rounded-lg hover:bg-blue-100 focus:bg-blue-400"
      >
        <NoteAddIcon></NoteAddIcon>
        <ListItemText primary="Request & Reservation" className="pl-4 pr-4" />
        {openRequestReservation ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={openRequestReservation} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <a href={getInventoryRequestListLink()}>
            <ListItem button className="pl-8 rounded-lg">
              <ListItemText primary="Request" />
            </ListItem>
          </a>

          <a href="/reservation">
            <ListItem button className="pl-8 rounded-lg">
              <ListItemText primary="Reservation" />
            </ListItem>
          </a>

          <a href="/ticket">
            <ListItem button className="pl-8 rounded-lg">
              <ListItemText primary="Maintain Ticket" />
            </ListItem>
          </a>
        </List>
      </Collapse>

      {/* Report */}
      <ListItem
        button
        onClick={handleReportClick}
        className="rounded-lg hover:bg-blue-100 focus:bg-blue-400"
      >
        <BarChartIcon></BarChartIcon>
        <ListItemText primary="Report" className="pl-4 pr-4" />
        {openReport ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={openReport} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <a href="/history/:userId">
            <ListItem button className="pl-8 rounded-lg">
              <ListItemText primary="View History" />
            </ListItem>
          </a>
          <a href="/report/inventory-summary">
            <ListItem button className="pl-8 rounded-lg">
              <ListItemText primary="Inventory Summary" />
            </ListItem>
          </a>
          <a href="/report/low-stock-report">
            <ListItem button className="pl-8 rounded-lg">
              <ListItemText primary="Stock Alert" />
            </ListItem>
          </a>
          {!isEmployee && (
            <a href="/report/item-usage-analysis">
              <ListItem button className="pl-8 rounded-lg">
                <ListItemText primary="Item Usage Analysis" />
              </ListItem>
            </a>
          )}
        </List>
      </Collapse>

      {/* Initiate Order */}
      {isAdmin && (
        <a href="/order">
          <ListItem
            button
            className="rounded-lg hover:bg-blue-100 focus:bg-blue-400"
          >
            <ShoppingCartIcon></ShoppingCartIcon>
            <ListItemText primary="Initiate Order" className="pl-4 pr-4" />
          </ListItem>
        </a>
      )}

      <ListItem
        button
        className="rounded-lg md:hidden hover:bg-blue-100 focus:bg-blue-400"
      >
        <AccountCircleIcon></AccountCircleIcon>
        <ListItemText primary="My Account" className="pl-4 pr-4" />
      </ListItem>
    </List>
  );
};

export default SideBar;
