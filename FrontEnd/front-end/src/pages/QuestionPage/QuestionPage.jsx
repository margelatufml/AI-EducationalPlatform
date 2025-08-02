import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import userTrackAPI from "../../api/userTrackAPI";
import { jwtDecode } from "jwt-decode";
import exercisesAPI from "../../api/exercisesAPI";
import UserAPI from "../../api/userApi";
import MathComponent from "../../components/convertableScripts/MathConvertor";
import CustomModal from "../../components/ui/pop_ups/pop_up_raspunsGpt";
import OtterCloseMouth from "../../components/ui/otter_animations/otter_circle_close_mouth/index";
import MathInput, {
  getElementContent,
} from "../../components/MathKeyboard/MathInput";

const QuestionPage = () => {
  const location = useLocation();
  const { exercises: initialExercises } = location.state || {};
  const [exercises, setExercises] = useState(initialExercises);
  const [responseMessage, setResponseMessage] = useState("");
  const [, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const getToken = () => {
    try {
      const accessToken =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      return accessToken ? `Bearer ${accessToken}` : "";
    } catch (error) {
      console.error("Error getting access token: ", error);
      return "";
    }
  };

  useEffect(() => {
    UserAPI.getUserById()
      .then((response) => {
        setUsers([response.data]);
      })
      .catch((error) => {
        console.error("Error fetching users: ", error);
      });
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);

    const token = getToken();
    const userId = jwtDecode(token).userId;
    const exerciseId = exercises.exercise.id;

    // Get the answer from MathInput using getElementContent
    const answer = getElementContent(); // Retrieve the value from MathInput
    // console.log("User's answer (from MathInput):", answer);

    const premium = false;
    const previousMessage = answer;

    const data = {
      exerciseId,
      userId,
      answer, // Sending MathInput value in API call
      premium,
    };

    try {
      const response = await userTrackAPI.correctExercices(data);

      let title, icon, text;
      const MesajP_Pasi = extracti_IncurajareText(
        response.data,
        "P-Pasi:",
        "M-Mesaj"
      );
      const MesajM_Mesaj = " ";
      extracti_IncurajareText(response.data, "M-Mesaj:", "*&*");
      const MesajSpart = extractNumberedPhrases(MesajP_Pasi);

      setIsLoading(false);
      const displayText = MesajSpart.length
        ? MesajSpart.join("<br>")
        : MesajP_Pasi;

      if (response.status === 200) {
        title = "Correct!";
        icon = "success";
        text = "The previous exercise was completed correctly.";
      } else if (response.status === 201) {
        title = "Response Message";
        icon = "info";
        text = `${MesajM_Mesaj}<br><br>Acestia sunt pasii de rezolvare:<br><br>${displayText}`;
      }

      // console.log("API response for modal:", response.data);
      // console.log(MesajSpart);
      const previousResponse = response.data;

      setModalConfig({
        icon,
        title,
        text,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Understood",
        cancelButtonText: "More Information",
        confirmCallback: () => {},
        cancelCallback: async () => {
          setIsLoading(true);
          try {
            const endpointResponse = await userTrackAPI.mesajMaiUsor({
              exerciseId,
              userId,
              answer,
              premium,
              previousMessage,
              previousResponse,
            });
            setIsLoading(false);
            if (endpointResponse && endpointResponse.data) {
              setModalConfig({
                icon: "info",
                title: "Suplimentare",
                text: endpointResponse.data,
                showConfirmButton: true,
                showCancelButton: false,
                confirmButtonText: "Understood",
              });
              setIsModalOpen(true);
            } else {
              console.error(
                "Răspunsul de la mesajMaiUsor nu este valid:",
                endpointResponse
              );
              setIsLoading(false);
            }
          } catch (error) {
            console.error("Eroare la apelul metodei mesajMaiUsor:", error);
            setIsLoading(false);
          }
        },
      });
      setIsModalOpen(true);

      const chapterId = location.state.chapterId;
      const newExercisesResponse = await exercisesAPI.getRandomExercises(
        chapterId
      );
      // console.log(newExercisesResponse.data);
      setResponseMessage("");
      setExercises(newExercisesResponse.data);

      try {
        const userResponse = await UserAPI.getUserById();
        setUsers([userResponse.data]);
      } catch (error) {
        console.error("Error fetching users: ", error);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Eroare la trimiterea răspunsului:", error);
      setIsLoading(false);
    }
  };

  const extracti_IncurajareText = (
    inputText,
    delimitatorDreapta,
    delimitatoStanga
  ) => {
    const startDelimiter = delimitatorDreapta;
    const endDelimiter = delimitatoStanga;
    const startIndex = inputText.indexOf(startDelimiter);
    const endIndex = inputText.indexOf(endDelimiter, startIndex);
    const extractedText = inputText.slice(
      startIndex + startDelimiter.length,
      endIndex
    );
    return extractedText.trim();
  };

  const extractNumberedPhrases = (text) => {
    const regex = /\d+\.\s[^.]+(?:\.(?!\s\d+\.\s)[^.]+)*/g;
    const matches = text.match(regex);
    return matches ? matches.map((match) => match.trim()) : [];
  };

  document.body.style.overflow = "hidden";

  return (
    <div className="container p-4 h-screen">
      {isLoading && (
        <div className="loading-container fixed inset-0 flex items-center justify-center z-50 w-screen">
          <OtterCloseMouth />
        </div>
      )}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-center">
          <MathComponent
            latex={
              exercises.exercise
                ? exercises.exercise.content
                : "Selectează un exercițiu"
            }
          />
        </h1>
        <h1 className="text-3xl font-bold text-center">
          {(() => {
            const waitTimeString = String(exercises.waitTime);

            const regexMinutes = /-(\d+):/;
            const matchMinutes = waitTimeString.match(regexMinutes);

            const regexSeconds = /:-(\d+)/;
            const matchSeconds = waitTimeString.match(regexSeconds);

            if (matchMinutes && matchMinutes[1]) {
              const minutes = parseInt(matchMinutes[1], 10);
              const seconds =
                matchSeconds && matchSeconds[1]
                  ? parseInt(matchSeconds[1], 10)
                  : 0;

              if (minutes > 0 || seconds > 0) {
                return `${minutes} min ${seconds} sec, timp ramas pana la reincarcarea vietilor`;
              } else {
                return "";
              }
            }
            return "";
          })()}
        </h1>
      </div>
      <div className="w-screen flex">
        <button
          className=" bg-base-200 text-white rounded px-4 py-2 ml-6  hover:bg-gunmetal-airforce shadow-md shadow-blue-mainpagebeforeLogin"
          onClick={handleSubmit}
        >
          Verifica
        </button>
      </div>
      <MathInput className="h-full" />

      {responseMessage && <div className="mt-4">{responseMessage}</div>}
      <CustomModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        {...modalConfig}
      />
    </div>
  );
};

export default QuestionPage;
