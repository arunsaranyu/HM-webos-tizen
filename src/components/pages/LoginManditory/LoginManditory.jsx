import React from "react";
import StaticReusable from "../../reusable/StaticReusable/StaticReusable.jsx";
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";

const LoginManditory = () => {
  const { ref, focusKey } = useFocusable();
  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref}>
        {
          <StaticReusable
            alert="Alert"
            alertType="Login Alert"
            heading="Action Required!"
            Description="Login is mandatory for this action"
            totalButtons={2}
            ButtonTextArray={["Login", "Cancel"]}
            direction={"activate"}
          />
        }
      </div>
    </FocusContext.Provider>
  );
};

export default LoginManditory;
