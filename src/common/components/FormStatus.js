import React from "react";
import PropTypes from "prop-types";
import "./FormStatus.scss";

const FormStatus = (props) => {
  const { mode, children, className, ...restProps } = props;
  const classNames = [
    "FormStatus",
    `FormStatus__${mode || "default"}`,
    className,
  ];

  return (
    <div className={classNames.join(" ")} {...restProps}>
      {children}
    </div>
  );
};

FormStatus.propTypes = {
  mode: PropTypes.oneOf(["default", "error"]),
  children: PropTypes.any,
  className: PropTypes.string,
};

export default FormStatus;
