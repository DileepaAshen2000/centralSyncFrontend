import * as React from "react";
import { PieChart } from "@mui/x-charts";
import { useState, useEffect } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const size = {
  width: 150,
  height: 400,
};

const palette = ["#4583DE", "#FFB946", "#FF5733", "#33FF57", "#3380FF", "#FF33A8", "#8D33FF"];

const ItemPieChart = () => {
  const [itemData, setItemData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/inventory-item/grouped");
        const data = Object.entries(response.data).map(([label, value]) => ({
          label,
          value,
        }));
        setItemData(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const series = [
    {
      data: itemData,
      innerRadius: 80,
    },
  ];

  return loading ? (
    <div className="flex justify-center items-center h-[400px] w-[300px]">
      <CircularProgress />
    </div>
  ) : (
    <div className="flex items-center justify-center">
      <PieChart
        margin={{ top: 0, bottom: 150, left: 10, right: 10}}
        colors={palette}
        series={series}
        slotProps={{
          legend: {
            direction: "column",
            position: { vertical: "bottom", horizontal: "center" },
            padding: 20,
          },
        }}
        {...size}
      />
    </div>
  );
};

export default ItemPieChart;
