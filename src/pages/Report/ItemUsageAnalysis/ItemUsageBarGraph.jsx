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
  const { width, height=0, ref } = useResizeDetector();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/request/filtered?itemGroup=${category}&year=${year}`
        );
        console.log("Requests response:", response.data);
        setRequests(Array.isArray(response.data) ? response.data : []);
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

  const requestsByMonth = requests
    .map((req) => {
      const dateArray = req.createdDateTime;
      const date = new Date(Date.UTC(...dateArray));
      return {
        date: date,
        status: req.reqStatus,
      };
    })
    .reduce((acc, rq) => {
      const date = new Date(rq.date);
      const month = date.toLocaleDateString("default", { month: "short" });
      acc[month] = acc[month] || [];
      if (
        rq.status === "ACCEPTED" ||
        rq.status === "DELIVERED" ||
        rq.status === "PENDING"
      ) {
        acc[month].push(rq);
      }
      return acc;
    }, {});

  console.log("requests By month", requestsByMonth);
  if (Object.keys(requestsByMonth).length === 0) {
    return <div className="text-center m-10">No records found</div>;
  }

  console.log(requestsByMonth);
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

  const noOfItemsUsed = xLabels.map(
    (label) => requestsByMonth[label]?.length ?? 0
  );

  return (
    <div ref={ref} className="w-full h-full">
      {width && height && (
        <BarChart
          colors={colour}
          width={width}
          height={height-50}
          series={[
            {
              data: noOfItemsUsed,
              label: "no of items",
              id: "pvId",
              type: "bar",
            },
          ]}
          xAxis={[{ data: xLabels, scaleType: "band" }]}
        />
      )}
    </div>
  );
};

export default UsageBarChart;
