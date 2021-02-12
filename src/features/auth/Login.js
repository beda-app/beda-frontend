import React from "react";
import "./Login.scss";
import UserIcon from "../../assets/img/icon-user.svg";
import PasswordIcon from "../../assets/img/icon-password.svg";
import Input from "../../common/components/Input";
import Icon from "../../common/components/Icon";
import Button from "../../common/components/Button";
import PropTypes from "prop-types";
import { withRouter, Redirect } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { login } from "./authSlice";

import FormStatus from "../../common/components/FormStatus";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.login = this.login.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      email: "",
      password: "",
    };
  }

  login() {
    const { email, password } = this.state;
    if (!this.validateEmail(email) || !password) return;
    this.props.login(email, password);
  }

  validateEmail(email) {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email
    );
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    const { history, status, error } = this.props;
    const { email, password } = this.state;

    return (
      <div className="Login">
        {status === "success" && <Redirect to="/dashboard" />}
        <div className="Login__container">
          <div className="Login__title">
            <div className="Login__title-box" />
            <div className="Login__title-text">Вход на сайт</div>
          </div>
          {error !== undefined && <FormStatus mode="error">{error}</FormStatus>}
          <Input
            left={<Icon src={UserIcon} height={48} width={38} />}
            placeholder="E-Mail"
            type="text"
            name="email"
            disabled={status !== "idle"}
            value={email}
            onChange={this.handleInputChange}
            mode={!email || this.validateEmail(email) ? "default" : "error"}
          />
          <Input
            left={<Icon src={PasswordIcon} height={48} width={38} />}
            placeholder="Пароль"
            type="password"
            name="password"
            disabled={status === "pending"}
            value={password}
            onChange={this.handleInputChange}
            mode={password && password.length < 8 ? "error" : "default"}
          />
          <div className="Login__button-container">
            <Button
              mode="primary"
              onClick={this.login}
              disabled={status !== "idle"}
            >
              Войти
            </Button>
            <Button
              mode="secondary"
              onClick={() => history.push("/register")}
              disabled={status !== "idle"}
            >
              Регистрация
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.any,
  status: PropTypes.string,
  error: PropTypes.string,
  login: PropTypes.func,
};

const mapStateToProps = (state) => ({
  error: state.auth.error,
  status: state.auth.status,
});

const mapDispatchToProps = (dispatch) => ({
  login: (email, password) => {
    dispatch(login({ email, password }));
  },
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Login);
