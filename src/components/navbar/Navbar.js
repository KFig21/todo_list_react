import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./navbar.scss";
import UserContext from "../../context/user";
import db from "../../lib/firebase";
// icons
import MenuIcon from "@material-ui/icons/Menu";
import MoreVertIcon from "@material-ui/icons/MoreVert";

export default function Navbar({
  list,
  userInfo,
  sidebarOpen,
  setSidebarOpen,
  showListEdit,
  setShowListEdit,
  setShowDeleteList,
}) {
  const { user } = useContext(UserContext);
  const [title, setTitle] = useState(list.listName);

  // update list name
  useEffect(() => {
    db.collection("users")
      .doc(userInfo.docId)
      .collection("lists")
      .doc(list.listId)
      .onSnapshot((snapshot) => {
        !snapshot.data() ? setTitle(title) : setTitle(snapshot.data().listName);
      });
  }, [list]);

  const handleCloseLists = () => {
    setShowListEdit(!showListEdit);
    setShowDeleteList(false);
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
            {title === undefined ? <h2> </h2> : <h2>{`${title}`}</h2>}
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
          {user && (
            <MoreVertIcon
              className="edit-list-icon"
              onClick={() => handleCloseLists()}
            />
          )}
        </div>
      </div>
    </div>
  );
}
