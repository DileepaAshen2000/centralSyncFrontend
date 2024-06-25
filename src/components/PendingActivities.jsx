import React, { useState, useEffect } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import LoginService from "../pages/Login/LoginService";

const PendingActivities = () => {
  const [pendingCountAdj, setPendingCountAdj] = useState(null);
  const [pendingCountReq, setPendingCountReq] = useState(null);
  const [loading, setLoading] = useState(true);
  const isEmployee = LoginService.isEmployee();
  const [profileInfo, setProfileInfo] = useState(null);

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        if (isEmployee) {
          console.log(profileInfo.userId)
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

  return loading ? (
    <div className="flex justify-center items-center h-[100px] w-[200px]">
      <CircularProgress />
    </div>
  ) : (
    <div className="p-4 text-xl">
      <div className="text-xl text-left">
        <h1>Pending Activities</h1>
      </div>
      <div className="flex gap-4 p-4">
        <h3>Your Pending Adjustments: {pendingCountAdj}</h3>
        <h3>Your Pending Requests: {pendingCountReq}</h3>
      </div>
    </div>
  );
};

export default PendingActivities;
