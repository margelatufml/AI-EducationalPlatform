import React, { useState, useEffect } from "react";
import UserAPI from "../../api/userApi";

const UserStatus = () => {
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

  return (
    <div className="mr-10 w-screen">
      {users &&
        users.map((user, index) => (
          <div className="mt-4 mb-4 text-xl" key={index}>
            {Object.entries(user).map(([key, value], i) =>
              key === "points" || key === "lives" ? (
                <p key={i}>
                  {key}: {value}
                </p>
              ) : null
            )}{" "}
          </div>
        ))}
    </div>
  );
};

export default UserStatus;
