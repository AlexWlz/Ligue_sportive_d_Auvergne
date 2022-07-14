import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import ListUsers from "./pages/ListUsers";
import User from "./pages/User";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Image from "./pages/Image";

function App() {

  const [authState, setAuthState] = useState({
    email: "",
    id: 0,
    first_name: "",
    admin: false,
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
            first_name: response.data.first_name,
            admin: response.data.admin,
            status: true,
          });
          const id = response.data.id;
          axios
            .get(`http://localhost:3001/auth/byId/${id}`)
            .then((response) => {
              if (response.data.error) {
                setUser({ ...user, admin: false });
              } else {
                sessionStorage.setItem("admin", response.data.admin);
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

  const logout = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <Link to="/"> Home Page</Link>
            {user.admin && (
              <>
                <Link to="/createpost"> Create A Post</Link>
                <Link to="/listusers">Users</Link>
                <Link to="/registration">Create Users</Link>
              </>
            )}

            {!authState.status && (
              <>
                <Link to="/login"> Login</Link>
                <Link to="/registration"> Registration</Link>
              </>
            )}
            {authState.status && (
              <>
                <Link to="/cart">Shopping Cart</Link>
                <Link to={`/profile/${authState.id}`}>{user.first_name}</Link>
              </>
            )}
            {authState.status && (
              <button className="logout" onClick={logout}>
                Logout
              </button>
            )}
          </div>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/image" exact element={<Image />} />
            <Route path="/createpost" exact element={<CreatePost />} />
            <Route path="/post/:id" exact element={<Post />} />
            <Route path="/user/:id" exact element={<User />} />
            <Route path="/registration" exact element={<Registration />} />
            <Route path="/listusers" exact element={<ListUsers />} />
            <Route path="/cart" exact element={<Cart />} />
            <Route path="/profile/:id" exact element={<Profile />} />
            {!authState.status && (
              <Route path="/login" exact element={<Login />} />
            )}
            <Route path="*" exact element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
