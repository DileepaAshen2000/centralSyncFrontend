import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
const AvgStockInCard = ({ category, year }) => {
  const [stockIn, setStockIn] = useState([]);

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

  const totStockIn = stockIn
    .map((stock) => stock.inQty)
    .reduce((tot, stIn) => {
     return tot = tot + 1;
    }, 0);

  return (
    <div>
      <div className="flex flex-col h-[8%] gap-2 bg-orange-300 w-full p-4 rounded-lg shadow-xl my-5">
        <span>
          <CategoryRoundedIcon />
        </span>
        <span className="text-sm text-gray-800">Average stock in per month</span>
        <span className="text-2xl text-orange-800">{totStockIn / 12}</span>
      </div>
    </div>
  );
};

export default AvgStockInCard;
