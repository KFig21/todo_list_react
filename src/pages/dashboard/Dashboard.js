import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import "./dashboard.scss";
import UserContext from "../../context/user";
import useUser from "../../hooks/use-user";
import { getListsByDocId } from "../../services/firebase";
import db from "../../lib/firebase";
//components
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import List from "../../components/list/List";
import EditList from "../../components/editList/EditList";

export default function Dashboard() {
  // dummy imputs to keep initial load from returning undefined
  const emptyList = {
    listName: "",
    tasks: [{ taskName: "none" }],
  };
  const emptyList2 = {
    listName: "",
    tasks: [{ taskName: "none" }],
  };
  const emptyArr = [emptyList, emptyList2];
  const [lists, setLists] = useState(emptyArr);
  const [currentList, setCurrentList] = useState(emptyList);

  const { user } = useContext(UserContext);
  const { userInfo } = useUser();
  const [tasks, setTasks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showListEdit, setShowListEdit] = useState(false);
  const [showDeleteList, setShowDeleteList] = useState(false);
  const [username, setusername] = useState("");
  const history = useHistory();

  // load lists upon initial load
  useEffect(() => {
    async function loadLists() {
      const listData = await getListsByDocId(userInfo.docId);
      if (listData) {
        setLists(listData);
      } else {
        return;
      }
    }

    loadLists();
    setCurrentList(lists[0]);
    setusername(userInfo.username);
  }, [userInfo.docId]);

  // update dashboard to include newly added list
  useEffect(() => {
    db.collection("users")
      .doc(userInfo.docId)
      .collection("lists")
      .onSnapshot((snapshot) => {
        setLists(snapshot.docs.map((doc) => doc.data()));
      });
  }, [currentList]);

  useEffect(() => {
    if (!user) {
      history.push("/login");
    }
  }, [user]);

  useEffect(() => {
    currentList.listName === ""
      ? (document.title = `To Do`)
      : (document.title = `To Do - ${currentList.listName}`);
  }, [currentList]);

  return (
    <div className="main">
      <Navbar
        list={currentList}
        userInfo={userInfo}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        showListEdit={showListEdit}
        setShowListEdit={setShowListEdit}
        setShowDeleteList={setShowDeleteList}
        username={username}
      />
      <EditList
        list={currentList}
        userInfo={userInfo}
        showListEdit={showListEdit}
        setShowListEdit={setShowListEdit}
        showDeleteList={showDeleteList}
        setShowDeleteList={setShowDeleteList}
        setSidebarOpen={setSidebarOpen}
        tasks={tasks}
        setTasks={setTasks}
      />
      <Sidebar
        lists={lists}
        setCurrentList={setCurrentList}
        userInfo={userInfo}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
      />
      <List
        list={currentList}
        userInfo={userInfo}
        tasks={tasks}
        setTasks={setTasks}
        setShowListEdit={setShowListEdit}
        setShowDeleteList={setShowDeleteList}
        setSidebarOpen={setSidebarOpen}
      />
    </div>
  );
}
