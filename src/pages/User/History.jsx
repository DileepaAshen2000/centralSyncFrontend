import * as React from "react";
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


export default function OppositeContentTimeline() {
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
            <TimelineItem>
              <TimelineOppositeContent className="flex-none w-1/5">
                <Chip
                  label={
                    <>
      27 Dec 2023<br />
      9.30 pm
    </>
                  }
                  
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
                 label="Inventory Adjustment approved."
                  component="a"
                  href="#basic-chip"
                  variant="outlined"
                  className="bg-[#B9D4F3] w-[335px] h-[45px]  text-black   rounded-none   space-x-5 shadow-md  "
                  clickable
                />
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineOppositeContent className="flex-none w-1/5">
                <Chip
                  label={
                    <>
      27 Dec 2023<br />
      5.30 pm
    </>
                  }
                  component="a"
                  href="#basic-chip"
                  variant="outlined"
                  className="bg-[#B9D4F3] w-[335px] h-[45px]  text-black   border-none  rounded-md   space-x-5 shadow-md  "
                />
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot className="bg-[#777BCB]" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Chip
                  label="New User Added"
                  component="a"
                  href="#basic-chip"
                  variant="outlined"
                  className="bg-[#B9D4F3] w-[335px] h-[45px]  text-black    rounded-none   space-x-5 shadow-md "
                  clickable
                />
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineOppositeContent className="flex-none w-1/5">
                <Chip
                  label={
                    <>
      27 Dec 2023<br />
      10.30 am
    </>
                  }
                  component="a"
                  href="#basic-chip"
                  variant="outlined"
                  className="bg-[#B9D4F3] w-[335px] h-[45px]  text-black  border-none  rounded-md  space-x-5 "
                />
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot className="bg-[#777BCB]" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Chip
                   label="Inventory Adjustment approved."
                    
                  component="a"
                  href="#basic-chip"
                  variant="outlined"
                  className="bg-[#B9D4F3] w-[335px] h-[45px]  text-black   border-none  rounded-none   space-x-5 "
                  clickable
                />
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </div>
      </div>
    </React.Fragment>
  );
}
