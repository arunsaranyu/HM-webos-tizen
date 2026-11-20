import React, { useCallback, useEffect, useRef, useState } from "react";
import termsIcon from "../../../assets/images/icon_termsOfUse.png";
import privacyIcon from "../../../assets/images/icon_privacyPolicy.png";
import profile from "../../../assets/images/icon_account.png";
import logout from "../../../assets/images/icon_logout.png";
import Watchlist from "../../../assets/images/icon_myList.png";
import plans from "../../../assets/images/icon_plans.png";
import contactUsIcon from "../../../assets/images/icon_contactUs.svg";
import refundPolicyIcon from "../../../assets/images/icon_refundPolicy.svg";
import SettingsCard from "./SettingsCard.jsx";
import { useNavigate } from "react-router-dom";
import refundIcons from "../../../assets/images/icon_refundPolicy.svg"
import about_us from "../../../assets/images/about_us.png"
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import "./Settings.scss";
import { useDispatch, useSelector } from "react-redux";
import { SidebarDisable, activeIndexSidebar, sidebarAllow, sidebarDisable, sidebarToggleFalse, sidebarToggleTrue } from "../../../redux/reducer/landingReducer.jsx";
import { auth_token, getAuthToken, session_Id } from "../../../assets/constant/index.jsx";
import { setErrorMessageStatus, signout } from "../../../redux/reducer/loginReducer.jsx";
import Popup from "../../../helper/Popup.jsx";
import Toast from "../../../helper/Toasty.jsx";
import icon_error from "../../../assets/images/icon_error.png";
import { sidebarFocused } from "../../../redux/reducer/sidebarReducer.jsx";
const Settings = () => {

  const { ref, focusSelf, focusKey } = useFocusable({});
  const [popup, setpopup] = useState(false)
  const [signOutPopup, setSignOutPopup] = useState(false);
  const scrollingRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  dispatch(sidebarAllow())
  const sidebartoggole = useSelector((state) => state?.common?.sidebartoggle)
  const errormessagestaus = useSelector((state) => state?.login?.errorstatus)

  const onAssetFocus = useCallback(
    ({ x }) => {
      if (!!scrollingRef.current) {
        scrollingRef.current.scrollLeft = x;
      }
    },
    [scrollingRef]
  );


  const siginReducer = useSelector((state) => state.SigIn)
  const firstIndexValue = useSelector((state) => state?.landing?.firstIndex)
  const lastfocused = useSelector((state) => state?.sidebar?.sidebarFocuseKey)
  useEffect(() => {

  }, [siginReducer])

  const settingCard = [
    {
      Icon: plans,
      Name: "Plans",
      to: "plans",
    },
    {
      Icon: termsIcon,
      Name: "Terms and Conditions",
      to: "terms-and-conditions",
    },
    {
      Icon: privacyIcon,
      Name: "Privacy Policy",
      to: "privacy-policy",
    },
    {
      Icon: about_us,
      Name: "About Us",
      to: "about-us",
    },
    {
      Icon: refundPolicyIcon,
      Name: "Refund Policy",
      to: "refund-policy",
    },
    {
      Icon: contactUsIcon,
      Name: "Contact Us",
      to: "contact-us",
    },


  ];

  if (localStorage.getItem("session_id") !== null && localStorage.getItem("session_id") !== undefined) {
    settingCard.unshift({
      Icon: profile,
      Name: "My Profile",
      to: "profile",
    })
    settingCard.push({
      Icon: logout,
      Name: "Logout",
      to: "Login",
    },)

    settingCard.splice(2, 0, {
      Icon: Watchlist,
      Name: "My List",
      to: "watchlater",
    },)
  }
  else if (localStorage.getItem("session_id") === null) {

    settingCard.unshift({
      Icon: logout,
      Name: "Login",
      to: "activate",
    })
  }


  const onClickOfLogout = (button) => {
    console.log(button)
    if (button === "YES") {
      dispatch(signout(navigate))
      logoutapp(localStorage.getItem("user_id"))
    }
    else {
      setpopup(false)
    }


  }
  useEffect(() => {
    dispatch(setErrorMessageStatus(false))
    dispatch(activeIndexSidebar(window.location.hash.slice(2)))
  }, [])
  const redirection = (card) => {
    if (card.Name === "Logout") {
      // navigate('/exit')
      setSignOutPopup(true)
      dispatch(sidebarDisable())
    } else if (card.Name === "WatchLater") {

      navigate(`/${card.to}`)
    }

    else if (
      card.Name === "Contact Us" || card.to === "contact-us" || card.to === "Contact_us" ||
      card.Name === "Privacy Policy" || card.to === "privacy-policy" || card.to === "Privacy_Policy" ||
      card.Name === "Terms and Conditions" || card.to === "terms-and-conditions" || card.to === "Terms_and_Conditions" ||
      card.Name == "Content Redressal Mechanism" ||
      card.Name === "About Us" || card.to === "about-us" || card.to === "About_us" ||
      card.Name === "Refund Policy" || card.to === "refund-policy" || card.to === "Refund_Policy"
    ) {

      navigate(`/static-page/${card.to}`)

    }
    else if (card.Name === "Login") {
      navigate('/activate')

    }
    else if (card.Name === 'My Profile') {
      const sessionId = localStorage.getItem("session_id");
      if (sessionId !== null && sessionId !== undefined && sessionId !== "") {
        navigate(`/${card.to}`)
      }
      else {
        navigate('/loginManditory')
      }
    }
    else {
      navigate(`/${card.to}`)
    }
  };
  dispatch(sidebarFocused("settings"))
  useEffect(() => {
    focusSelf();
  }, [focusSelf, lastfocused]);

  const onSubmit = (confirm, navigate) => {

    if (confirm == "Logout") {
      var details = {
        auth_token: getAuthToken(),

      };
      const firstIndex = {
        firstIndex: firstIndexValue
      }

      dispatch(signout({ details, navigate, firstIndex }));

    }
    else if (confirm === "Login") {

      localStorage.removeItem("session_id")
      localStorage.removeItem("image_url")
      localStorage.removeItem("sidebarProfileName")
      dispatch(setErrorMessageStatus(false))
      navigate('/activate')
    }
    else if (confirm === "Continue without login") {

      dispatch(setErrorMessageStatus(false))
      localStorage.removeItem("session_id")
      localStorage.removeItem("image_url")
      localStorage.removeItem("sidebarProfileName")
    }
    else {
      setSignOutPopup(false)
      dispatch(sidebarAllow())
    }
  };

  return (

    <FocusContext.Provider value={focusKey}>
      {!signOutPopup ? <div className="main-card">
        <div className="parent-container">
          <div style={{ position: "relative" }} className="settings-container  m-top-15">
            <div className="card-wrapper setting-container">
              <div className="row mt-2 mb-2">
                <div className="col-lg-12">
                  <div className="row-title" style={{ paddingLeft: '1%', fontWeight: '600' }}>Settings</div>
                </div>
              </div>
              <div className="row mt-2 mb-2">
                <div className="col-lg-12">
                  <div className="card-block" ref={scrollingRef}>
                    <div className="card-content" ref={ref}>
                      {settingCard.map((card, i) => {
                        return (
                          <SettingsCard
                            key={i}
                            card={card}
                            onFocus={onAssetFocus}
                            onEnterPress={() => {
                              redirection(card);
                            }}
                            redirection={redirection}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <h1 class="versionclass">Version:1.1.0</h1>
            </div>
          </div>

        </div>

      </div> :
        <Popup
          alert="Alert"
          alertType="Logout"
          heading="Action Required!"
          Description="Are you sure you want to logout?"
          from={"signout"}
          onSubmit={onSubmit}

        />}
      {
        localStorage.getItem("session_id") != null && localStorage.getItem("session_id") != undefined && errormessagestaus == true ?
          <Popup
            alert=""
            alertType="Session Alert"
            heading="Session Expired"
            Description="You have logged out from your device,please login again to continue."
            from={"session"}
            onSubmit={onSubmit}
          /> : ""
      }
    </FocusContext.Provider>
  );
};

export default Settings;
