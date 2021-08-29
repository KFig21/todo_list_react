import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import * as ROUTES from "./constants/routes";
import useAuthListener from "./hooks/use-auth-listener";
import UserContext from "./context/user";
//styles
import "./App.css";
import "./app.scss";
//pages
const Login = lazy(() => import("./pages/login/Login"));
const Signup = lazy(() => import("./pages/signup/Signup"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));

function App() {
  const { user } = useAuthListener();
  return (
    <UserContext.Provider value={{ user }}>
      <Router basename="/todo_list_react">
        <div className="app">
          <Suspense fallback={<div className="suspense">loading...</div>}>
            <Switch>
              <Route path={ROUTES.DASHBOARD} exact component={Dashboard} />
              <Route path={ROUTES.LOGIN} exact component={Login} />
              <Route path={ROUTES.SIGN_UP} exact component={Signup} />
            </Switch>
          </Suspense>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
