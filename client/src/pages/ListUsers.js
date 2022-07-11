import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ListUsers() {
  const [listOfPosts, setListOfPosts] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/auth").then((response) => {
      setListOfPosts(response.data);
    });
  }, []);

  const [authState, setAuthState] = useState({
    email: "",
    id: 0,
    status: false,
  });

  const [user, setUser] = useState({
    first_name: "",
    admin: false,
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
          axios
            .get(`http://localhost:3001/auth/byId/${id}`)
            .then((response) => {
              if (response.data.error) {
                setUser({ ...user, admin: false });
              } else {
                setUser({
                  first_name: response.data.first_name,
                  admin: response.data.admin,
                });
              }
            });
        }
      });
  }, []);

  if (user.admin === true) {
    return (
      <div className="containerPost">
        {listOfPosts.map((value, key) => {
          return (
            <div key={key} className="post">
              <div className="title">
                <p>
                  {!value.admin && "User"}
                  {value.admin && "Admin"}
                </p>
              </div>

              <div className="body">
                <p>Lastname: {value.last_name}</p>
                <p>Fistname: {value.first_name}</p>
                <p>Phone: {value.phone}</p>
                <p>Email: {value.email}</p>
              </div>

              <div className="footer">
                <button
                  className="buttons"
                  onClick={() => {
                    navigate(`/user/${value.id}`);
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  } else {
    return <div>Access denied !</div>;
  }
}

export default ListUsers;
