import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import config from "../config";

const Register = ({ onRegister = () => {} }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    number: "",
    profil: "",
    learningMethod: "",
  });

  const [classes, setClasses] = useState([]);
  const learningMethods = ["Audio", "Video"];

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(config.apibackend + "/class");
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes");
      }
    };

    fetchClasses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      let updatedData = {
        ...prevData,
        [name]: value,
      };

      if (name === "class") {
        const selectedClass = classes.find((cls) => cls.id === value);
        if (selectedClass) {
          updatedData.number = selectedClass.classNumber;
          updatedData.profil = selectedClass.profil;
        }
      }

      return updatedData;
    });
  };

  const verifyFormData = (formData) => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "number",
      "profil",
      "learningMethod",
    ];

    const fieldLabels = {
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      password: "Password",
      number: "Class Number",
      profil: "Profile",
      learningMethod: "Learning Method",
    };

    let invalidFields = [];

    for (const field of requiredFields) {
      const value = formData[field];

      if (typeof value === "string" && !value.trim()) {
        invalidFields.push(fieldLabels[field]);
      } else if (field === "class" && typeof value !== "string") {
        invalidFields.push(fieldLabels[field]);
      } else if (field === "number" && typeof value !== "number") {
        invalidFields.push(fieldLabels[field]);
      } else if (field === "profil" && typeof value !== "string") {
        invalidFields.push(fieldLabels[field]);
      }
    }

    return invalidFields;
  };

  const handleRegister = async () => {
    try {
      onRegister();
      const invalidFields = verifyFormData(formData);

      if (invalidFields.length > 0) {
        const invalidFieldsList = invalidFields.join(", ");

        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: `Please fill in the following required fields: ${invalidFieldsList}.`,
        });
        return;
      }

      // Add a delay to ensure backend readiness after OPTIONS preflight
      setTimeout(async () => {
        try {
          const response = await axios.post(
            config.apibackend + "/welcome/register",
            formData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          sessionStorage.setItem("accessToken", response.data.accessToken);
          sessionStorage.setItem("refreshToken", response.data.refreshToken);
          navigate("/user/MainPageForUser");
        } catch (error) {
          if (error.response && error.response.status === 400) {
            Swal.fire({
              icon: "error",
              title: "Email Exists",
              text: "This email already exists. Please use a different one.",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: `Registration error. Please try again later. ${error.response}`,
            });
            console.log(error);
          }
        }
      }, 100); // Adding a small delay
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Registration error. Please try again later. ${error.response}`,
      });
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen text-center bg-gunmetal-blue font-roboto">
      <div className="w-full md:w-1/2 p-10 bg-transparent border-2 border-blue-mainpagebeforeLogin text-blue-mainpagebeforeLogin rounded-lg ">
        <h1 className="text-4xl text-princeton-orange font-bold mb-12 font-kodchasan">
          Register
        </h1>

        <div className="flex justify-between w-full gap-x-14 mb-12">
          <div className="flex flex-col space-y-4 w-1/2">
            <div>
              <label
                htmlFor="firstName"
                className="block text-floral-white text-m font-bold mb-2 font-roboto"
              >
                First Name:
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="shadow appearance-none border-2 border-gray-800 rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-kindofwhite mb-1"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-floral-white text-m font-bold mb-2"
              >
                Last Name:
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="shadow appearance-none border-2 border-gray-800 rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-kindofwhite mb-1"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-floral-white text-m font-bold mb-2"
              >
                Email:
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="shadow appearance-none border-2 border-gray-800 rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-kindofwhite mb-1"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-floral-white text-m font-bold mb-2"
              >
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="shadow appearance-none border-2 border-gray-800 rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-kindofwhite mb-1"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-4 w-1/2">
            <div>
              <label
                htmlFor="class"
                className="block text-floral-white text-m font-bold mb-2"
              >
                Class:
              </label>
              <select
                id="class"
                name="class"
                value={formData.class}
                onChange={handleChange}
                className="w-full p-2 border-2 border-gray-800 rounded-lg text-black bg-kindofwhite focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-1"
              >
                <option value="">Select a class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {`Class:${cls.classNumber}, Profile:${cls.profil}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="learningMethod"
                className="block text-floral-white text-m font-bold mt-4 mb-2"
              >
                Cum inveti mai usor?
              </label>
              <select
                id="learningMethod"
                name="learningMethod"
                value={formData.learningMethod}
                onChange={handleChange}
                className="w-full p-2 border-2 border-gray-800 rounded-lg text-black bg-kindofwhite focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-1"
              >
                <option value="">Select an option</option>
                {learningMethods.map((method, index) => (
                  <option key={index} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleRegister}
          className="bg-blue-mainpagebeforeLogin hover:bg-prussian-blue text-white font-bold py-3 px-8 text-lg rounded focus:outline-none focus:shadow-outline mt-6 inline-block"
        >
          Sign Up
        </button>
        <Link to="/LoginPage">
          <button
            type="button"
            className="hover:text-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-6 inline-block underline"
          >
            I already have an account
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Register;
