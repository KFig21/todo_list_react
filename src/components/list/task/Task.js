import React, { useState } from "react";
import "./task.scss";
import db from "../../../lib/firebase";
import Edit from "./edit/Edit";
// icons
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";
import CloseIcon from "@material-ui/icons/Close";
import CreateIcon from "@material-ui/icons/Create";

export default function Task({ task, userInfo, list, completed }) {
  console.log("task", task);
  const [toggleCompleted, setToggleCompleted] = useState(completed);
  const [toggleUrgent, setToggleUrgent] = useState(task.urgent);
  const [showEdit, setShowEdit] = useState(false);

  // completed
  const handleToggleCompleted = async () => {
    setToggleCompleted((toggleCompleted) => !toggleCompleted);

    await db
      .collection("users")
      .doc(userInfo.docId)
      .collection("lists")
      .doc(list.listId)
      .collection("tasks")
      .doc(task.taskIdList)
      .update({
        completed: toggleCompleted ? false : true,
      });

    await db
      .collection("users")
      .doc(userInfo.docId)
      .collection("tasks")
      .doc(task.taskIdMain)
      .update({
        completed: toggleCompleted ? false : true,
      });
  };

  // urgent
  const handleToggleUrgent = async () => {
    setToggleUrgent((toggleUrgent) => !toggleUrgent);

    await db
      .collection("users")
      .doc(userInfo.docId)
      .collection("lists")
      .doc(list.listId)
      .collection("tasks")
      .doc(task.taskIdList)
      .update({
        urgent: toggleUrgent ? false : true,
      });

    await db
      .collection("users")
      .doc(userInfo.docId)
      .collection("tasks")
      .doc(task.taskIdMain)
      .update({
        urgent: toggleUrgent ? false : true,
      });
  };

  // delete
  const handleDeleteTask = async () => {
    await db
      .collection("users")
      .doc(userInfo.docId)
      .collection("lists")
      .doc(list.listId)
      .collection("tasks")
      .doc(task.taskIdList)
      .delete();

    await db
      .collection("users")
      .doc(userInfo.docId)
      .collection("tasks")
      .doc(task.taskIdMain)
      .delete();
  };

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US");
  }

  return (
    <div className="list-item-container">
      <div className="list-item">
        <div className="left">
          {/* completed */}
          <div className="icon-container" onClick={handleToggleCompleted}>
            {toggleCompleted ? (
              <CheckCircleIcon className="completedIcon" />
            ) : (
              <RadioButtonUncheckedIcon className="incompleteIcon" />
            )}
          </div>

          {/* urgent */}
          <div className="icon-container" onClick={handleToggleUrgent}>
            {toggleUrgent ? (
              <PriorityHighIcon className="urgentIcon" />
            ) : (
              <PriorityHighIcon className="urgentIconFaded" />
            )}
          </div>

          <p
            className="task"
            onClick={() => setShowEdit((showEdit) => !showEdit)}
          >
            {task.taskName}
            <CreateIcon className="create-icon" />
          </p>
        </div>

        <div className="right">
          <p
            className="date"
            onClick={() => setShowEdit((showEdit) => !showEdit)}
          >
            <CreateIcon className="create-icon" />
            {formatDate(task.due)}
          </p>
          <div className="icon-container" onClick={handleDeleteTask}>
            <CloseIcon className="closeIcon" />
          </div>
        </div>
      </div>

      {showEdit && (
        <div className="edit-contianer">
          <Edit
            task={task}
            userInfo={userInfo}
            list={list}
            completed={completed}
            showEdit={showEdit}
            setShowEdit={setShowEdit}
          />
        </div>
      )}
    </div>
  );
}
