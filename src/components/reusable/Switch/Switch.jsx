import React from "react";
import "./Switch.scss";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";

const Switch = ({ isOn, handleToggle, onColor ,onEnterPress,onEnter,disable}) => {
  const {ref,focused}=useFocusable({onEnterPress})
  const focusStyle = focused ? {border:'2px solid #F5841F'} :{};
  const switchStyle = disable? { opacity: 0.5, cursor: "not-allowed" } : {};
  return (
    <label style={{ ...focusStyle,...switchStyle,background: isOn && onColor }} className="react-switch" ref={ref}>
      <input
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"
        type="checkbox"
        disabled={disable==true?"disabled":""}
      />
      <div className={focused ? "react-switch-buttonfocused":"react-switch-button"} />
      <div className="react-switch-labels">
        <span>OFF</span>
        <span>ON</span>
      </div>
    </label>
  );
};

export default Switch;
