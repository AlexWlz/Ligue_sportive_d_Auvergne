import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  let navigate = useNavigate();

  const initialValues = {
    produce: "",
    description: "",
    price: "",
    stock: "",
  };

  const validationSchema = Yup.object().shape({
    produce: Yup.string().required("You must input a produce!"),
    description: Yup.string().required(),
    price: Yup.number().required(),
    stock: Yup.number().required(),
  });

  const onSubmit = (data) => {
    axios.post("http://localhost:3001/posts", data).then((response) => {
      navigate("/");
    });
  };

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
      <div className="createPostPage">
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form className="formContainer">
            <label>Produce: </label>
            <ErrorMessage name="produce" component="span" />
            <Field
              autoComplete="off"
              id="inputCreatePost"
              name="produce"
              placeholder="(Ex. Produce...)"
            />
            <label>Description: </label>
            <ErrorMessage name="description" component="span" />
            <Field
              autoComplete="off"
              id="inputCreatePost"
              name="description"
              placeholder="(Ex. Description...)"
            />
            <label>Price: </label>
            <ErrorMessage name="price" component="span" />
            <Field
              type="number"
              autoComplete="off"
              id="inputCreatePost"
              name="price"
              placeholder="(Ex. 12...)"
            />
            <label>Stock: </label>
            <ErrorMessage name="stock" component="span" />
            <Field
              type="number"
              autoComplete="off"
              id="inputCreatePost"
              name="stock"
              placeholder="(Ex. 12...)"
            />

            <button type="submit"> Create Post</button>
          </Form>
        </Formik>
      </div>
    );
  } else {
    return <div>Access denied !</div>;
  }
}

export default CreatePost;
