import "./signup.scss";
import { Link, useHistory } from "react-router-dom";
import React, { useState, useContext, useEffect } from "react";
import FirebaseContext from "../../context/firebase";
import * as ROUTES from "../../constants/routes";
import { doesUsernameExist } from "../../services/firebase";
import Navbar from "../../components/navbar/Navbar";

export default function Signup() {
  const history = useHistory();
  const { firebase } = useContext(FirebaseContext);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const isInvalid = password === "" || emailAddress === "";
  const [buttonClass, setButtonClass] = useState("disabled");

  const handleSignup = async (e) => {
    e.preventDefault();

    const usernameExists = await doesUsernameExist(username);
    if (!usernameExists) {
      try {
        const createdUserResult = await firebase
          .auth()
          .createUserWithEmailAndPassword(emailAddress, password);

        await createdUserResult.user.updateProfile({
          displayName: username,
        });
        var userDocRef = await firebase.firestore().collection("users").doc();
        userDocRef.set({
          userId: createdUserResult.user.uid,
          username: username,
          fullName,
          emailAddress: emailAddress.toLowerCase(),
          dateCreated: Date.now(),
          docId: userDocRef.id,
        });

        var listsDocRef = userDocRef.collection("lists").doc();
        var tasksInListDocRef = listsDocRef.collection("tasks").doc();
        var tasksMainDocRef = userDocRef.collection("tasks").doc();
        var listName = "New";
        var taskName = "Create a list or a task!";
        var dateCreated = Date.now();

        listsDocRef.set({
          listId: listsDocRef.id,
          listName: listName,
          dateCreated: dateCreated,
        });

        tasksInListDocRef.set({
          taskName: taskName,
          taskIdList: tasksInListDocRef.id,
          taskIdMain: tasksMainDocRef.id,
          dateCreated: dateCreated,
          urgent: false,
          completed: false,
          due: dateCreated,
        });

        tasksMainDocRef.set({
          taskName: taskName,
          taskIdList: tasksInListDocRef.id,
          taskIdMain: tasksMainDocRef.id,
          dateCreated: dateCreated,
          urgent: false,
          completed: false,
          due: dateCreated,
        });

        history.push(ROUTES.DASHBOARD);
      } catch (error) {
        setFullName("");
        setEmailAddress("");
        setPassword("");
        setError(error.message);
      }
    } else {
      setError("That username is already taken");
    }
  };

  useEffect(() => {
    isInvalid ? setButtonClass("disabled") : setButtonClass("able");
  }, [isInvalid]);

  useEffect(() => {
    document.title = "Sign-up - To Do";
  }, []);

  return (
    <>
      {/* <Navbar /> */}
      <div className="signup">
        <div className="container">
          <div className="modal">
            <h2>Signup</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSignup}>
              {/* username */}
              <input
                aria-label="Enter your username"
                type="test"
                placeholder="Username"
                onChange={({ target }) => setUsername(target.value)}
                value={username}
              />
              {/* full name */}
              <input
                aria-label="Enter your full name"
                type="test"
                placeholder="Full name"
                onChange={({ target }) => setFullName(target.value)}
                value={fullName}
              />
              {/* email */}
              <input
                aria-label="Enter your email address"
                type="test"
                placeholder="Email address"
                onChange={({ target }) => setEmailAddress(target.value)}
                value={emailAddress}
              />
              {/* password */}
              <input
                aria-label="Enter your password"
                type="password"
                placeholder="Password"
                onChange={({ target }) => setPassword(target.value)}
                value={password}
              />
              {/* login button */}
              <button
                className={buttonClass}
                disabled={isInvalid}
                type="submit"
              >
                Sign-up
              </button>
            </form>
          </div>
          <div className="already">
            Already have an account?{" "}
            <Link to={ROUTES.LOGIN} className="link">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
