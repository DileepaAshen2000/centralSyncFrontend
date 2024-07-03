import React,{useRef} from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography,Button } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import PrintIcon from "@mui/icons-material/Print";
import { useReactToPrint } from 'react-to-print';


const handlePrint=()=>{
  window.print();
}
const options = ['COMPUTERS_AND_LAPTOPS', 'COMPUTER_ACCESSORIES', 'COMPUTER_HARDWARE', 'OFFICE_SUPPLIES', 'FURNITURE','PRINTERS_AND_SCANNERS','OTHER','ALL_ITEM'];

const InventorySummary = () => {
  const navigate = useNavigate();
  // for drop down button
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const printRef = useRef();

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
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  //
//   const {sinId} = useParams(); // get the StockIn id from the url
//   const [stockIn,setStockIn] = useState({  // create state for StockIn, initial state is empty with object.
//     date:"",
//     description:"",
//     inQty:"",
//     location:"",
//     itemId:""
//   })

// const{date,description,inQty,location,itemId} = stockIn;

// const [item,setItem] = useState({  // create state for StockIn, initial state is empty with object.
//   itemName:"",
//   quantity:"",
//   itemGroup:""
// })
// const{itemName,quantity,itemGroup} = item;

// useEffect(() => {
//   loadStockIn();
// },[]);

// //get selected StockIn data
// const loadStockIn = async () => {
//   try {
//     const result = await axios.get(`http://localhost:8080/stock-in/getById/${sinId}`);
//     setStockIn(result.data);  // Make sure the fetched data structure matches the structure of your state
    
//     const result1 = await axios.get(`http://localhost:8080/inventory-item/getById/${result.data.itemId}`);
//     setItem(result1.data);
//   } catch (error) {
//     console.error('Error loading StockIn:', error);
//   }
// }


  // Get the current date and time
  const currentDate = new Date();

  // Extract components of the date and time
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so add 1
  const day = currentDate.getDate().toString().padStart(2, '0');
  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');

  // Format the date and time as needed
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  
  return (
      <div>
        {/* button area */}
        <div className="flex items-end justify-end gap-4 p-6 mr-10">
          <ButtonGroup
            variant="contained"
            ref={anchorRef}
            aria-label="Button group with a nested menu"
          >
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
        <Button className="px-6 py-2 text-white bg-blue-600 rounded"
          variant='contained'
          type='submit'
          onClick={handlePrint}
        >
          <PrintIcon />
          print
        </Button>
        <Popper
          sx={{
            zIndex: 1,
          }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
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
        {/* report body */}
        <div ref={printRef} className="p-10 ml-6 mr-6 bg-white">
          <div>
            <section className="flex flex-col items-center justify-center mt-4 mb-10">
              <header className="text-3xl">INVENTORY-SUMMARY REPORT</header>
              <Typography variant='h6' gutterBottom>Company Name</Typography>
            </section>
            <section className="flex flex-row gap-10 ml-6">
              <ul className='flex flex-col gap-2'>
                <li className="font-bold">Category</li>
                <li className="font-bold">Date</li>
                <li className="font-bold">Generated By</li>
              </ul>
              <ul className='flex flex-col gap-2'>
                <li>{options[selectedIndex]}</li>
                <li>2024-05-21</li>
                <li>Dileepa Ashen</li>
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
                  <TableCell align="right" className="text-white">Department</TableCell>
                  <TableCell align="right" className="text-white">Total Used</TableCell>
                  <TableCell align="right" className="text-white">Total Adjustment</TableCell>
                  <TableCell align="right" className="text-white">Available</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                  <TableRow>
                    <TableCell align="right">1</TableCell>
                    <TableCell align="right">001</TableCell>
                    <TableCell align="right">item 01</TableCell>
                    <TableCell align="right">10</TableCell>
                    <TableCell align="right">8</TableCell>
                    <TableCell align="right">2</TableCell>
                    <TableCell align="right">1</TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <div className='mt-16'>
            <Typography variant="caption" gutterBottom>Generated Date/Time : </Typography>
            <Typography variant="caption" gutterBottom>{formattedDateTime}</Typography>
          </div>
          <Typography variant="caption" gutterBottom>Computer Generated Report By CENTRAL SYNC &#174; | No Signature Required.</Typography>
        </div>

        <div className='flex ml-[86%] mt-6'>
          <Button className="px-6 py-2 rounded"
                variant='outlined'
                type='submit'
                onClick={() => navigate("/")}
                  >cancel</Button>
        </div>
    </div>
  )
}
export default InventorySummary;
