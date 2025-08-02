import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import chapterAPI from "../../api/chapterAPI";
import exercisesAPI from "../../api/exercisesAPI";
import userTrackAPI from "../../api/userTrackAPI";
import UserAPI from "../../api/userApi";
import Swal from "sweetalert2";

const Chapter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subjectTitle, subjectId } = location.state || {};
  const [chaptersToDo, setChaptersToDo] = useState([]);
  const [chaptersFinish, setChaptersFinish] = useState([]);
  const [exerciseData, setExerciseData] = useState({});

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const responseToDo = await chapterAPI.chaptersToDo(subjectId);
        const responseFinish = await chapterAPI.chaptersFinish(subjectId);
        setChaptersToDo(responseToDo.data);
        setChaptersFinish(responseFinish.data);

        const chapterIds = [
          ...responseToDo.data.map((chapter) => chapter.id),
          ...responseFinish.data.map((chapter) => chapter.id),
        ];

        chapterIds.forEach((chapterId) => {
          fetchExerciseData(chapterId);
        });
      } catch (error) {
        console.error("Failed to fetch chapters");
      }
    };

    const fetchExerciseData = async (chapterId) => {
      try {
        const response = await userTrackAPI.getCountForUser(chapterId);
        setExerciseData((prevData) => ({
          ...prevData,
          [chapterId]: response.data,
        }));
      } catch (error) {
        console.error("Failed to fetch exercise data");
      }
    };

    if (subjectId) {
      fetchChapters();
    }
  }, [subjectId]);

  const handleChapterClick = async (chapter) => {
    try {
      const userResponse = await UserAPI.getUserById();
      if (userResponse.data.lives <= 0) {
        const timeResponse = await exercisesAPI.getRemainingTime();
        const timeString = timeResponse.data;

        const [minutes, seconds] = timeString
          .replace("--", "")
          .split(":")
          .map(Number);

        const formattedTime = `${Math.abs(minutes)} min și ${Math.abs(
          seconds
        )} sec de așteptat.`;

        Swal.fire(
          "Error",
          `Nu mai ai viteti. Mai ai ${formattedTime}`,
          "error"
        );
      } else {
        const response = await exercisesAPI.getRandomExercises(chapter.id);
        navigate("/user/QuestionPage", {
          state: { chapter, exercises: response.data, chapterId: chapter.id },
        });
      }
    } catch (error) {
      Swal.fire("Error", "Error fetching exercises!", "error");
    }
  };

  const getProgressPercentage = (chapterId) => {
    const data = exerciseData[chapterId];
    if (data) {
      return ((data.completedExercices / data.totalExercices) * 100).toFixed(2);
    }
    return 0;
  };

  return (
    <div className="container mx-auto p-4 h-screen">
      <h1 className="text-4xl font-extrabold text-center text-honeydew-good mb-6 font-roboto">
        Chapters for {subjectTitle}
      </h1>
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Chapters To Do</h2>
        {chaptersToDo?.map((chapter, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            className="w-full md:w-2/3 lg:w-1/2 bg-gunmetal-airforce shadow-md rounded-xl p-4 my-2 focus:outline-none shadow-blue-mainpagebeforeLogin"
            onClick={() => handleChapterClick(chapter)}
          >
            <div className="flex items-center">
              <div className="flex-1 text-lg font-semibold text-white">
                {chapter.name}
              </div>
              <div className="flex-shrink-0 w-2/5">
                <div className="relative h-2 bg-gray-300 rounded">
                  <div
                    className="absolute h-full bg-green-500 rounded"
                    style={{ width: `${getProgressPercentage(chapter.id)}%` }}
                  />
                </div>
              </div>
              <div className="ml-4 text-lg font-semibold text-white flex items-center">
                <span className="text-xl mr-1">
                  {exerciseData[chapter.id]?.completedExercices || 0}
                </span>
                <span className="text-xl mx-1">/</span>
                <span className="text-xl">
                  {exerciseData[chapter.id]?.totalExercices || 0}
                </span>
              </div>
            </div>
          </motion.button>
        ))}

        <h2 className="text-2xl font-bold mb-4 mt-8">Chapters Finished</h2>
        {chaptersFinish?.map((chapter, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            className="w-full md:w-2/3 lg:w-1/2 bg-sunset-blaze-gradient shadow-xl rounded-xl p-4 my-2 focus:outline-none"
            onClick={() => handleChapterClick(chapter)}
          >
            <div className="flex items-center">
              <div className="flex-1 text-lg font-semibold text-white">
                {chapter.name}
              </div>
              <div className="flex-shrink-0 w-2/5">
                <div className="relative h-2 bg-gray-300 rounded">
                  <div
                    className="absolute h-full bg-green-500 rounded"
                    style={{ width: `${getProgressPercentage(chapter.id)}%` }}
                  />
                </div>
              </div>
              <div className="ml-4 text-lg font-semibold text-white flex items-center">
                <span className="text-xl mr-1">
                  {exerciseData[chapter.id]?.completedExercices || 0}
                </span>
                <span className="text-xl mx-1">/</span>
                <span className="text-xl">
                  {exerciseData[chapter.id]?.totalExercices || 0}
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Chapter;
