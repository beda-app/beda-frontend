import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Input.scss";
import Checkbox from "./Checkbox";

const Input = (props) => {
  const { type, left, className, ...restProps } = props;
  const [hidden, setHidden] = useState(true);

  return (
    <div className="Input">
      {left}
      <div className="Input__container">
        <input
          className={["Input__el", className].join(" ")}
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
};

export default Input;
