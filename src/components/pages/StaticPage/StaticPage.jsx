import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import "./StaticPage.scss";
import Staticpagecontent from './Staticpagecontent.jsx';
import Termscontent from './Termscontent.jsx';
import Privacycontent from './Privacycontent.jsx';
import { sidebarDisable } from '../../../redux/reducer/landingReducer.jsx';
import Aboutcontent from './Aboutcontent.jsx';
import Contactcontent from './Contactcontent.jsx';
import Refundcontent from './Refundcontent.jsx';

const pageTitleMap = {
  "terms-and-conditions": "Terms and Conditions",
  "privacy-policy": "Privacy Policy",
  "about-us": "About Us",
  "contact-us": "Contact Us",
  "refund-policy": "Refund Policy",
};

const StaticPage = () => {
  const { page } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(sidebarDisable());
  }, [dispatch]);

  const { ref, focusKey } = useFocusable({});

  const onArrowPress = useCallback((direction) => {
    if (direction === 'down') {
      ref.current.scrollTop += 300;
    } else if (direction === 'up') {
      ref.current.scrollTop -= 300;
    }
  }, [ref]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        onArrowPress(event.key === 'ArrowUp' ? 'up' : 'down');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onArrowPress]);

  const normalizedPage = (page || "").toLowerCase().replace(/_/g, "-");
  const displayTitle =
    pageTitleMap[normalizedPage] ||
    (page ? page.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "");

  return (
    <FocusContext.Provider value={focusKey}>
      <div className="main-card settings-card" style={{ marginLeft: "0" }}>
        <div className="setting-title">
          <h1>{displayTitle}</h1>
        </div>
        <div className="horizontal-line" style={normalizedPage === 'terms-and-conditions' ? { left: '40%' } : {}}></div>
        <div ref={ref} id={`${page}`} className='setting-content' style={{ position: 'relative' }}>
          {
            normalizedPage === "terms-and-conditions" ? <Termscontent /> :
              normalizedPage === "privacy-policy" ? <Privacycontent /> :
                normalizedPage === "about-us" ? <Aboutcontent /> :
                  normalizedPage === "contact-us" ? <Contactcontent /> :
                    normalizedPage === "refund-policy" ? <Refundcontent /> : null
          }
        </div>
      </div>
    </FocusContext.Provider>
  );
};

export default StaticPage;