
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import PersonIcon from '@mui/icons-material/Person';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React, { useState } from 'react';


// React component for the SideBar
const SideBar = () => {
  const [openInventory, setOpenInventory] = useState(false);
  const [openRequestReservation, setOpenRequestReservation] = useState(false);
  const [openReport, setOpenReport] = useState(false);
 
  const handleInventoryClick = () => {
    setOpenInventory(!openInventory);
  };

  const handleRequestReservationClick = () => {
    setOpenRequestReservation(!openRequestReservation);
  };

  const handleReportClick = () => {
    setOpenReport(!openReport);
  };

  return (
    
      <List className='mx-2 mt-2'>
        {/* Dashboard sections */}
        <a href='/'>
          <ListItem button className='rounded-lg hover:bg-blue-100 focus:bg-blue-400' >
            <DashboardIcon></DashboardIcon>
            <ListItemText primary="Dashboard" className='pl-4 pr-4' />
          </ListItem>
        </a>
        
        {/* Inventory */}
        <ListItem button onClick={handleInventoryClick} className='rounded-lg hover:bg-blue-100 focus:bg-blue-400'>
          <InventoryIcon></InventoryIcon>
          <ListItemText primary="Inventory" className='pl-4 pr-4'/>
          {openInventory ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openInventory} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button  className='pl-8 rounded-lg'>
              <ListItemText primary="Item" />
            </ListItem>
            <a href='/adjustment'>
              <ListItem button  className='pl-8 rounded-lg'>
                <ListItemText primary="Adjustment" />
              </ListItem>
            </a>
            <ListItem button  className='pl-8 rounded-lg'>
              <ListItemText primary="Stock In" />
            </ListItem>
            <ListItem button  className='pl-8 rounded-lg'>
              <ListItemText primary="Stock Out" />
            </ListItem>
          </List>
        </Collapse>

        {/* User */}
        <ListItem button className='rounded-lg hover:bg-blue-100 focus:bg-blue-400'>
          <PersonIcon></PersonIcon>
          <ListItemText primary="User" className='pl-4 pr-4'/>
        </ListItem>

        {/* Request & Reservation with dropdown and sub-parts */}
        <ListItem button onClick={handleRequestReservationClick} className='rounded-lg hover:bg-blue-100 focus:bg-blue-400'>
          <NoteAddIcon></NoteAddIcon>
          <ListItemText primary="Request & Reservation" className='pl-4 pr-4'/>
          {openRequestReservation ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openRequestReservation} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button  className='pl-8 rounded-lg'>
              <ListItemText primary="Request" />
            </ListItem>
            <ListItem button  className='pl-8 rounded-lg'>
              <ListItemText primary="Reservation" />
            </ListItem>
            <ListItem button  className='pl-8 rounded-lg'>
              <ListItemText primary="Maintain Ticket" />
            </ListItem>
          </List>
        </Collapse>

        {/* Report */}
        <ListItem button onClick={handleReportClick} className='rounded-lg hover:bg-blue-100 focus:bg-blue-400'>
          <BarChartIcon></BarChartIcon>
          <ListItemText primary="Report" className='pl-4 pr-4'/>
          {openReport ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openReport} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button  className='pl-8 rounded-lg'>
              <ListItemText primary="View History" />
            </ListItem>
            <ListItem button  className='pl-8 rounded-lg'>
              <ListItemText primary="Inventory Summary" />
            </ListItem>
            <ListItem button  className='pl-8 rounded-lg'>
              <ListItemText primary="Stock Alert" />
            </ListItem>
            <ListItem button  className='pl-8 rounded-lg'>
              <ListItemText primary="Item Usage Analysis" />
            </ListItem>
          </List>
        </Collapse>

        {/* Initiate Order */}
        <ListItem button className='rounded-lg hover:bg-blue-100 focus:bg-blue-400'>
          <ShoppingCartIcon></ShoppingCartIcon>
          <ListItemText primary="Initiate Order" className='pl-4 pr-4'/>
        </ListItem>

        <ListItem button className='rounded-lg md:hidden hover:bg-blue-100 focus:bg-blue-400'>
          <AccountCircleIcon></AccountCircleIcon>
          <ListItemText primary="My Account" className='pl-4 pr-4'/>
        </ListItem>
      </List>

  );
};

export default SideBar;
