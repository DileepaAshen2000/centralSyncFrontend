import * as React from "react";
import { PieChart } from "@mui/x-charts";
import PieCenterLabel from "./PieCenterLabel";
import { useState, useEffect } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const size = {
  width: 300,
  height: 400,
};

const palette = ["#4583DE", "#FFB946"];

const ItemPieChart = () => {
  const [itemData, setItemData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const svg = document.querySelector(".css-13aj3tc-MuiChartsSurface-root");
    if (svg) {
      svg.setAttribute("viewBox", "-40 50 300 400");
    }
  }, [loading]);

 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/inventory-item/getAll"
        );
        setItemData(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  // calculate the total number of active items
  const activeTotal = itemData
    .map((inventoryItem) => inventoryItem.status)
    .reduce((count, status) => {
      return status === "ACTIVE" ? count + 1 : count;
    }, 0);

    console.log(activeTotal);

  // calculate the total number of inactive items
  const inactiveTotal = itemData
    .map((inventoryItem) => inventoryItem.status)
    .reduce((count, status) => {
      return status === "INACTIVE" ? count + 1 : count;
    }, 0);

  // define the series data for the pie chart
  const series = [
    {
      data: [
        { value: activeTotal, label: "Active items" },
        { value: inactiveTotal, label: "Inactive items" },
      ],
      innerRadius: 80,
    },
  ];

  return loading ? (
    <div className="flex justify-center items-center h-[400px] w-[300px]">
      <CircularProgress />
    </div>
  ) : (
    <PieChart
      margin={{ top: 50, bottom: 100 }}
      colors={palette}
      series={series}
      slotProps={{
        legend: {
          direction: "column",
          position: { vertical: "bottom", horizontal: "left" },
          padding: 10,
        },
      }}
      {...size}
    >
      <PieCenterLabel />
    </PieChart>
  );
};

export default ItemPieChart;
