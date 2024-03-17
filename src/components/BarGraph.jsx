import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

const pData = [
  2400, 1398, 9800, 3908, 4800, 3800, 4300, 7200, 5640, 6480, 8000, 2598,
];
const xLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const colour=["#5C998E"]

const UsageBarChart = () => {
  return (
    <BarChart
      colors={colour}
      width={650}
      height={300}
      series={[{ data: pData, label: "no of items", id: "pvId", type: "bar" }]}
      xAxis={[{ data: xLabels, scaleType: "band" }]}
    //     sx={{
    //     "& .MuiChartsAxis-directionX": {
    //       "& .MuiChartsAxis-tickLabel": {
    //         rotate: "45deg"
    //       }
    //     }
    //   }}
    />
  );
};

export default UsageBarChart;
