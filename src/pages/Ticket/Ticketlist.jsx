import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import MyTicketList from "./Myticketlist";
import Ticket from "./Otherticketlist";
import LoginService from "../Login/LoginService";
import { useEffect, useState } from "react";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const isEmployee = LoginService.isEmployee();
  

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      {!isEmployee && (
        <Box sx={{ width: "100%" }}>
           
          
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Others' Tickets" {...a11yProps(0)} />
              <Tab label="My Tickets" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <Ticket />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <MyTicketList />
          </CustomTabPanel>
        </Box>
      )}

      {isEmployee && (
        <div>
           
          <MyTicketList />
        </div>
      )}
    </div>
  );
}
