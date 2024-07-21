import * as React from "react";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";


// StyledText component with custom styles for the text element in the center
const StyledText = styled("text")(({ theme }) => ({
  fill: "#4583DE",
  textAnchor: "middle",
  dominantstatusaseline: "central",
  fontSize: 40,
  fontWeight: "bold",
}));

const PieCenterLabel = ({ itemData }) => {
  const aciveTotal = itemData
    .map((inventoryItem) => inventoryItem.status)
    .reduce((count, status) => {
      return status === "ACTIVE" ? count + 1 : count;
    }, 0);

  const getArcLabel = () => {
    const percent = aciveTotal / parseFloat(itemData.length);
    return `${(percent * 100).toFixed(0)}%`;
  };

  // Get the dimensions of the drawing area for positioning the text element
  const { width, height, left, top } = useDrawingArea();

  return(
  <StyledText x={left + width / 2} y={top + height / 1.85}>
    {getArcLabel()}
  </StyledText>
  );
};

export default PieCenterLabel;
