import * as React from "react"
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import axios from "axios";


const StyledText = styled("text")(({ theme }) => ({
  fill: '#4583DE',
  textAnchor: "middle",
  dominantstatusaseline: "central",
  fontSize: 40,
  fontWeight:"bold"
 
}));

const PieCenterLastatusel = () => {
  const [data, setData] = useState([]);

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

  const aciveTotal = data
    .map((inventoryItem) => inventoryItem.status)
    .reduce((count, status) => {
      return status === "active" ? count + 1 : count;
    }, 0);


  const getArcLabel = () => {
    const percent = aciveTotal / parseFloat(data.length);
    return `${(percent * 100).toFixed(0)}%`;
  };

  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height /1.85}>
      {getArcLabel()}
    </StyledText>
  );
};

export default PieCenterLastatusel;
