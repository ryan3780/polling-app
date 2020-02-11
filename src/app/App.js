import React, { useEffect } from "react";
import "./App.css";
import { Route, withRouter, Switch } from "react-router-dom";

import { getCurrentUser } from "../util/APIUtils";
import { ACCESS_TOKEN } from "../constants";

import PollList from "../poll/PollList";
import NewPoll from "../poll/NewPoll";
import Login from "../user/login/Login";
import Signup from "../user/signup/Signup";
import Profile from "../user/profile/Profile";
import AppHeader from "../common/AppHeader";
import NotFound from "../common/NotFound";
import LoadingIndicator from "../common/LoadingIndicator";
import PrivateRoute from "../common/PrivateRoute";

import { Layout, notification } from "antd";
const { Content} = Layout;

function App({ history }) {

  const initalCurrentUser = {
    currentUser: null,
    isAuthenticated: false,
    isLoading: false
  };

  notification.config({
    placement: "topRight",
    top: 70,
    duration: 3
  });
  const [userState, setUserState] = React.useState(initalCurrentUser);

  const loadCurrentUser = () => {

    setUserState({
      isLoading: true
    });
    getCurrentUser()
      .then(response => {
        setUserState({
          currentUser: response,
          isAuthenticated: true,
          isLoading: false
        });
      })
      .catch(error => {
        setUserState({
          isLoading: false
        });
      });
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const handleLogout = (
    redirectTo = "/",
    notificationType = "success",
    description = "You're successfully logged out."
  ) => {
    localStorage.removeItem(ACCESS_TOKEN);

    setUserState({
      currentUser: null,
      isAuthenticated: false
    });

    history.push(redirectTo);

    notification[notificationType]({
      message: "Polling App",
      description: description
    });
  };

  const handleLogin = () => {
    notification.success({
      message: "Polling App",
      description: "You're successfully logged in."
    });
    loadCurrentUser();
    history.push("/");
  };

  if (userState.isLoading) {
    return <LoadingIndicator />;
  }
  return (
    <Layout className="app-container">
      <AppHeader
        isAuthenticated={userState.isAuthenticated}
        currentUser={userState.currentUser}
        onLogout={handleLogout}
      />

      <Content className="app-content">
        <div className="container">
          <Switch>
            <Route
              exact
              path="/"
              render={props => (
                <PollList
                  isAuthenticated={userState.isAuthenticated}
                  currentUser={userState.currentUser}
                  handleLogout={handleLogout}
                  {...props}
                />
              )}
            ></Route>
            <Route
              path="/login"
              render={props => <Login onLogin={handleLogin} {...props} />}
            ></Route>
            <Route path="/signup" component={Signup}></Route>
            <Route
              path="/users/:username"
              render={(props) => (
                <Profile
                  isAuthenticated={userState.isAuthenticated}
                  currentUser={userState.currentUser}
                  {...props}
                />
              )}
            ></Route>
            <PrivateRoute
              authenticated={userState.isAuthenticated}
              path="/poll/new"
              component={NewPoll}
              handleLogout={handleLogout}
            ></PrivateRoute>
            <Route component={NotFound}></Route>
          </Switch>
        </div>
      </Content>
    </Layout>
  );
}

export default withRouter(App);
