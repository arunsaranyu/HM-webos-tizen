import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isHomePath, requestExitPopup } from '../../helpers/homeRoute.js';

/**
 * BackFromHomeWatcher monitors navigation events inside React Router.
 *
 * On webOS, the platform frequently intercepts the physical Back key and pops
 * the window history before JS keydown events can fire.
 * When navigation type is 'POP', a real route change occurred, and the previous
 * location was a Home route leaving to a non-home route, this component
 * halts/reverts the pop via navigate(homePath, { replace: true }) and dispatches
 * 'trigger-exit-popup' to display the Exit Confirmation Dialog.
 */
const BackFromHomeWatcher = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navType = useNavigationType(); // 'POP', 'PUSH', or 'REPLACE'
  const firstIndex = useSelector((state) => state?.landing?.firstIndex);

  const prevLocationRef = useRef(location);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Ignore initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevLocationRef.current = location;
      return;
    }

    const prevLocation = prevLocationRef.current;

    // Only inspect when an actual route change took place
    if (prevLocation.key === location.key) {
      return;
    }

    prevLocationRef.current = location;

    // Detect when webOS platform pops history leaving a home route
    if (navType === 'POP') {
      const wasHome = isHomePath(prevLocation.pathname, firstIndex);
      const isStillHome = isHomePath(location.pathname, firstIndex);

      if (wasHome && !isStillHome) {
        const homePath = prevLocation.pathname || '/';
        navigate(homePath, { replace: true });
        requestExitPopup();
      }
    }
  }, [location, navType, navigate, firstIndex]);

  return null;
};

export default BackFromHomeWatcher;
