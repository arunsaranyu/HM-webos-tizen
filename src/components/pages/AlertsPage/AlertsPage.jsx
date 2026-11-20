import React from "react";
import { useSelector } from "react-redux";
import StaticReusable from "../../reusable/StaticReusable/StaticReusable.jsx";
import noInternetConnection from "../../../assets/images/noInternetConnection.svg";

const AlertsPage = ({ direction }) => {
  const firstIndex = useSelector((state) => state?.landing?.firstIndex);

  return (
    <>
      <StaticReusable
        alert="Alert"
        alertType="Network Error"
        image={noInternetConnection}
        heading="Opps..!"
        Description="Slow or no internet connection. Please check your internet setting."
        ButtonTextArray={["Try Again"]}
        direction={direction || firstIndex || "home-list"}
      />
    </>
  );
};

export default AlertsPage;
