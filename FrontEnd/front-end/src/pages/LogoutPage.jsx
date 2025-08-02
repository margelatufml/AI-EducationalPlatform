import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginAPI from "../api/loginApi";
/**
 Asta este doar o incercare de a vedea daca merge acel cicd
**/
function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    LoginAPI.logout();
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("refreshToken");
    navigate("/");
  }, [navigate]);

  return (
    <div>
      <p>Logging out...</p>
    </div>
  );
}

export default LogoutPage;
