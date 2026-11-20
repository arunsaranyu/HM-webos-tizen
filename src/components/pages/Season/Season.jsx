import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  activeSeasonData,
  getSeason,
  getUpdateSeason,
} from "../../../redux/reducer/seasonReducer.jsx";
import {
  sidebarDisable,
  sidebarAllow,
} from "../../../redux/reducer/landingReducer.jsx";
import { season } from "../../../api/index.jsx";
import SeasonButton from "./SeasonButton.jsx";
import ShowsDetails from "../ShowsDetailsPage/ShowsDetails.jsx";
import Card from "../../reusable/Card/Card.jsx";
import { EpisodeButton } from "./EpisodeButton.jsx";
import "./Season.scss";
// import CarouselWithItems from "./ExampleSeasonButtons.jsx";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { useParams } from "react-router-dom";
import Seasonlist from "./Seasonlist.jsx";
import SideVideo from "../../reusable/SideVideo/SideVideo.jsx";
import Popup from "../../../helper/Popup.jsx";

let initialSeasonData = {};

const Season = () => {
  // const renderEpisode = (data, index) => {
  //   console.log( 
  //     catalog_object_friendly_id,
  //     friendly_id,
  //     subcategory_friendly_id,
  //     index
  //   );

  //   const value = {
  //     catalog_object_friendly_id: catalog_object_friendly_id,
  //     friendly_id: friendly_id,
  //     subcategory_friendly_id: data?.friendly_id,
  //     page: index,
  //   };
  //   dispatch(getUpdateSeason(value));
  // };
  // const renderSeason = (data) => {
  //   console.log(data);
  //   console.log(
  //     catalog_object_friendly_id,
  //     friendly_id,
  //     subcategory_friendly_id
  //   );
  //   const value = {
  //     catalog_object_friendly_id: catalog_object_friendly_id,
  //     friendly_id: friendly_id,
  //     subcategory_friendly_id: data?.friendly_id,
  //   };
  //   dispatch(activeSeasonData(data));
  //   console.log(data);
  //   dispatch(getSeason(value));
  // };


  const dispatch = useDispatch();
  const { ref, focusKey, focusSelf } = useFocusable({});
  var { catalog_object_friendly_id, friendly_id, subcategory_friendly_id } = useParams();
  var seasonlistcount = useSelector((state) => state?.season?.activeSeason);
  const detailsPageData = useSelector((state) => state?.details?.data);
  const SeasonData = useSelector((state) => state?.season?.data);
  const seasonindex = useSelector((state) => state?.season?.seasonIndex)
  if (Object.keys(initialSeasonData).length === 0 && SeasonData) {
    initialSeasonData = SeasonData;
  }
  else if (Object.keys(initialSeasonData).length > 0) {
    if (seasonindex != initialSeasonData?.title || initialSeasonData?.content_id !== SeasonData?.content_id) {
      initialSeasonData = SeasonData;
    }
  }

  // console.log("seasonlistcount",detailsPageData);

  if (detailsPageData?.subcategory_flag === "yes") {
    dispatch(activeSeasonData(detailsPageData?.subcategories));
  }
  const episodesPerPage = 20;
  // const [buttons, setButtons] = useState([]);

  // useEffect(() => {
  //   const generateButtons = () => {
  //     const buttonsArray = [];
  //     if (SeasonData?.episode_count < 20) {
  //       setButtons([]);
  //     } else {
  //       for (
  //         let i = 0;
  //         i < Math.ceil(SeasonData?.episode_count / episodesPerPage);
  //         i++
  //       ) {
  //         const startRange = i * episodesPerPage + 1;
  //         const endRange = Math.min(
  //           (i + 1) * episodesPerPage,
  //           SeasonData?.episode_count
  //         );
  //         buttonsArray.push({
  //           key: `E-${startRange} - E-${endRange}`,
  //           title: `E-${startRange} - E-${endRange}`,
  //           start: startRange,
  //           end: endRange,
  //         });
  //       }
  //     }
  //     setButtons(buttonsArray);
  //   };

  //   generateButtons();
  // }, [SeasonData?.episode_count, SeasonData]);

  // console.log(SeasonData);

  const onAssetFocus = useCallback(({ y }) => {
    if (!!ref.current) {
      ref.current.scrollTop = y;
    }
  }, [ref]);
  const [session_id_status, set_session_id_status] = useState(false)
  const invalidSession = localStorage.getItem("invalidsession") === "true";

  useEffect(() => {
    if (invalidSession) {
      set_session_id_status(true);
    }
  }, [invalidSession]);

  const onSubmit = (confirm) => {

    if (confirm === "Login") {
      localStorage.removeItem("session_id")
      localStorage.setItem("invalidsession", false)
      localStorage.removeItem("image_url")
      localStorage.removeItem("sidebarProfileName")
      navigate('/activate')
    }
    else if (confirm === "Continue without login") {
      localStorage.removeItem("session_id")
      set_session_id_status(false)
      localStorage.setItem("invalidsession", false)
      localStorage.removeItem("image_url")
      localStorage.removeItem("sidebarProfileName")
      dispatch(sidebarAllow())
    }
  }
  return (
    <div className="main-card">
      <FocusContext.Provider value={focusKey}>
        <div className="parent-container">
          {detailsPageData?.title_image_display == true ? (
            <img id="season-seeall-mt"
              className="banner-img "
              src={detailsPageData?.title_image}
              alt=""
            />
          ) : (
            <h1 className="season-title">{detailsPageData?.title}</h1>
          )}
          <div className="season-container" ref={ref}>
            <div className="season-card" >
              <Seasonlist data={seasonlistcount} subcategory_flag={detailsPageData?.subcategory_flag} onFocus={onAssetFocus} />
            </div>
            <div className="hor-line"></div>
            <SideVideo data={initialSeasonData?.items} from="season" onFocus={onAssetFocus} />
          </div>
          {/* <div className="season-conatainer" ref={scrollingRef}>
            <div className="card-content">
              {detailsPageData?.subcategories?.length > 0 &&
                detailsPageData?.subcategories?.map((each) => (
                  <SeasonButton
                    data={each}
                    onEnterPress={() => {
                      renderSeason(each);
                      navigate("/seasonsSeeAll")
                    }}
                    onFocus={onAssetFocus}
                    renderDetails={renderSeason}
                  />
                ))}
            </div>
          </div>
          {
            <div className="episode-button-container" ref={episodeRef}>
              <div className="card-content">
                {SeasonData &&
                  buttons &&
                  buttons?.map((each, i) => (
                    <EpisodeButton
                      data={each}
                      onEnterPress={() => {
                        renderEpisode(each, i);
                      }}
                      onFocus={onScroll}
                      index={i}
                      renderDetails={renderEpisode}
                    />
                  ))}
              </div>
            </div>
          }

          {SeasonData && <Card data={SeasonData} from={"season"} index={"0"} />} */}
        </div>
        {
          localStorage.getItem("session_id") != null && localStorage.getItem("session_id") != undefined && session_id_status == true ?
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
    </div>
  );
};

export default Season;
