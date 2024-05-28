import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import stockin from "../../assests/stockin.png";
import stockout from "../../assests/stockout.png";
import usageimg from "../../assests/avgUsage.png";

const AvgCards = ({ category, year }) => {
  const [requests, setRequests] = useState([]);
  const [stockIn, setStockIn] = useState([]);
  const [stockOut, setStockOut] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/request/getAll?itemGroup=${category}&year=${year}`
        );
        setRequests(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [category, year]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/stock-out/getAll?itemGroup=${category}&year=${year}`
        );
        setStockOut(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [category, year]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/stock-in/getAll?itemGroup=${category}&year=${year}`
        );
        setStockIn(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [category, year]);

  const totReq = (data) => {
    return data
      .map((req) => req.reqStatus)
      .reduce((count, status) => {
        return status === "accepted" ? count + 1 : count;
      }, 0);
  };

  const totStockIn = (data) => {
    return data
      .map((stock) => stock.inQty)
      .reduce((tot, stIn) => {
        return (tot = tot + stIn);
      }, 0);
  };

  const totStockOut = (data) => {
    return data
      .map((stock) => stock.outQty)
      .reduce((tot, stOut) => {
        return (tot = tot + stOut);
      }, 0);
  };

  return (
    <div>
      <div className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-xl mb-8 h-[110px]">
        <span>
          <img src={usageimg} alt="usage" className="w-12 h-12 object-cover " />
        </span>
        <div className="flex flex-col">
          <span className="text-2xl text-blue-800">
            {Math.ceil(totReq(requests) / 12)}
          </span>
          <span className="text-sm text-gray-800">Average Usage per Month</span>
        </div>
      </div>
      <div className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-xl mb-8 h-[110px]">
        <span>
          <img
            src={stockin}
            alt="stockin"
            className="w-12 h-12 object-cover "
          />
        </span>
        <div className="flex flex-col">
          <span className="text-2xl text-green-800">
            {Math.ceil(totStockIn(stockIn) / 12)} pcs
          </span>
          <span className="text-sm text-gray-800">
            Average Stock In per Month
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-xl  h-[110px]">
        <span>
          <img
            src={stockout}
            alt="stockout"
            className="w-12 h-12 object-cover "
          />
        </span>
        <div className="flex flex-col">
          <span className="text-2xl text-red-800">
            {Math.ceil(totStockOut(stockOut) / 12)} pcs
          </span>
          <span className="text-sm text-gray-800">
            Average Stock Out per Month
          </span>
        </div>
      </div>
    </div>
  );
};

export default AvgCards;
