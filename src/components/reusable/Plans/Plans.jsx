import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import React, { useCallback, useEffect, useRef } from "react";
import PlansDetails from "./PlansDescription.jsx";
import "./Plans.scss";
import { getSubscriptionPlans } from "../../../redux/reducer/plansreducer.jsx";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../helper/Loader.jsx";
const Plans = (props) => {
  const { onFocus } = props;
  const scrollingRef = useRef();
  const dispatch = useDispatch()
  const { ref, focusKey, focusSelf } = useFocusable({ onFocus });
  useEffect(() => {
    dispatch(getSubscriptionPlans())
  }, [])
  const plansdata = useSelector((state) => state?.plans?.plans);
  const loading = useSelector((state) => state?.plans?.loading)
 
  const flattenedArray = [];

  for (let i = 0; i < plansdata?.length; i++) {
    const innerArray = plansdata[i];
    const packDetails = innerArray.pack_details
    const display_title=innerArray.display_title
    for (let j = 0; j < innerArray?.plans?.length; j++) {
      flattenedArray.push([display_title,innerArray.plans[j],packDetails]);
    }
  }
 
  useEffect(() => {
    focusSelf();
  }, [plansdata]);
  const onAssetFocus = useCallback(
    ({ y }) => {
      if (!!scrollingRef.current) {
        scrollingRef.current.scrollLeft = y;
      }
    },
    [scrollingRef]
  );


  return (
          <FocusContext.Provider value={focusKey}>

            <div className="plans-heading" ref={ref}>
              <h1>Plans</h1>
              <div style={{ paddingTop: '20px' }}>
                {
                  (flattenedArray?.length) ? (
                    <>
                      {
                        flattenedArray?.map((each) => (
                          <PlansDetails data={each} onFocus={onAssetFocus} />
                        ))
                      }
                    </>
                  ) : ("")
                }
              </div>


            </div>
          </FocusContext.Provider>
    
  );
};

export default Plans;