import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Input.scss";
import Checkbox from "./Checkbox";
import uniqid from "uniqid";

const Input = (props) => {
  const { type, left, className, mode, id, label, ...restProps } = props;
  const [hidden, setHidden] = useState(true);
  const myId = id || uniqid("input-");
  const classNames = [
    "Input__el",
    `Input__mode-${mode || "default"}`,
    className,
  ];

  return (
    <div className="Input">
      {left}
      <div
        className="Input__container"
        style={{ marginLeft: left !== undefined ? 16 : 0 }}
      >
        <label htmlFor={myId} className="Input__hidden-label">
          {label || restProps.placeholder}
        </label>
        <input
          id={myId}
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
  mode: PropTypes.oneOf(["default", "error"]),
  id: PropTypes.string,
  label: PropTypes.string,
};

export default Input;
