import React,{forwardRef} from "react";
import AvgCards from "./AvgCards";
import UsageBarChart from "./ItemUsageBarGraph";
import StockLineChart from "./StockIn&OutChart";
import InsightTable from "./InsightTable1";

const PrintView = forwardRef(({ category, year },ref) => {
  return (
    <div ref={ref}  className="grid grid-cols-10">
       <h1 className="row start-1 col-span-10 text-3xl text-center p-10 ">
        USAGE ANALYSIS OF ITEM CATEGORY {category}
        <br /> (JAN-DEC)
        <br /> {year}
      </h1>

      <div className="row-start-2 col-span-3">
        <AvgCards category={category} year={year} />
      </div>

      <div className="row-start-2 col-start-4 col-span-7 ml-10  h-[400px] bg-white ">
        <h2 className=" text-xl  p-4 ">Monitor Usage</h2>
        <hr className="col-span-4 border-t border-gray-200" />
        <UsageBarChart category={category} year={year} />
      </div>
      <div className="row-start-3 col-span-10 h-[400px] mt-5 bg-white ">
        <h2 className=" text-xl  p-4 ">Monitor Inventory Statistics</h2>
        <hr className="col-span-4 border-t border-gray-200" />
        <StockLineChart category={category} year={year} />
      </div>
      <div className="row-start-4 col-span-10 h-max mt-5 bg-white">
        <h3 className=" text-xl  p-4  ">Inventory Insights</h3>
        <hr className="col-span-4 border-t border-gray-200" />
        <InsightTable category={category} year={year} isOpen={true} />
      </div>
    </div>
   
  );
})


export default PrintView;
