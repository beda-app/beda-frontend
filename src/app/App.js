import React from "react";
import Login from "../features/auth/Login";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Register from "../features/auth/Register";
import { Provider } from "react-redux";
import store from "./store";
import PrivateRoute from "../common/components/PrivateRoute";
import Dashboard from "../features/dashboard/Dashboard";

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <PrivateRoute path="/dashboard">
              <Dashboard />
            </PrivateRoute>
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
