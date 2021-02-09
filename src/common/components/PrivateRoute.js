import React, { useState } from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import jwtDecode from "jwt-decode";

const PrivateRoute = (props) => {
  const { children, ...restProps } = props;
  const checkAuthorization = () => {
    const token = localStorage.getItem("token");
    if (token === null) return false;

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch {
      return false;
    }
    setTimeout(() => setAuthorized(false), decoded.exp * 1000 - Date.now());
    return decoded.exp * 1000 > Date.now();
  };

  const [authorized, setAuthorized] = useState(checkAuthorization());

  return (
    <Route
      {...restProps}
      render={({ location }) => {
        return authorized ? (
          children
        ) : (
          <Redirect to={{ pathname: "/login", state: { from: location } }} />
        );
      }}
    />
  );
};

PrivateRoute.propTypes = {
  children: PropTypes.any,
};

export default PrivateRoute;
