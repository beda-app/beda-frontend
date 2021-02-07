import React from "react";
import SignIn from "../features/auth/SignIn";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/login" component={SignIn} />
        </Switch>
      </Router>
    );
  }
}

export default App;
