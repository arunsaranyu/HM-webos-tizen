import React from "react";
// import AlertsAndLoginManditory from "../../reusable/AlertsAndLoginManditory/AlertsAndLoginManditory.jsx";
import StaticReusable from "../StaticReusable/StaticReusable.jsx";

const NoData = () => {
  return (
    <>
      {
        <StaticReusable
          title="Alert"
          error="No Data"
          sideHeading="oops..."
          sideDescription="No Data found"
          buttonText={["Go Back"]}
          direction={"activate"}
        />
      }
    </>
  );
};

export default NoData;
