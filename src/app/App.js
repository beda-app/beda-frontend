import React from "react";
import Login from "../features/auth/Login";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
        </Switch>
      </Router>
    );
  }
}

export default App;
