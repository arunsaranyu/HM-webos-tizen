import React, { useEffect, useState, useCallback, useRef } from 'react'

import AllRoutes from './AllRoutes.jsx'
import { FocusContext, init, useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import "./assets/css/global.scss";
import { getAppConfig, getRegion, onClicked } from './redux/reducer/commonReducer.jsx';
import { getSidebarData } from './redux/reducer/landingReducer.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { hideSplash } from "./assets/js/utils.jsx";
import "./App.scss"
import { getWatchLater } from './redux/reducer/watchlaterReducer.jsx';
import { HashRouter as Router, useParams } from "react-router-dom";

import NetworkModal from './components/pages/NetworkModal/NetworkModal.jsx';
import ExitApp from './components/pages/ExitModal/ExitApp.jsx';
import BackFromHomeWatcher from './components/common/BackFromHomeWatcher.jsx';
import { isHomeHash, closeApp as executeCleanExit } from './helpers/homeRoute.js';
import { userAgent } from './assets/js/UserAgent.jsx';
import sdkDolbyFunction from './sdkFunction/sdkFunction.jsx';
import Detect4k from "./helper/Detect4K.js"
import { getAuthToken } from './assets/constant/index.jsx';
import { getTrendingSearch } from './redux/reducer/SearchReducer.jsx';

const App = () => {
  const { focusKey, ref } = useFocusable()
  const [show, setShow] = useState(false);
  const [networkStatus, setNetworkStatus] = useState(false);
  const [direction, setDirection] = useState("")
  const [currentDateTime, setCurrentDateTime] = useState('');

  const appversion = window.navigator.appVersion
  let pattern = /WebOS/
  let pattern3 = /Tizen/
  let pattern2 = /TizenOS/
  let pattern4 = /SmartTV/;
  let result = pattern.test(appversion)

  let result2 = pattern2.test(appversion)
  let result3 = pattern3.test(appversion)
  let result4 = pattern4.test(appversion)
  if (result || result4) {
    localStorage.setItem("platform", "WebOS")
  } else if (result2) {
    localStorage.setItem("platform", "TizenOS")
  } else if (result3) {
    localStorage.setItem("platform", "TizenOS")
  }
  else {
    localStorage.setItem("platform", "WebOS")
  }

  const dispatch = useDispatch()
  const regiondata = useSelector((state) => state?.common?.data);
  const firstIndex = useSelector((state) => state?.landing?.firstIndex)

  init({
    debug: false,
    visualDebug: false,
  })

  useEffect(() => {
    hideSplash();
  }, []);

  useEffect(() => {
    dispatch(getRegion())
    if (localStorage.getItem("region")) {
      dispatch(getAppConfig())
      dispatch(getSidebarData())
      dispatch(getTrendingSearch())
    }
  }, [])

  useEffect(() => {
    if (!!regiondata?.region) {
      dispatch(getAppConfig())
      dispatch(getSidebarData())
      dispatch(getTrendingSearch())
    }
  }, [regiondata])

  // Listen for custom trigger-exit-popup event (e.g. from BackFromHomeWatcher)
  useEffect(() => {
    const handleTriggerExit = () => {
      setShow(true);
    };
    window.addEventListener('trigger-exit-popup', handleTriggerExit);
    return () => {
      window.removeEventListener('trigger-exit-popup', handleTriggerExit);
    };
  }, []);

  const closeApp = () => {
    executeCleanExit();
  };

  const cancelClose = () => {
    setShow(false);
  };

  const reloadApp = () => {
    setNetworkStatus(false);
  };

  const updateConnectionStatus = () => {
    if (window.navigator.onLine === false) {
      setNetworkStatus(true);
    }
  };

  useEffect(() => {
    window.addEventListener("online", updateConnectionStatus);
    window.addEventListener("offline", updateConnectionStatus);
    return () => {
      window.removeEventListener("online", updateConnectionStatus);
      window.removeEventListener("offline", updateConnectionStatus);
    };
  }, []);

  const lastBackPressTimeRef = useRef(0);

  /**
   * Unified Back key handler:
   * 1. If Exit Popup is showing, dismiss/cancel the popup.
   * 2. If on Home screen, open the Exit Confirmation Popup.
   * 3. If on an Inner page, perform standard navigation (history.back()), never opening the exit popup.
   */
  const handleBack = useCallback((event) => {
    const now = Date.now();
    // Debounce duplicate events within 250ms (common when TV OS fires both hardware key & keydown)
    if (now - lastBackPressTimeRef.current < 250) {
      if (event && event.preventDefault) event.preventDefault();
      if (event && event.stopPropagation) event.stopPropagation();
      return;
    }
    lastBackPressTimeRef.current = now;

    if (networkStatus) {
      setNetworkStatus(false);
      setTimeout(() => {
        if (window.navigator.onLine === true) {
          setNetworkStatus(false);
          reloadApp();
        } else {
          setNetworkStatus(true);
        }
      }, 500);
      return;
    }

    // If Exit Confirmation Popup is currently open, dismiss it
    if (show) {
      if (event && event.preventDefault) event.preventDefault();
      if (event && event.stopPropagation) event.stopPropagation();
      setShow(false);
      return;
    }

    // Determine if current screen is Home
    const isHome = isHomeHash(window.location.hash, firstIndex);

    if (isHome) {
      // 1. Home screen Back key: open Exit Confirmation Popup
      if (event && event.preventDefault) event.preventDefault();
      if (event && event.stopPropagation) event.stopPropagation();
      setShow(true);
    } else {
      // 2. Inner pages Back key: standard history navigation, never open exit popup
      if (event && event.preventDefault) event.preventDefault();
      if (event && event.stopPropagation) event.stopPropagation();
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.hash = `#/${firstIndex || 'home-list'}`;
      }
    }
  }, [networkStatus, show, firstIndex]);

  // Tizen hardware back key listener ('tizenhwkey' -> keyName === 'back')
  useEffect(() => {
    const handleTizenHwKey = (e) => {
      if (e && e.keyName === 'back') {
        handleBack(e);
      }
    };
    window.addEventListener('tizenhwkey', handleTizenHwKey);
    return () => window.removeEventListener('tizenhwkey', handleTizenHwKey);
  }, [handleBack]);

  // KeyDown event listener:
  // - webOS: keyCode === 461, key === 'GoBack', key === 'BrowserBack'
  // - Tizen: keyCode === 10009
  // - Browser testing: keyCode === 66 ('B' key)
  useEffect(() => {
    const handleKeyDown = (event) => {
      const keyCode = event.keyCode || event.which;
      const key = event.key;

      const isWebOSBack = keyCode === 461 || key === 'GoBack' || key === 'BrowserBack';
      const isTizenBack = keyCode === 10009;
      const isTestingBack = keyCode === 66;

      if (isWebOSBack || isTizenBack || isTestingBack) {
        handleBack(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBack]);

  Detect4k();
  sdkDolbyFunction();
  getAuthToken();

  return (
    <>
      <Router>
        <BackFromHomeWatcher />
        {networkStatus ? (
          <NetworkModal direction={direction} networkStatus={networkStatus} reloadApp={reloadApp} />
        ) : null}
        {show && (
          <ExitApp show={show} closeApp={closeApp} cancelClose={cancelClose} />
        )}
        {!networkStatus && (
          <AllRoutes setShow={setShow} />
        )}
      </Router>
    </>
  );
};

export default App
