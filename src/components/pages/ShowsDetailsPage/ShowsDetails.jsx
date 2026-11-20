import Alert from "../../../helper/Alert.jsx";
import icon_error from "../../../assets/images/icon_error.png";
import btn_seasonsAndTrailers_active from "../../../assets/images/icon_season_focused.svg";
import btn_seasonsAndTrailers_inactive from "../../../assets/images/icon_season_default.svg";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import React, { useCallback, Suspense, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import md5 from "md5";
import btn_watchNow_inactive from "../../../assets/images/icon_play_default.svg";
import btn_watchNow_active from "../../../assets/images/icon_play_focused.svg";
import btn_removeWatchLater_inactive from "../../../assets/images/icon_mylist_default.svg";
import btn_removeWatchLater_active from "../../../assets/images/icon_mylist_focused.svg";
import btn_addWatchLater_inactive from "../../../assets/images/icon_watchlater_default.svg";
import btn_addWatchLater_active from "../../../assets/images/icon_watchlater_focused.svg";
import dot from "../../../assets/images/dot.svg"
import whitelogo from "../../../assets/images/tag_premium.png";
import btn_info_active from "../../../assets/images/icon_info_focused.svg";
import btn_info_inactive from "../../../assets/images/icon_info_default.svg";
import exclusive_icon from "../../../assets/images/tag_exclusive.png";
import ItemCaption from "../../reusable/ItemCaption/ItemCaption.jsx";
import btn_playFromBeginning_inactive from "../../../assets/images/icon_playbeginning_default.svg";
import btn_playFromBeginning_active from "../../../assets/images/icon_playbeginning_focused.svg";
import btn_continueWatching_active from "../../../assets/images/icon_continuewatching_focused.svg";
import btn_continueWatching_inactive from "../../../assets/images/icon_continuewatching_default.svg";
import Loader from "../../../helper/Loader.jsx";
import BannerPlayer from "../../reusable/BannerPlayer/index.jsx";
import tag_premium from "../../../assets/images/tag_premium.svg";
import "./Detailspage.scss";
import { watchlater } from "../../../analytics/index.jsx";
import { sidebarDisable } from "../../../redux/reducer/landingReducer.jsx";
import {
  contentDetails,
  getAllDetailsData,
  getDetailsData,
  positionInPlayer,
  setErrorMessageStatus,
  waterlaterbuttonToggle,
} from "../../../redux/reducer/detailsReducer.jsx";
import {

  auth_token,
  getAuthToken,
  secret_key,
} from "../../../assets/constant/index.jsx";
import ShowsDetailsIcons from "./ShowsDetailsIcons.jsx";
import {
  addWatchlater,
  deletewaterlateritem,
} from "../../../redux/reducer/detailsReducer.jsx";
import InstaPlayerBanner from "../PlayerBanner/PlayerBanner.jsx";
import { activeSeasonData, getSeason, activeIndexSeason } from "../../../redux/reducer/seasonReducer.jsx";
import { Saranyu_watchlater } from "../../../analytics/saranyuAnalytics.jsx";
import Popup from "../../../helper/Popup.jsx";
import { onClicked } from "../../../redux/reducer/commonReducer.jsx";
import { signoutall } from "../../../redux/reducer/loginReducer.jsx";
import { activeIndexSidebar } from "../../../redux/reducer/landingReducer.jsx";
import { session_text } from "../../../assets/constant/index.jsx";
const ShowsDetails = () => {
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
  const detailsPD = useSelector((state) => state?.details)
  const dispatch = useDispatch();
  useEffect(() => {

    dispatch(sidebarDisable());
    dispatch(onClicked(""))
    dispatch(setErrorMessageStatus(false));

    // console.log("alldetails", allDetails);
    const data = {
      catalog_object_friendly_id: catalog_object_friendly_id,
      friendly_id: friendly_id,
      theme: theme,
    };
    dispatch(getDetailsData(data));


  }, []);


  const getAllDetail = useSelector((state) => state?.details?.getAllDetails);
  const continueWatching = useSelector((state) => state?.details?.continue);
  const detailsPageData = useSelector((state) => state?.details?.data);
  useEffect(() => {
    const targetContent = detailsPageData?.last_episode || (detailsPageData?.content_id ? detailsPageData : null);
    if (!!targetContent?.content_id) {


      const session_id =
        localStorage.getItem("session_id") != null
          ? localStorage.getItem("session_id")
          : "";
      var allDetails = {
        content_id: targetContent?.content_id,
        catalog_id: targetContent?.catalog_id,
        auth_token: getAuthToken(),
        id: session_id,
        md5: md5(targetContent?.catalog_id + targetContent?.content_id + session_id + ts + secret_key),
        ts: String(ts),
        category: "",
        region: localStorage.getItem("region"),
      };
      dispatch(getAllDetailsData({ allDetails }));
      // dispatch(contentDetails(targetContent));
    }

  }, [detailsPageData]);
  const [session_id_status, set_session_id_status] = useState(false)
  const invalidSession = localStorage.getItem("invalidsession") === "true";

  useEffect(() => {
    if (invalidSession) {
      set_session_id_status(true);
    }
  }, [invalidSession]);
  const addwaterlatertoast = useSelector((state) => state.details);
  const waterlaterToggle = useSelector((state) => state.details?.waterlaterToggle);
  const errormessagestaus = useSelector((state) => state?.details?.errorstatus)
  const firstIndexValue = useSelector((state) => state?.landing?.firstIndex)

  // console.log("waterlaterToggle",waterlaterToggle)
  const loading = useSelector((state) => state?.details?.loading);
  const [buttonarray, setbuttonarray] = useState([]);
  const ts = parseInt(new Date().getTime() / 1000);
  const list_id = useSelector(
    (state) => state?.details?.getAllDetails?.data?.playlists
  );
  // console.log("this is the list_id", list_id);
  const listItem_id = useSelector((state) => state?.details?.addwatchlater);
  // console.log("token of gratitude", listItem_id);
  const navigate = useNavigate();
  const [preview, setPreview] = useState(false);
  const onclikedStatus = useSelector((state) => state?.common?.clicked)

  useEffect(() => {
    if (!!getAllDetail) {
      if (getAllDetail?.stream_info?.preview_available == true) {
        setPreview(true);
      }
    }
  }, [getAllDetail]);
  useEffect(() => {

  }, [detailsPageData])
  const showsIcon = [
    [
      {
        // name: continueWatching === true ? "Resume" :`${detailsPageData?.last_episode?.title}`,
        name: continueWatching === true && getAllDetail?.data?.stream_info?.percentage !== 100 ? "Resume" : "Watch Now",
        title: continueWatching === true && getAllDetail?.data?.stream_info?.percentage !== 100 ? "Resume" : "Watch Now",
        focusedIcons:
          continueWatching === true && getAllDetail?.data?.stream_info?.percentage !== 100
            ?
            btn_continueWatching_active : btn_watchNow_active,
        notFocused:
          continueWatching === true && getAllDetail?.data?.stream_info?.percentage !== 100
            ? btn_continueWatching_inactive : btn_watchNow_inactive
        ,
        NavType: continueWatching === true ? getAllDetail?.data?.stream_info?.percentage : 0,
        alt: "",
      },
    ],
    [
      // {
      //   name: "Season & Episodes",
      //   focusedIcons: btn_seasonsAndTrailers_active,
      //   notFocused: btn_seasonsAndTrailers_inactive,
      //   NavType: "",
      //   alt: "",
      // },
      // {
      //   name: "Recommended",
      //   focusedIcons: btn_recommended_active,
      //   notFocused: btn_recommended_inactive,
      //   NavType: "",
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
        alt: "",
      },
    ],
  ];

  // useEffect(() => {
  //   if (!!detailsPageData) {
  //     console.log(detailsPageData.subcategory_flag=="yes","ddddddddddd",showsIcon[1])
  //     if(detailsPageData?.subcategory_flag==="yes"){
  //     showsIcon[1].unshift(
  //       {
  //         name: "Seasons & Episodes",
  //         focusedIcons:btn_seasonsAndTrailers_active,
  //         notFocused: btn_seasonsAndTrailers_inactive,
  //         NavType: "",
  //         alt: "",
  //       }
  //     )
  //     }
  //   }
  // }, [detailsPageData,waterlaterToggle])
  useEffect(() => {
    setbuttonarray(showsIcon);
    const continueButton = {
      name: "Start Over",
      focusedIcons: btn_playFromBeginning_active,
      notFocused: btn_playFromBeginning_inactive,
      space: true,
      alt: "",
    };

    if (continueWatching == true && getAllDetail?.data?.stream_info?.percentage !== 100) {
      showsIcon.map((each, i) => {
        if (i == 0) {
          each.push(continueButton);
        }
      });
    }
    if (detailsPageData?.theme == "show") {
      showsIcon[1].unshift(
        {
          name: "All Episodes",
          focusedIcons: btn_seasonsAndTrailers_active,
          notFocused: btn_seasonsAndTrailers_inactive,
          NavType: "",
          alt: "",
        }
      )
    }
  }, [detailsPageData, detailsPD?.continue, content_id, detailsPD?.waterlaterToggle]);

  useEffect(() => {
    focusSelf();
  }, [showsIcon]);

  const enterPress = (details, data) => {
    if (data.name != "Season & Episodes" && data.name != "My List" && data.name != "Info") {
      setButtonPressed(true)
    }

    const conditionnavigation = true;
    const targetContent = details?.last_episode || details;
    dispatch(contentDetails(targetContent));
    if (data.title == "Resume") {
      if ((localStorage.getItem("session_id") == undefined ||
        localStorage.getItem("session_id") == null) &&
        detailsPageData?.access_control?.login_required == true) {
        navigate("/loginManditory")
      } else {
        navigate("/player/vod");
      }
    } else if (data.name === "Start Over" && continueWatching) {
      if ((localStorage.getItem("session_id") == undefined ||
        localStorage.getItem("session_id") == null) &&
        detailsPageData?.access_control?.login_required == true) {
        navigate("/loginManditory")
      } else {
        dispatch(contentDetails(targetContent));
        dispatch(positionInPlayer("00:00:00"));
        navigate("/player/vod");
      }
    }
    else if (data.name === "All Episodes") {
      // dispatch(activeSeasonData(detailsPageData?.subcategories[0]));
      const param = {
        catalog_object_friendly_id: detailsPageData?.catalog_object?.friendly_id,
        friendly_id: detailsPageData?.friendly_id,
        subcategory_friendly_id: detailsPageData?.subcategories[0]?.friendly_id,

      };
      dispatch(getSeason(param));
      navigate(
        `/season/${catalog_object_friendly_id}/${friendly_id}/${detailsPageData?.subcategories[0]?.friendly_id}`
      );
      dispatch(activeIndexSeason(detailsPageData?.subcategories[0]?.title))
    } else if (data.name === "My List") {
      const targetEpisode = detailsPageData?.last_episode || detailsPageData;
      const videodetails = {
        catalog_id: targetEpisode?.catalog_id,
        content_id: targetEpisode?.content_id,
        media_type: theme,
        auth_token: getAuthToken(),
      };
      if (localStorage.getItem("session_id") == undefined || localStorage.getItem("session_id") == null) {
        navigate("/loginManditory")
      }

      if (waterlaterToggle === false) {

        // setwatchlaterItem(false)

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
              }
              else {
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
    else if (data.title === "Watch Now") {
      if ((localStorage.getItem("session_id") == undefined ||
        localStorage.getItem("session_id") == null) &&
        detailsPageData?.access_control?.login_required == true) {
        navigate("/loginManditory")
      } else {
        dispatch(positionInPlayer("00:00:00"));
        navigate("/player/vod");
      }
    } else if (data.name === "Info") {
      navigate(`/info`);
    }
  };
  let backgroundStyle;
  let backgroundImg = '';
  // console.log(Object.keys(detailsPageData)?.length > 0);
  if (Object.keys(detailsPageData).length > 0) {
    // console.log(detailsPageData);
    // backgroundImg = detailsPageData
    //   ? detailsPageData?.thumbnails?.medium_16_9?.url
    //   : "";


    if (detailsPageData && detailsPageData?.last_episode) {


      if (detailsPageData?.last_episode?.thumbnails?.medium_16_9) {
        backgroundImg = detailsPageData?.last_episode?.thumbnails?.medium_16_9?.url

      }
      else if (detailsPageData && detailsPageData?.thumbnails) {


        if (detailsPageData?.thumbnails?.medium_16_9) {
          backgroundImg = detailsPageData?.thumbnails?.medium_16_9?.url;
        }
      }
    } else {
      if (detailsPageData && detailsPageData?.thumbnails) {


        if (detailsPageData?.thumbnails?.medium_16_9) {
          backgroundImg = detailsPageData?.thumbnails?.medium_16_9?.url;
        }
      }
    }
    backgroundStyle = {
      backgroundImage: `linear-gradient(0deg, rgb(24,29,37), rgba(24,29,37,0)),linear-gradient(90deg, rgb(24,29,37), rgba(24,29,37,0)), url('${backgroundImg}')`,
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
        access_token: access_token,
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
      dispatch(setErrorMessageStatus(false))
      localStorage.setItem("invalidsession", false)
      navigate('/activate')
    }
    else if (confirm === "Continue without login") {

      dispatch(setErrorMessageStatus(false))
      localStorage.removeItem("session_id")
      localStorage.removeItem("image_url")
      localStorage.removeItem("sidebarProfileName")

      localStorage.setItem("invalidsession", false)


      set_session_id_status(false);

      console.log("After removing invalidsession:", localStorage.getItem("invalidsession"), errormessagestaus, localStorage.getItem("session_id"));
    }
    else {
      navigate("/plans")
    }
  }
  const [subscribed, setSubscribed] = useState("false")
  useEffect(() => {
    setSubscribed(localStorage.getItem("is_subscribed"))
  }, [getAllDetail])


  const handleTimeUpdate = useCallback((currentTime) => {

  }, []);

  const handleEnded = useCallback((currentTime) => {

  }, []);
  const processCaption = (captions) => {
    return ItemCaption(captions);
  };
  return loading == true ? (
    <Loader />
  ) : (
    <FocusContext.Provider value={focusKey}>
      <div className="main-card">
        {detailsPageData?.access_control?.is_free == false ? (
          <img className="premium-tag-player" src={tag_premium} alt="" />
        ) : (
          ""
        )}
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
        <div className="parent-container">
          <div className="banner-detailspage-container">
            {detailsPageData?.title_image_display == true ? (
              <img
                className="banner-img"
                src={detailsPageData?.tv_banner_title_image}
                alt=""
              />
            ) : (
              <h1 className="banner-title">{detailsPageData?.display_title}</h1>
            )}
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
              {/* {!!detailsPageData?.is_original &&
                detailsPageData?.is_original === "Yes" ? (
                <div className="exclusive-container">
                  <div className="exclusive-gradient"></div>

                  <h1 className="etv-win-exclusive">ETV Win Exclusive</h1>
                </div>
              ) : (
                ""
              )} */}
            </div>
          </div>

          <hr className="hrline" />

          <div className="movie-icons">
            {buttonarray.map((each, i) => {
              // console.log(each, "each");
              return (
                <>
                  {i == 0 ? (
                    <div className="space-detailspageicons" >
                      {each.map((each) => (
                        <ShowsDetailsIcons
                          data={each}
                          index={i}
                          details={detailsPageData}
                          onEnterPress={() =>
                            enterPress(detailsPageData, each)
                          }
                          enterPress={enterPress}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-detailspageicons">
                      {each.map((each) => (
                        <ShowsDetailsIcons
                          data={each}
                          index={i}
                          details={detailsPageData}
                          onEnterPress={() =>
                            enterPress(detailsPageData, each)
                          }
                          enterPress={enterPress}
                        // onClick={()=>enterPress(detailspage, each)}
                        />
                      ))}
                    </div>
                  )}
                </>
              );
            })}
          </div>
        </div>

      </div>

      {addwaterlatertoast.addwatchlatertoast && (
        <Alert
          imgicon={icon_error}
          text="Added to My List!"
          setalertpopup={setalertpopup}
          backgroundcolor="#E6EFFA"
          bordercolor="#076DE3"
        />
      )}
      {addwaterlatertoast.removewatchtoast && (
        <Alert
          imgicon={icon_error}
          text="Removed from My List!"
          setalertpopup={setalertpopup}
          backgroundcolor=" #E6EFFA"
          bordercolor="#076DE3"
        />
      )}
      {
        (localStorage.getItem("session_id") !== null && localStorage.getItem("session_id") !== undefined && errormessagestaus === true) || session_id_status == true ?
          <Popup
            alert=""
            alertType="Session Alert"
            heading="Session Expired"
            Description="You have logged out from your device,please login again to continue."
            from={"session"}
            onSubmit={onSubmit}
          /> : ""
      }
    </FocusContext.Provider>
  );
};

export default ShowsDetails;