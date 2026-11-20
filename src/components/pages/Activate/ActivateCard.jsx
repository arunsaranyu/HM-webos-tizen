import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";

const ActivateCard = (props) => {
  const { onEnterPress, card, redirection, onFocus } = props;
  const { ref, focused, focusSelf } = useFocusable({ onEnterPress });
  const handleClick = () => {
    redirection(card.Name);
  };
  const [qrCodeSize, setQRCodeSize] = useState(0);

  useEffect(() => {
    if (card.Button === true) {
      document.getElementById("loginButton").focus();
    }
  }, [card.Button]);

  const handleKeyDown = (event) => {
    if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight" ||
      event.key === "ArrowDown" ||
      event.key === "ArrowUp"
    ) {
      event.preventDefault();
    } else if (event.key === "Enter") {
      handleClick();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const calculateQRCodeSize = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    if (windowWidth >= 1920 && windowHeight >= 1080) {
      setQRCodeSize(300);
    } else {
      setQRCodeSize(200);
    }
  };

  useEffect(() => {
    calculateQRCodeSize();
    window.addEventListener("resize", calculateQRCodeSize);
    return () => {
      window.removeEventListener("resize", calculateQRCodeSize);
    };
  }, []);
 
  return (
    <div>
      <div className={"activate-card"}>
        <h3 className={"card-name"} style={{ width: `${card.width}` }}>
          {card.Name}
        </h3>
        <div style={{ width: "100%" }}>
          {card.Name === "QR Code - Login" && (
            <div className="qr-code-container">
              <QRCode value={card.contentData} size={qrCodeSize} />
            </div>
          )}
          {card.Name === "Activate using Code" && (
            <div className="activateCode">
              <span>{card.contentData}</span>
              <p>Activation code</p>
            </div>
          )}
          {card.Button === true && (
            <div className="loginButton1">
              <div id="loginButton" tabIndex="0" onClick={handleClick}>
                LOGIN
              </div>
              <p className="clickButton" style={{ paddingTop: "10%" }}>
                Click ok to enter Mobile Number
              </p>
            </div>
          )}
        </div>
        <div className="footer-data">
          <p>{card.footerData1}</p>
          <p>{card.footerData2}</p>
        </div>
      </div>
    </div>
  );
};

export default ActivateCard;
