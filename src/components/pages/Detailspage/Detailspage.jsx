import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
// import Popup from "../../../helper/Popup.jsx";
import Alert from "../../../helper/Alert.jsx";
import icon_error from "../../../assets/images/icon_error.png";

import md5 from "md5";
import btn_watchNow_inactive from "../../../assets/images/icon_play_default.svg";
import btn_watchNow_active from "../../../assets/images/icon_play_focused.svg";
import btn_removeWatchLater_inactive from "../../../assets/images/icon_mylist_default.svg";
import btn_removeWatchLater_active from "../../../assets/images/icon_mylist_focused.svg";
import btn_addWatchLater_inactive from "../../../assets/images/icon_watchlater_default.svg";
import btn_addWatchLater_active from "../../../assets/images/icon_watchlater_focused.svg";

import whitelogo from "../../../assets/images/tag_premium.png";
import btn_info_active from "../../../assets/images/icon_info_focused.svg";
import btn_info_inactive from "../../../assets/images/icon_info_default.svg";
import exclusive_icon from "../../../assets/images/tag_exclusive.png";

import btn_playFromBeginning_inactive from "../../../assets/images/icon_playbeginning_default.svg";
import btn_playFromBeginning_active from "../../../assets/images/icon_playbeginning_focused.svg";
import btn_continueWatching_active from "../../../assets/images/icon_continuewatching_focused.svg";
import btn_continueWatching_inactive from "../../../assets/images/icon_continuewatching_default.svg";

import Loader from "../../../helper/Loader.jsx";
import BannerPlayer from "../../reusable/BannerPlayer/index.jsx";
import tag_premium from "../../../assets/images/tag_premium.svg"
import ItemCaption from "../../reusable/ItemCaption/ItemCaption.jsx";
import { addWatchlater, deletewaterlateritem, getupNext } from "../../../redux/reducer/detailsReducer.jsx";
import "../ShowsDetailsPage/Detailspage.scss";
import DetailsIcons from "./DetailsIcons.jsx";
import { sidebarDisable } from "../../../redux/reducer/landingReducer.jsx";
import { contentDetails, getAllDetailsData, getDetailsData, positionInPlayer, waterlaterbuttonToggle } from "../../../redux/reducer/detailsReducer.jsx";
import { getAuthToken, secret_key, session_Id } from "../../../assets/constant/index.jsx";
import InstaPlayerBanner from "../PlayerBanner/PlayerBanner.jsx";
import { watchlater } from "../../../analytics/index.jsx";

