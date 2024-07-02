import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useResizeDetector } from "react-resize-detector";

const palette = ["#357a38", "#ff1744"];

const StockLineChart = ({ category, year }) => {
  const [stockIn, setStockIn] = useState([]);
  const [stockOut, setStockOut] = useState([]);
  const [loading, setLoading] = useState();
  const { width=800, height = 400, ref } = useResizeDetector();

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      try {
        const [stockInResponse, stockOutResponse] = await Promise.all([
          axios.get(
            `http://localhost:8080/stock-in/getAll?itemGroup=${category}&year=${year}`
          ),
          axios.get(
            `http://localhost:8080/stock-out/getAll?itemGroup=${category}&year=${year}`
          ),
        ]);

        setStockIn(
          Array.isArray(stockInResponse.data) ? stockInResponse.data : []
        );
        setStockOut(
          Array.isArray(stockOutResponse.data) ? stockOutResponse.data : []
        );
      } catch (error) {
        console.log(error);
        setStockIn([]);
        setStockOut([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [category, year]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  if (stockIn.length === 0 && stockOut.length === 0) {
    return <div className="text-center m-10">No records found</div>;
  }

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

  const stockInData = xLabels.map((label) => sumByMonthSI[label] || 0);
  const stockOutData = xLabels.map((label) => sumByMonthSO[label] || 0);

  return (
    <div ref={ref} className="w-full h-full">
      {width && height && (
        <LineChart
          colors={palette}
          width={width}
          height={height-50}
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
          grid={{ vertical: true, horizontal: true }}
        />
      )}
    </div>
  );
};

export default StockLineChart;
