import { useState, useEffect } from "react";
import LoginAPI from "../api/loginApi";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const [accessToken, setAccessToken] = useState(
    sessionStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState(
    sessionStorage.getItem("refreshToken")
  );
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = async () => {
      if (accessToken) {
        const decodedToken = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          try {
            const response = await LoginAPI.refreshToken(refreshToken);
            if (response.status === 200) {
              setAccessToken(response.data.accessToken);
              sessionStorage.setItem("accessToken", response.data.accessToken);
              setRefreshToken(response.data.refreshToken);
              sessionStorage.setItem(
                "refreshToken",
                response.data.refreshToken
              );
            } else {
              if (response.status === 400 || response.status === 401)
                navigate("/");
            }
          } catch (error) {
            console.error("An error occurred");
            navigate("/");
          }
        }
      }
    };

    checkTokenExpiration();
    const intervalId = setInterval(checkTokenExpiration, 100);

    return () => clearInterval(intervalId);
  }, [accessToken, refreshToken, navigate]);

  return { accessToken, refreshToken, setAccessToken, setRefreshToken };
};

export default useAuth;
