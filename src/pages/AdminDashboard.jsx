import * as React from "react";
import TotalEmpCard from "../components/TotalEmpCard";
import ItemCard from "../components/ItemCard";
import LowStockCard from "../components/LowStockCard";
import ItemPieChart from "../components/PieChart";
import LowStockTable from "../components/LowStockTable";
import InventoryStatistic from "../components/InventoryStatistic";
import RecentlyUsedItem from "../components/RecentlyUsedItem";
import ItemGroupPieChart from "../components/ItemGroupPieChart";
import PendingActivities from "../components/PendingActivities";
import LoginService from "./Login/LoginService";
import { useNavigate } from "react-router-dom";


export default function AdminDashboard() {
  const isEmployee = LoginService.isEmployee();
  const isRequestHandler = LoginService.isReqHandler();
  const isAdmin = LoginService.isAdmin();
  const navigate = useNavigate();

  const handleLowStock = () => {
    navigate("/report/low-stock-report")
  }
  
  return(
    <div>
      {isAdmin && (
        <div className="flex items-center justify-start p-2 text-2xl">Admin Dashboard</div>
      )}
      {isRequestHandler && (
        <div className="flex items-center justify-start p-2 text-2xl">Request-Handler Dashboard</div>
      )}
      {isEmployee &&(
        <div className="flex items-center justify-start p-2 text-2xl">Employee Dashboard</div>
      )}
      
      <div className="grid grid-cols-12 gap-4 h-[400px] grid-rows-7">
        <div className="flex justify-around col-span-8 row-span-3 p-4 text-5xl text-center rounded-lg ">
          <TotalEmpCard />
          <ItemCard />
          <LowStockCard />
        </div>
        <div className="flex flex-col items-center justify-center col-span-4 py-4 text-xl text-center text-black bg-white rounded-lg row-span-7">
          <h1>Inventory-Item</h1>
          <ItemPieChart />
        </div>
        <div className="flex flex-col col-span-8 row-span-4 p-4 text-5xl text-center text-black bg-white rounded-lg">
          <PendingActivities/>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-4 h-[800px] grid-rows-12 mt-4">
        <div className="flex flex-col items-center justify-center col-span-6 row-span-5 p-4 text-2xl text-center text-black bg-white rounded-lg" onClick={handleLowStock}>
          <LowStockTable/>
        </div>
        <div className="flex flex-col items-center justify-center col-span-6 row-span-5 p-4 text-2xl text-center text-black bg-white rounded-lg">
          <RecentlyUsedItem/>
        </div>
        {!isEmployee &&(
          <div className="col-span-8 p-4 text-5xl text-center text-black bg-white rounded-lg row-span-7">
            <InventoryStatistic />
          </div>
        )}
        {!isEmployee &&(
          <div className="items-center justify-center col-span-4 p-4 text-xl text-center text-black bg-white rounded-lg row-span-7">
            <h1>Item Categories</h1>
            <ItemGroupPieChart/>
        </div>
        )}
        
      </div>
    </div>
  );
}
