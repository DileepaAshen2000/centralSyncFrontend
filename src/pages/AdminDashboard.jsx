import * as React from "react";

// import { Grid } from '@mui/material';
import TotalEmpCard from "../components/TotalEmpCard";
import ItemCard from "../components/ItemCard";
import LowStockCard from "../components/LowStockCard";
import ItemPieChart from "../components/PieChart";


export default function AdminDashboard() {
  return (
    <div className="flex">
      <div className="flex flex-col w-full gap-4">
        <div>
          <h1 className="pt-2 pb-3 text-3xl font-bold">Dashboard</h1>
        </div>
        
        <div className="flex gap-4 space-x-5">
          <TotalEmpCard />
          <ItemCard />
          <LowStockCard />
        </div>
        
      </div>
      <div className=" w-[30%] bg-white p-4 mt-10">
        <h1 className="text-xl text-center ">All Items</h1>
        <hr className="border-t border-gray-200" />
        <div>
          <ItemPieChart />
        </div>
      </div>
    </div>
  );
}
