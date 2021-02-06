import React from "react";
import PropTypes from "prop-types";
import "./Checkbox.scss";

const Checkbox = (props) => {
  const { label, className, ...restProps } = props;

  return (
    <label className={["Checkbox", className].join(" ")}>
      {label}
      <input type="checkbox" className="Checkbox__el" {...restProps} />
      <span className="Checkbox__checkmark" />
    </label>
  );
};

Checkbox.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
};

export default Checkbox;
