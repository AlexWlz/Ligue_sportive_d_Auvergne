import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
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

  for (var i = 0; i < length; i++) {
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

  const Send = () => {
    list = [];
    listPost.map((value) => {
      let newStock = value.stock - value.quantity;
      let id = value.id;
      post.push({ id: value.id, newStock: newStock });
      console.log(post);
      localStorage.setItem("newStock", JSON.stringify(post));
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
      localStorage.clear();
      navigate("/");
    });
  };
  return (
    <div className="containerPost">
      <div className="post postCart">
        <div className="title">
          <p>Shopping Cart</p>
        </div>
        <div className="body">
          {listPost.map((value, key) => {
              return (
                <div className="cart" key={key}>
                  <p>
                    {value.quantity} x {value.produce}
                  </p>
                  <p>{value.description}</p>
                  <p>{value.price} €</p>
                </div>
              );
        })}
          <div className="cart">
            <p className="total">Total price: {totalPrice} €</p>
          </div>
        </div>
        <div className="footer">
          <button onClick={Empty}>Empty the cart</button>
          <button onClick={Send}>Validate the cart</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
