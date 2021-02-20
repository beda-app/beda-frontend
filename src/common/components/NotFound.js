import React from "react";
import "./NotFound.scss";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="NotFound">
    <div className="NotFound__container">
      <div className="NotFound__code">404</div>
      <div className="NotFound__description">Не найдено</div>
      <Link to={"/"} className="NotFound__back">
        На главную
      </Link>
    </div>
  </div>
);

export default NotFound;
