import React from "react";
import "./Register.scss";
import Input from "../../common/components/Input";
import PropTypes from "prop-types";
import Icon from "../../common/components/Icon";
import UserIcon from "../../assets/img/icon-user.svg";
import PasswordIcon from "../../assets/img/icon-password.svg";
import Button from "../../common/components/Button";
import FormStatus from "../../common/components/FormStatus";
import { connect } from "react-redux";
import { register } from "./authSlice";
import { Redirect } from "react-router-dom";

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.register = this.register.bind(this);

    this.state = {
      email: "",
      password: "",
    };
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  validateEmail(email) {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email
    );
  }

  register() {
    const { email, password } = this.state;

    console.log(email, password);
    this.props.register(email, password);
  }

  render() {
    const { status, error } = this.props;
    const { email, password } = this.state;

    return (
      <div className="Register">
        {status === "success" && <Redirect to="/" />}
        <div className="Register__container">
          <div className="Register__title">
            <div className="Register__title-box" />
            <div className="Register__title-text">Регистрация</div>
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
          <div className="Register__button-container">
            <Button
              mode="primary"
              disabled={status !== "idle"}
              onClick={this.register}
            >
              Создать аккаунт
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  status: PropTypes.string,
  error: PropTypes.string,
  register: PropTypes.func,
};

const mapStateToProps = (state) => ({
  error: state.auth.error,
  status: state.auth.status,
});

const mapDispatchToProps = (dispatch) => ({
  register: (email, password) => {
    dispatch(register({ email, password }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
