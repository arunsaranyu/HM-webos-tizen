import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import React from "react";

const SeasonButton = (props) => {
  const { data, onEnterPress, renderDetails, onFocus } = props;

  const { ref, focused } = useFocusable({ onEnterPress, onFocus });
  const onClickHandler = () => {
    renderDetails(data);
  };
  return (
    <div
      ref={ref}
      onClick={() => onClickHandler(data)}
      className={focused ? "season-button-focused" : "season-button"}
    >
      <p>{data.title}</p>
    </div>
  );
};

export default SeasonButton;
