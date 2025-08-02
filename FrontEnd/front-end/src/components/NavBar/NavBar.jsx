import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import userApi from "../../api/userApi";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  ////////////////////////////////////////////////////////////////////////
  const ulVariants = {
    hidden: {
      opacity: 0,
      y: -20,
    },
    visible: {
      opacity: 1,

      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };
  const liVariants = {
    hidden: { y: -20, scale: 0.8 },
    visible: {
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };
  ///////////////////////////////////////////////////////////////////////

  const fetchProfilePicture = async () => {
    try {
      const response = await userApi.getUserById();
      setUsers([response.data]);
    } catch (error) {
      console.error("Failed to fetch profile picture: ");
    }
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  useEffect(() => {
    try {
      const auth =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      const decodedToken = auth ? jwtDecode(auth) : null;

      if (decodedToken) {
        setUserRole(decodedToken.roles[0]);
        fetchProfilePicture();
      } else {
        setUserRole(null);
        navigate("/");
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "You do not have permission to access this page.",
        });
      }
    } catch (error) {
      navigate("/");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred.",
      });
    }
  }, [navigate]);

  const handleProfileClick = () => {
    navigate("/user/ProfilePage");
  };

  return (
    <div className="relative top-0 left-0 w-full z-50">
      {userRole === "ADMIN" && (
        <div className="navbar bg-base-100">
          <div className="navbar-start">
            <div className="dropdown relative">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
                onClick={toggleDropdown}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>

                <ul
                  tabIndex={0}
                  className={`menu menu-sm dropdown-content absolute z-[1] left-0 top-full mb-15 p-5 shadow bg-base-100 rounded-box w-52 ${
                    isDropdownOpen ? "block" : "hidden"
                  }`}
                >
                  <li>
                    <NavLink to="/admin/MainPage">
                      <button className="mr-2 bg-custom-blue pb-5">
                        Main Page
                      </button>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/UsersAdminPage">
                      <button className="mr-2 bg-custom-blue pb-5">
                        Users
                      </button>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/ChapterAdminPage">
                      <button className="mr-2 bg-custom-blue pb-5">
                        Chapter
                      </button>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/ExercisesAdminPage">
                      <button className="mr-2 bg-custom-blue pb-5">
                        Exercises
                      </button>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/ClassForUser">
                      <button className="mr-2 bg-custom-blue pb-5">
                        Classes
                      </button>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/LogoutPage">
                      <button className="mr-2 bg-custom-blue pb-5">
                        Logout
                      </button>
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="navbar-center">
            <a className="btn btn-ghost text-xl" href="/">
              Intelecta
            </a>
          </div>
          <div className="navbar-end">
            <button className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="badge badge-xs badge-primary indicator-item"></span>
              </div>
            </button>
          </div>
        </div>
      )}

      {userRole === "USER" && (
        <div className="navbar bg-base-100 z-50">
          <div className="navbar-start">
            <div className="dropdown relative">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
                onClick={toggleDropdown}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
                <motion.ul
                  tabIndex={0}
                  className={`menu menu-sm dropdown-content absolute z-[2] left-0 top-full mb-15 p-5 shadow bg-base-100 rounded-box w-52 ${
                    isDropdownOpen ? "block" : "hidden"
                  }`}
                  variants={ulVariants}
                  initial="hidden"
                  animate={isDropdownOpen ? "visible" : "hidden"}
                >
                  <motion.li variants={liVariants} whileHover={{ scale: 1.1 }}>
                    <NavLink to="/user/MainPageForUser">
                      <button className="mr-2 bg-custom-blue pb-5">
                        Main Page
                      </button>
                    </NavLink>
                  </motion.li>
                  <motion.li variants={liVariants} whileHover={{ scale: 1.1 }}>
                    <NavLink to="/user/Subjects">
                      <button className="mr-2 bg-custom-blue pb-5">
                        Subjects
                      </button>
                    </NavLink>
                  </motion.li>
                  <motion.li variants={liVariants} whileHover={{ scale: 1.1 }}>
                    <NavLink to="/user/Pricing">
                      <button className="mr-2 bg-custom-blue pb-5">
                        Pricing
                      </button>
                    </NavLink>
                  </motion.li>
                  <motion.li variants={liVariants} whileHover={{ scale: 1.1 }}>
                    <NavLink to="/user/Leaderboard">
                      <button className="mr-2 bg-custom-blue pb-5">
                        Leaderboard
                      </button>
                    </NavLink>
                  </motion.li>
                  <motion.li variants={liVariants} whileHover={{ scale: 1.1 }}>
                    <NavLink to="/user/LogoutPage">
                      <button className="mr-2 bg-custom-blue pb-5">
                        Logout
                      </button>
                    </NavLink>
                  </motion.li>
                </motion.ul>
              </div>
            </div>
          </div>
          <div className="navbar-center">
            <NavLink to="/user/MainPageForUser">
              <button className="btn btn-ghost text-xl">Intelecta</button>
            </NavLink>
          </div>
          <div className="navbar-end">
            <div className="relative mr-2">
              <div>
                <button
                  type="button"
                  className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  onClick={handleProfileClick}
                >
                  <span className="sr-only">Open user menu</span>

                  {users && users[0] && users[0].picture ? (
                    <img
                      src={`data:image/jpeg;base64,${users[0].picture}`}
                      alt="Profile"
                      className="rounded-full w-12 h-12"
                    />
                  ) : (
                    <img alt="Profile" className="rounded-full w-12 h-12" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Navbar;
