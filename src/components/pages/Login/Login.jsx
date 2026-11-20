import React, { useCallback, useEffect, useRef, useState } from "react";
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useDispatch, useSelector } from "react-redux";

// --import images  ---
import icon_error from "../../../assets/images/icon_error.png";


import InputField from "../../reusable/InputField/InputField.jsx";

import "./login.scss";
// import { SignIndata, incorrectphoneToast, userPhoneNumber } from '../../../Redux/reducer/signInReducer.jsx';
import { useNavigate } from "react-router-dom";
import LoginButton from "./Loginbutton.jsx";
import { sidebarDisable } from "../../../redux/reducer/landingReducer.jsx";
import LoginInput from "./LoginInput.jsx";
import { getAuthToken } from "../../../assets/constant/index.jsx";
import {
  getloginwithnumber,
  setPhoneNumber,
  setOtpScreen,
  resetState
} from "../../../redux/reducer/loginReducer.jsx";
import { getAppConfig } from "../../../redux/reducer/commonReducer.jsx";
import Toast from "../../../helper/Toasty.jsx";
import OtpPage from "../OtpPage/OtpPage.jsx";
// import Alert from '../../../helpers/modals/Alert.jsx';

const Login = () => {
  const { ref, focusKey, focusSelf } = useFocusable({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otppopup, setOtppopup] = useState(false);
  const inputFocus = useRef(null);
  useEffect(() => {
    dispatch(sidebarDisable());
    dispatch(getAppConfig());
    // dispatch(getregiondata())
    dispatch(setOtpScreen())
    dispatch(resetState())
  }, []);

  const [moblieNumber, setMobileNumber] = useState("");
  const regionData = useSelector((state) => state?.common?.data);
  const appConfigData = useSelector((state) => state?.common?.appConfig)

  const logoutToast = useSelector((state) => state?.SignIn?.logoutToast);
  const OtpScreen = useSelector((state) => state?.login?.otpScreen)
  const unregisteredErrorStatus = useSelector((state) => state?.login?.unregisteredErrorStatus)
  const errormessage = useSelector((state) => state?.login?.errormessage)
  const phonenumberToast = useSelector(
    (state) => state?.SignIn?.phonenumberToast);
  const [toast, setToast] = useState(false)

  const onEnterInlogin = () => {
    // console.log(
    //   "enter",
    //   moblieNumber,
    //   regionData?.region?.max_digits,
    //   moblieNumber?.region?.length
    // );
    if (regionData?.region?.max_digits == moblieNumber?.length) {
      const indianPhoneRegex = /^[6-9]\d{9}$/;
      const validationPhoneNumber = indianPhoneRegex.test(moblieNumber);
      if (validationPhoneNumber) {
        localStorage.setItem(
          "number",
          `${regionData?.region?.calling_code.slice(2, 4)}${moblieNumber}`
        );
        const mobile = `${regionData?.region?.calling_code}${moblieNumber}`;
        const userdata = {
          // access_token: access_token,
          auth_token: getAuthToken(),
          region: localStorage.getItem("region"),
          type: "msisdn",
          user_id: mobile,
        };
        dispatch(resetState())
        dispatch(setPhoneNumber(mobile));
        dispatch(getloginwithnumber(userdata));
        // setOtppopup(true)
        // navigate("/Otp");
      } else {
        setToast(true)
      }
    } else {
      setToast(true)
    }
  };
  useEffect(() => {
    focusSelf();
    setToast(false)
  }, [focusSelf, moblieNumber]);

  const onRowFocus = useCallback(
    ({ y }) => {
      if (!!ref.current) {
        ref.current.scrollTop = y;
      }
    },
    [ref]
  );

  return (
    <FocusContext.Provider value={focusKey}>
      {OtpScreen == true ? <OtpPage /> : (
        <div className="backgroundcolor">
          <div
            className="parent-container-login"
            style={{
              backgroundImage: `url(${appConfigData?.params_hash2?.config_params?.tv_login_bg_image})`,
              backgroundRepeat: "no-repeat",
              paddingTop: "7.6%",
            }}
          >
            <div className="background-signin">
              <div className="login-container">
                <h3>Welcome To</h3>
                <h1>ETV WIN</h1>
                <h2>
                  Watch your favourite Movies, Live TV, Channels, Web Series, TV
                  Show online{" "}
                </h2>
                <h5 for="mobile">Mobile Number *</h5>
                <div className="phonenumber-container">
                  {/* <div className='country-code'>
                    <p>+91</p>
                  </div> */}
                  <LoginInput
                    inputType="number"
                    maxLength={regionData?.region?.max_digits}
                    moblieNumber={moblieNumber}
                    setMobileNumber={setMobileNumber}
                    inputFocus={inputFocus}
                    onFocus={onRowFocus}
                  />
                </div>
                <div className="login-button-container">
                  <LoginButton
                    text={"GET OTP"}
                    onEnter={onEnterInlogin}
                    onEnterPress={() => onEnterInlogin()}
                  />
                  <p>
                    On click of "GET OTP" OTP will be sent to above mentioned
                    number
                  </p>
                </div>
              </div>
            </div>
          </div>
          {toast ?
            <Toast imgicon={icon_error} text={"Not a valid phone number"} backgroundcolor="#E6EFFA" bordercolor="red" /> : ""
          }
          {unregisteredErrorStatus ?
            <Toast imgicon={icon_error} text={errormessage} backgroundcolor="#E6EFFA" bordercolor="red" /> : ""
          }
        </div>)}
    </FocusContext.Provider>
  );
};

export default Login;