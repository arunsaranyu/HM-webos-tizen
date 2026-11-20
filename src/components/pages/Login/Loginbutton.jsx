
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import React from "react";
import "./login.scss";

const LoginButton = (props) => {
  const { onEnterPress, onEnter, text } = props;
  const { ref, focused } = useFocusable({ onEnterPress });

  const onClickhandler = () => {
    onEnter();
  };
  return (
    <button
      ref={ref}
      onClick={onClickhandler}
      className={focused ? "button-focused" : "button"}
      type="button"
    >
      {text}
    </button>
  );
};

export default LoginButton;
