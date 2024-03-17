import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { useEffect, useState } from "react";
import axios from "axios";

const palette = ["#357a38", "#ff1744"];

const StockLineChart = () => {
  const [stockIn, setStockIn] = useState([]);
  const [stockOut, setStockOut] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/stock-in/getAll")
      .then((response) => {
        setStockIn(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/stock-out/getAll")
      .then((response) => {
        setStockOut(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (stockIn.length === 0 || stockOut.length === 0) {
    return null;
  }

  const stockInByMonth = stockIn
    .map((stock) => ({
      date: stock.date,
      quantity: stock.quantity,
    }))
    .reduce((acc, so) => {
      const date = new Date(so.date);
      const month = date.toLocaleString("default", { month: "long" });
      acc[month] = acc[month] || [];
      acc[month].push(so.quantity);
      return acc;
    }, {});

  const stockOutByMonth = stockOut
    .map((stock) => ({
      date: stock.date,
      quantity: stock.quantity,
    }))
    .reduce((acc, so) => {
      const date = new Date(so.date);
      const month = date.toLocaleString("default", { month: "long" });
      acc[month] = acc[month] || [];
      acc[month].push(so.quantity);
      return acc;
    }, {});

  const sumByMonthSI = {};
  const sumByMonthSO = {};

  for (const month in stockInByMonth) {
    if (stockInByMonth.hasOwnProperty(month)) {
      const sum = stockInByMonth[month].reduce(
        (total, quantity) => total + quantity,
        0
      );
      sumByMonthSI[month] = sum;
    }
  }

  for (const month in stockOutByMonth) {
    if (stockOutByMonth.hasOwnProperty(month)) {
      const sum = stockOutByMonth[month].reduce(
        (total, quantity) => total + quantity,
        0
      );
      sumByMonthSO[month] = sum;
    }
  }

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

  const uData = xLabels.map((label) => sumByMonthSI[label]);
  const pData = xLabels.map((label) => sumByMonthSO[label]);

  return (
    <LineChart
      colors={palette}
      width={1000}
      height={300}
      series={[
        { data: uData, label: "Stock In" },
        { data: pData, label: "Stock Out" },
      ]}
      xAxis={[
        {
          scaleType: "point",
          data: xLabels
        },
      ]}
      // sx={{
      //   "& .MuiChartsAxis-directionX": {
      //     "& .MuiChartsAxis-tickLabel": {
      //       rotate: "45deg"
      //     }
      //   }
      // }}
    />
  );
};

export default StockLineChart;
