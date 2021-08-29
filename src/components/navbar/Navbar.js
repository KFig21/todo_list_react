import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./navbar.scss";
import FirebaseContext from "../../context/firebase";
import UserContext from "../../context/user";
import useUser from "../../hooks/use-user";
// icons
import MenuIcon from "@material-ui/icons/Menu";
import MoreVertIcon from "@material-ui/icons/MoreVert";

export default function Navbar({ title, sidebarOpen, setSidebarOpen }) {
  const { firebase } = useContext(FirebaseContext);
  const { user } = useContext(UserContext);
  const { userInfo } = useUser();
  const history = useHistory();
  let navTitle = title === undefined ? "To-Do List" : title;

  const handleSignOut = () => {
    firebase.auth().signOut();
    history.push("/login");
  };

  return (
    <div className="navbar">
      <div className="relative">
        <div className="left">
          <div
            className="hamburger"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <MenuIcon className="icon" />
          </div>
        </div>
        <div className="middle">
          <Link className="link-title" to="/">
            <h2>{`${navTitle}`}</h2>
          </Link>
        </div>
        <div className="right">
          {!user && (
            <>
              <Link to="/login">
                <button>Login</button>
              </Link>
              <Link to="/signup">
                <button>Signup</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
