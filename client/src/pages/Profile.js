import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function Profile() {
  let navigate = useNavigate();
  let paramID = useParams("");
  let id = Number(paramID.id);

  const [user, SetUser] = useState("");

  const [authState, setAuthState] = useState({
    email: "",
    id: 0,
    first_name: "",
    admin: false,
    status: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            email: response.data.email,
            id: response.data.id,
            status: true,
          });
          const id = response.data.id;
          if (Number(paramID.id) === id) {
            axios
              .get(`http://localhost:3001/auth/byId/${id}`)
              .then((response) => {
                SetUser(response.data);
              });
          } else {
            navigate("/");
          }
        }
      });
  }, []);

  const editUser = (option) => {
    if (option === "firstName") {
      let newFirstName = prompt("Enter new first name: ");
      if (newFirstName) {
        axios.put(
          "http://localhost:3001/auth/firstName",
          {
            newFirstName: newFirstName,
            id: id,
          },
          {
            headers: { accessToken: sessionStorage.getItem("accessToken") },
          }
        );

        SetUser({ ...user, first_name: newFirstName });
      }
    }
    if (option === "lastName") {
      let newLastName = prompt("Enter new last name: ");
      if (newLastName) {
        axios.put(
          "http://localhost:3001/auth/lastName",
          {
            newLastName: newLastName,
            id: id,
          },
          {
            headers: { accessToken: sessionStorage.getItem("accessToken") },
          }
        );

        SetUser({ ...user, last_name: newLastName });
      }
    }
    if (option === "phone") {
      let newPhone = prompt("Enter new phone: ");
      if (newPhone) {
        axios.put(
          "http://localhost:3001/auth/phone",
          {
            newPhone: newPhone,
            id: id,
          },
          {
            headers: { accessToken: sessionStorage.getItem("accessToken") },
          }
        );

        SetUser({ ...user, phone: newPhone });
      }
    }
    if (option === "email") {
      let newEmail = prompt("Enter new email: ");
      if (newEmail) {
        axios.put(
          "http://localhost:3001/auth/email",
          {
            newEmail: newEmail,
            id: id,
          },
          {
            headers: { accessToken: sessionStorage.getItem("accessToken") },
          }
        );

        SetUser({ ...user, email: newEmail });
      }
    }
    if (option === "password") {
      let newPassword = prompt("Enter new password: ");
      if (newPassword) {
        axios.put(
          "http://localhost:3001/auth/password",
          {
            newPassword: newPassword,
            id: id,
          },
          {
            headers: { accessToken: sessionStorage.getItem("accessToken") },
          }
        );

        SetUser({ ...user, password: newPassword });
      }
    }
    window.location.reload();
  };
  return (
    <div className="containerPost">
      <div className="post">
        <div className="title">
          <p>Profile</p>
        </div>
        <div className="body">
          <p>
            First Name: {user.first_name}
            <button
              onClick={() => {
                editUser("firstName");
              }}
            >
              Modify
            </button>
          </p>
          <p>
            Last Name: {user.last_name}
            <button
              onClick={() => {
                editUser("lastName");
              }}
            >
              Modify
            </button>
          </p>
          <p>
            Phone: {user.phone}
            <button
              onClick={() => {
                editUser("phone");
              }}
            >
              Modify
            </button>
          </p>
          <p>
            Email: {user.email}
            <button
              onClick={() => {
                editUser("email");
              }}
            >
              Modify
            </button>
          </p>
          <p>
            Password
            <button
              onClick={() => {
                editUser("password");
              }}
            >
              Modify
            </button>
          </p>
        </div>
        <div className="footer">
          <button>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
