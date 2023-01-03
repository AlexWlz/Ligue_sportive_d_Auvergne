import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Cart() {
  const id = localStorage.getItem("id");
  const [listCart, setListCart] = useState([]);

  const initialValues = {
    rue: "",
    code: "",
    ville: "",
    pays: "",
  };

  const validationSchema = Yup.object().shape({
    rue: Yup.string().required(),
    code: Yup.string().required(),
    ville: Yup.string().required(),
    pays: Yup.string().required(),
  });

  let list = JSON.parse(localStorage.getItem("basket"));
  let length = 0;
  if (list === null) {
    length = 0;
  } else {
    length = list.length;
  }

  let listPost = [];

  let totalPrice = 0;
  let price = 0;
  let post = [];

  const navigate = useNavigate();

  for (let i = 0; i < length; i++) {
    if (list[i].stock > 0) {
      price = Number(list[i].price) * list[i].quantity;
      totalPrice = totalPrice + price;
      listPost.push(list[i]);
    }
  }

  const Empty = () => {
    list = [];
    localStorage.clear();
    navigate("/");
  };

  const Send = (data) => {
    if (data) {
      // eslint-disable-next-line array-callback-return
      // listPost.map((value) => {
      //   let newStock = value.stock - value.quantity;
      //   let id = value.id;
      //   post.push({ id: value.id, newStock: newStock });
      //   console.log(post);
      //   localStorage.setItem("newStock", JSON.stringify(post));
      //   axios.put(
      //     "http://localhost:3001/posts/stock",
      //     {
      //       newStock: newStock,
      //       id: id,
      //     },
      //     {
      //       headers: { accessToken: sessionStorage.getItem("accessToken") },
      //     }
      //   );
      // });

      // eslint-disable-next-line array-callback-return
      list.map((value) => {
        setListCart(
          listCart.push({
            id_produce: value.id,
            number: localStorage.getItem(value.id),
          })
        );
      });

      const command = {
        panier: JSON.stringify(listCart),
        id_user: id,
        address: JSON.stringify(data),
      }

      console.log(command);

      
      // const command = {
      //   panier: JSON.stringify({list}),
      //   id_user: id,
      //   address: JSON.stringify({data}),
      // };

      axios.post("http://localhost:3001/commands", command).then((response) => {
        console.log(response);
        list = [];
      });

        localStorage.clear();
        navigate("/");
    }
  };
  return (
    <div className="containerPost">
      <div className="post postCart">
        <div className="title">
          <p>Shopping Cart</p>
        </div>
        <div className="body">
          {listPost.map((value, key) => {
            const url = `http://localhost:3001/${value.url}`;
            return (
              <div className="cart" key={key}>
                <p>
                  {value.quantity} x {value.produce}
                </p>
                {
                  // eslint-disable-next-line jsx-a11y/alt-text
                  value.url && <img src={url} />
                }
                <p>{value.description}</p>
                <p>{value.price} €</p>
              </div>
            );
          })}
          <div className="cart">
            <p className="total">Total price: {totalPrice} €</p>
          </div>
          <Formik
            initialValues={initialValues}
            onSubmit={Send}
            validationSchema={validationSchema}
          >
            <Form className="formContainer">
              <label>Rue: </label>
              <ErrorMessage name="rue" component="span" />
              <Field
                autoComplete="off"
                name="rue"
                placeholder="(Ex. 5 place de mist...)"
              />
              <label>Code postal: </label>
              <ErrorMessage name="code" component="span" />
              <Field
                autoComplete="off"
                name="code"
                placeholder="(Ex. 75000...)"
              />
              <label>Ville: </label>
              <ErrorMessage name="ville" component="span" />
              <Field
                autoComplete="off"
                name="ville"
                placeholder="(Ex. Paris...)"
              />
              <label>Pays: </label>
              <ErrorMessage name="pays" component="span" />
              <Field
                autoComplete="off"
                name="pays"
                placeholder="(Ex. France...)"
              />

              <button type="submit">Validate the cart</button>
            </Form>
          </Formik>
        </div>
        <div className="footer">
          <button onClick={Empty}>Empty the cart</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
