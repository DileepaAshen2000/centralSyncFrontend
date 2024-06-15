import * as React from "react";
import TotalEmpCard from "../components/TotalEmpCard";
import ItemCard from "../components/ItemCard";
import LowStockCard from "../components/LowStockCard";
import ItemPieChart from "../components/PieChart";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LowStockTable from "../components/LowStockTable";
import InventoryStatistic from "../components/InventoryStatistic";


export default function AdminDashboard() {
  return(
    <div>
      <div className="flex items-center justify-start p-4 text-3xl">Admin Dashboard</div>
      <div className="grid grid-cols-12 gap-4 h-[500px] grid-rows-9">
        <div className="flex justify-around col-span-8 row-span-3 p-4 text-5xl text-center rounded-lg ">
          <TotalEmpCard />
          <ItemCard />
          <LowStockCard />
        </div>
        <div className="flex flex-col items-center justify-center col-span-4 py-4 text-xl text-center text-black bg-white rounded-lg row-span-9">
          <h1>Inventory-Item</h1>
          <ItemPieChart />
        </div>
        <div className="flex flex-col items-center justify-center col-span-8 row-span-6 p-4 text-5xl text-center text-black bg-white rounded-lg">
          <div className="text-xl">Inventory-Statistic</div>
          <InventoryStatistic />
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-4 h-[700px] grid-rows-10 mt-4">
        <div className="flex flex-col items-center justify-center col-span-6 row-span-5 p-4 text-2xl text-center text-black bg-blue-500 rounded-lg">
          <h1>Low-Stock</h1>
          <LowStockTable/>
        </div>
        <div className="col-span-6 row-span-5 p-4 text-5xl text-center text-white bg-blue-500 rounded-lg">recently used</div>
        <div className="col-span-12 row-span-5 p-4 text-5xl text-center text-white bg-blue-500 rounded-lg">Delivary</div>
      </div>
    </div>
  );
}
