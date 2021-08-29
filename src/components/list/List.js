import React, { useState, useEffect } from "react";
import { addTask } from "../../services/firebase";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import "./list.scss";
import Task from "./task/Task";
import db from "../../lib/firebase";
import { Suspense } from "react";

export default function List({ list, userInfo }) {
  console.log("list", list);
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const isInvalid = input === "";

  useEffect(() => {
    db.collection("users")
      .doc(userInfo.docId)
      .collection("lists")
      .doc(list.listId)
      .collection("tasks")
      .onSnapshot((snapshot) => {
        console.log(
          "snapshot",
          snapshot.docs.map((doc) => doc.data())
        );
        setTasks(snapshot.docs.map((doc) => doc.data()));
      });
  }, [list]);

  const handleAddTask = (event) => {
    event.preventDefault();
    addTask(list.listId, userInfo.docId, input);
    setInput("");
  };

  return (
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
        <Suspense fallback={<p className="suspense">loading...</p>}>
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
        </Suspense>
      </div>
    </div>
  );
}
