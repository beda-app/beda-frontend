import React from "react";
import PropTypes from "prop-types";
import "./Icon.scss";

const Icon = (props) => {
  const { height, width, src, className, style, ...restProps } = props;

  return (
    <img
      className={["Icon", className].join(" ")}
      src={src}
      style={{
        maxHeight: height,
        minHeight: height,
        maxWidth: width,
        minWidth: width,
        ...style,
      }}
      alt=""
      {...restProps}
    />
  );
};

Icon.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
  src: PropTypes.string,
};

export default Icon;
