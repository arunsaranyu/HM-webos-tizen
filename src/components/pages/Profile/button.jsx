import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import React from "react";
import "./Profile.scss";

const Button = (props) => {
  const { onEnterPress, onEnter, text, each } = props;
  const { ref, focused } = useFocusable({ onEnterPress });

  const onClickhandler = () => {
    onEnter(each);
  };
  return (
    <button
      id="profileButton"
      ref={ref}
      onClick={onClickhandler}
      className={focused ? "button-focused" : "button"}
      type="button"
    >
      {text}
    </button>
  );
};

export default Button;
