import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Input.scss";
import Checkbox from "./Checkbox";

const Input = (props) => {
  const { type, left, className, mode, ...restProps } = props;
  const [hidden, setHidden] = useState(true);
  const classNames = [
    "Input__el",
    `Input__mode-${mode || "default"}`,
    className,
  ];

  return (
    <div className="Input">
      {left}
      <div className="Input__container">
        <input
          className={classNames.join(" ")}
          type={type === "password" && !hidden ? "text" : type}
          {...restProps}
        />
        {type === "password" && (
          <Checkbox
            className="Input__show-password"
            onClick={() => setHidden(!hidden)}
            label="Показать пароль"
          />
        )}
      </div>
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  left: PropTypes.element,
  className: PropTypes.string,
  mode: PropTypes.oneOf("default", "error"),
};

export default Input;
