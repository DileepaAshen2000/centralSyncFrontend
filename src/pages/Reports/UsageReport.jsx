import * as React from "react";
import ItemPieChart from "../../components/PieChart";
import { Button } from "@mui/material";
import StockLineChart from "../../components/LineChart";
import UsageBarChart from "../../components/BarGraph";
import PrintIcon from "@mui/icons-material/Print";

const Usage = () => {
  return (
    <div className="grid grid-cols-10">
      <Button
        variant="contained"
        className="row-start-1 col-start-9 col-span-2 rounded-sm bg-blue-600 ml-10  "
      >
        <PrintIcon />
        Print
      </Button>
      <h1 className="row start-2 col-span-10 text-3xl text-center p-10 ">
        MONITOR ITEM USAGE ANALYSIS REPORT
        <br /> (JAN-DEC)
      </h1>
      <div className="row-start-3 col-span-3  bg-white">
        <h1 className=" text-xl text-center p-4 ">All Items</h1>
        <hr className="border-t border-gray-200" />
        <div>
          <ItemPieChart />
        </div>
      </div>
      <div className="row-start-3 col-start-4 col-span-7 ml-10 mt-10 h-[400px] bg-white ">
        <h2 className=" text-xl  p-4 ">Monitor Usage</h2>
        <hr className="col-span-4 border-t border-gray-200" />
        <UsageBarChart />
      </div>
      <div className="row-start-4 col-span-10 h-[400px] mt-5 bg-white ">
        <h2 className=" text-xl  p-4 ">Monitor Inventory Statistics</h2>
        <hr className="col-span-4 border-t border-gray-200" />
        <StockLineChart />
      </div>
    </div>
  );
};

export default Usage;
