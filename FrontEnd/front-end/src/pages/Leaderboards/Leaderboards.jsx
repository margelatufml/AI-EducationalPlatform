import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import userTrackAPI from "../../api/userTrackAPI";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState({});

  useEffect(() => {
    const fetchTopUsersScore = async () => {
      try {
        const response = await userTrackAPI.topUsersScore();
        const groupedData = response.data.reduce((acc, user) => {
          const chapter = user[0];
          if (!acc[chapter]) {
            acc[chapter] = [];
          }
          acc[chapter].push(user);
          return acc;
        }, {});
        setLeaderboardData(groupedData);
      } catch (error) {
        console.error("Error fetching top users scores");
      }
    };

    fetchTopUsersScore();
  }, []);

  return (
    <div className=" mx-auto p-4">
      <h1 className="text-4xl font-roboto font-extrabold text-center text-honeydew-good mb-6">
        Clasament
      </h1>
      <p className="text-lg font-medium text-center text-gray-600 mb-4">
        Sortat in functie de Capitole
      </p>
      <div className="flex flex-col items-center">
        {Object.keys(leaderboardData).map((chapter) => (
          <div key={chapter}>
            <h2 className="text-2xl font-bold text-center text-honeydew-good mb-2">
              {chapter}
            </h2>
            {leaderboardData[chapter].map((user, index) => (
              <motion.div
                key={index}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
                }}
                className="w-full md:w-40 lg:w-60 bg-airforce-princeton shadow-lg rounded-lg p-4 my-2 flex justify-between items-center"
              >
                <span className="text-lg font-semibold text-white">
                  {user[1]} {user[2]}
                </span>
                <span className="bg-white rounded-full px-3 py-1 text-sm font-medium text-gray-800">
                  {user[3]} XP
                </span>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
