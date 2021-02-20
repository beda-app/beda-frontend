import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import PrivateRoute from "../common/components/PrivateRoute";
import Loading from "../common/components/Loading";
import NotFound from "../common/components/NotFound";

const Login = lazy(() => import("../features/auth/Login"));
const Register = lazy(() => import("../features/auth/Register"));
const Dashboard = lazy(() => import("../features/dashboard/Dashboard"));

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Suspense fallback={<Loading />}>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <PrivateRoute path="/dashboard">
                <Dashboard />
              </PrivateRoute>
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </Router>
      </Provider>
    );
  }
}

export default App;
