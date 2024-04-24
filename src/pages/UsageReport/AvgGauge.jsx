import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";

const AvgGauge = ({ category, year }) => {
  const [requests, setRequests] = useState([]);
  const [stockIn, setStockIn] = useState([]);
  const [stockOut, setStockOut] = useState([]);

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

  // Fetch stock out data based on category and year
  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/stock-out/getAll?itemGroup=${category}&year=${year}`
      )
      .then((response) => {
        setStockOut(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [category, year]);

  // Fetch stock in data based on category and year
  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/stock-in/getAll?itemGroup=${category}&year=${year}`
      )
      .then((response) => {
        setStockIn(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [category, year]);


  //Calculate total accepted requests for the year
  const totReq = (data) => {
    return data
      .map((req) => req.reqStatus)
      .reduce((count, status) => {
        return status === "accepted" ? count + 1 : count;
      }, 0);
  };

  //Calculate total stock in amount for the year
  const totStockIn = (data) => {
    return data
      .map((stock) => stock.inQty)
      .reduce((tot, stIn) => {
        return (tot = tot + stIn);
      }, 0);
  };

  //Calculate total stock out amount for the year
  const totStockOut = (data) => {
    return data
      .map((stock) => stock.outQty)
      .reduce((tot, stOut) => {
        return (tot = tot + stOut);
      }, 0);
  };

 
  const [valueIndex, setValueIndex] = useState(0);
  const [values, setValues] = useState([]);

    // Initialize the values state when requests, stockIn, and stockOut are updated
  useEffect(() => {
    setValues([
      {
        title: "Average usage per month",
        value: (totReq(requests)/12).toFixed(2),
      },
      {
        title: "Average stock in per month",
        value: (totStockIn(stockIn)/12).toFixed(2),
      },
      {
        title: "Average stock out per month",
        value: (totStockOut(stockOut)/12).toFixed(2),
      },
    ]);
  }, [requests, stockIn, stockOut]);


  useEffect(() => {
    // Function to update the value index every 5 seconds
    const intervalId = setInterval(() => {
      setValueIndex((prevIndex) => (prevIndex + 1) % values.length);
    }, 5000); // Change value every 5 seconds

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [values.length]);


  
  return (
    <div className=" w-full h-full bg-white p-4 ">
    {/* Check if values array is not empty */}
    {values.length > 0 && (
    <>
      <h1 className=" text-xl text-center  ">{values[valueIndex].title}</h1>
      <hr className="border-t border-gray-200" />
      <div className="flex items-center mt-10">
        <Gauge
          value={values[valueIndex].value}
          width={250}
          height={250}
          text={({ value }) => `${value}`}
          cornerRadius="50%"
          sx={(theme) => ({
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 30,
            },
            [`& .${gaugeClasses.valueArc}`]: {
                // Determine the fill color based on valueIndex
              fill:
                valueIndex === 0
                  ? "#52b202"
                  : valueIndex === 1
                  ? "#4169e1"
                  : "#ff4500",
            },
            [`& .${gaugeClasses.referenceArc}`]: {
              fill: theme.palette.text.disabled,
            },
          })}
        />
      </div>
      </>)}
    </div>
  );
};

export default AvgGauge;
