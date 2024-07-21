import React, { useState, useEffect } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import LoginService from "../pages/Login/LoginService";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PendingActivities = () => {
  const [pendingCountAdj, setPendingCountAdj] = useState(null);
  const [pendingCountReq, setPendingCountReq] = useState(null);
  const [pendingCountTicket, setPendingCountTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const isEmployee = LoginService.isEmployee();
  const isRequestHandler = LoginService.isReqHandler();
  const isAdmin = LoginService.isAdmin();
  const [profileInfo, setProfileInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        if (isEmployee) {
          const response1 = await axios.get("http://localhost:8080/adjustment/pendingByUserId/count");
          setPendingCountAdj(response1.data);
          const response2 = await axios.get("http://localhost:8080/request/ReqByUserId/count");
          setPendingCountReq(response2.data);
        } else {
          const response1 = await axios.get("http://localhost:8080/adjustment/pending/count");
          setPendingCountAdj(response1.data);
          const response2 = await axios.get("http://localhost:8080/request/pending-all/count");
          setPendingCountReq(response2.data);
        }

        if(isRequestHandler) {
          const response3 = await axios.get("http://localhost:8080/ticket/count");
          setPendingCountTicket(response3.data);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    if (profileInfo) {
      fetchPendingCount();
    }
  }, [profileInfo, isEmployee]);

  const fetchProfileInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await LoginService.getYourProfile(token);
      setProfileInfo(response.users);
    } catch (error) {
      console.error('Error fetching profile information:', error);
    }
  };

  const handleAdjustment = () => {
    navigate("/adjustment");
  }

  const handleRequest = () => {
    if (isEmployee) {
      navigate("/employee-de-request-list");
    } else {
      navigate("/admin-in-request-list");
    }
  }

  return loading ? (
    <div className="flex justify-center items-center h-[100px] w-[200px]">
      <CircularProgress />
    </div>
  ) : (
    <div className="h-[100%]">
      <div className="mb-2">
        <Typography className="p-2 pl-4 text-sm text-left bg-blue-200">Pending Activities</Typography>
      </div>
      <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[150px]">
        <div className="flex items-center justify-center col-span-2 row-span-2 rounded-lg bg-slate-100" onClick={handleAdjustment}>
          {isEmployee && (
            <div className="flex flex-col gap-2">
              <h3 className="text-xl">Your Pending Adjustments</h3>
              <h3 className="text-3xl">{pendingCountAdj}</h3>
            </div>
          )}
          {isRequestHandler && (
            <div className="flex flex-col gap-2">
              <h3 className="text-xl">Pending Issue Tickets</h3>
              <h3 className="text-3xl">{pendingCountTicket}</h3>
            </div>
          )}
          {isAdmin && (
            <div className="flex flex-col gap-2">
              <h3 className="text-xl">Pending Adjustments</h3>
              <h3 className="text-3xl">{pendingCountAdj}</h3>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center col-span-2 row-span-2 rounded-lg bg-slate-100" onClick={handleRequest}>
          {isEmployee ? (
            <div className="flex flex-col gap-2">
              <h3 className="text-xl">Your Pending Requests</h3>
              <h3 className="text-3xl">{pendingCountReq}</h3>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <h3 className="text-xl">Pending Requests</h3>
              <h3 className="text-3xl">{pendingCountReq}</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingActivities;
