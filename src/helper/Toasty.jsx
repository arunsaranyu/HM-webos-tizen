import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { dislableToast, toast } from '../redux/reducer/loginReducer.jsx';
import { watchlatertoast } from '../redux/reducer/watchlaterReducer.jsx';

const Toast = (props) => {
  const { imgicon, text, backgroundcolor, bordercolor, from } = props;

  const [isVisible, setIsVisible] = useState(true);
const dispatch=useDispatch()
  useEffect(() => {
    const timeoutId = setTimeout(() => {
    
      setIsVisible(false);
dispatch(dislableToast())
    }, 4000);

    return () => {
      // Clear the timeout to avoid memory leaks
      clearTimeout(timeoutId);
    };
  }, []); // The empty dependency array ensures that the effect runs only once after the initial render

  return (
    <>
      {isVisible && (
        <div id={text} className={from=="otppage"?"popup-alert-toasty-otp":'popup-alert-toasty'} style={{ backgroundColor: backgroundcolor, borderColor: bordercolor }}>
          <img src={imgicon} alt="" width={50} height={50} />
          <p>{text}</p>
        </div>
      )}
    </>
  );
};

export default Toast;
