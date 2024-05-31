import * as React from "react";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

// StyledText component with custom styles for the text element in the center
const StyledText = styled("text")(({ theme }) => ({
  fill: "#4583DE",
  textAnchor: "middle",
  dominantstatusaseline: "central",
  fontSize: 40,
  fontWeight: "bold",
}));

const PieCenterLabel = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/inventory-item/getAll"
        );
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
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

  // Get the dimensions of the drawing area for positioning the text element
  const { width, height, left, top } = useDrawingArea();

  return loading ? (
    <div>
      <CircularProgress />
    </div>
  ) : (
    <StyledText x={left + width / 2} y={top + height / 1.85}>
      {getArcLabel()}
    </StyledText>
  );
};

export default PieCenterLabel;
