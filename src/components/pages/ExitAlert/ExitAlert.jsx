import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sidebarDisable } from "../../../redux/reducer/landingReducer.jsx";
import StaticReusable from "../../reusable/StaticReusable/StaticReusable.jsx";

const ExitAlert = ({ direction }) => {
  const dispatch = useDispatch();
  const firstIndex = useSelector((state) => state?.landing?.firstIndex);

  useEffect(() => {
    dispatch(sidebarDisable());
  }, []);

  return (
    <>
      <StaticReusable
        alert=""
        alertType="Logout"
        heading={"Signout?"}
        Description={"Do you really want to exit from the app?.."}
        ButtonTextArray={["Yes", "No"]}
        totalButtons={2}
        direction={direction || firstIndex || "home-list"}
      />
    </>
  );
};

export default ExitAlert;
