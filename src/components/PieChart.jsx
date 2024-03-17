import * as React from "react"
import { PieChart } from "@mui/x-charts";
import PieCenterLabel from "./PieCenterLabel";
import { useState, useEffect } from "react";
import axios from "axios";

const size = {
  width: 300,
  height: 400,
};
const palette = ["#4583DE", "#FFB946"];

const ItemPieChart = () => {

  useEffect(() => {
    const svg = document.querySelector(".css-13aj3tc-MuiChartsSurface-root");
    if (svg) {
      svg.setAttribute("viewBox", "-50 50 300 400");
    }
  }, []);

  const [itemData, setItemData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/inventory-item/getAll")
      .then((response) => {
        setItemData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const aciveTotal = itemData
    .map((inventoryItem) => inventoryItem.status)
    .reduce((count, status) => {
      return status === "active" ? count + 1 : count;
    }, 0);

  const inactiveTotal = itemData
    .map((inventoryItem) => inventoryItem.status)
    .reduce((count, status) => {
      return status === "inactive" ? count + 1 : count;
    }, 0);

  const series = [
    {
      data: [
        { value: aciveTotal, label: "active items" },
        { value: inactiveTotal, label: "inactive items" },
      ],
      innerRadius: 80,
    },
  ];

  return (
    <PieChart
    margin={{top:75, bottom:100}}
      colors={palette}
      series={series}
      slotProps={{
        legend: {
          
          direction: "column",
          position: { vertical: "bottom", horizontal: "left" },
          padding:10,
        
        },
      }}
      {...size}
    >
      <PieCenterLabel />
    </PieChart>
  );
};

export default ItemPieChart;
