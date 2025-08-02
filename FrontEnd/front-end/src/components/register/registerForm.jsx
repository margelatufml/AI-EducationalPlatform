import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const RegisterForm = ({ onRegister = () => {} }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    number: "",
    profil: "",
    process: "",
  });

  const [classes, setClasses] = useState([]);
  const ProcessOptions = ["Audio", "Video"];

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/class");
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes");
      }
    };

    fetchClasses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "class") {
      const selectedClass = classes.find((cls) => cls.id === value);
      if (selectedClass) {
        setFormData((prevData) => ({
          ...prevData,
          number: selectedClass.classNumber,
          profil: selectedClass.profil,
        }));
      }
    }
  };
  const verifyFormData = async (formData) => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "class",
      "process",
    ];

    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        return false; // Invalid if any required field is empty
      }
    }

    return true; // All required fields are filled
  };

  const handleRegister = async () => {
    try {
      onRegister();
      const isFormDataValid = verifyFormData(formData);
      if (!isFormDataValid) {
        // Show an alert if form data is invalid
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "Please fill in all required fields.",
        });
        return; // Prevent further execution
      } else {
        const response = await axios.post(
          "http://localhost:8080/welcome/register",
          formData
        );

        sessionStorage.setItem("accessToken", response.data.accessToken);

        navigate("/user/MainPageForUser");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Registration error. Please try again later.",
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center text-center font-roboto">
      <h2 className="text-4xl text-princeton-orange font-bold mb-6">
        Sign Up!
      </h2>
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
          className="shadow appearance-none border-2  border-gray-800 rounded w-full py-2 px-3 text-gunmetal-blue leading-tight focus:outline-none focus:shadow-outline bg-transparent mb-1"
          required
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
          className="shadow appearance-none border-2  border-gray-800 rounded w-full py-2 px-3 text-gunmetal-blue leading-tight focus:outline-none focus:shadow-outline selection:bg-transparent bg-transparent mb-1"
          required
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
          className="shadow appearance-none border-2  border-gray-800 rounded w-full py-2 px-3 text-gunmetal-blue leading-tight focus:outline-none focus:shadow-outline bg-transparent mb-1"
          required
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
          className="shadow appearance-none border-2  border-gray-800 rounded w-full py-2 px-3 text-gunmetal-blue leading-tight focus:outline-none focus:shadow-outline bg-transparent mb-1"
          required
        />
      </div>
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
          className="w-full p-2 border-2  border-gray-800 rounded-lg text-gray-800 bg-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-1"
          required
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
          htmlFor="process"
          className="block text-floral-white text-m font-bold mt-4 mb-2"
        >
          Cum inveti mai usor?
        </label>
        <select
          id="process"
          name="process"
          value={formData.process}
          onChange={handleChange}
          className="w-full p-2 border-2  border-gray-800 rounded-lg text-gray-800 bg-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-1"
          required
        >
          <option value="">Select an option</option>
          {ProcessOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleRegister}
        className="bg-princeton-orange hover:bg-prussian-sunset text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2 inline-block"
      >
        Sign Up
      </button>
      <Link to="/">
        <button
          type="button"
          className=" hover:text-prussian-blue text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2 inline-block"
        >
          I already have an account
        </button>
      </Link>
    </div>
  );
};

export default RegisterForm;
