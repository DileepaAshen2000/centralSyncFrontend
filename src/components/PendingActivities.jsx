import React, { useState, useEffect } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const PendingActivities = () => {
  const [pendingCountAdj, setPendingCountAdj] = useState(null);
  const [pendingCountReq, setPendingCountReq] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const response = await axios.get("http://localhost:8080/adjustment/pending/count");
        setPendingCountAdj(response.data);
        const response1 = await axios.get("http://localhost:8080/request/pending-all/count");
        setPendingCountReq(response1.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPendingCount();
  }, []);

  return loading ? (
    <div className="flex justify-center items-center h-[100px] w-[200px]">
      <CircularProgress />
    </div>
  ) : (
    <div className="p-4 text-xl">
      <div className="text-xl text-left">
        <h1>Pending Activities</h1>
      </div>
      <div className="flex p-4">
        <h3>Total Pending Adjustments: {pendingCountAdj}</h3>
        <h3>Total Pending Request: {pendingCountReq}</h3>
        <h3>Total Pending Request: {pendingCountReq}</h3>
      </div>
    </div>
  );
};

export default PendingActivities;
