import React, { useCallback, useEffect, useRef, useState } from 'react'


import { useNavigate } from 'react-router-dom';
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import { useDispatch, useSelector } from 'react-redux';
import './Profile.scss';
import plusIcon from "../../../assets/images/plus.png";

import Switch from '../../reusable/Switch/Switch.jsx';
import { ProfileList, createProfile, setErrorMessageStatus } from '../../../redux/reducer/profileReducer.jsx';

import { sidebarDisable } from '../../../redux/reducer/landingReducer.jsx';
import { auth_token, getAuthToken } from '../../../assets/constant/index.jsx';
import LoginInput from '../Login/LoginInput.jsx';
import LoginButton from '../Login/Loginbutton.jsx';
import Toast from '../../../helper/Toasty.jsx';
import icon_error from "../../../assets/images/icon_error.png";
import Alert from '../../../helper/Alert.jsx';
import { onClicked } from '../../../redux/reducer/commonReducer.jsx';


const CreateProfile1 = () => {
  const { ref, focusKey, focusSelf } = useFocusable({})
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const inputFocus = useRef(null)
  const [value, setValue] = useState(false);
  const [name, setName] = useState("")
  const [profileName, setProfileName] = useState("");
  const [invalid, setInvalid] = useState(false);
  const errormessagestaus = useSelector((state) => state?.profile?.errorstatus)
  const appConfigData = useSelector((state) => state?.common?.appConfig)
  const firstIndexValue = useSelector((state) => state?.landing?.firstIndex)
  useEffect(() => {
    dispatch(sidebarDisable())
    dispatch(setErrorMessageStatus(false))
  }, [])
  useEffect(() => {
    focusSelf()
  }, [focusSelf])

  const onRowFocus = useCallback(
    ({ y }) => {
      if (!!ref.current) {
        ref.current.scrollTop = y;
      }
    },
    [ref]
  );
  const handleClick = () => {
    if (name != "" && name != null) {
      const profileData = {
        firstname: name,
        child: String(value),
        // access_token: access_token,
        auth_token: getAuthToken()
      }

      dispatch(createProfile({ profileData, navigate }));
    }
    else {
      setInvalid(true)
      setTimeout(() => {
        setInvalid(false);
      }, 4000);
    }
    // dispatch(ProfileList());
    // navigate('/chooseprofile');
  }

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
      <div className='backgroundcolor'>
        <div className='parent-container-login'
          style={{
            backgroundImage: `url(${appConfigData?.params_hash2?.config_params?.tv_login_bg_image})`,
            backgroundRepeat: "no-repeat",
          }}>
          <div className="background-signin">
            <div className='login-container'>
              <h3>Create</h3>
              <h1 style={{ fontWeight: 'bold' }}>New Profile</h1>
              <h2>You can create upto 5 different profiles</h2>
              <h5 for="mobile">Profile Name *</h5>
              <div className="phonenumber-container">
                <LoginInput moblieNumber={name} setMobileNumber={setName} inputFocus={inputFocus} onFocus={onRowFocus} />
              </div>
              <div className='switch-container'
              >
                <h3 style={{ width: '40%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>Parental Control?</h3>
                <Switch ref={ref}
                  onColor="linear-gradient(180deg, #4E5766 0%, #272C33 100%)"
                  isOn={value}
                  handleToggle={() => setValue(!value)}
                  onEnter={() => setValue(!value)}
                  onEnterPress={() => setValue(!value)}
                />
              </div>
              <div className='p_login'>
                {/* <button className={"buttonProfile"} type='button' style={{top:'50%'}} onClick={() => handleClick()}>Create</button> */}
                <LoginButton text={'Create'} onEnter={handleClick} onEnterPress={() => handleClick()} />

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
  )
}

export default CreateProfile1