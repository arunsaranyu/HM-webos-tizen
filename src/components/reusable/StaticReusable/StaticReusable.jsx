import React, { useEffect } from "react";
import { sidebarDisable } from "../../../redux/reducer/landingReducer.jsx";
import "./StaticReusable.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import {
  access_token,
  auth_token,
  getAuthToken,
  session_Id,
} from "../../../assets/constant/index.jsx";
import { signout } from "../../../redux/reducer/loginReducer.jsx";
import { useNavigate, useParams } from "react-router-dom";

const StaticReusable = ({
  alert,
  alertType,
  image = "",
  heading,
  Description,
  totalButtons = 1,
  ButtonTextArray = [],
  direction,
  from,
  reloadApp = "",
  closeApp,
  cancelClose = "",
  networkStatus = false
}) => {
  const dispatch = useDispatch();
  const firstIndex = useSelector((state) => state?.landing?.firstIndex);
  const targetDirection = direction === "home-list" || !direction ? (firstIndex || "home-list") : direction;

  const { focusKey, focusSelf } = useFocusable();

  useEffect(() => {
    dispatch(sidebarDisable());
    focusSelf();
  }, [focusSelf]);

  var ButtonsArray = [];

  for (let i = 0; i < totalButtons; i++) {
    ButtonsArray.push(i);
  }

  return (
    <FocusContext.Provider value={focusKey}>
      <div className="main_banner">
        <div className="alerts">
          <p>{alert}</p>
          <h1 style={{ width: "auto" }}>{alertType}</h1>
        </div>
        <div className="Details">
          {image != "" ? <img src={image} alt="" /> : ""}
          <h1>{heading}</h1>
          <p>{Description}</p>
          <div className="ButtonsDisplay">
            {ButtonsArray?.map((_, i) => (
              <Button buttonText={ButtonTextArray[i]} direction={targetDirection} from={from} reloadApp={reloadApp} closeApp={closeApp} cancelClose={cancelClose} networkStatus={networkStatus} />
              // <button>{ButtonTextArray[i]}</button>
            ))}
          </div>
        </div>
      </div>
    </FocusContext.Provider>
  );
};

export default StaticReusable;

const Button = ({ buttonText, direction, from, reloadApp, closeApp, cancelClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const firstIndex = useSelector((state) => state?.landing?.firstIndex);
  const targetDirection = direction === "home" || !direction ? (firstIndex || "home") : direction;
  const url = window.location.href.split("#/").pop()
  const { ref, focused } = useFocusable({
    onEnterPress: () => {
      if (from === "delete") {
        if (buttonText === "Yes") {
          var details = {
            auth_token: getAuthToken(),

          };
          dispatch(signout(details));
          localStorage.clear();
          navigate(`/${targetDirection}`);
        }
        else {

          navigate(`/profile`);
        }
      } else if (buttonText === "No" || buttonText == "Go Back" || buttonText == "Cancel") {
        navigate(-1);
      } else if (buttonText === "Login") {
        navigate(`/${targetDirection}`);
      } else if (buttonText === "Exit") {

        closeApp()
      } else if (buttonText === "home") {
        navigate(`/${targetDirection}`)
        cancelClose()
      } else if (buttonText === "Retry") {
        navigate(url);
        reloadApp != "" ? reloadApp() : cancelClose();
      } else {
        navigate(`/${targetDirection}`);
        reloadApp != "" ? reloadApp() : cancelClose()
      }
    },
  });

  return (
    <button
      ref={ref} className={focused ? 'button-pop-focused' : 'button-pop'}
      onClick={() => {
        navigate(`/${targetDirection}`)
        reloadApp != "" ? reloadApp() : ""
        cancelClose != "" ? cancelClose() : ""
      }}
    >
      {buttonText}
    </button>
  );
};
