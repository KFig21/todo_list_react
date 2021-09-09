import "../signup/signup.scss";
import { Link, useHistory } from "react-router-dom";
import React, { useState, useContext, useEffect } from "react";
import FirebaseContext from "../../context/firebase";
import * as ROUTES from "../../constants/routes";

export default function Login() {
  const history = useHistory();
  const { firebase } = useContext(FirebaseContext);
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const isInvalid = password === "" || emailAddress === "";
  const [buttonClass, setButtonClass] = useState("disabled");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await firebase.auth().signInWithEmailAndPassword(emailAddress, password);
      history.push(ROUTES.DASHBOARD);
    } catch (error) {
      setEmailAddress("");
      setPassword("");
      setError(error.message);
    }
  };

  const handleVisitor = async () => {
    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword("Visitor@mail.com", "password");
      history.push(ROUTES.DASHBOARD);
    } catch (error) {
      setEmailAddress("");
      setPassword("");
      setError(error.message);
    }
  };

  useEffect(() => {
    isInvalid ? setButtonClass("disabled") : setButtonClass("able");
  }, [isInvalid]);

  useEffect(() => {
    document.title = "Login - To Do";
  }, []);
  return (
    <>
      <div className="signup">
        <div className="container">
          <div className="modal">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleLogin}>
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
                Login
              </button>
            </form>
          </div>
          <div className="already">
            Already have an account?{" "}
            <Link to={ROUTES.SIGN_UP} className="link">
              Signup
            </Link>
          </div>
          <div className="visitor-container">
            <button onClick={() => handleVisitor()}>Just visiting?</button>
          </div>
        </div>
      </div>
    </>
  );
}
