import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

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

  const initialValues = {
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
  };

  const phoneRegExp = /^\d{10}$/;

  const validationSchema = Yup.object().shape({
    email: Yup.string().email(),
    password: Yup.string().min(4).max(20),
    first_name: Yup.string(),
    last_name: Yup.string(),
    phone: Yup.string().matches(phoneRegExp, "Phone number is not valid"),
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editUser = (option) => {
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

        SetUser({ ...user, first_name: newFirstName });
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

        SetUser({ ...user, last_name: newLastName });
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

        SetUser({ ...user, phone: newPhone });
      }
    }
    if (option.email !== "") {
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

        SetUser({ ...user, email: newEmail });
      }
    }
    if (option.password !== "") {
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
          <Formik
            initialValues={initialValues}
            onSubmit={editUser}
            validationSchema={validationSchema}
          >
            <Form className="formContainer edit">
              <label>Email: {user.email}</label>
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

              <label>First name: {user.first_name}</label>
              <ErrorMessage name="first_name" component="span" />
              <Field
                autoComplete="off"
                id="inputCreatePost"
                name="first_name"
                placeholder="(Ex. Alex)"
              />

              <label>Last name: {user.last_name}</label>
              <ErrorMessage name="last_name" component="span" />
              <Field
                autoComplete="off"
                id="inputCreatePost"
                name="last_name"
                placeholder="(Ex. Worn)"
              />

              <label>Phone: {user.phone}</label>
              <ErrorMessage name="phone" component="span" />
              <Field
                autoComplete="off"
                id="inputCreatePost"
                name="phone"
                placeholder="(Ex. 0102030405)"
              />

              <button type="submit"> Edit</button>
            </Form>
          </Formik>
        <div className="footer">
          <button>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
