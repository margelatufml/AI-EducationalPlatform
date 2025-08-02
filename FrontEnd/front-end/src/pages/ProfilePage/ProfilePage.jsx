import React, { useState, useEffect } from "react";
import UserAPI from "../../api/userApi";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import ClassForUser from "../../api/classForUserAPI";
import userTrackAPI from "../../api/userTrackAPI";

function UserPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    UserAPI.getUserById()
      .then((response) => {
        setUsers([response.data]);
      })
      .catch((error) => {
        console.error("Error fetching users");
      });
  }, []);

  const getTrack = async () => {
    try {
      const trackResponse = await userTrackAPI.getTrackForUser();
      const exercisesHTML = trackResponse.data
        .map((exercise) => {
          return `
          <div style="margin-bottom: 20px;">
            <h3>Exercise Info:</h3>
            <p><strong>Exercise:</strong> ${exercise.exercises.content}</p>
            <p><strong>Exercise answer:</strong> ${exercise.exercises.answer}</p>
            <p><strong>Exercise Points:</strong> ${exercise.exercises.points}</p>
            <p><strong>Chapter name:</strong> ${exercise.chapter.name}</p>
          </div>
        `;
        })
        .join("");

      Swal.fire({
        title: "Track Info",
        html: exercisesHTML,
      });
    } catch (error) {
      console.error("Error fetching user track");
      Swal.fire("Error", "Error fetching user track!", "error");
    }
  };

  const handleUpdateProfilePopout = async () => {
    const result = await Swal.fire({
      title: "Update Profile",
      html:
        `<input id="swal-input1" class="swal2-input" value="${users[0].firstName}" placeholder="First Name">` +
        `<input id="swal-input2" class="swal2-input" value="${users[0].lastName}" placeholder="Last Name">` +
        `<input id="swal-input3" class="swal2-input" value="${users[0].email}" placeholder="Email">`,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const firstName = Swal.getPopup().querySelector("#swal-input1").value;
        const lastName = Swal.getPopup().querySelector("#swal-input2").value;
        const email = Swal.getPopup().querySelector("#swal-input3").value;

        const newData = {
          firstName,
          lastName,
          email,
          picture: users[0].picture,
        };

        return UserAPI.updateUser(newData)
          .then(() => {
            return UserAPI.getUserById()
              .then((response) => {
                setUsers([response.data]);
              })
              .catch((error) => {
                console.error("Error fetching users");
              });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Error updating profile!",
            });
          });
      },
    });

    if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        icon: "info",
        title: "Cancelled",
        text: "Profile update cancelled",
      });
    }
  };

  const setClassForUser = async () => {
    try {
      const classes = await ClassForUser.getClasses();
      const classOptions = classes.data.reduce((acc, classItem) => {
        acc[
          classItem.classNumber
        ] = `${classItem.classNumber} (${classItem.profil})`;
        return acc;
      }, {});

      const result = await Swal.fire({
        title: "Ce clasa esti?",
        input: "select",
        inputOptions: classOptions,
        inputPlaceholder: "Selectează clasa",
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "Trebuie să selectezi o clasă!";
          }
        },
      });

      if (result.isConfirmed) {
        const data = { number: result.value };
        await UserAPI.setClassForUser(data)
          .then(() => {
            Swal.fire("Succes", "Clasa a fost setată cu succes", "success");
            return UserAPI.getUserById();
          })
          .then((response) => {
            setUsers([response.data]);
          })
          .catch((error) => {
            Swal.fire("Eroare", "A apărut o eroare la setarea clasei", "error");
          });
      }
    } catch (error) {
      console.error("Error fetching classes");
    }
  };

  const handleUploadImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64String = reader.result
          .replace("data:", "")
          .replace(/^.+,/, "");

        const newData = {
          firstName: users[0].firstName,
          lastName: users[0].lastName,
          email: users[0].email,
          picture: base64String,
        };

        try {
          await UserAPI.updateUser(newData);

          // const response = await UserAPI.getUserById();
          // setUsers([response.data]);

          // merge sa iti schimbi poza si sa iti dea refresh la pagina cu totul ca sa se incarce poza si in navbar, ceea ce cautam

          window.location.reload();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error updating profile picture!",
          });
        }
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    };

    input.click();
  };

  const fieldNames = {
    firstName: "prenume",
    lastName: "nume",
    email: "email",
    classUser: "clasa",
    points: "puncte",
    lives: "vieți",
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start p-4">
      <ul className="w-full max-w-4xl list-none p-0">
        {users.map((user) => (
          <li key={user.id} className="flex flex-col items-center mb-10">
            <div className="flex flex-col items-center">
              {user.picture && (
                <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-md border-2 border-white">
                  <img
                    src={`data:image/jpeg;base64,${user.picture}`}
                    alt="Profile"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="mt-4 w-full flex flex-col items-center space-y-4">
                {Object.entries(user).map(([key, value], i) => {
                  if (
                    key === "classUser" &&
                    typeof value === "object" &&
                    value !== null
                  ) {
                    const classDisplay = `${value.classNumber} (${value.profil})`;
                    return (
                      <motion.div
                        key={i}
                        className="w-full max-w-xl text-white rounded-lg p-4 my-2 flex justify-between items-center shadow-md shadow-blue-mainpagebeforeLogin hover:bg-airforce-princeton"
                        whileHover={{ scale: 1.05 }}
                      >
                        <strong>{fieldNames[key] || key}:</strong>{" "}
                        {classDisplay}
                      </motion.div>
                    );
                  }
                  if (
                    key === "picture" ||
                    key === "password" ||
                    key === "id" ||
                    key === "role"
                  )
                    return null;

                  return (
                    <motion.div
                      key={i}
                      className="w-full max-w-xl text-white rounded-lg p-4 my-2 flex justify-between items-center shadow-md shadow-blue-mainpagebeforeLogin hover:bg-airforce-princeton"
                      whileHover={{ scale: 1.05 }}
                    >
                      <strong>{fieldNames[key] || key}:</strong> {value}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="space-y-2 mt-4">
        <button
          onClick={handleUpdateProfilePopout}
          className="btn btn-outline mr-4 btn-blue-mainpagebeforeLogin text-blue-mainpagebeforeLogin hover:text-gray-500 hover:bg-white"
        >
          Actualizează Informațiile Personale
        </button>
        <button
          onClick={handleUploadImage}
          className="btn btn-outline mr-4 btn-blue-mainpagebeforeLogin text-blue-mainpagebeforeLogin hover:text-gray-500 hover:bg-white"
        >
          Schimbă poza de profil
        </button>
        <button
          onClick={setClassForUser}
          className="btn btn-outline mr-4 btn-blue-mainpagebeforeLogin text-blue-mainpagebeforeLogin hover:text-gray-500 hover:bg-white"
        >
          Seteaza Clasa
        </button>
        <button
          onClick={getTrack}
          className="btn btn-outline btn-blue-mainpagebeforeLogin text-blue-mainpagebeforeLogin hover:text-gray-500 hover:bg-white"
        >
          Informatiile Tale
        </button>
      </div>
    </div>
  );
}

export default UserPage;
