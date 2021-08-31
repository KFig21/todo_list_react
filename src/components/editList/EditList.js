import React, { useState } from "react";
import "./editList.scss";
import db from "../../lib/firebase";
import { deleteTask } from "../../services/firebase";
// icons
import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";

export default function EditList({
  list,
  userInfo,
  showListEdit,
  setShowListEdit,
  showDeleteList,
  setShowDeleteList,
  setSidebarOpen,
  tasks,
  setTasks,
}) {
  const [inputName, setInputName] = useState("");
  const isInvalid = inputName === "";

  const handleSaveName = async () => {
    await db
      .collection("users")
      .doc(userInfo.docId)
      .collection("lists")
      .doc(list.listId)
      .update({
        listName: inputName,
      });

    setInputName("");
    setShowListEdit(!showListEdit);
    setShowDeleteList(false);
  };

  const handleDelete = async () => {
    for (let i = 0; i < tasks.length; i++) {
      deleteTask(userInfo.docId, list.listId, tasks[i].taskIdList);
    }

    await db
      .collection("users")
      .doc(userInfo.docId)
      .collection("lists")
      .doc(list.listId)
      .delete();

    setInputName("");
    setShowListEdit(!showListEdit);
    setShowDeleteList(false);
    setSidebarOpen(true);
    setTasks([]);
  };

  const handleCancel = () => {
    setShowDeleteList((showDeleteList) => !showDeleteList);
  };

  return (
    <div className={showListEdit ? "edit-list active" : "edit-list"}>
      <div className="edit-container">
        <p>Name:</p>
        <div className="edit-input">
          <input
            type="text"
            maxLength={20}
            placeholder={`${list.listName}`}
            onChange={(e) => setInputName(e.target.value)}
          />
          <button disabled={isInvalid} onClick={() => handleSaveName()}>
            <SaveIcon className="save-icon" />
          </button>
        </div>
        <div className="delete-container">
          <CloseIcon
            className="delete-icon"
            onClick={() => setShowDeleteList(!showDeleteList)}
          />
        </div>
      </div>
      <div className={showDeleteList ? "delete-list show" : "delete-list"}>
        <button className="cancel" onClick={() => handleCancel()}>
          Cancel
        </button>
        <button className="delete" onClick={() => handleDelete()}>
          Delete
        </button>
      </div>
    </div>
  );
}
