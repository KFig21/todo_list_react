import React, { useState } from "react";
import "./edit.scss";
import db from "../../../../lib/firebase";
// icons
import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";

export default function Edit({ task, userInfo, list, showEdit, setShowEdit }) {
  const [inputName, setInputName] = useState("");
  const [inputDue, setInputDue] = useState("");
  const taskNameIsInvalid = inputName === "";
  const dueDateIsInvalid = inputDue === "";

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", { timeZone: "UTC" });
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
      <button>
        <CloseIcon
          className="close-edit"
          onClick={() => setShowEdit(!showEdit)}
        />
      </button>
      <div className="info">
        {/* edit task input */}
        <p>Task:</p>
        <div className="edit-input">
          <input
            type="text"
            maxLength={1000}
            placeholder={`${task.taskName}`}
            onChange={(e) => setInputName(e.target.value)}
          ></input>
          <button disabled={taskNameIsInvalid} onClick={() => handleSaveName()}>
            <SaveIcon className="save-icon" />
          </button>
        </div>
        {/* edit due date input */}
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
          <button disabled={dueDateIsInvalid} onClick={() => handleSaveDate()}>
            <SaveIcon className="save-icon" />
          </button>
        </div>
        <p>Created:</p>
        <p className="padding-left">{formatDate(task.dateCreated)}</p>
        <p>Status:</p>
        {task.completed ? (
          <p className="completed-p padding-left">Completed</p>
        ) : (
          <p className="padding-left">Incomplete</p>
        )}
        <p>Priority:</p>

        {task.urgent ? (
          <p className="urgent-p padding-left">HIGH</p>
        ) : (
          <p className="padding-left">None</p>
        )}
      </div>
    </div>
  );
}
