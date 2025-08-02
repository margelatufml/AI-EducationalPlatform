// Leaderboards.js
import React from "react";
import { useLocation } from "react-router-dom";
import Leaderboard from "./Leaderboards"; // Assuming the path is correct

const LeaderboardsPage = () => {
  const location = useLocation();
  const additionalUserData = location.state;

  return (
    <div className="">
      <Leaderboard additionalUserData={additionalUserData} />
    </div>
  );
};

export default LeaderboardsPage;
