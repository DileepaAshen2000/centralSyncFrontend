import * as React from "react";
import {
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import AvgCards from "./AvgCards";
import UsageBarChart from "./ItemUsageBarGraph";
import StockLineChart from "./StockIn&OutChart";
import InsightTable from "./InsightTable1";
import { YearCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import PrintIcon from "@mui/icons-material/Print";
import { useState, useRef } from "react";
import PrintView from "./PrintView";
import ReactToPrint from "react-to-print";

const Usage = () => {
  const [category, setCategory] = useState("COMPUTER_ACCESSORIES");
  const [year, setYear] = useState(dayjs().endOf("year").format("YYYY"));
  const [open, setOpen] = useState(false);
  const printRef = useRef();

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-10">
      <Select
        label="Group"
        id="selectItemGroup"
        className="col-start-1 bg-blue-600  w-[250px] h-10   text-white"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <MenuItem value="COMPUTER_ACCESSORIES">Computer Accessories</MenuItem>
        <MenuItem value="PRINTER">Printer</MenuItem>
        <MenuItem value="COMPUTER_HARDWARE">Computer Hardware</MenuItem>
        <MenuItem value="OTHER">Other</MenuItem>
      </Select>

      <Button
        variant="contained"
        className="bg-blue-600 col-start-4 "
        onClick={handleOpen}
      >
        {year ? year : "year"}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Select a year</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <YearCalendar
              minDate={dayjs([2020, 1, 1])}
              maxDate={dayjs().endOf("year")}
              onChange={handleYearChange}
            />
          </LocalizationProvider>
        </DialogContent>
      </Dialog>

      <ReactToPrint
        trigger={() => (
          <Button
            variant="contained"
            className="row-start-1 col-start-9 col-span-2 rounded-sm bg-blue-600 ml-10 no-print"
          >
            <PrintIcon />
            Print
          </Button>
        )}
        content={() => printRef.current}
      />

      <div style={{ display: "none" }}>
        <PrintView ref={printRef} category={category} year={year} />
      </div>

      <h1 className="row start-2 col-span-10 text-3xl text-center p-10 ">
        USAGE ANALYSIS OF ITEM CATEGORY {category}
        <br /> (JAN-DEC)
        <br /> {year}
      </h1>

      <div className="row-start-3 col-span-3">
        <AvgCards category={category} year={year} />
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
      <div className="row-start-5 col-span-10 h-max mt-5 bg-white">
        <h3 className=" text-xl  p-4  ">Inventory Insights</h3>
        <hr className="col-span-4 border-t border-gray-200" />
        <InsightTable category={category} year={year} isOpen={false} />
      </div>
    </div>
  );
};

export default Usage;
