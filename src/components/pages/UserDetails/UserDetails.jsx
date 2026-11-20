import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import React, { useCallback, useEffect, useState } from "react";
import "./UserDetails.scss";
import UserDetailsContent from "./UserDetailsContent.jsx";
import { useDispatch, useSelector } from "react-redux";
// import {getuserdetails ,deleteaccount} from "../../../Redux/reducer/signInReducer.jsx";
import { useNavigate } from "react-router-dom";

import Popup from "../../../helper/Popup.jsx";

import {
  DeleteUserAccount,
  getUserDetails,
} from "../../../redux/reducer/userReducer.jsx";
import { getUserPlans } from "../../../redux/reducer/plansreducer.jsx";

import { sidebarDisable, sidebarAllow, activeIndexSidebar } from "../../../redux/reducer/landingReducer.jsx";
import StaticReusable from "../../reusable/StaticReusable/StaticReusable.jsx";
import { access_token, auth_token, getAuthToken } from "../../../assets/constant/index.jsx";
import { setErrorMessageStatus, signout } from "../../../redux/reducer/loginReducer.jsx";

const UserDetails = () => {
  const [setpop, setpopup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ref, focusSelf, focusKey } = useFocusable({});
  const [isDeletePopupVisible, setDeletePopupVisible] = useState(false);
  const userData = useSelector((state) => state?.user?.data);

  // var userData = JSON.parse(localStorage.getItem("userDetails"));
  const userPlans = useSelector((state) => state?.plans?.userplans || state?.plans?.data);
  const userSubscribedTo = useSelector((state) => state?.user?.subscribedTo);
  const errormessagestaus = useSelector((state) => state?.login?.errorstatus);
  const firstIndexValue = useSelector((state) => state?.landing?.firstIndex);

  const getActivePlan = (sub) => {
    if (!sub) return null;
    const targets = [sub, sub?.data].filter(Boolean);

    for (const t of targets) {
      if (Array.isArray(t) && t.length > 0) {
        const item = t[0];
        if (item?.pack || item?.user_pack || item?.package) {
          return item.pack || item.user_pack || item.package;
        }
        return item;
      }

      const p = t?.pack || t?.user_pack || t?.current_pack || t?.active_pack || t?.package;
      if (p) {
        if (Array.isArray(p) && p.length > 0) return p[0];
        if (typeof p === "object") return p;
        if (typeof p === "string") return { title: p };
      }

      if (Array.isArray(t?.current_active_plans) && t.current_active_plans.length > 0) return t.current_active_plans[0];
      if (Array.isArray(t?.packs) && t.packs.length > 0) return t.packs[0];
      if (Array.isArray(t?.packages) && t.packages.length > 0) return t.packages[0];
      if (Array.isArray(t?.active_plans) && t.active_plans.length > 0) return t.active_plans[0];
      if (Array.isArray(t?.user_plans) && t.user_plans.length > 0) return t.user_plans[0];
      if (Array.isArray(t?.plans) && t.plans.length > 0) return t.plans[0];
    }

    if (typeof sub === "object" && sub !== null && !Array.isArray(sub)) {
      return sub;
    }

    return null;
  };

  const activePlan = getActivePlan(userPlans) || getActivePlan(userSubscribedTo) || getActivePlan(userData?.subscription) || getActivePlan(userData?.user_plans) || getActivePlan(userData);
  const userSubscription = activePlan?.subscription_title || activePlan?.pack_name || activePlan?.title || activePlan?.plan_title || activePlan?.package_name || activePlan?.name || userData?.subscription?.title || userData?.subscription?.plan_title || userData?.subscription_title || localStorage.getItem("user_plan");
  const expiresOn = activePlan?.valid_till_uts || activePlan?.valid_till || activePlan?.expiry_date || activePlan?.expires_on || activePlan?.end_date || activePlan?.subscription_end_date || userData?.subscription?.valid_till_uts || userData?.subscription?.valid_till || userData?.subscription?.expiry_date || userData?.valid_till_uts || userData?.valid_till || userData?.expiry_date;

  const formatMobile = (mobile) => {
    if (!mobile) return "NA";
    const str = String(mobile).trim();
    const digits = str.replace(/\D/g, "");
    if (digits.length >= 10) {
      return `+91 ${digits.slice(-10)}`;
    }
    return str || "NA";
  };

  const formatExpiryDate = (val) => {
    if (!val || val === "NA") return "NA";
    if (typeof val === "string" && isNaN(Number(val)) && !isNaN(Date.parse(val))) {
      try {
        const d = new Date(val);
        return d
          .toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
          .replace(/(\w+) (\d+), (\d+)/, (_, month, day, year) => `${parseInt(day)} ${month} ${year}`);
      } catch (e) {
        return val;
      }
    }
    const num = Number(val);
    if (isNaN(num) || num <= 0) return "NA";
    try {
      const ms = num < 10000000000 ? num * 1000 : num;
      const date = new Date(ms);
      if (isNaN(date.getTime())) return "NA";
      return date
        .toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
        .replace(/(\w+) (\d+), (\d+)/, (_, month, day, year) => `${parseInt(day)} ${month} ${year}`);
    } catch (e) {
      return "NA";
    }
  };

  const toggleDeletePopup = (each) => {
    if (each.text === "Logout") {
      setDeletePopupVisible(!isDeletePopupVisible);
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {

    focusSelf();
  }, [focusSelf]);

  useEffect(() => {
    dispatch(getUserPlans());
    dispatch(sidebarDisable());
    dispatch(setErrorMessageStatus(false));
    dispatch(getUserDetails());
  }, []);

  const buttonarray = [
    {
      text: "Back",
    },
    {
      text: "Logout",
    },
  ];
  const onSubmit = (confirm, navigate) => {

    if (confirm == "Yes") {
      var details = {
        auth_token: getAuthToken(),

      };

      const firstIndex = {
        firstIndex: firstIndexValue
      }
      dispatch(activeIndexSidebar(firstIndexValue))
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
      setDeletePopupVisible(false)
      navigate(-1)
    }
    else {
      // setSignOutPopup(false)
      setDeletePopupVisible(false)
      // dispatch(sidebarAllow())
    }
  };

  const onAssetFocus = useCallback(
    ({ x }) => {
      if (!!ref.current) {
        ref.current.scrollLeft = x;
      }
    },
    [ref]
  );
  return (
    <FocusContext.Provider value={focusKey}>
      {!isDeletePopupVisible ?
        <div className="main-card settings-card" style={{ marginLeft: "0" }}>
          <div className="setting-title">
            <h1 style={{ top: "14%" }}>My Profile</h1>
          </div>
          <div className="horizontal-line"></div>
          <div
            className="setting-content"
            style={{ position: "relative" }}
            ref={ref}
          >
            <div>
              <div className="user-input-container">
                <p style={{ color: "#FFFFFFDD" }}>Account Details</p>
                <p>
                  <label>Name</label> :{" "}
                  {userData?.firstname ? userData.firstname : "NA"}
                </p>
                <p>
                  <label>Mobile Number</label> :{" "}
                  {formatMobile(userData?.mobile_number)}
                </p>
                <p>
                  <label>Email Id</label> :{" "}
                  {userData?.email_id ? userData.email_id : "NA"}
                </p>
                <p>
                  <label>Age</label> :{" "}
                  {userData?.age && userData.age !== 0 ? userData.age : "NA"}
                </p>
                <p>
                  <label>Subscription :</label>{" "}
                  {userSubscription
                    ? userSubscription
                    : (userData?.isUserSubscribed ? "Active Subscription" : "Not Subscribed to any plan")}
                </p>


                <p>
                  <label>Expires on :</label>{" "}
                  {expiresOn && expiresOn !== "NA"
                    ? formatExpiryDate(expiresOn)
                    : "NA"}
                </p>

              </div>

            </div>
          </div>
        </div> :
        < Popup
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

export default UserDetails;
