import * as React from "react";
import { PieChart } from "@mui/x-charts";
import PieCenterLabel from "./PieCenterLabel";
import { useState, useEffect } from "react";
import axios from "axios";

//define the size of the pie chart
const size = {
  width: 300,
  height: 400,
};

//define a colour palatte
const palette = ["#4583DE", "#FFB946"];

const ItemPieChart = () => {
  //adjust the viewbox of the chart
  useEffect(() => {
    const svg = document.querySelector(".css-13aj3tc-MuiChartsSurface-root");
    if (svg) {
      svg.setAttribute("viewBox", "-50 50 300 400");
    }
  }, []);

  //state variables
  const [itemData, setItemData] = useState([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/inventory-item/getAll"
        );
        setItemData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  // calculate the total number of active items
  const aciveTotal = itemData
    .map((inventoryItem) => inventoryItem.status)
    .reduce((count, status) => {
      return status === "ACTIVE" ? count + 1 : count;
    }, 0);

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
        { value: aciveTotal, label: "Active items" },
        { value: inactiveTotal, label: "Inactive items" },
      ],
      innerRadius: 80,
    },
  ];

  return (
    <PieChart
      margin={{ top: 75, bottom: 100 }}
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
