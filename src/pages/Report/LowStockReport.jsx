import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography, Button, ButtonGroup } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import PrintIcon from '@mui/icons-material/Print';

const options = ['COMPUTER_ACCESSORIES', 'COMPUTER_HARDWARE', 'PRINTER', 'OTHER'];

const LowStockReport = () => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    fetchLowStockItems();
  }, []);

  const fetchLowStockItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/low-stock-items');
      setLowStockItems(response.data);
    } catch (error) {
      console.error('Error fetching low stock items:', error);
    }
  };

  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so add 1
  const day = currentDate.getDate().toString().padStart(2, '0');
  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return (
    <div>
      <div className="flex items-end justify-end gap-4 p-6 mr-10">
        <ButtonGroup variant="contained" ref={anchorRef} aria-label="Button group with a nested menu">
          <Button className="px-6 py-2 text-white bg-blue-600 rounded" onClick={handleClick}>{options[selectedIndex]}</Button>
          <Button
            className="px-6 py-2 text-white bg-blue-600 rounded"
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Button className="px-6 py-2 text-white bg-blue-600 rounded" variant='contained' type='submit' onClick={handlePrint}>
          <PrintIcon /> Print
        </Button>
        <Popper sx={{ zIndex: 1 }} open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu" autoFocusItem>
                    {options.map((option, index) => (
                      <MenuItem
                        key={option}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
      <div className="p-10 ml-6 mr-6 bg-white">
        <div>
          <section className="flex flex-col items-center justify-center mt-4 mb-10">
            <header className="text-3xl">LOW-STOCK ITEMS REPORT</header>
            <Typography variant='h6' gutterBottom>Company Name</Typography>
          </section>
          <section className="flex flex-row gap-10 ml-6">
            <ul className='flex flex-col gap-2'>
              <li className="font-bold">Category</li>
              <li className="font-bold">Date</li>
              <li className="font-bold">Generated By</li>
            </ul>
            <ul className='flex flex-col gap-2'>
              <li>All Item</li>
              <li>{new Date().toLocaleDateString()}</li>
              <li>System</li>
            </ul>
          </section>
        </div>
        <TableContainer component={Paper} className="p-8 mt-8">
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow className=" bg-zinc-800">
                <TableCell align="right" className="text-white">#</TableCell>
                <TableCell align="right" className="text-white">Item ID</TableCell>
                <TableCell align="right" className="text-white">Item Name</TableCell>
                <TableCell align="right" className="text-white">Total Stock In</TableCell>
                <TableCell align="right" className="text-white">Total Stock Out</TableCell>
                <TableCell align="right" className="text-white">Available Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lowStockItems.map((item, index) => (
                <TableRow key={item.itemId}>
                  <TableCell align="right">{index + 1}</TableCell>
                  <TableCell align="right">{item.itemId}</TableCell>
                  <TableCell align="right">{item.itemName}</TableCell>
                  <TableCell align="right">{item.totalStockIn}</TableCell>
                  <TableCell align="right">{item.totalStockOut}</TableCell>
                  <TableCell align="right">{item.availableQuantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className='mt-16'>
          <Typography variant="caption" gutterBottom>Generated Date/Time : </Typography>
          <Typography variant="caption" gutterBottom>{formattedDateTime}</Typography>
        </div>
        <Typography variant="caption" gutterBottom>Computer Generated Report By CENTRAL SYNC &#174; | No Signature Required.</Typography>
      </div>
    </div>
  );
};
export default LowStockReport;
