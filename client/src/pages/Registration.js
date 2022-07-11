import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Registration() {
  let navigate = useNavigate();
  const initialValues = {
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
  };

  const phoneRegExp = /^\d{10}$/

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required("This field is requried"),
    password: Yup.string().min(4).max(20).required("This field is requried"),
    first_name: Yup.string().required("This field is requried"),
    last_name: Yup.string().required("This field is requried"),
    phone: Yup.string().matches(phoneRegExp,'Phone number is not valid').required("This field is requried"),
  });

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

  const onSubmit = (data) => {
    axios.post("http://localhost:3001/auth", data).then(() => {
      if (user.admin === true) {
        navigate("/listusers");
      } else {
        navigate("/login");
      }
    });
  };

  return (
    <div className="containerPost">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
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

          <label>First name: </label>
          <ErrorMessage name="first_name" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="first_name"
            placeholder="(Ex. Alex)"
          />

          <label>Last name: </label>
          <ErrorMessage name="last_name" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="last_name"
            placeholder="(Ex. Worn)"
          />

          <label>Phone: </label>
          <ErrorMessage name="phone" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="phone"
            placeholder="(Ex. 0102030405)"
          />

          <button type="submit"> Register</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Registration;
