import * as React from "react";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import axios from "axios";

// StyledText component with custom styles for the text element in the center
const StyledText = styled("text")(({ theme }) => ({
  fill: "#4583DE",
  textAnchor: "middle",
  dominantstatusaseline: "central",
  fontSize: 40,
  fontWeight: "bold",
}));

const PieCenterLastatusel = () => {
  // State to store data fetched from the API
  const [data, setData] = useState([]);

  //fetch data
  useEffect(() => {
    axios
      .get("http://localhost:8080/inventory-item/getAll")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Calculate the total number of inventory items with status "ACTIVE"
  const aciveTotal = data
    .map((inventoryItem) => inventoryItem.status)
    .reduce((count, status) => {
      return status === "ACTIVE" ? count + 1 : count;
    }, 0);

  // Calculate the percentage of "ACTIVE" inventory items
  const getArcLabel = () => {
    const percent = aciveTotal / parseFloat(data.length);
    return `${(percent * 100).toFixed(0)}%`;
  };

  // Get the dimensions of the drawing area for positioning the text element
  const { width, height, left, top } = useDrawingArea();

  return (
    <StyledText x={left + width / 2} y={top + height / 1.85}>
      {getArcLabel()}
    </StyledText>
  );
};

export default PieCenterLastatusel;
