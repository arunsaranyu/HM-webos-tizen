import React, { useCallback, useEffect, useRef, useState } from 'react'
import "./SideVideo.scss"
import SidevideoItem from './SidevideoItem.jsx'
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import { useNavigate } from 'react-router-dom';
import { contentDetails, getAllDetailsData, getupNext } from '../../../redux/reducer/detailsReducer.jsx';
import md5 from 'md5';
import { access_token, auth_token, secret_key } from '../../../assets/constant/index.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { artwork_tapped } from '../../../analytics/index.jsx';
import { Saranyu_artwork_tapped } from '../../../analytics/saranyuAnalytics.jsx';
import Popup from '../../../helper/Popup.jsx';
import { onClicked } from '../../../redux/reducer/commonReducer.jsx';
// import { artwork_tapped } from '../../../analytics/analytics.js';
// import { Sidebardisable } from '../../../Redux/reducer/commonReducer.jsx';
const SideVideo = (props) => {
  const { data, onFocus, from } = props


  const navigate = useNavigate()
  // console.log("sidevideo,", data);
  const dispatch = useDispatch()
  const onclikedStatus = useSelector((state) => state?.common?.clicked)

  const scrollingRef = useRef()
  const { ref, focusSelf, focusKey } = useFocusable({ onFocus })
  const onAssetFocus = useCallback(({ y }) => {
    if (!!scrollingRef.current) {
      scrollingRef.current.scrollTop = y;

    }
  }, [scrollingRef]);

  const [count, setcount] = useState(1)
  const updatesetcount = () => {
    setcount(count + 1)
  }

  useEffect(() => {
    if (data?.length > 0) {
      focusSelf()
    }
  }, [data])
  let iterate
  iterate = data;
  const activeTitle = useSelector((state) => state?.season?.seasonIndex);
  if (!!iterate) {
    const seeAll = { theme: "seeall" };
    if (iterate.length >= 20) {
      iterate = iterate.slice(0, 19);
      iterate = [...iterate, seeAll];
    }
  }
  const renderDetails = (data, key) => {

    // console.log("data in Side Video Render details", data)

    const ts = parseInt(new Date().getTime() / 1000);
    dispatch(contentDetails(data))
    const session_id =
      localStorage.getItem("session_id") != null
        ? localStorage.getItem("session_id")
        : "";
    var allDetails = {
      content_id: data?.content_id,
      catalog_id: data?.catalog_id,
      auth_token: getAuthToken(),


      id: session_id,
      md5: md5(
        data?.catalog_id + data?.content_id + session_id + ts + secret_key
      ),
      ts: String(ts),
      category: "",
      region: localStorage.getItem("region"),
    };
    dispatch(getupNext(data))
    if (from == "season" && data.theme !== 'seeall') {


      if (!!localStorage.getItem("session_id")) {
        if (localStorage.getItem("is_subscribed") === "true") {
          dispatch(getAllDetailsData({ allDetails, navigate }))
        } else if (localStorage.getItem("is_subscribed") === "false") {
          if (data?.access_control?.is_free == true) {
            dispatch(getAllDetailsData({ allDetails, navigate }))
          } else {
            dispatch(onClicked("clicked"));
          }
        } else {
          dispatch(onClicked("clicked"));
        }

      }
      else if (localStorage.getItem("session_id") == null || localStorage.getItem("session_id") == undefined) {
        if (data?.access_control?.is_free == true) {
          dispatch(getAllDetailsData({ allDetails, navigate }))
        } else {
          navigate("/loginManditory");
        }
      }
      else {
        navigate("/loginManditory");
      }
    }
    else if (data.theme == 'seeall') {
      navigate(`/seasonsSeeAll/${activeTitle}`);
    }
  }

  const onSubmit = (confirm) => {
    dispatch(onClicked(""))

    if (confirm === "Go Back") {

      dispatch(onClicked(""))
    }
    else {
      navigate("/plans")
    }
  }

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className='video-container1'>
        <div ref={scrollingRef} style={{ overflow: "hidden" }}>
          {
            (iterate?.length) ? (
              iterate?.map((each, i) => (
                <SidevideoItem data={each} index={i} onEnterPress={() => { renderDetails(each, i) }}
                  onFocus={onAssetFocus} count={count} updatesetcount={updatesetcount} from={from} renderDetails={renderDetails} />
              ))
            )
              : ("")
          }
        </div>
      </div>
      {
        onclikedStatus == "clicked" ?
          <Popup
            alert=""
            alertType="Subscription Alert"
            heading="No Subscription Found"
            Description="You need a subscription to access the content"
            from={"details"}
            onSubmit={onSubmit}
          /> : ""
      }
    </FocusContext.Provider>
  )
}

export default SideVideo
