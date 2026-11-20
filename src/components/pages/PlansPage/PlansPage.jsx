import React, { useCallback, useEffect, useState } from "react";
import Plans from "../../reusable/Plans/Plans.jsx";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import "./PlansPage.scss";
import { useDispatch, useSelector } from "react-redux";

import { getUserPlans } from "../../../redux/reducer/plansreducer.jsx";
import { sidebarDisable } from "../../../redux/reducer/landingReducer.jsx";
import Loader from "../../../helper/Loader.jsx";

const CustomCheckmark = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-check-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /> <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" /> </svg>
);

const PlansPage = () => {

  const dispatch = useDispatch()
  dispatch(sidebarDisable())

  useEffect(() => {
    dispatch(getUserPlans())
  }, [])


  const focusedPlanTitle = useSelector((state) => state?.plans?.datatitle);

  const loading = useSelector((state) => state?.plans?.loading)
  const { ref, focusKey } = useFocusable({
    onArrowPress: () => true,
  });
  const onAssetFocus = useCallback(({ y }) => {
    if (!!ref.current) {
      ref.current.scrollTop = y;
    }
  });
  const pack = useSelector((state) => state?.plans?.pack)
  const subsurl = useSelector((state) => state?.common?.appConfig?.params_hash2?.config_params?.subscription_url)

  return (
    <div className="main-card">


      <FocusContext.Provider value={focusKey}>
        <div className="parent-container" style={{ marginLeft: "0px", background: 'transparent linear-gradient(0deg, #181D25 0%, #181D2500 100%) 0% 0% no-repeat padding-box' }}>
          <div className="plans" ref={ref}>
            {
              (pack?.current_active_plans?.length > 0) ? ("") : (
                <Plans onFocus={onAssetFocus} />)
            }
            <div className="horizontal-line" style={{ position: 'absolute', marginLeft: '5%' }}></div>
            <div className="plans-description" >
              {!!pack && pack?.length > 0 && (
                <div>
                  {!!pack && pack?.map((each, i) => (
                    <div>
                      {i === 0 && <h1 style={{ paddingBottom: '2%' }}>{!!focusedPlanTitle ? focusedPlanTitle : ""}</h1>}
                      <p>{each.info} : {each.value === 'yes' ? <CustomCheckmark /> : each.value}</p>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ paddingTop: '15%' }}>
                <h1 style={{ paddingBottom: '2%' }}>Follow the simple steps to subscribe</h1>
                <p style={{ padding: '0% 0%' }}>
                  Step 1: Visit the URL {subsurl}
                </p>
                <p style={{ padding: '0% 0%' }}>
                  Step 2: Follow the steps and subscribe the plan
                </p>
              </div>
            </div>


          </div>
        </div>

      </FocusContext.Provider>

    </div>
  );
};

export default PlansPage;