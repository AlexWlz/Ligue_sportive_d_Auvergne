import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const navigate = useNavigate();
  let list = JSON.parse(localStorage.getItem("cart"));

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
    axios.get("http://localhost:3001/posts").then((response) => {
      setListOfPosts(response.data);
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

  function saveBasket(basket) {
    localStorage.setItem("basket", JSON.stringify(basket));
  }

  function getBasket() {
    let basket = localStorage.getItem("basket");
    if (basket == null) {
      return [];
    } else {
      return JSON.parse(basket);
    }
  }

  let quantity = 0;

  return (
    <div className="containerPost">
      {listOfPosts.map((value, key) => {
        const addToCart = () => {
          window.location.reload();
          let basket = getBasket();
          let foundValue = basket.find((p) => p.id === value.id);
          if (foundValue !== undefined) {
            foundValue.quantity++;
            if (foundValue.quantity > value.stock) {
              foundValue.quantity = value.stock;
            }
            localStorage.setItem(value.id, foundValue.quantity);
          } else {
            value.quantity = 1;
            basket.push(value);
            localStorage.setItem(value.id, value.quantity);
          }
          saveBasket(basket);
          quantity = JSON.parse(localStorage.getItem(value.id));
        };

        if (user.admin === true) {
          return (
            <div key={key} className="post">
              <div className="title">
                <p>
                  {value.produce} / Stock: {value.stock}
                </p>
              </div>
              <div className="body">
                <p>{value.description}</p>
              </div>
              <div className="footer">
                <p>{value.price} €</p>
                {user.admin && (
                  <div>
                    <button
                      onClick={() => {
                        navigate(`/post/${value.id}`);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                )}
                {authState.status && (
                  <div>
                    <button onClick={addToCart}>Add to cart</button>
                  </div>
                )}
                {authState.status && (
                  <div>
                    <p onChange={addToCart}>
                      {JSON.parse(localStorage.getItem(value.id))}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        } else {
          if (value.stock != 0) {
            return (
              <div key={key} className="post">
                <div className="title">
                  <p>
                    {value.produce} / Stock: {value.stock}
                  </p>
                </div>
                <div className="body">
                  <p>{value.description}</p>
                </div>
                <div className="footer">
                  <p>{value.price} €</p>
                  {user.admin && (
                    <div>
                      <button
                        onClick={() => {
                          navigate(`/post/${value.id}`);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                  {authState.status && (
                    <div>
                      <button onClick={addToCart}>Add to cart</button>
                    </div>
                  )}
                  {authState.status && (
                    <div>
                      <p onChange={addToCart}>
                        {JSON.parse(localStorage.getItem(value.id))}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          }
        }
      })}
    </div>
  );
}

export default Home;
