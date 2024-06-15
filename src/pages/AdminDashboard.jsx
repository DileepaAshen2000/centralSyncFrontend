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
  // return (
  //   <div>
  //     <div className="flex">
  //       <div className="flex flex-col w-full gap-4">
  //         <div>
  //           <h1 className="pt-2 pb-3 text-3xl font-bold">Dashboard</h1>
  //         </div>
  //         <Box sx={{ flexGrow: 1 }}>
  //           <Grid container spacing={3} columns={30}>
  //             <Grid item xs={8}>
  //               <TotalEmpCard />
  //             </Grid>
  //             <Grid item xs={8}>
  //               <ItemCard />
  //             </Grid>
  //             <Grid item xs={8}>
  //               <LowStockCard />
  //             </Grid>
  //           </Grid>
  //           <div className="flex items-center justify-center p-5 ">
  //             {/* <h1 className="text-xl text-center">reserved for inventory statistic</h1> */}
  //             <InventoryStatistic />
  //           </div>
  //         </Box>
  //       </div>
        
  //       <div className=" w-[30%] bg-white p-4 mt-10">
  //         <h1 className="text-xl text-center ">All Items</h1>
  //         <hr className="border-t border-gray-200" />
  //         <div>
  //           <ItemPieChart />
  //         </div>
  //       </div>
  //     </div>
      
  //     <div className="flex mt-10">
  //       <Box sx={{ flexGrow: 1 }}>
  //         <Grid container spacing={2} columns={18} className="flex items-center justify-center gap-10 p-10">
  //           <Grid xs={8}>
  //             <LowStockTable/>
  //           </Grid>
  //           <Grid xs={8}>
  //             <LowStockTable />
  //           </Grid>
  //         </Grid>
  //       </Box>
  //     </div>
      
  //   </div>
  // );

  return(
    <div>
      <div className="flex items-center justify-start p-4 text-3xl">Admin Dashboard</div>
      <div className="grid grid-cols-12 gap-4 h-[500px] grid-rows-9">
        <div className="flex justify-around col-span-8 row-span-3 p-4 text-5xl text-center rounded-lg ">
          <TotalEmpCard />
          <ItemCard />
          <LowStockCard />
        </div>
        <div className="flex flex-col items-center justify-center col-span-4 py-4 text-2xl text-center text-black bg-white rounded-lg row-span-9">
          <h1>Inventory-Item</h1>
          <ItemPieChart />
        </div>
        <div className="flex items-center justify-center col-span-8 row-span-6 p-4 text-5xl text-center text-white bg-white rounded-lg">
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
