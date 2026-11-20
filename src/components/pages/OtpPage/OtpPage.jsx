import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { useDispatch, useSelector } from "react-redux";
// -images--
import icon_error from "../../../assets/images/icon_error.png";

// import {  SignIndata, veriftyOtpdata } from '../../../Redux/reducer/signInReducer.jsx';
import { useNavigate } from "react-router-dom";

import Resendbutton from "./Resendbutton.jsx";
import Verifybutton from "./Verifybutton.jsx";
import Loader from "../../../helper/Loader.jsx";
import { sidebarDisable } from "../../../redux/reducer/landingReducer.jsx";
import LoginInput from "../Login/LoginInput.jsx";
import { getAuthToken } from "../../../assets/constant/index.jsx";
import {
  getloginwithnumber,
  getverifytoken,
  otpverify,
} from "../../../redux/reducer/loginReducer.jsx";
import Alert from "../../../helper/Alert.jsx";
import Toast from "../../../helper/Toasty.jsx";
const OtpPage = () => {
  const { ref, focusSelf, focusKey } = useFocusable({});
  const [otp, setOtp] = useState();
  const [seconds, setSeconds] = useState(120);
  const [alertotp, setalertotp] = useState(false);
  const [resendvalidation, setresendvaliation] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const phoneNumber = useSelector((state) => state?.login?.phonenumber);
  const generateOtp = useSelector((state) => state?.login?.generateOtp);
  const regionData = useSelector((state) => state?.common?.data);
  const appConfigData = useSelector((state) => state?.common?.appConfig)
  const otpdata = useSelector((state) => state?.login?.data);
  const otpToast = useSelector((state) => state?.login?.generateOtp)

  const errormessage = useSelector((state) => state?.login?.errormessage)
  const errormessagestaus = useSelector((state) => state?.login?.errorstatus)

  const loader = useSelector((state) => state?.SignIn?.loader);
  // const regiondata = useSelector((state)=>state?.Common?.getregiondata)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(sidebarDisable());
  }, []);
  useEffect(() => {
    focusSelf();
    setInvalid(false);
  }, [focusSelf, otp]);
  const inputFocus = useRef(null);
  useEffect(() => {
    if (!!generateOtp) {
      const timer = setInterval(() => {
        if (seconds == 0) {
          clearInterval(timer);
          setresendvaliation(true);
        } else {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [generateOtp, seconds]);

  const onEnterInVerify = () => {
    const otpVerifyData = {
      // access_token: access_token,
      auth_token: getAuthToken(),
      user: {
        action: "signin",
        key: otp,
        region: localStorage.getItem("region"),
        type: "msisdn",
        user_id: phoneNumber,
      },
    };
    dispatch(otpverify({ otpVerifyData, navigate }));
  };


  const onEnterInResend = () => {

    const userdata = {
      // access_token: access_token,
      auth_token: getAuthToken(),
      region: localStorage.getItem("region"),
      type: "msisdn",
      user_id: phoneNumber,
    };
    setresendvaliation(false);
    setSeconds(120);
    dispatch(getloginwithnumber(userdata));
  };
  useEffect(() => { }, [seconds]);

  const onRowFocus = useCallback(
    ({ y }) => {
      if (!!ref.current) {
        ref.current.scrollTop = y;
      }
    },
    [ref]
  );

  function formatPhoneNumber(number) {
    const firstThreeDigits = number.slice(0, 3);
    const nextThreeDigits = number.slice(3, 6);
    const lastFourDigits = number.slice(6);

    return `${firstThreeDigits} ${nextThreeDigits} ${lastFourDigits}`;
  }

  return (
    <FocusContext.Provider value={focusKey}>
      {loader === true ? (
        <Loader />
      ) : (
        <div className="backgroundcolor">
          <div
            className="parent-container-login"
            style={{
              backgroundImage: `url(${appConfigData?.params_hash2?.config_params?.tv_login_bg_image})`,
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="background-signin">
              <div className="login-container">
                {/* <h5>{otpdata?.otp}</h5> */}
                <h3>We have sent the OTP to your number</h3>
                <h1>{"+91  " + phoneNumber.slice(4)}</h1>
                <h2>
                  Please enter the verification code sent to above number!
                </h2>
                <h5 for="otp">OTP</h5>
                <div>
                  <LoginInput
                    inputType="number"
                    moblieNumber={otp}
                    maxLength={6}
                    setMobileNumber={setOtp}
                    from={"otp"}
                    inputFocus={inputFocus}
                    onFocus={onRowFocus}
                  />
                  {/* <InputField
                id={"otp"}
                 width={"100%"}
                  value={otp}
                  setvalue={setOtp}
                  type={"number"}
                  onEnterInlogin={""}
                  inputFocus={inputFocus}
                  placeholder={"Enter 4 digit code here"}
                  focusedbackgroundcolor={"#454B52"}
                  unfocusedbackgroundcolor={"#2A2E32"}
                  from={"otp"}
               
                  onFocus={onRowFocus}
                  maxLength={4}
                /> */}
                </div>
                <div className="login-button-container">
                  <Verifybutton
                    onEnter={onEnterInVerify}
                    onEnterPress={() => onEnterInVerify()}
                  />

                  <div className="spacebetweenbutton"></div>
                  {resendvalidation === false ? (
                    <div className="timer">{seconds} sec</div>
                  ) : (
                    <Resendbutton
                      onEnter={onEnterInResend}
                      onEnterPress={() => onEnterInResend()}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          {errormessagestaus == true ?
            <Toast imgicon={icon_error} text={errormessage?.message.includes("User params are missed") ? "Enter valid OTP" : errormessage?.message} backgroundcolor="#E6EFFA" bordercolor="red" from="otppage" /> : ""
          }
          {otpToast?.success?.status_code == "200" || otpToast?.status_code == "200" ?
            <Toast imgicon={icon_error} text={"Otp sent successfully to the registered account"} backgroundcolor="#E6EFFA" bordercolor="red" /> : ""
          }
        </div>
      )}
    </FocusContext.Provider>
  );
};

export default OtpPage;