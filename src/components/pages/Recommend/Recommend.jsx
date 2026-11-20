import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecommendmovies } from "../../../redux/reducer/recommendReducer.jsx";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { sidebarDisable } from "../../../redux/reducer/landingReducer.jsx";
import Card from "../../reusable/Card/Card.jsx";
import Loader from "../../../helper/Loader.jsx";
import tag_premium from "../../../assets/images/tag_premium.svg";
import { useNavigate, useParams } from "react-router-dom";
import NoData from "../../reusable/NoData/NoData.jsx";
import Popup from "../../../helper/Popup.jsx";
import nodatafound from "../../../assets/images/nodatafound.png";
import ItemCaption from "../../reusable/ItemCaption/ItemCaption.jsx";

const Recommend = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ref, focusSelf, focusKey } = useFocusable({});
  const loading = useSelector((state) => state?.recommend?.loading);
  const recommendData = useSelector((state) => state?.recommend?.data);
  const bannerData = useSelector((state) => state?.common?.banner);
  const [count, setcount] = useState(1);
  const [multiplier, setmultiplier] = useState(1);

  let { catalog_object_friendly_id, friendly_id, genres, display_title } =
    useParams();

  let dataFilter = recommendData;

  useEffect(() => {
    const data = {
      catalog_object_friendly_id: catalog_object_friendly_id,
      friendly_id: friendly_id,
      genres: genres,
    };
    dispatch(sidebarDisable());
    dispatch(getRecommendmovies(data));
  }, []);
  useEffect(() => {
    focusSelf();
  }, [recommendData]);
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

  if (Object.keys(bannerData).length > 0) {

    backgroundImg = bannerData?.thumbnails
      ? bannerData.thumbnails?.high_16_9
        ? bannerData?.thumbnails?.high_16_9.url
        : { url: "" }
      : { url: "" };
    backgroundStyle = {
      backgroundImage: `linear-gradient(90deg, rgb(24,29,37), rgba(24,29,37,0)), url('${backgroundImg}')`,
    };
  }

  const onSubmit = (confirm) => {
    navigate(-1)
  };
  // console.log("recommended",title);
  return loading == true ? (
    <Loader />
  ) : (
    <FocusContext.Provider value={focusKey}>
      {recommendData?.items?.length == 0 ? (
        < Popup
          alert="Alert"
          image={nodatafound}
          alertType="Empty Data"
          heading=""
          Description="No Data Found"
          from={"recommended"}
          onSubmit={onSubmit}
        />
      ) : (
        <div className="main-card">
          <div></div>
          <div></div>
          {bannerData?.access_control?.is_free == false ? (
            <img className="premium-tag-player" src={tag_premium} alt="" />
          ) : (
            ""
          )}
          <div className="background-container-fullscreen">
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
                <h1 className="banner-title">{bannerData?.title}</h1>
              )}
              <div className="banner-description-container">
                {/* <p className="banner-captions">{ItemCaption(bannerData)}</p> */}
                <div className="banner-description">
                  {bannerData?.short_description}
                </div>
                {/* {bannerData?.is_original &&
                bannerData?.is_original === "Yes" ? (
                  <div className="exclusive-container">
                    <div className="exclusive-gradient"></div>

                    <h1 className="etv-win-exclusive">ETV Win Exclusive</h1>
                  </div>
                ) : (
                  ""
                )} */}
              </div>
            </div>

            {!!recommendData && (
              <div className="content-container" ref={ref}>
                <Card
                  index={"0"}
                  key={""}
                  title={`Recommended - ${display_title}`}
                  data={recommendData}
                  layout={""}
                  onFocus={onRowFocus}
                  from={"recommend"}
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
      )}
    </FocusContext.Provider>
  );
};

export default Recommend;
