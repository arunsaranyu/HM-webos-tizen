import React, { useCallback, useEffect, useState } from "react";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../reusable/Card/Card.jsx";
import Loader from "../../../helper/Loader.jsx";
import { sidebarDisable } from "../../../redux/reducer/landingReducer.jsx";
import tag_premium from "../../../assets/images/tag_premium.svg";
import { getWatchLater, setErrorMessageStatus } from "../../../redux/reducer/watchlaterReducer.jsx";
import StaticReusable from "../../reusable/StaticReusable/StaticReusable.jsx";
import nodatafound from "../../../assets/images/nodatafound.png";
import Popup from "../../../helper/Popup.jsx";
import dot from "../../../assets/images/dot.svg"
import { useNavigate } from "react-router-dom";
import { onClicked } from "../../../redux/reducer/commonReducer.jsx";
import ItemCaption from "../../reusable/ItemCaption/ItemCaption.jsx";
import SeeallCard from "../Seeall/SeeallCard.jsx";

const Watchlater = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ref, focusSelf, focusKey } = useFocusable({});
  const loading = useSelector((state) => state?.watchlater?.loading);
  const watchlaterData = useSelector((state) => state?.watchlater?.data);
  const bannerData = useSelector((state) => state?.common?.banner);
  const [count, setcount] = useState(1);
  const [multiplier, setmultiplier] = useState(1);
  const onclikedStatus = useSelector((state) => state?.common?.clicked)
  const errormessagestaus = useSelector((state) => state?.watchlater?.errorstatus)

  let dataFilter;
  dataFilter = watchlaterData;
  useEffect(() => {
    dispatch(sidebarDisable())
    dispatch(onClicked(""));
    dispatch(setErrorMessageStatus(false))
    if (!!localStorage.getItem("session_id")) {
      dispatch(getWatchLater());
    }
  }, []);
  useEffect(() => {
    focusSelf();
  }, [watchlaterData]);
  const onRowFocus = useCallback(
    ({ y }) => {
      if (!!ref.current) {
        ref.current.scrollTop = y;
      }
    },
    [ref]
  );

  const updateCount = () => {
    setcount(count + 1);
    setmultiplier(multiplier + 1);
  };
  let backgroundStyle;
  let backgroundImg;
  // console.log(Object.keys(bannerData)?.length > 0)
  if (Object.keys(bannerData).length > 0) {
    // console.log(bannerData)
    backgroundImg = bannerData?.thumbnails
      ? bannerData.thumbnails?.medium_16_9
        ? bannerData?.thumbnails?.medium_16_9.url
        : { url: "" }
      : { url: "" };
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
    if (confirm == "Go Back") {
      navigate(-1)
    }
    else if (confirm === "Login") {

      localStorage.removeItem("session_id")
      localStorage.removeItem("image_url")
      localStorage.removeItem("sidebarProfileName")
      dispatch(setErrorMessageStatus(false))
      navigate('/activate')
    }
    else if (confirm === "Continue without login") {

      dispatch(setErrorMessageStatus(false))
      localStorage.removeItem("session_id")
      localStorage.removeItem("image_url")
      localStorage.removeItem("sidebarProfileName")
      navigate(-1)
    }
  };
  useEffect(() => {

  }, [onclikedStatus])
  useEffect(() => { }, [bannerData])
  const onSubmitsubs = (confirm) => {
    dispatch(onClicked(""))

    if (confirm === "Go Back") {

      dispatch(onClicked(""))
    }
    else {
      navigate("/plans")
    }
  }
  const processCaption = (captions) => {
    // Split captions by " . "
    const parts = captions?.item_captions?.split(" . ");

    // Prepare an array to hold JSX elements
    const captionElements = [];

    // Loop through parts array and add color to dots
    !!parts && parts.forEach((part, index) => {
      // If it's not the last part, add dot with color
      if (index < parts.length - 1) {
        captionElements.push(<div style={{ color: '#E1E1E2', display: "inline-flex" }}>{part} <div style={{ display: "flex", alignItems: "center" }} > <img class="dot-style" src={dot} alt="" />  </div></div>);
      } else {
        // Otherwise, add the last part without dot
        captionElements.push(<div style={{ color: '#E1E1E2', display: "inline-flex", }}>{part}</div>);
      }
    });

    return captionElements;
  };
  return (
    <FocusContext.Provider value={focusKey}>

      {loading == true ? <Loader /> : watchlaterData?.items?.length == 0 ?
        < Popup
          alert="Alert"
          image={nodatafound}
          alertType="Empty mylist"
          heading=""
          Description="No items added to mylist"
          from={"watchlater"}
          onSubmit={onSubmit}
        /> :
        <div className="main-card">
          <div></div>
          <div></div>
          {bannerData?.access_control?.is_free == false ? (
            <img className="premium-tag-player" src={tag_premium} alt="" />
          ) : (
            ""
          )}
          <div className="background-container">
            <div className="poster" style={backgroundStyle}>
              {/* <Player playerType="live-banner" /> */}
            </div>
          </div>
          {/* <div className='home-background-container'>
                { /** videoUrl needs to be updated dynamically */}
          {/* <BannerPlayer
                    videoUrl={'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                    posterUrl={backgroundImg}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleEnded}
                /> */}
          {/* </div> */}
          <div className="parent-container">
            <div className="banner-container">
              {bannerData?.title_image_display == true ? (
                <img
                  className="banner-img"
                  src={bannerData?.title_image}
                  alt=""
                />
              ) : (
                <h1 className='banner-title'>
                  {(bannerData?.theme == "show_episode" || bannerData?.theme == "episode" || bannerData?.theme == "episode") ? (bannerData?.show_name !== "" ? bannerData?.show_name : bannerData?.title) : bannerData?.title}
                </h1>
              )}
              <div className="banner-description-container">
                {/* <p className="banner-captions">{ItemCaption(bannerData)}</p> */}
                <div className="banner-description">
                  {bannerData?.short_description}
                </div>
                {/* {bannerData?.is_original ==="Yes" ? (
                <div className="exclusive-container">
                  <div className="exclusive-gradient"></div>

                  <h1 className="etv-win-exclusive">ETV Win Exclusive</h1>
                </div>
              ) : (
                ""
              )} */}
              </div>
            </div>

            {!!watchlaterData && (
              <div className="content-container" ref={ref}>
                <SeeallCard
                  index={"0"}
                  key={""}
                  title={"My List"}
                  data={watchlaterData}
                  layout={""}
                  onFocus={onRowFocus}
                  from={"watchlater"}
                  friendly_id={""}
                  homelink={""}
                  count={""}
                  length={dataFilter?.items?.length}
                  updateCount={updateCount}
                  multiplier={multiplier}
                />
              </div>
            )}
          </div>
        </div>

      }
      {
        onclikedStatus == "clicked" ?
          <Popup
            alert=""
            alertType="Subscription Alert"
            heading="No Subscription Found"
            Description="You need a subscription to access the content"
            from={"details"}
            onSubmit={onSubmitsubs}
          /> : ""
      }
      {
        localStorage.getItem("session_id") != null && localStorage.getItem("session_id") != undefined && errormessagestaus == true ?
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
  )
};

export default Watchlater;
