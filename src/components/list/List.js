import React, { useState, useEffect } from "react";
import { addTask } from "../../services/firebase";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import "./list.scss";
import Task from "./task/Task";
import db from "../../lib/firebase";
import { Suspense } from "react";
// icons
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";
import TodayIcon from "@material-ui/icons/Today";

export default function List({ list, userInfo }) {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const isInvalid = input === "";
  const [sort, setSort] = useState("due");
  const [dir, setDir] = useState("asc");

  useEffect(() => {
    console.log("😜", sort);
    db.collection("users")
      .doc(userInfo.docId)
      .collection("lists")
      .doc(list.listId)
      .collection("tasks")
      .orderBy(sort, dir)
      .onSnapshot((snapshot) => {
        setTasks(snapshot.docs.map((doc) => doc.data()));
      });
  }, [list, sort, dir]);

  const handleAddTask = (event) => {
    event.preventDefault();
    addTask(list.listId, userInfo.docId, input);
    setInput("");
  };

  const sortByDate = () => {
    setSort("due");
    setDir("asc");
    // tasks.sort(function compare(a, b) {
    //   var dateA = new Date(a.due);
    //   var dateB = new Date(b.due);
    //   return dateA - dateB;
    // });
    console.log("sorted by DATE", tasks);
  };

  const sortByPriority = () => {
    setSort("urgent");
    setDir("desc");
    // tasks.sort(function compare(a, b) {
    //   var taskA = a.urgent;
    //   var taskB = b.urgent;
    //   return taskA === taskB ? 0 : taskA ? -1 : 1;
    // });
    console.log("sorted by PRIORITY", tasks);
  };

  const sortByStatus = () => {
    setSort("completed");
    setDir("desc");
    // tasks.sort(function compare(a, b) {
    //   var taskA = a.completed;
    //   var taskB = b.completed;
    //   return taskA === taskB ? 0 : taskA ? -1 : 1;
    // });
    console.log("sorted by STATUS", tasks);
  };

  return (
    <Suspense fallback={<p className="suspense">loading...</p>}>
      <div className="list">
        {list.listId !== undefined && (
          <form className="add">
            <button disabled={isInvalid} type="submit" onClick={handleAddTask}>
              <AddCircleIcon className="add-icon" />
            </button>
            <input
              placeholder="Add a task"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </form>
        )}
        <div className="tasks-container">
          {tasks.map((item) => (
            <>
              <Task
                task={item}
                userInfo={userInfo}
                list={list}
                completed={item.completed}
              />
            </>
          ))}
        </div>
        <div className="sortbar">
          <button onClick={() => sortByStatus()}>
            <CheckCircleIcon
              className={
                sort === "completed" ? "sort-status active" : "sort-status"
              }
            />
          </button>
          <button onClick={() => sortByPriority()}>
            <PriorityHighIcon
              className={
                sort === "urgent" ? "sort-priority active" : "sort-priority"
              }
            />
          </button>
          <button onClick={() => sortByDate()}>
            <TodayIcon
              className={sort === "due" ? "sort-date active" : "sort-date"}
            />
          </button>
        </div>
      </div>
    </Suspense>
  );
}
