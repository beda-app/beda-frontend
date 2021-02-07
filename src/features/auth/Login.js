import React from "react";
import "./SignIn.scss";
import UserIcon from "../../assets/img/icon-user.svg";
import PasswordIcon from "../../assets/img/icon-password.svg";
import Input from "../../common/components/Input";
import Icon from "../../common/components/Icon";
import Button from "../../common/components/Button";

class Login extends React.Component {
  render() {
    return (
      <div className="SignIn">
        <div className="SignIn__container">
          <div className="SignIn__title">
            <div className="SignIn__title-box" />
            <div className="SignIn__title-text">Вход на сайт</div>
          </div>
          <Input
            left={<Icon src={UserIcon} height={48} width={38} />}
            placeholder="Логин"
            type="text"
          />
          <Input
            left={<Icon src={PasswordIcon} height={48} width={38} />}
            placeholder="Пароль"
            type="password"
          />
          <div className="SignIn__button-container">
            <Button mode="primary">Войти</Button>
            <Button mode="secondary">Регистрация</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
