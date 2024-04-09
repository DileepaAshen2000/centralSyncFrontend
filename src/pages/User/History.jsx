import React, { useEffect, useState } from "react";
import axios from "axios";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import Chip from "@mui/material/Chip";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";

const UserActivityHistory = () => {
  const [activityLogs, setActivityLogs] = useState([]);
 

  useEffect(() => {
    // Fetch user activity logs from the backend API
    const fetchActivityLogs = async () => {
      try {
        const response = await axios.get("http://localhost:8080/user-activity-log/getAll");  
        setActivityLogs(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user activity logs:", error);
        console.error("Error details:", error.response);
      }
    };

    fetchActivityLogs();
  }, []);

  return (
    <React.Fragment>
      <div className="pt-5 pb-10">
        <div className="bg-[#E9E9E9]  flex flex-col  shadow-md min-h-screen">
          <div>
            <h1 className="p-4 text-3xl font-bold">Recent Activities</h1>
            <div className="grid grid-cols-6 grid-rows-1  gap-x-[0.25rem] pt-5 ">
              <div className="col-span-1 px-11">
                <AccountCircleOutlinedIcon className="text-[70px]" />
              </div>
              <div className="col-span-1">
                <Typography variant="subtitle1">Dileepa Ashen</Typography>
                <Typography variant="subtitle1">EM2023001</Typography>
                <Typography variant="subtitle1">Role : Admin</Typography>
              </div>
            </div>
            <div>
              <hr className="border-[#796F6F]" />
            </div>
          </div>
          <Timeline className="pt-12 ">
            {activityLogs.map((log) => (
              <TimelineItem key={log.id}>
                <TimelineOppositeContent className="flex-none w-1/5">
                  <Chip
                    label={log.timestamp}
                    component="a"
                    href="#basic-chip"
                    variant="outlined"
                    className="bg-[#B9D4F3] w-[335px] h-[45px]  text-black  border-none  space-x-5 shadow-md rounded-md "
                  />
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot className="bg-[#777BCB]" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Chip
                    label={log.action}
                    component="a"
                    href="#basic-chip"
                    variant="outlined"
                    className="bg-[#B9D4F3] w-[335px] h-[45px]  text-black   rounded-none   space-x-5 shadow-md  "
                    clickable
                  />
                </TimelineContent>
                
              </TimelineItem>
            ))}
          </Timeline>
        </div>
      </div>
   
    </React.Fragment>
  );
};

export default UserActivityHistory;

