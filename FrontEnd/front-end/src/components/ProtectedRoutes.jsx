import { Navigate, Outlet, useLocation } from "react-router-dom";
import "sweetalert2/dist/sweetalert2.min.css";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import Navbar from "./NavBar/NavBar";
import Footer from "./Footer/Footer";
import useAuth from "../auth/useAuth";

const ProtectedRoute = ({ allowedRoles }) => {
  const { accessToken } = useAuth();
  let decodedToken;
  const location = useLocation();

  if (accessToken) {
    decodedToken = jwtDecode(accessToken);
  }

  if (
    !accessToken ||
    !decodedToken ||
    !allowedRoles.includes(decodedToken.roles[0])
  ) {
    if (location.pathname !== "/") {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You do not have permission to access this page.",
      });
    }

    if (!accessToken) {
      return <Navigate to="/" replace />;
    } else if (decodedToken.roles[0] === "ADMIN") {
      return <Navigate to="/admin/MainPage" replace />;
    } else if (decodedToken.roles[0] === "USER") {
      return <Navigate to="/user/MainPageForUser" replace />;
    }
  }

  return (
    <>
      <Navbar />
      <Outlet />
      {location.pathname !== "/user/MainPageForUser" &&
        location.pathname !== "/user/QuestionPage" && <Footer />}
    </>
  );
};

export default ProtectedRoute;
