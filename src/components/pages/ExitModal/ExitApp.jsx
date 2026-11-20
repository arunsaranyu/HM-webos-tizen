import React, { useEffect, useRef, useState } from 'react';
import {
  FocusContext,
  useFocusable,
  setFocus,
  getCurrentFocusKey,
  doesFocusableExist,
  ROOT_FOCUS_KEY,
} from '@noriginmedia/norigin-spatial-navigation';
import '../../reusable/StaticReusable/StaticReusable.scss';

const EXIT_MODAL_FOCUS_KEY = 'EXIT_MODAL';
const BUTTONS = ['Yes', 'Cancel'];

const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_ENTER = 13;


const ExitApp = ({ closeApp, cancelClose, show, onClose }) => {
  const { ref, focusKey } = useFocusable({
    focusKey: EXIT_MODAL_FOCUS_KEY,
    isFocusBoundary: true,
  });

  const [selected, setSelected] = useState(0); // 0 = Yes, 1 = Cancel
  const selectedRef = useRef(0);
  const previousFocusKeyRef = useRef(null);

  const select = (index) => {
    selectedRef.current = index;
    setSelected(index);
  };

  const handleDismiss = () => {
    if (typeof cancelClose === 'function') {
      cancelClose();
    } else if (typeof onClose === 'function') {
      onClose();
    }
  };

  const handleExit = () => {
    if (typeof closeApp === 'function') {
      closeApp();
    }
  };

  const activate = (index) => {
    if (BUTTONS[index] === 'Yes') {
      handleExit();
    } else {
      handleDismiss();
    }
  };


  const activateRef = useRef(activate);
  activateRef.current = activate;

  useEffect(() => {
    if (!show) return undefined;

    const current = getCurrentFocusKey();
    previousFocusKeyRef.current = current !== EXIT_MODAL_FOCUS_KEY ? current : null;

    select(0);
    setFocus(EXIT_MODAL_FOCUS_KEY);

    const onKeyDown = (event) => {
      const code = event.keyCode || event.which;
      if (![KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_DOWN, KEY_ENTER].includes(code)) {
        return; 
      }
      event.preventDefault();
      event.stopPropagation();
      if (event.stopImmediatePropagation) event.stopImmediatePropagation();

      if (code === KEY_LEFT) {
        select(0);
      } else if (code === KEY_RIGHT) {
        select(1);
      } else if (code === KEY_ENTER) {
        if (event.repeat) return;
        activateRef.current(selectedRef.current);
      }
    };

    window.addEventListener('keydown', onKeyDown, true);

    return () => {
      window.removeEventListener('keydown', onKeyDown, true);

      // Popup closed: put focus back where it was on the page
      const prev = previousFocusKeyRef.current;
      setTimeout(() => {
        if (prev && doesFocusableExist(prev)) {
          setFocus(prev);
        } else {
          setFocus(ROOT_FOCUS_KEY);
        }
      }, 0);
    };
  }, [show]);

  if (!show) return null;

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        className="main_banner"
        role="dialog"
        aria-modal="true"
        style={{ zIndex: 999999 }}
      >
        <div className="alerts">
          <p>Alert</p>
          <h1 style={{ width: 'auto' }}>Exit Application</h1>
        </div>
        <div className="Details">
          <h1>Action Required!</h1>
          <p>Are you sure you want to exit?</p>
          <div className="ButtonsDisplay">
            {BUTTONS.map((btn, index) => (
              <button
                key={btn}
                className={selected === index ? 'button-pop-focused' : 'button-pop'}
                onMouseEnter={() => select(index)}
                onClick={() => activate(index)}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      </div>
    </FocusContext.Provider>
  );
};

export default ExitApp;
