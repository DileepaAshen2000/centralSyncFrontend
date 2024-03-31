import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useState, useEffect } from "react";
import axios from "axios";


//colour palatte for the chart
const colour = ["#5C998E"];

const UsageBarChart = ({ category, year }) => {

  const [requests, setRequests] = useState([]);

   // Fetch requests data based on category and year
  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/request/getAll?itemGroup=${category}&year=${year}`
      )
      .then((response) => {
        setRequests(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [category, year]);

  

    // Process requests data by month
  const requestsByMonth = requests
    .map((req) => ({
      date: req.date,
      status: req.reqStatus,
    }))//an array containing objects with date and status
    .reduce((acc, rq) => {
      const date = new Date(rq.date);
      const month = date.toLocaleDateString("default", { month: "short" });
      acc[month] = acc[month] || [];
      if (rq.status === "accepted") {
        acc[month].push(rq);
      }
      return acc;
    }, {});//array transformed into object ex={jan[{ date: "2024-01-15", status: "accepted"}, { date: "2024-01-20", status: "accepted" },] & soon },
   

 // Create labels for the x-axis (months)
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


  //map requestsByMonth object key values with the xlabels using  optional chaining operator
  const pData = xLabels.map((label) => requestsByMonth[label]?.length ?? 0);

  return (
    <BarChart
      colors={colour}
      width={650}
      height={300}
      series={[{ data: pData, label: "no of items", id: "pvId", type: "bar" }]}
      xAxis={[{ data: xLabels, scaleType: "band" }]}
    
    />
  );
};

export default UsageBarChart;
