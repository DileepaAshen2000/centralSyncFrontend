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
import { useNavigate } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";

const UserActivityHistory = () => {
  const [activityLogs, setActivityLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user activity logs from the backend API
    const fetchActivityLogs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/user-activity-log/getAll"
        );
        setActivityLogs(response.data.reverse());
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user activity logs:", error);
      }
    };

    fetchActivityLogs();
  }, []);
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  // Function to handle action click
  const handleActionClick = (entityId, action) => {
    let path = "";
    if (action.includes("User")) {
      path = `/user/users/${entityId}`;
    } else if (action.includes("Ticket")) {
      path = `/ticket/ticketdoc/${entityId}`;
    } else if (action.includes("Stock In")) {
      path = `/stockIn/${entityId}`;
    } else if (action.includes("Stock Out")) {
      path = `/stockOut/${entityId}`;
    } else if (action.includes("Request")) {
      path = `/item/view-item/${entityId}`;
    } else if (action.includes("Reservation")) {
      path = `/stockOut/${entityId}`;
    } else if (action.includes("Item")) {
      path = `/stockOut/${entityId}`;
    } else if (action.includes("Order")) {
      path = `/order/view-order/${entityId}`;
    } else {
    }

    // Navigate to the appropriate path
    if (path) {
      navigate(path);
    }
  };

  return (
    <React.Fragment>
      <div className="pt-5 pb-10">
        <div className="bg-white  flex flex-col  shadow-md min-h-screen rounded-xl">
          <div>
            <h1 className="p-4 text-3xl font-bold">Recent Activities</h1>
            <div className="grid grid-cols-6 grid-rows-1  gap-x-[0.25rem] pt-5 ">
              <div className="col-span-1 px-11">
                <AccountCircleOutlinedIcon className="text-[70px]" />
              </div>
              <div className="col-span-1">
                <Typography variant="subtitle1" className="font-semibold">
                  Dileepa Ashen
                </Typography>
                <Typography variant="subtitle1" className="font-semibold">
                  EM2023001
                </Typography>
                <Typography variant="subtitle1" className="font-semibold">
                  Role : Admin
                </Typography>
              </div>
            </div>
            <div>
              <hr className="border-[#796F6F]" />
            </div>
          </div>

          <Timeline className="pt-12">
            {activityLogs.map((log) => (
              <TimelineItem key={log.id}>
                <TimelineOppositeContent className="flex-none w-1/5">
                  <Chip
                    label={
                      <>
                        {log.date}
                        {"  "}
                        {log.time}
                      </>
                    }
                    component="a"
                    //href="#basic-chip"
                    variant="outlined"
                    data-aos="zoom-in"
                    className="bg-[#50ABE7] w-[500px] h-[50px] font-semibold text-black border-2 border-[#00008B]  space-x-5 shadow-lg rounded-xl "
                  />
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot
                    className="bg-black border-[3px] shadow-[0_1px_15px_rgba(0,0,139,1)]  border-opacity-0"
                    data-aos="zoom-in"
                  />
                  <TimelineConnector className="bg-black" data-aos="zoom-in" />
                </TimelineSeparator>
                <TimelineContent>
                  <Chip
                    label={log.action}
                    component="a"
                    href="#basic-chip"
                    variant="outlined"
                    data-aos="zoom-in"
                    className="bg-[#50ABE7] w-[310px] h-[50px] font-semibold text-black  border-2 border-[#00008B] rounded-xl   space-x-5 shadow-xl"
                    clickable
                    onClick={() => handleActionClick(log.userId, log.action)}
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
