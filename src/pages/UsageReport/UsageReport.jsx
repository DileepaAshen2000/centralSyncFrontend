import * as React from "react";
import {
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import AvgGauge from "./AvgGauge";
import UsageBarChart from "./ItemUsageBarGraph";
import StockLineChart from "./StockIn&OutChart";
import { YearCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import PrintIcon from "@mui/icons-material/Print";
import { useState } from "react";

const Usage = () => {
  const [category, setCategory] = useState("computerAccessories");
  const [year, setYear] = useState(dayjs().endOf("year").format("YYYY"));
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleYearChange = (selectedYear) => {
    setYear(dayjs(selectedYear, "YYYY").format("YYYY"));
    setOpen(false);
  };


  
  return (
    <div className="grid grid-cols-10">
      <Select
        label="Group"
        id="selectItemGroup"
        className="col-start-1 bg-blue-600  w-[200px] h-10   text-white"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <MenuItem value="computerAccessories">Computer accessories</MenuItem>
        <MenuItem value="printer">Printer</MenuItem>
        <MenuItem value="computerHardware">Computer hardware</MenuItem>
        <MenuItem value="other">Other</MenuItem>
      </Select>

      <Button
        variant="contained"
        className="bg-blue-600 col-start-3 col-span-2 ml-10"
        onClick={handleOpen}
      >
        {year ? year : "year"}
      </Button>
      <Dialog open={open} onClose={handleClose} >
        <DialogTitle>Select a year</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <YearCalendar
           
              minDate={dayjs([2020, 1, 1])}
              maxDate={dayjs().endOf("year")}
              onChange={handleYearChange}
              className=" col-start-4"
            />
          </LocalizationProvider>
        </DialogContent>
      </Dialog>

      <Button
        variant="contained"
        className="row-start-1 col-start-9 col-span-2 rounded-sm bg-blue-600 ml-10  "
      >
        <PrintIcon />
        Print
      </Button>
      <h1 className="row start-2 col-span-10 text-3xl text-center p-10 ">
        {category.toUpperCase()} ITEM USAGE ANALYSIS REPORT
        <br /> (JAN-DEC)
        <br/> {year}
      </h1>
     
        <div className="row-start-3 col-span-3" >
          <AvgGauge category={category} year={year}/>
          
        </div>
     
      <div className="row-start-3 col-start-4 col-span-7 ml-10  h-[400px] bg-white ">
        <h2 className=" text-xl  p-4 ">Monitor Usage</h2>
        <hr className="col-span-4 border-t border-gray-200" />
        <UsageBarChart category={category} year={year} />
      </div>
      <div className="row-start-4 col-span-10 h-[400px] mt-5 bg-white ">
        <h2 className=" text-xl  p-4 ">Monitor Inventory Statistics</h2>
        <hr className="col-span-4 border-t border-gray-200" />
        <StockLineChart category={category} year={year} />
      </div>
    </div>
  );
};

export default Usage;
