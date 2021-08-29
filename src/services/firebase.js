import { firebase, FieldValue } from "../lib/firebase";

export async function doesUsernameExist(username) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", username)
    .get();

  return result.docs.length > 0;
}

export async function getUserByUsername(username) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", username)
    .get();

  return result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));
}

// get user from the firestore wher userId == userId(passed from the auth) ✔
export async function getUserByUserId(userId) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("userId", "==", userId)
    .get();

  return result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));
}

// get lists (plural) ✔
export async function getListsByDocId(docId) {
  let result = await firebase
    .firestore()
    .collection("users")
    .doc(docId)
    .collection("lists")
    .get();

  result = result.docs.map((item) => ({
    ...item.data(),
  }));

  return result;
}

// get tasks ✔
export async function getTasksFromListId(listId, userId) {
  const result = await firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .collection("lists")
    .doc(listId)
    .collection("tasks")
    .get();

  return result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));
}

// add task ✔
export async function addTask(listId, userId, input) {
  // var taskDocRef = await firebase
  // .firestore()
  // .collection("users")
  // .doc(userId)
  // .collection("lists")
  // .doc(listId)
  // .collection("tasks")
  // .doc();

  var userDocRef = await firebase.firestore().collection("users").doc(userId);

  var listsDocRef = userDocRef.collection("lists").doc(listId);
  var tasksInListDocRef = listsDocRef.collection("tasks").doc();
  var tasksMainDocRef = userDocRef.collection("tasks").doc();
  var dateCreated = Date.now();
  // var dateCreated = new Date().toString().split(" ").splice(1, 3).join(" ");

  tasksInListDocRef.set({
    taskName: input,
    dateCreated: dateCreated,
    completed: false,
    due: dateCreated,
    urgent: false,
    taskIdList: tasksInListDocRef.id,
    taskIdMain: tasksMainDocRef.id,
  });

  tasksMainDocRef.set({
    taskName: input,
    dateCreated: dateCreated,
    completed: false,
    due: dateCreated,
    urgent: false,
    taskIdList: tasksInListDocRef.id,
    taskIdMain: tasksMainDocRef.id,
  });
}

// add list
export async function addList(userId, input) {
  var listDocRef = await firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .collection("lists")
    .doc();

  listDocRef.set({
    listName: input,
    dateCreated: Date.now(),
    listId: listDocRef.id,
  });
}
