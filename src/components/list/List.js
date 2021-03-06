import React, { useState, useEffect } from "react";
import { Suspense } from "react";
import "./list.scss";
import Task from "./task/Task";
import db from "../../lib/firebase";
import { addTask } from "../../services/firebase";
// icons
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";
import RefreshIcon from "@material-ui/icons/Refresh";

export default function List({
  list,
  userInfo,
  tasks,
  setTasks,
  setShowListEdit,
  setShowDeleteList,
  setSidebarOpen,
}) {
  const [input, setInput] = useState("");
  const isInvalid = input === "";

  // update tasks
  useEffect(() => {
    db.collection("users")
      .doc(userInfo.docId)
      .collection("lists")
      .doc(list.listId)
      .collection("tasks")
      .orderBy("due", "asc")
      .onSnapshot((snapshot) => {
        setTasks(snapshot.docs.map((doc) => doc.data()));
      });
  }, [list]);

  const handleAddTask = (event) => {
    event.preventDefault();
    addTask(list.listId, userInfo.docId, input);
    setInput("");
  };

  const sortByDate = () => {
    db.collection("users")
      .doc(userInfo.docId)
      .collection("lists")
      .doc(list.listId)
      .collection("tasks")
      .orderBy("due", "asc")
      .onSnapshot((snapshot) => {
        setTasks(snapshot.docs.map((doc) => doc.data()));
      });
  };

  const filterBy = (item, bool) => {
    setTasks(tasks.filter((task) => task[item] === bool));
  };

  const handleCloseListEdit = () => {
    setShowListEdit(false);
    setShowDeleteList(false);
    setSidebarOpen(false);
  };

  return (
    <Suspense fallback={<p className="suspense">loading...</p>}>
      <div className="list" onClick={() => handleCloseListEdit()}>
        {list.listId !== undefined && (
          <form className="add">
            <button disabled={isInvalid} type="submit" onClick={handleAddTask}>
              <AddCircleIcon className="add-icon" />
            </button>
            <input
              placeholder="Add a task"
              value={input}
              maxLength={1000}
              onChange={(e) => setInput(e.target.value)}
            />
          </form>
        )}
        <div className="tasks-container">
          {tasks.map((item, index) => (
            <>
              <Task
                task={item}
                userInfo={userInfo}
                list={list}
                completed={item.completed}
                index={index}
              />
            </>
          ))}
        </div>

        <div className="filterbar">
          <button onClick={() => filterBy("completed", false)}>
            <CheckCircleIcon className="incomplete-filter" />
          </button>
          <button onClick={() => filterBy("completed", true)}>
            <CheckCircleIcon className="completed-filter" />
          </button>
          <button onClick={() => filterBy("urgent", true)}>
            <PriorityHighIcon className="priority-filter" />
          </button>
          <button className="refresh-button" onClick={() => sortByDate()}>
            <RefreshIcon className="refresh" />
          </button>
        </div>
      </div>
    </Suspense>
  );
}
