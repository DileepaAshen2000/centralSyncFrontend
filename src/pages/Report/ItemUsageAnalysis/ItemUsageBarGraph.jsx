import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useEffect } from "react";
import axios from "axios";
import { useResizeDetector } from "react-resize-detector";

const colour = ["#5C998E"];

const UsageBarChart = ({ category, year }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState();
  const { width, height = 0, ref } = useResizeDetector();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/request/filtered?itemGroup=${category}&year=${year}`
        );
        console.log("Requests response:", response.data);
        setRequests(response.data);
      } catch (error) {
        console.log(error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, year]);
  console.log("requests", requests);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }
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
  const requestsByMonth = xLabels.reduce((acc, month) => {
    acc[month] = 0;
    return acc;
  }, {});

  requests.forEach((req) => {
    // Parse formattedCreatedDateTime to Date
    const [datePart] = req.formattedCreatedDateTime.split(' ');
    const [year, month, day] = datePart.split('-');
    const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
    
    const monthIndex = date.getMonth(); // Get the month index (0-11)
    const monthLabel = xLabels[monthIndex]; // Use month index to get the month label

    if (
      req.reqStatus !== "REJECTED" &&
      req.reqStatus !== "SENT_TO_ADMIN" &&
      req.reqStatus !== "PENDING"
    ) {
      requestsByMonth[monthLabel] = (requestsByMonth[monthLabel] || 0) + 1;
    }
  });
  console.log("requests By month", requestsByMonth);

  console.log("requests By month", requestsByMonth);
  // Check if there are any months with data
  const hasData = Object.values(requestsByMonth).some((count) => count > 0);

  if (!hasData) {
    return <div className="text-center m-10">No records found</div>;
  }

  // if (Object.keys(requestsByMonth).length === 0) {
  //   return <div className="text-center m-10">No records found</div>;
  // }

  console.log(requestsByMonth);

  const noOfItemsUsed = xLabels.map((label) => requestsByMonth[label] ?? 0);

  return (
    <div ref={ref} className="w-full h-full">
      {width && height && (
        <BarChart
          colors={colour}
          width={width}
          height={height - 50}
          series={[
            {
              data: noOfItemsUsed,
              label: "no of items",
              id: "pvId",
              type: "bar",
            },
          ]}
          xAxis={[{ data: xLabels, scaleType: "band" }]}
          grid={{ vertical: true, horizontal: true }}
        />
      )}
    </div>
  );
};

export default UsageBarChart;
