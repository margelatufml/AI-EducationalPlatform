import React, { useState } from "react";
import LoginAPI from "../../api/loginApi";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (e.nativeEvent.submitter.name === "loginButton") {
        const response = await LoginAPI.login(formData);
        if (response.status === 200 || response.status === 201) {
          sessionStorage.setItem("accessToken", response.data.accessToken);
          sessionStorage.setItem("refreshToken", response.data.refreshToken);

          const decodedToken = jwtDecode(response.data.accessToken);

          if (decodedToken.roles[0] === "ADMIN") {
            window.location.href = "/admin/MainPage";
          } else if (decodedToken.roles[0] === "USER") {
            window.location.href = "/user/MainPageForUser";
          }
        } else {
          navigate("/LoginPage");
        }
      }
    } catch (error) {
      navigate("/LoginPage");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Email or password incorrect!",
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen text-center bg-gunmetal-blue font-roboto">
      <div className="max-w-lg w-full p-10 bg-transparent border-2 border-blue-mainpagebeforeLogin text-blue-mainpagebeforeLogin rounded-lg ">
        <h2 className="text-4xl text-princeton-orange font-bold mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label
              className="block text-floral-white text-m font-bold mb-2 font-roboto"
              htmlFor="email"
            >
              Email:
            </label>
            <input
              className="shadow appearance-none border-2 border-gray-800 rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-kindofwhite mb-1"
              id="email"
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-floral-white text-m font-bold mb-2 font-roboto"
              htmlFor="password"
            >
              Password:
            </label>
            <input
              className="shadow appearance-none border-2 border-gray-800 rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-kindofwhite mb-1"
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label className="inline-flex items-center">
              <input
                className="py-3 px-3 form-checkbox text-princeton-orange rounded focus:outline-none focus:shadow-outline font-roboto"
                type="checkbox"
                name="rememberMe"
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
              <span className="ml-2 text-floral-white text-m font-bold">
                Remember me
              </span>
            </label>
          </div>
          <div>
            <button
              type="submit"
              name="loginButton"
              className="bg-blue-mainpagebeforeLogin hover:bg-prussian-blue text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Login
            </button>
          </div>
          <div className="mt-4">
            <p className="text-floral-white">
              You don't have an account?
              <br />
              <Link to="/RegisterPage">
                <button
                  type="button"
                  className="bg-blue-mainpagebeforeLogin hover:bg-prussian-blue text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2 inline-block"
                >
                  Sign Up{" "}
                </button>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
