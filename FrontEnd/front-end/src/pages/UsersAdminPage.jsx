import React, { useState, useEffect } from "react";
import UserAPI from "../api/userApi";

function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    UserAPI.getUsers()
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users");
      });
  }, []);

  const handleDelete = (user) => {
    const updatedUsers = users.filter((u) => u.id !== user.id);
    setUsers(updatedUsers);
  };

  return (
    <div style={{ width: "70%", margin: "auto" }} className="min-h-screen">
      <h2 className="font-bold text-2xl font-kodchasan mb-4">User List</h2>
      <table
        style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              Profile
            </th>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              Name
            </th>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              Email
            </th>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              Class
            </th>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              Points
            </th>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              Lives
            </th>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              Acțiuni
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <React.Fragment key={user.id}>
              <tr>
                <td style={{ padding: "8px" }}>
                  <div className="profile-picture">
                    {user.picture ? (
                      <img
                        src={`data:image/jpeg;base64,${user.picture}`}
                        alt="Profile"
                        style={{
                          borderRadius: "100%",
                          width: "100px",
                          height: "100px",
                        }}
                      />
                    ) : null}
                  </div>
                </td>
                <td
                  style={{ padding: "8px" }}
                >{`${user.firstName} ${user.lastName}`}</td>
                <td style={{ padding: "8px" }}>{user.email}</td>
                <td style={{ padding: "8px" }}>
                  {user.classUser
                    ? user.classUser.classNumber + " " + user.classUser.profil
                    : "N/A"}
                </td>
                <td style={{ padding: "8px" }}>{user.points}</td>
                <td style={{ padding: "8px" }}>{user.lives}</td>
                <td style={{ padding: "8px" }}>
                  <button
                    onClick={() => handleDelete(user)}
                    className="btn btn-outline btn-info btn-sm"
                  >
                    Ștergeți
                  </button>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersList;
