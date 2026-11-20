import React, { useCallback, useEffect, useRef, useState } from "react";


import { useNavigate, useParams } from "react-router-dom";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { useDispatch, useSelector } from "react-redux";
import "./Profile.scss";
import plusIcon from "../../../assets/images/plus.png";

import Switch from "../../reusable/Switch/Switch.jsx";
import {
  DefaultProfile,
  ProfileList,
  UpdateProfile,
  setErrorMessageStatus,
} from "../../../redux/reducer/profileReducer.jsx";
import icon_error from "../../../assets/images/icon_error.png";
import Alert from '../../../helper/Alert.jsx';
import { onWatchHistoryFalse, sidebarDisable } from "../../../redux/reducer/landingReducer.jsx";
import { auth_token } from "../../../assets/constant/index.jsx";
import LoginInput from "../Login/LoginInput.jsx";
import LoginButton from "../Login/Loginbutton.jsx";
import Toast from "../../../helper/Toasty.jsx";
import Popup from "../../../helper/Popup.jsx";

const EditProfile = () => {
  const { ref, focusKey, focusSelf } = useFocusable({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputFocus = useRef(null);
  const [value, setValue] = useState(false);
  const [moblieNumber, setMobileNumber] = useState("");
  const { id } = useParams();
  const [profileName, setProfileName] = useState("");
  const [disable, setDisable] = useState(false);
  const [invalid, setInvalid] = useState(false);
  // const firstIndexValue=useSelector((state)=>state?.landing?.)
  const firstIndexValue = useSelector((state) => state?.landing?.firstIndex)
  useEffect(() => {
    dispatch(sidebarDisable());
    dispatch(setErrorMessageStatus(false))
    const link = {
      id: id,
      navigate: undefined,
      firstIndex: undefined,
    }
    dispatch(DefaultProfile(link));
    dispatch(onWatchHistoryFalse())
  }, []);
  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  const onRowFocus = useCallback(
    ({ y }) => {
      if (!!ref.current) {
        ref.current.scrollTop = y;
      }
    },
    [ref]
  );
  const defaultData = useSelector((state) => state?.profile?.defaultData);
  const errormessagestaus = useSelector((state) => state?.profile?.errorstatus);
  const appConfigData = useSelector((state) => state?.common?.appConfig)
  const firstIndex = useSelector((state) => state?.landing?.firstIndex)

  useEffect(() => {
    if (defaultData) {
      setProfileName(defaultData.firstname);
      if (defaultData.child != null)
        setValue(defaultData.child);
      else {
        setValue(false)
      }
      if (defaultData.profile_type == "admin") {
        setDisable(true)
      }
      else {
        setDisable(false)
      }
    }
  }, [defaultData]);

  const handleClick = () => {
    if (profileName != "" && profileName != null) {
      const newprofileData = {
        firstname: profileName,
        child: String(value),
        // access_token: access_token,
        auth_token: getAuthToken(),
        profile_id: String(id),
      };

      dispatch(UpdateProfile({ newprofileData, navigate }));
    }
    else {
      setInvalid(true)
      setTimeout(() => {
        setInvalid(false);
      }, 4000);
    }
  };

  const onSubmit = (confirm) => {

    if (confirm === "Login") {
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
      navigate(`/${firstIndexValue}`)
    }
  }
  return (
    <FocusContext.Provider value={focusKey}>
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
              <h3>Edit</h3>
              <h1 style={{ fontWeight: "bold" }}>Update Profile</h1>
              <h2>You can create upto 5 different profiles</h2>

              <h5 for="mobile">Profile Name *</h5>
              <div className="phonenumber-container">
                {/* <InputField
                    id={"mobile"}
                    width={"130%"}
                    value={profileName}
                    setvalue={setProfileName}
                    type={"text"}
                    inputFocus={inputFocus}
                    // placeholder={"eg John Doe"}
                    focusedbackgroundcolor={"#454B52"}
                    unfocusedbackgroundcolor={"#2A2E32"}
                    from={"login"}
                    onFocus={onRowFocus}
                    maxLength={10}
                  /> */}
                <LoginInput
                  inputType={"text"}
                  inputFocus={inputFocus}
                  onFocus={onRowFocus}
                  moblieNumber={profileName}
                  setMobileNumber={setProfileName}
                  maxLength={200}
                />
              </div>
              {
                disable == false &&
                <div className="switch-container">
                  <h3 style={{ width: '40%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>Parental Control?</h3>
                  <Switch
                    ref={ref}
                    onColor="linear-gradient(180deg, #4E5766 0%, #272C33 100%)"
                    isOn={value}
                    handleToggle={() => {
                      if (disable == false) {
                        setValue(!value)
                      }
                    }}
                    onEnter={() => {
                      if (disable == false) {
                        setValue(!value)
                      }
                    }}
                    onEnterPress={() => {
                      if (disable == false) {
                        setValue(!value)
                      }
                    }}
                    disable={disable}
                  />
                </div>}
              {/* <div>
                    <button className={"buttonProfile"} type='button' style={{top:'50%'}} onClick={() => handleClick()}>Edit</button>
                </div> */}
              <div className='p_login'>
                {/* <button className={"buttonProfile"} type='button' style={{top:'50%'}} onClick={() => handleClick()}>Create</button> */}
                <LoginButton
                  text={"Update"}
                  onEnter={handleClick}
                  onEnterPress={() => handleClick()}
                />
              </div>
            </div>
          </div>
        </div>
        {invalid &&
          <Toast imgicon={icon_error} text={"Please enter name"} backgroundcolor=" #E6FAEB" bordercolor="#3FC063" />
        }
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
      </div>
    </FocusContext.Provider>
  );
};

export default EditProfile;