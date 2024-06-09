import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useEffect } from "react";
import axios from "axios";

const colour = ["#5C998E"];

const UsageBarChart = ({ category, year }) => {
  const [requests, setRequests] = useState();
  const [loading,setLoading]=useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/request/getAll?itemGroup=${category}&year=${year}`
        );
        console.log("Requests response:", response.data); 
        setRequests(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.log(error);
        setRequests([]);
      }finally{
        setLoading(false);
      }
    };

    fetchData();
  }, [category, year]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center m-10">
      No records found
      
    </div>
    );
  }

  const requestsByMonth = requests
    .map((req) => ({
      date: req.date,
      status: req.reqStatus,
    })) 
    .reduce((acc, rq) => {
      const date = new Date(rq.date);
      const month = date.toLocaleDateString("default", { month: "short" });
      acc[month] = acc[month] || [];
      if (rq.status === "accepted") {
        acc[month].push(rq);
      }
      return acc;
    }, {}); 

  
    if ( Object.keys(requestsByMonth).length === 0 ) {
      return (
        <div className="text-center m-10">
          No records found 
        </div>
      );
    }
   
  console.log(requestsByMonth);  const xLabels = [
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

  const noOfItemsUsed = xLabels.map(
    (label) => requestsByMonth[label]?.length ?? 0
  );

  return (
    <BarChart
      colors={colour}
      width={650}
      height={300}
      series={[
        { data: noOfItemsUsed, label: "no of items", id: "pvId", type: "bar" },
      ]}
      xAxis={[{ data: xLabels, scaleType: "band" }]}
    />
  );
};

export default UsageBarChart;
