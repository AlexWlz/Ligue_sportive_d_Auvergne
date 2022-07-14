import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Post() {
  let { id } = useParams();
  let navigate = useNavigate();

  const number = /^[0-9]+$/;

  const validationSchema = Yup.object().shape({
    produce: Yup.string(),
    description: Yup.string(),
    price: Yup.string().matches(number, "Is not a number"),
    stock: Yup.string().matches(number, "Is not a number"),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [file, setFile] = useState("");
  const [image, setImage] = useState();

  const onChange = (e) => {
    const f = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(f);
    reader.onload = (e) => {
      setImage(e.target.result);
    };
    setFile(f);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    let newUrl = file.name;

    axios.post("http://localhost:3001/posts/img", formData);
    if (newUrl) {
      axios
        .put(
          "http://localhost:3001/posts/url",
          {
            newUrl: newUrl,
            id: id,
          },
          {
            headers: { accessToken: sessionStorage.getItem("accessToken") },
          }
        )
        .then(() => {
          navigate("/");
        });
    }
  };

  const deleteImage = (e) => {
    let newUrl = null;
    axios
      .put(
        "http://localhost:3001/posts/url",
        {
          newUrl: newUrl,
          id: id,
        },
        {
          headers: { accessToken: sessionStorage.getItem("accessToken") },
        }
      )
      .then(() => {
        navigate("/");
      });
  };

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
  const url = `http://localhost:3001/${postObject.url}`
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
                autoComplete="off"
                id="inputCreatePost"
                name="price"
                placeholder="(Ex. 12...)"
              />
              <label>Stock: {postObject.stock}</label>
              <ErrorMessage name="stock" component="span" />
              <Field
                autoComplete="off"
                id="inputCreatePost"
                name="stock"
                placeholder="(Ex. 12...)"
              />

              <button type="submit">Edit Post</button>
            </Form>
          </Formik>

          <Formik>
            <Form className="formContainer edit" onSubmit={onSubmit}>
              <label>Image: {!postObject.url && "No image"}</label>
              {postObject.url && <img src={url} />}
              <Field
                type="file"
                className="custom-file-input"
                id="customFile"
                onChange={onChange}
                accept="image/*"
              />
              {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
              {image && (
                <div className="containerPost">
                  <img src={image} />
                  <button style={{margin: "0"}} type="submit">{postObject.url && ("Edit Image")}{!postObject.url && ("Upload Image")}</button>
                </div>
              )}
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
            {postObject.url && (
              <button onClick={deleteImage}>Delete image</button>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return <div>Access denied !</div>;
  }
}
export default Post;
