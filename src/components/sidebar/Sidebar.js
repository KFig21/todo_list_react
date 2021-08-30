import React, { useState, useContext } from "react";
import { addList } from "../../services/firebase";
import { useHistory } from "react-router-dom";
import FirebaseContext from "../../context/firebase";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import "./sidebar.scss";

export default function Sidebar({
  lists,
  setCurrentList,
  userInfo,
  sidebarOpen,
  setSidebarOpen,
  user,
}) {
  const [input, setInput] = useState("");
  const isInvalid = input === "";
  const { firebase } = useContext(FirebaseContext);
  const history = useHistory();

  const handleAddList = (event) => {
    event.preventDefault();
    addList(userInfo.docId, input);
    setInput("");
  };

  const handleListClick = (list) => {
    setCurrentList(list);
    setSidebarOpen(false);
  };

  const handleSignOut = () => {
    firebase.auth().signOut();
    history.push("/login");
  };

  return (
    <div className={"sidebar " + (sidebarOpen && "active")}>
      <div className="sidebar-list">
        {lists.map((list, index) => (
          <div className="sidebar-list-item" key={`sidebar-${index}`}>
            <span className="list-name" onClick={() => handleListClick(list)}>
              {list.listName}
            </span>
          </div>
        ))}
        {user && (
          <form className="add">
            <button disabled={isInvalid} type="submit" onClick={handleAddList}>
              <AddCircleIcon className="add-icon" />
            </button>
            <input
              placeholder="Add a list"
              value={input}
              maxLength={20}
              onChange={(e) => setInput(e.target.value)}
            />
          </form>
        )}
      </div>
      {user && (
        <button
          className="signout"
          onClick={() => handleSignOut()}
          onKeyDown={(e) => {
            if (e.key === "enter") {
              history.push("/login");
              firebase.auth().signOut();
            }
          }}
        >
          Signout
        </button>
      )}
    </div>
  );
}
