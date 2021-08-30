import React, { useState } from "react";
import "./edit.scss";
import db from "../../../../lib/firebase";
// icons
import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";

export default function Edit({ task, userInfo, list, showEdit, setShowEdit }) {
  const [inputName, setInputName] = useState("");
  const [inputDue, setInputDue] = useState("");

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US");
  }

  const handleSaveName = async () => {
    await db
      .collection("users")
      .doc(userInfo.docId)
      .collection("lists")
      .doc(list.listId)
      .collection("tasks")
      .doc(task.taskIdList)
      .update({
        taskName: inputName,
      });

    await db
      .collection("users")
      .doc(userInfo.docId)
      .collection("tasks")
      .doc(task.taskIdMain)
      .update({
        taskName: inputName,
      });
  };

  const handleSaveDate = async () => {
    await db
      .collection("users")
      .doc(userInfo.docId)
      .collection("lists")
      .doc(list.listId)
      .collection("tasks")
      .doc(task.taskIdList)
      .update({
        due: inputDue,
      });

    await db
      .collection("users")
      .doc(userInfo.docId)
      .collection("tasks")
      .doc(task.taskIdMain)
      .update({
        due: inputDue,
      });
  };

  return (
    <div className={showEdit ? "edit-item" : "edit-item inactive"}>
      <CloseIcon
        className="close-edit"
        onClick={() => setShowEdit(!showEdit)}
      />
      <div className="info">
        <p>Task:</p>
        <div className="edit-input">
          <input
            type="text"
            maxLength={1000}
            placeholder={`${task.taskName}`}
            onChange={(e) => setInputName(e.target.value)}
          ></input>
          <SaveIcon className="save-icon" onClick={() => handleSaveName()} />
        </div>
        <p>Due:</p>
        <div className="edit-input">
          <input
            type="text"
            onFocus={(e) => {
              e.currentTarget.type = "date";
              e.currentTarget.focus();
            }}
            placeholder={`${formatDate(task.due)}`}
            onChange={(e) => setInputDue(e.target.value)}
          ></input>
          <SaveIcon className="save-icon" onClick={() => handleSaveDate()} />
        </div>
        <p>Created:</p>
        <p>{formatDate(task.dateCreated)}</p>
        <p>Status:</p>
        {task.completed ? (
          <p className="completed-p">Completed</p>
        ) : (
          <p>Incomplete</p>
        )}
        <p>Priority:</p>

        {task.urgent ? <p className="urgent-p">HIGH</p> : <p>Low</p>}
      </div>
    </div>
  );
}
