import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Commands() {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    email: "",
    id: 0,
    status: false,
  });

  const [user, setUser] = useState({
    first_name: "",
    admin: false,
  });

  const [commands, setCommands] = useState([]);
  const [listComma, setListCommand] = useState();
  const [number, setNumber] = useState();
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

    axios.get("http://localhost:3001/commands").then((response) => {
      setCommands(response.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteCommand = (id) => {
    console.log(id);
    axios
      .delete(`http://localhost:3001/commands/${id}`, {
        headers: { accessToken: sessionStorage.getItem("accessToken") },
      })
      .then(() => {
        window.location.reload();
      });
  };
  if (user.admin === true && commands) {
    return (
      <div className="containerPost">
        {commands.map((value, key) => {
          const panier = JSON.parse(value.panier);
          const Panier = [];

          const command = [];
          panier.map((value) => {
            Panier.push({ id: value.id_produce, number: value.number });
            axios
              .get(`http://localhost:3001/posts/byId/${value.id_produce}`)
              .then((response) => {
                command.push(response.data);
                localStorage.setItem("panier", JSON.stringify(command));
              });
          });
          const listPanier = JSON.parse(localStorage.getItem("panier"));

          const address = JSON.parse(value.address);

          return (
            <div className="post" key={key}>
              <div className="title">
                <p>Commande :</p>
              </div>
              <div className="body">
                <p>
                  Panier : <br />
                </p>
                {listPanier.map((value, key) => {
                  const id = value.id;
                  return (
                    <div key={key}>
                      {value.produce} x{" "}
                      {Panier.map((value) => {
                        if (value.id == id) {
                          return value.number;
                        }
                      })}
                    </div>
                  );
                })}
                <p>
                  Adresse : <br />
                  Rue : {address.rue}
                  <br />
                  Code postal : {address.code} <br />
                  Ville : {address.ville} <br />
                  Pays : {address.pays}
                </p>
              </div>
              <div className="footer">
                <button
                  className="buttons"
                  onClick={() => {
                    deleteCommand(value.id);
                  }}
                >
                  Validate
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  } else {
    return <div>Access denied !</div>;
  }
}

export default Commands;
