import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

function Login() {

  const { setAuthState } = useContext(AuthContext);
  const { setUser } = useContext(AuthContext);

  let navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required("This field is requried"),
    password: Yup.string().required("This field is requried"),
  });

  const login = (data) => {
    axios.post("http://localhost:3001/auth/login", data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        sessionStorage.setItem("accessToken", response.data.token);
        setAuthState({
          email: response.data.email,
          id: response.data.id,
          status: true,
        });
        const id = response.data.id;
        axios.get(`http://localhost:3001/auth/byId/${id}`).then((response) => {
          if (response.data.error) {
            alert(response.data.error);
          } else {
            sessionStorage.setItem("admin", response.data.admin);
            setUser({
              first_name: response.data.first_name,
              admin: response.data.admin,
            });
          }
        });
        navigate("/");
        window.location.reload();
      }
    });
  };
  return (
    <div className="containerPost">
      <Formik
        initialValues={initialValues}
        onSubmit={login}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Email: </label>
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
          <button type="submit"> Login</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Login;
