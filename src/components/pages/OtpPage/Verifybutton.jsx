import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import React from "react";

const Verifybutton = (props) => {
  const { onEnterPress, onEnter } = props;
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
      Verify
    </button>
  );
};

export default Verifybutton;
