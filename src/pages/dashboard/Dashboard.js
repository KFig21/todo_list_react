import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import UserContext from "../../context/user";
import useUser from "../../hooks/use-user";
import { getListsByDocId } from "../../services/firebase";
import "./dashboard.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import List from "../../components/list/List";
import db from "../../lib/firebase";
import { useHistory } from "react-router-dom";

export default function Main() {
  const emptyList = {
    listName: "",
    tasks: [{ taskName: "none" }],
  };
  const emptyList2 = {
    listName: "",
    tasks: [{ taskName: "none" }],
  };
  const emptyArr = [emptyList, emptyList2];
  const { user } = useContext(UserContext);
  const { userInfo } = useUser();
  const [lists, setLists] = useState(emptyArr);
  const [currentList, setCurrentList] = useState(emptyList);
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
  }, [userInfo.docId]);

  // update dashboard to include newly added list
  useEffect(() => {
    db.collection("users")
      .doc(userInfo.docId)
      .collection("lists")
      .onSnapshot((snapshot) => {
        console.log(
          "snapshot",
          snapshot.docs.map((doc) => doc.data())
        );
        setLists(snapshot.docs.map((doc) => doc.data()));
      });
  }, [currentList]);

  useEffect(() => {
    if (!user) {
      history.push("/login");
    }
  }, [user]);

  return (
    <div className="main">
      <Navbar
        title={currentList.listName}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar
        lists={lists}
        setCurrentList={setCurrentList}
        userInfo={userInfo}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
      />
      <List list={currentList} userInfo={userInfo} />
    </div>
  );
}
