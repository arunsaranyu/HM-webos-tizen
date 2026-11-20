import React, { useCallback, useEffect, useRef, useState } from 'react';

import { generatetoken, getverifytoken } from '../../../redux/reducer/loginReducer.jsx';
import ActivateCard from './ActivateCard.jsx';
import { useNavigate } from "react-router-dom";
import './Activate.scss';
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { useDispatch, useSelector } from "react-redux";
import { sidebarDisable } from '../../../redux/reducer/landingReducer.jsx';
import { getAppConfig, getRegion } from '../../../redux/reducer/commonReducer.jsx';

import Login from '../Login/Login.jsx';

const Activate = () => {
  const dispatch = useDispatch();
  dispatch(sidebarDisable())
  const { ref, focusSelf, focusKey } = useFocusable({});
  const scrollingRef = useRef();
  const navigate = useNavigate();
  const [loginpopup, setLoginopup] = useState(false);
  const region = useSelector((state) => state?.common?.data);
  // localStorage.clear();

  const appConfigData = useSelector((state) => state?.commom?.appConfig)

  useEffect(() => {
    dispatch(getAppConfig())
    dispatch(getRegion())
  }, []);
  const onAssetFocus = useCallback(
    ({ x }) => {
      if (!!scrollingRef.current) {
        scrollingRef.current.scrollLeft = x;
      }
    },
    [scrollingRef]
  );

  const redirection = (name) => {
    if (name === "Login using Mobile Number") {
      setLoginopup(true)
      // navigate('/login')
    }
  };

  useEffect(() => {
    dispatch(generatetoken());
  }, []);

  const tokenData = useSelector((state) => state?.login?.data);
  const qrData = useSelector((state) => state?.common?.appConfig?.params_hash2?.config_params?.qr_login_url);
  const tvLoginUrl = useSelector((state) => state?.common?.appConfig?.params_hash2?.config_params?.tv_connect_url)
  const [apicalled, setapicalled] = useState(false)

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (localStorage.getItem("session_id") === null) {
        dispatch(generatetoken());
      }
    }, 300000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [dispatch, tokenData]);


  useEffect(() => {
    const intervalId = setInterval(() => {
      if (localStorage.getItem("session_id") === null) {
        dispatch(getverifytoken({ tokenData, navigate }));
      }
    }, 5000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [dispatch, tokenData]);


  const ActivationCard = [
    // {
    //   Name: "QR Code - Login",
    //   Button: false,
    //   to: '',
    //   width: '80%',
    //   footerData1: 'Step 1: Open any camera app ',
    //   footerData2: 'Step 2: Scan the QR code',
    //   contentData: qrData + String(tokenData?.token),
    // },
    {
      Name: "Activate using Code",
      Button: false,
      to: '',
      width: '80%',
      footerData1: `Step 1: Visit the URL ${tvLoginUrl} `,
      footerData2: 'Step 2: Enter the code. ',
      contentData: tokenData?.token,
    }
  ];

  // if (!!region?.region && region?.region?.country_code2 === "IN") {
  //   const button_add = {
  //     Name: "Login using Mobile Number",
  //     Button: true,
  //     to: 'login',
  //     width: '70%',
  //     footerData1: 'Step 1: Click on Login ',
  //     footerData2: 'Step 2: Enter the mobile number & OTP',
  //     contentData: ''
  //   }
  //   ActivationCard.push(button_add);
  // }
  return (
    <FocusContext.Provider value={focusKey}>
      {loginpopup == true ? <Login /> : (
        <div className="main-card activate-page">
          <div className="parent-container">
            <div className='login-container-activate'>
              <h3>Activate TV</h3>
              <h1>Welcome To Tarang plus</h1>
            </div>
            <div className="activate-card-container">
              <div className="activate-card-content" ref={ref}>
                {ActivationCard.map((card, i) => {
                  return (
                    <ActivateCard
                      key={i}
                      card={card}
                      onFocus={focusSelf}
                      onEnterPress={() => {
                        redirection(card.Name);
                      }}
                      redirection={redirection}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>)}
    </FocusContext.Provider>
  )
}

export default Activate
