import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Post() {
  let { id } = useParams();
  let navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    produce: Yup.string(),
    description: Yup.string(),
    price: Yup.number(),
    stock: Yup.number(),
  });

  const initialValues = {
    produce: "",
    description: "",
    price: "",
    stock: "",
  };

  const [postObject, setPostObject] = useState({});

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
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
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
  }, []);

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: { accessToken: sessionStorage.getItem("accessToken") },
      })
      .then(() => {
        navigate("/");
      });
  };

  const editPost = (option) => {
    if (option.produce !== "") {
      let newProduce = option.produce;
      if (newProduce) {
        axios.put(
          "http://localhost:3001/posts/produce",
          {
            newProduce: newProduce,
            id: id,
          },
          {
            headers: { accessToken: sessionStorage.getItem("accessToken") },
          }
        );

        setPostObject({ ...postObject, produce: newProduce });
      }

      setPostObject({ ...postObject, produce: newProduce });
    }

    if (option.description !== "") {
      let newDescription = option.description;
      if (newDescription) {
        axios.put(
          "http://localhost:3001/posts/description",
          {
            newDescription: newDescription,
            id: id,
          },
          {
            headers: { accessToken: sessionStorage.getItem("accessToken") },
          }
        );

        setPostObject({ ...postObject, description: newDescription });
      }
    }

    if (option.price !== "") {
      let newPrice = option.price;
      if (newPrice) {
        axios.put(
          "http://localhost:3001/posts/price",
          {
            newPrice: newPrice,
            id: id,
          },
          {
            headers: { accessToken: sessionStorage.getItem("accessToken") },
          }
        );

        setPostObject({ ...postObject, price: newPrice });
      }
    }

    if (option.stock !== "") {
      let newStock = option.stock;
      if (newStock) {
        axios.put(
          "http://localhost:3001/posts/stock",
          {
            newStock: newStock,
            id: id,
          },
          {
            headers: { accessToken: sessionStorage.getItem("accessToken") },
          }
        );

        setPostObject({ ...postObject, stock: newStock });
      }
    }
  };
  if (user.admin === true) {
    return (
      <div className="containerPost">
        <div className="post">
          <div className="title">
            <p>Modify produce</p>
          </div>
          <Formik
            initialValues={initialValues}
            onSubmit={editPost}
            validationSchema={validationSchema}
          >
            <Form className="formContainer edit">
              <label>Produce: {postObject.produce}</label>
              <ErrorMessage name="produce" component="span" />
              <Field
                autoComplete="off"
                id="inputCreatePost"
                name="produce"
                placeholder="(Ex. Produce...)"
              />
              <label>Description: {postObject.description}</label>
              <ErrorMessage name="description" component="span" />
              <Field
                autoComplete="off"
                id="inputCreatePost"
                name="description"
                placeholder="(Ex. Description...)"
              />
              <label>Price: {postObject.price}</label>
              <ErrorMessage name="price" component="span" />
              <Field
                type="number"
                autoComplete="off"
                id="inputCreatePost"
                name="price"
                placeholder="(Ex. 12...)"
              />
              <label>Stock: {postObject.stock}</label>
              <ErrorMessage name="stock" component="span" />
              <Field
                type="number"
                autoComplete="off"
                id="inputCreatePost"
                name="stock"
                placeholder="(Ex. 12...)"
              />

              <button type="submit">Edit</button>
            </Form>
          </Formik>

          <div className="footer">
            <button
              onClick={() => {
                deletePost(postObject.id);
              }}
            >
              Delete Post
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return <div>Access denied !</div>;
  }
}
export default Post;
