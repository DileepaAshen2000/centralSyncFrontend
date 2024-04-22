import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
const AvgStockOutCard = ({ category, year }) => {
  const [stockOut, setStockOut] = useState([]);

  // Fetch stock in data based on category and year
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

  const totStockOut = stockOut
    .map((stock) => stock.outQty)
    .reduce((tot, stOut) => {
      return tot = tot + 1;
    }, 0);

  return (
    <div>
      <div className="flex flex-col h-[8%] gap-2 bg-red-300 w-full p-4 rounded-lg shadow-xl my-5">
        <span>
          <CategoryRoundedIcon />
        </span>
        <span className="text-sm text-gray-800">Average stock out per month</span>
        <span className="text-2xl text-red-800">{totStockOut / 12}</span>
      </div>
    </div>
  );
};

export default AvgStockOutCard;