import Popup from "../../../helper/Popup.jsx";
import dot from "../../../assets/images/dot.svg"
import { onClicked } from "../../../redux/reducer/commonReducer.jsx";
import { signoutall } from "../../../redux/reducer/loginReducer.jsx";
import { setErrorMessageStatus } from "../../../redux/reducer/detailsReducer.jsx";
import { session_text } from "../../../assets/constant/index.jsx";
import { activeIndexSidebar } from "../../../redux/reducer/landingReducer.jsx";
const DetailsPage = () => {
  const [buttonPressed, setButtonPressed] = useState(false)
  const { ref, focusKey, focusSelf } = useFocusable({});
  const {
    theme,
    catalog_object_friendly_id,
    friendly_id,
    content_id,
    catalog_id,
  } = useParams();
  const [alertpopup, setalertpopup] = useState(true);
  const [waterlaterItem, setwatchlaterItem] = useState(true);
  const session_id =
    localStorage.getItem("session_id") != null
      ? localStorage.getItem("session_id")
      : "";
  const dispatch = useDispatch();

  const [session_id_status, set_session_id_status] = useState(false)
  const invalidSession = localStorage.getItem("invalidsession") === "true";

  useEffect(() => {
    if (invalidSession) {
      set_session_id_status(true);
    }
  }, [invalidSession]);
  useEffect(() => {
    dispatch(sidebarDisable());
    dispatch(onClicked(""));
    dispatch(setErrorMessageStatus(false));
    var allDetails = {
      content_id: content_id,
      catalog_id: catalog_id,
      auth_token: getAuthToken(),
      // access_token: access_token,\
      id: session_id,
      md5: md5(catalog_id + content_id + session_id + ts + secret_key),
      ts: String(ts),
      category: "",
      region: localStorage.getItem("region"),
    };
    const data = {
      catalog_object_friendly_id: catalog_object_friendly_id,
      friendly_id: friendly_id,
    }
    dispatch(getDetailsData(data))
    dispatch(getAllDetailsData({ allDetails }))

  }, [])

  const continueWatching = useSelector((state) => state.details?.continue)
  const detailsPageData = useSelector((state) => state?.details?.data)
  useEffect(() => {

    dispatch(contentDetails(detailsPageData))
  }, [detailsPageData])
  const waterlaterData = useSelector((state) => state?.details?.addwatchlater)

  const waterlaterToggle = useSelector((state) => state.details?.waterlaterToggle)

  const detailsPD = useSelector((state) => state?.details)
  const errormessagestaus = useSelector((state) => state?.details?.errorstatus)
  const addwaterlatertoast = useSelector((state) => state.details);
  const loading = useSelector((state) => state?.details?.loading)
  const getAllDetail = useSelector((state) => state?.details?.getAllDetails)
  const onclikedStatus = useSelector((state) => state?.common?.clicked)

  const firstIndexValue = useSelector((state) => state?.landing?.firstIndex)
  const [subscribed, setSubscribed] = useState("false")
  useEffect(() => {
    setSubscribed(localStorage.getItem("is_subscribed"))
  }, [getAllDetail])
  const [buttonarray, setbuttonarray] = useState([]);

  const ts = parseInt(new Date().getTime() / 1000);

  const navigate = useNavigate();
  const list_id = useSelector((state) => state?.details?.getAllDetails?.data?.playlists);
  const listItem_id = useSelector((state) => state?.details?.addwatchlater);


  const isLiveTv = theme === "livetv" || detailsPageData?.theme === "livetv";

  const showsIcon = isLiveTv ? [
    [{
      name: "Watch Live",
      focusedIcons: btn_watchNow_active,
      notFocused: btn_watchNow_inactive,
      NavType: 0,
      alt: "",
    }],
  ] : [
    [{
      name: continueWatching === true && getAllDetail?.data?.stream_info?.percentage !== 100 ? "Resume" : "Watch Now",
      focusedIcons: continueWatching === true && getAllDetail?.data?.stream_info?.percentage !== 100 ? btn_continueWatching_active : btn_watchNow_active,
      notFocused: continueWatching === true && getAllDetail?.data?.stream_info?.percentage !== 100 ? btn_continueWatching_inactive : btn_watchNow_inactive,
      NavType: continueWatching === true ? getAllDetail?.data?.stream_info?.percentage : 0,

      alt: "",
    },
    ],
    [
      //   {
      //     name: "Recommended",
      //     focusedIcons: btn_recommended_active,
      //     notFocused: btn_recommended_inactive,
      //     NavType: "",

      //   alt: "",
      // },
      {
        name: "My List",
        focusedIcons: waterlaterToggle ? btn_removeWatchLater_active : btn_addWatchLater_active,
        notFocused: waterlaterToggle ? btn_removeWatchLater_inactive : btn_addWatchLater_inactive,
        NavType: "",
        space: true,
        alt: "",
      },
      {
        name: "Info",
        focusedIcons: btn_info_active,
        notFocused: btn_info_inactive,
        NavType: "",
        space: true,
        alt: "",
      }],
  ];

  useEffect(() => {
    const continueButton = {
      name: "Start Over",
      focusedIcons: btn_playFromBeginning_active,
      notFocused: btn_playFromBeginning_inactive,
      space: true,
      alt: "",
      NavType: "",
    };

    if (!isLiveTv && continueWatching && getAllDetail?.data?.stream_info?.percentage !== 100) {
      showsIcon.map((each, i) => {
        if (i == 0) {
          each.push(continueButton);
        }
      });
    }
    setbuttonarray(showsIcon);

  }, [detailsPageData, continueWatching, content_id, waterlaterToggle, isLiveTv])
  useEffect(() => {
    if (!!detailsPageData) {
      if (detailsPageData?.content_id) {
        // dispatch(getupNext(detailsPageData))

      }
    }
  }, [detailsPageData])
  useEffect(() => {
    focusSelf();
  }, [showsIcon]);

  const enterPress = (details, data) => {

    const conditionnavigation = true;
    if (data.name != "Season & Episodes" && data.name != "My List" && data.name != "Info") {
      setButtonPressed(true)
    }
    if (data.name == "Resume") {
      if ((localStorage.getItem("session_id") == undefined ||
        localStorage.getItem("session_id") == null) &&
        detailsPageData?.access_control?.is_free !== true) {
        navigate("/loginManditory")
      } else {
        dispatch(contentDetails(details))
        dispatch(positionInPlayer(getAllDetail?.data?.stream_info?.play_back_time));
        navigate("/player/vod");
      }
    }
    else if (data.name === "Start Over" && continueWatching) {
      if ((localStorage.getItem("session_id") == undefined ||
        localStorage.getItem("session_id") == null) &&
        detailsPageData?.access_control?.is_free !== true) {
        navigate("/loginManditory")
      } else {
        dispatch(contentDetails(details))
        dispatch(positionInPlayer("00:00:00"));
        navigate("/player/vod");
      }
    }
    else if (data.name === "My List") {

      const videodetails = {
        catalog_id: detailsPageData?.catalog_id,
        content_id: detailsPageData?.content_id,
        media_type: detailsPageData.theme,
        auth_token: getAuthToken(),
      };


      if (localStorage.getItem("session_id") == undefined || localStorage.getItem("session_id") == null) {
        navigate("/loginManditory")
      }
      else if (waterlaterToggle == false) {

        dispatch(addWatchlater(videodetails));
        setalertpopup(true)
      }

      else {

        if (waterlaterToggle == true) {

          if (listItem_id[0]?.listitem_id) {
            dispatch(deletewaterlateritem(listItem_id[0]?.listitem_id))
          }
          else if (list_id?.length > 0) {
            list_id?.map((e) => {
              if (e?.name == "Watch Later") {
                // setwatchlaterItem(true);

                dispatch(deletewaterlateritem(e?.listitem_id));
              } else {
                dispatch(deletewaterlateritem(listItem_id[0]?.listitem_id))
              }

            })
          }



        }
      }
    }
    else if (data.name === "Recommended") {
      navigate(`/recommended/${details?.title}/${details?.catalog_object?.friendly_id}/${details?.friendly_id}/${details?.genres?.join(", ")}`)
    }
    else if (data.name === "Watch Now") {
      if ((localStorage.getItem("session_id") == undefined ||
        localStorage.getItem("session_id") == null) &&
        detailsPageData?.access_control?.is_free !== true) {
        navigate("/loginManditory")
      } else {
        dispatch(contentDetails(details))
        dispatch(positionInPlayer("00:00:00"));
        navigate("/player/vod");
      }
    }

    else if (data.name === "Watch Live") {
      console.log(data.name === "Watch Live",)
      if ((localStorage.getItem("session_id") == undefined ||
        localStorage.getItem("session_id") == null) &&
        detailsPageData?.access_control?.is_free !== true) {
        navigate("/loginManditory")
      } else {
        dispatch(contentDetails(details))
        dispatch(positionInPlayer("00:00:00"));
        navigate("/liveplayer/live");
      }



    }
    else if (data.name === "Info") {
      navigate(`/info`);
    }
  };

  const handleTimeUpdate = useCallback((currentTime) => {

  }, []);

  const handleEnded = useCallback((currentTime) => {

  }, []);

  let backgroundStyle;
  let backgroundImg = ''
  if (Object.keys(detailsPageData).length > 0) {

    // backgroundImg = detailsPageData
    //   ? detailsPageData?.thumbnails?.medium_16_9?.url
    //   : "";
    if (detailsPageData && detailsPageData?.thumbnails) {

      if (detailsPageData?.thumbnails?.large_16_9) {
        backgroundImg = detailsPageData?.thumbnails?.large_16_9?.url;
      }
    }
    backgroundStyle = {
      backgroundImage: `
    linear-gradient(0deg, rgb(24, 29, 37), rgba(24, 29, 37, 0)), 
    linear-gradient(90deg, rgb(24, 29, 37), rgba(24, 29, 37, 0)), 
    url('${backgroundImg}')
  `,
      backgroundSize: '100% 100%, 30% 100%, cover',
      backgroundPosition: '0 0, 0 0, center',
      backgroundRepeat: 'no-repeat, no-repeat, no-repeat'
    };

  }

  const onSubmit = (confirm) => {
    dispatch(onClicked(""))

    if (confirm === "Go Back") {

      dispatch(onClicked(""))
    }
    else if (confirm == "Retry") {
      dispatch(onClicked(""))
    }
    else if (confirm == "Signout all") {

      var details = {
        auth_token: getAuthToken(),
        // access_token: access_token,
        type: session_text
      };

      const firstIndex = {
        firstIndex: firstIndexValue
      }
      dispatch(activeIndexSidebar(firstIndexValue))
      dispatch(signoutall({ details, navigate, firstIndex }));
    }
    else if (confirm === "Login") {
      localStorage.removeItem("session_id")
      localStorage.removeItem("image_url")
      localStorage.removeItem("sidebarProfileName")
      localStorage.setItem("invalidsession", false)
      dispatch(setErrorMessageStatus(false))
      navigate('/activate')
    }
    else if (confirm === "Continue without login") {
      dispatch(setErrorMessageStatus(false))
      localStorage.removeItem("session_id")
      localStorage.removeItem("image_url")
      localStorage.removeItem("sidebarProfileName")
      set_session_id_status(false)
      localStorage.setItem("invalidsession", false)


    }
    else {
      navigate("/plans")
    }
  }
  const processCaption = (captions) => {
    return ItemCaption(captions);
  };

  return loading == true ? (<Loader />) : (
    <FocusContext.Provider value={focusKey}>
      <div className='main-card'>
        {
          detailsPageData?.access_control?.is_free == false ? <img className="premium-tag-player" src={tag_premium} alt="" /> : ""
        }
        <div className='background-container-fullscreen' >
          {
            (
              detailsPageData?.preview?.preview_available == true

            ) ? (
              <BannerPlayer
                videoUrl={detailsPageData?.preview?.preview_url}
                posterUrl={backgroundImg}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                layout={"banner"}
                muted={false}
              />
            ) : (
              <div className='poster' style={backgroundStyle}>

              </div>
            )



          }

        </div>
        <div className='parent-container'>

          <div className="banner-detailspage-container">
            <div>
              {

                <h1 className='banner-title'>{detailsPageData?.display_title || detailsPageData?.title}</h1>
              }
            </div>

          </div>



          <div className="banner-head">
            <div
              className="banner-detailspage-description-container"
              style={{ height: "auto" }}
            >
              {/* <p className="banner-captions">
                      {processCaption(detailsPageData)}
                    </p> */}
              <div className="banner-description">
                {detailsPageData?.short_description}
              </div>
              {!!detailsPageData?.is_original &&
                detailsPageData?.is_original === "Yes" ? (
                <div className="exclusive-container">
                  <div className="exclusive-gradient"></div>

                  <h1 className="etv-win-exclusive">ETV Win Exclusive</h1>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          <hr className="hrline" />

          <div className="movie-icons">
            {
              buttonarray.map((each, i) => {
                // console.log(each,"each");
                return (
                  <>
                    {i == 0 ? (
                      <div className="space-detailspageicons">
                        {
                          each.map((each) => (
                            <DetailsIcons
                              data={each}
                              index={i}
                              details={detailsPageData}
                              onEnterPress={() =>
                                enterPress(detailsPageData, each)
                              }
                              enterPress={enterPress}
                            // onClick={()=>enterPress(detailspage, each)}
                            />
                          ))
                        }
                      </div>
                    ) : (
                      <div className="space-detailspageicons">
                        {
                          each.map((each) => (


                            <DetailsIcons
                              data={each}
                              index={i}
                              details={detailsPageData}
                              onEnterPress={() =>
                                enterPress(detailsPageData, each)
                              }
                              enterPress={enterPress}
                            // onClick={()=>enterPress(detailspage, each)}
                            />
                          ))
                        }
                      </div>
                    )
                    }
                  </>
                )
              })

            }
          </div>
        </div>

        {
          addwaterlatertoast.addwatchlatertoast && <Alert imgicon={icon_error} text="Added to My List!" setalertpopup={setalertpopup} backgroundcolor="#E6EFFA" bordercolor="#076DE3" />
        }
        {
          addwaterlatertoast.removewatchtoast && <Alert imgicon={icon_error} text="Removed from My List!" setalertpopup={setalertpopup} backgroundcolor=" #E6EFFA" bordercolor="#076DE3" />
        }

        {
          (localStorage.getItem("session_id") != null && localStorage.getItem("session_id") != undefined && errormessagestaus == true) || session_id_status == true ?
            <Popup
              alert=""
              alertType="Session Alert"
              heading="Session Expired"
              Description="You have logged out from your device,please login again to continue."
              from={"session"}
              onSubmit={onSubmit}
            /> : ""
        }
      </div>


    </FocusContext.Provider>


  )
};

export default DetailsPage;