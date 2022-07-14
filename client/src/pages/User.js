import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function User() {
  let { id } = useParams();
  let navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    admin: "",
  };

  const phoneRegExp = /^\d{10}$/;

  const validationSchema = Yup.object().shape({
    email: Yup.string().email(),
    password: Yup.string().min(4).max(20),
    first_name: Yup.string(),
    last_name: Yup.string(),
    phone: Yup.string().matches(phoneRegExp, "Phone number is not valid"),
    admin: Yup.boolean(),
  });

  const [username, setUsername] = useState({});

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
    axios.get(`http://localhost:3001/auth/byId/${id}`).then((response) => {
      setUsername(response.data);
    });
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const deleteUser = (id) => {
    axios
      .delete(`http://localhost:3001/auth/${id}`, {
        headers: { accessToken: sessionStorage.getItem("accessToken") },
      })
      .then(() => {
        window.location.reload();
        navigate("/listusers");
      });
  };

  const editUser = (option) => {
    if (option.first_name !== "") {
      let newEmail = option.email;
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

        setUsername({ ...username, email: newEmail });
      }

      if (option.first_name !== "") {
        let newFirstName = option.first_name;
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

          setUsername({ ...username, first_name: newFirstName });
        }
      }
    }

    if (option.last_name !== "") {
      let newLastName = option.last_name;
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

        setUsername({ ...username, last_name: newLastName });
      }
    }

    if (option.phone !== "") {
      let newPhone = option.phone;
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

        setUsername({ ...username, phone: newPhone });
      }
    }

    if (option.first_name !== "") {
      let newAdmin = option.admin;
      if (newAdmin) {
        axios.put(
          "http://localhost:3001/auth/email",
          {
            newAdmin: newAdmin,
            id: id,
          },
          {
            headers: { accessToken: sessionStorage.getItem("accessToken") },
          }
        );

        setUsername({ ...username, email: newAdmin });
      }
    }

    if (option.first_name !== "") {
      let newPassword = option.password;
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

        setUsername({ ...username, password: newPassword });
      }
    }
    navigate("/listusers");
  };

  if (user.admin === true) {
    return (
      <div className="containerPost">
        <div className="post">
          <div className="title">
            <p>Info User</p>
          </div>
          <Formik
            initialValues={initialValues}
            onSubmit={editUser}
            validationSchema={validationSchema}
          >
            <Form className="formContainer edit">
              <label>Email: {username.email}</label>
              <ErrorMessage name="email" component="span" />
              <Field
                autoComplete="off"
                type="email"
                id="inputCreatePost"
                name="email"
                placeholder="(Ex. alex@worn.fr)"
              />

              <label>Password: </label>
              <ErrorMessage name="password" component="span" />
              <Field
                autoComplete="off"
                type="password"
                id="inputCreatePost"
                name="password"
                placeholder="(Your Password...)"
              />

              <label>First name: {username.first_name}</label>
              <ErrorMessage name="first_name" component="span" />
              <Field
                autoComplete="off"
                id="inputCreatePost"
                name="first_name"
                placeholder="(Ex. Alex)"
              />

              <label>Last name: {username.last_name}</label>
              <ErrorMessage name="last_name" component="span" />
              <Field
                autoComplete="off"
                id="inputCreatePost"
                name="last_name"
                placeholder="(Ex. Worn)"
              />

              <label>Phone: {username.phone}</label>
              <ErrorMessage name="phone" component="span" />
              <Field
                autoComplete="off"
                id="inputCreatePost"
                name="phone"
                placeholder="(Ex. 0102030405)"
              />

              <label>
                Admin: {username.admin && "True"}
                {!username.admin && "False"}
              </label>
              <ErrorMessage name="admin" component="span" />
              <Field
                autoComplete="off"
                id="inputCreatePost"
                name="admin"
                placeholder="(True or false)"
              />

              <button type="submit">Edit</button>
            </Form>
          </Formik>

          <div className="footer">
            <button
              onClick={() => {
                deleteUser(username.id);
              }}
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return <div>Access denied !</div>;
  }
}
export default User;
