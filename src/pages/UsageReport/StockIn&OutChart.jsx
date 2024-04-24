import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { useEffect, useState } from "react";
import axios from "axios";


// color palette for the chart
const palette = ["#357a38", "#ff1744"];


// StockLineChart component takes 'category' and 'year' as props
const StockLineChart = ({category, year} ) => {
 

// State variables to store stock in and stock out data
  const [stockIn, setStockIn] = useState([]);
  const [stockOut, setStockOut] = useState([]);

 // Fetch stock in data based on category and year
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/stock-in/getAll?itemGroup=${category}&year=${year}`);
      setStockIn(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  fetchData();
}, [category, year]);


// Fetch stock out data based on category and year
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/stock-out/getAll?itemGroup=${category}&year=${year}`);
      setStockOut(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  fetchData();
}, [category, year]);


   // Check if either stock in or stock out data is empty
  if (stockIn.length === 0 && stockOut.length === 0) {
    return (
      <div className="text-center m-10">
        No data to display
        
      </div>
    );
  }

  // Process stock in data by month
  const stockInByMonth = stockIn
    .map((stock) => ({
      date: stock.date,
      quantity: stock.inQty,
    }))
    .reduce((acc, si) => {
      const date = new Date(si.date);
      const month = date.toLocaleString("default", { month: "long" });
      acc[month] = acc[month] || [];
      acc[month].push(si.quantity);
      return acc;
    }, {});


  // Process stock out data by month
  const stockOutByMonth = stockOut
    .map((stock) => ({
      date: stock.date,
      quantity: stock.outQty,
    }))
    .reduce((acc, so) => {
      const date = new Date(so.date);
      const month = date.toLocaleString("default", { month: "long" });
      acc[month] = acc[month] || [];
      acc[month].push(so.quantity);
      return acc;
    }, {});


 

 // Calculate the sum of quantities for each month in stock in data
 const sumByMonthSI = {};
  for (const month in stockInByMonth) {
    if (stockInByMonth.hasOwnProperty(month)) {
      const sum = stockInByMonth[month].reduce(
        (total, quantity) => total + quantity,
        0
      );
      sumByMonthSI[month] = sum;
    }
  }

// Calculate the sum of quantities for each month in stock in data
  const sumByMonthSO = {};
  for (const month in stockOutByMonth) {
    if (stockOutByMonth.hasOwnProperty(month)) {
      const sum = stockOutByMonth[month].reduce(
        (total, quantity) => total + quantity,
        0
      );
      sumByMonthSO[month] = sum;
    }
  }


  // Create labels for the x-axis (months)
  const xLabels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];


   // Ensure that there is a value for each month, even if it is 0
  xLabels.forEach((label) => {
    sumByMonthSI[label] = sumByMonthSI[label] || 0;
    sumByMonthSO[label] = sumByMonthSO[label] || 0;
  });


  
  // Create  data array for the chart y axis from the object sumByMonth which has properties as name of month
  const stockInData = xLabels.map((label) => sumByMonthSI[label]);
  const stockOutData = xLabels.map((label) => sumByMonthSO[label]);

  return (

    <LineChart
      colors={palette}
      width={1000}
      height={300}
      series={[
        { data: stockInData, label: "Stock In" },
        { data: stockOutData, label: "Stock Out" },
      ]}
      xAxis={[
        {
          scaleType: "point",
          data: xLabels,
        },
      ]}
    />
  );
};

export default StockLineChart;
