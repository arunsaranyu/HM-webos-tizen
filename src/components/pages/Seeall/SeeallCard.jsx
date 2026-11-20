import React, { useCallback, useState, useEffect, useRef } from 'react'
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import "../../reusable/Card/Card.scss"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { contentDetails, getAllDetailsData, getupNext, positionInPlayer } from '../../../redux/reducer/detailsReducer.jsx';
import { activeIndexEpisode, getUpdateSeason } from "../../../redux/reducer/seasonReducer.jsx"
import md5 from 'md5';
import SeeallCardDetails from './SeeallCardDetails.jsx';
import { auth_token, getAuthToken, secret_key } from '../../../assets/constant/index.jsx';
import "../Season/Season.scss"
import down_Arrow from '../../../assets/images/icon_downArrow.svg'
import up_Arrow from '../../../assets/images/icon_upArrow.svg';
import { onClicked } from "../../../redux/reducer/commonReducer.jsx";
import Popup from '../../../helper/Popup.jsx';

const SeeallCard = (props) => {
  const { homelink, data, onFocus, title, from, index, length, updateCount, count, multiplier, layout, friendly_id } = props;
  const SeasonData = useSelector((state) => state?.season?.data);
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const continueWatchingData = useSelector((state) => state?.landing?.watchHistory)
  let [seealltext, setSeealltext] = useState(true)
  let [page, setpage] = useState(1)
  const onclikedStatus = useSelector((state) => state?.common?.clicked)
  const { ref, focusKey, hasFocusedChild } = useFocusable({})

  let iterate;
  if (from === "home" || from == "kids" || from == "health" || from == "food" || from === "movies" || from == "live" || from === "shows" || from === "news" || from === "browser" || from === "trending" || from === "search" || from === "browserdetails" || from === "morechannels") {
    iterate = data.catalog_list_items;

    if (!!iterate) {
      const seeAll = { theme: "seeall", title: "See all", description: "See all" };
      if (iterate.length >= 5) {
        iterate = iterate.slice(0, 5);
        iterate = [...iterate, seeAll];
      }
    }
  }
  else if (from == "search-result" || from == "watchlater") {
    iterate = Array.isArray(data) ? data : (data?.items || data?.catalog_list_items || []);
  }
  else if (from == "seeall") {
    if (data?.display_title === "Continue Watching" || title?.includes("Continue Watching")) {
      const cw = continueWatchingData;
      iterate = Array.isArray(cw) ? cw : (cw?.items || cw?.catalog_list_items || (Array.isArray(data) ? data : (data?.items || data?.catalog_list_items || [])));
    } else {
      iterate = data?.catalog_list_items || (Array.isArray(data) ? data : (data?.items || []));
    }
  }
  else if (from == "details" || from == "search-result" || from == "watch-history" || from == "continue-watching" || from == "season") {
    iterate = Array.isArray(data) ? data : (data?.items || data?.catalog_list_items || (Array.isArray(continueWatchingData) ? continueWatchingData : (continueWatchingData?.items || [])));
  }

  console.log("data", from, data, iterate)

  const onRowFocus = useCallback(
    ({ y }) => {
      if (!!ref.current) {
        ref.current.scrollTop = y
      }
    },
    [ref]
  )

  const renderDetails = (data, friendly_id) => {
    const conditionNavigation = true;
    dispatch(contentDetails(data));

    const ts = parseInt(new Date().getTime() / 1000);

    const isContinueWatching =
      data?.theme !== "seeall" && (
        title?.includes("Continue Watching") ||
        from === "watch-history" ||
        from === "continue-watching" ||
        friendly_id === "watch-history" ||
        friendly_id === "continue-watching" ||
        friendly_id === "continue_watching"
      );

    if (isContinueWatching) {
      const session_id = localStorage.getItem("session_id") || "";
      const contentId = data?.content_id || data?.id;
      const catalogId = data?.catalog_id || data?.catalog_object?.catalog_id;

      if (!session_id && data?.access_control?.is_free !== true) {
        navigate("/loginManditory");
        return;
      }
      if (localStorage.getItem("is_subscribed") === "false" && data?.access_control?.is_free === false) {
        dispatch(onClicked("clicked"));
        return;
      }

      if (contentId && catalogId) {
        const allDetails = {
          content_id: contentId,
          catalog_id: catalogId,
          auth_token: getAuthToken(),
          id: session_id,
          md5: md5(catalogId + contentId + session_id + ts + secret_key),
          ts: String(ts),
          category: "",
          region: localStorage.getItem("region") || "IN",
        };

        dispatch(positionInPlayer(data?.pos || data?.play_back_time || "00:00:00"));
        dispatch(getAllDetailsData({ allDetails, navigate }));
        return;
      }
    }
    const theme = data?.theme || data?.content_type;
    if (theme == "livetv") {
      navigate(`/moviesdetails/${theme}/${data?.catalog_object?.friendly_id}/${data?.friendly_id}/${data.content_id}/${data.catalog_id}`);
    } else if (
      theme == "show_episode" ||
      theme == "episode" ||
      theme == "videolist"
    ) {
      const showFriendlyId = data?.show_object?.friendly_id || data?.catalog_object?.friendly_id;
      navigate(
        `/showsdetails/${theme}/${showFriendlyId}/${data?.friendly_id}/${data?.content_id}/${data?.catalog_id}`
      );
    } else if (
      theme == "movie" ||
      theme == "video" ||
      theme == "videolist"
    ) {
      navigate(
        `/moviesdetails/${theme}/${data?.catalog_object?.friendly_id}/${data?.friendly_id}/${data.content_id}/${data.catalog_id}`
      );
    } else if (theme == "show") {
      if (!!data.last_episode) {
        navigate(
          `/showsdetails/${theme}/${data?.catalog_object?.friendly_id}/${data?.friendly_id}/${data?.last_episode?.content_id}/${data?.last_episode.catalog_id}`
        );
      } else {
        navigate(
          `/showsdetails/${theme}/${data?.catalog_object?.friendly_id}/${data?.friendly_id}/${data?.content_id}/${data?.catalog_id}`
        );
      }
    }
    else if (theme === "seeall") {
      navigate(`/seeall/${friendly_id}`)
    }
    else if (theme === "catalog_list") {
      navigate(`/catalog/${data.friendly_id}`)
    } else {
      const catalogFriendlyId = data?.catalog_object?.friendly_id || data?.show_object?.friendly_id || "movies";
      navigate(`/moviesdetails/${theme || 'movie'}/${catalogFriendlyId}/${data?.friendly_id}/${data?.content_id}/${data?.catalog_id}`);
    }
  }


  const onKeyDown = useCallback((event) => {
    if (event.key === 'ArrowRight') {
      if (parseInt(localStorage.getItem("seasonseeall")) == data?.total_items_count || (parseInt(localStorage.getItem("seasonseeall")) % 4 == 0 && localStorage.getItem("focusedelement") !== "episodebutton")) {
        event.stopPropagation();
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  const activeSeasonData = useSelector((state) => state?.season?.activeSeasonData)
  let totalseeitems
  if (from == "details" || from == "search-result" || from == "watch-history" || from == "continue-watching" || from == "season") {
    totalseeitems = iterate?.length || (Array.isArray(data) ? data.length : (data?.items?.length || data?.total_items_count || 0));
  }
  else if (data?.display_title === "Continue Watching" || title?.includes("Continue Watching")) {
    totalseeitems = iterate?.length || (Array.isArray(continueWatchingData) ? continueWatchingData.length : (continueWatchingData?.items?.length || 0));
  }
  else {
    totalseeitems = data?.catalog_list_items?.length ? data?.catalog_list_items?.length : (data?.total_items_count || (iterate?.length || 0));
  }
  const remainingitems = totalseeitems % 4
  useEffect(() => {

    if (totalseeitems == parseInt(localStorage.getItem("seasonseeall"))) {
      setSeealltext(false)
    }
    else if (parseInt(localStorage.getItem("seasonseeall")) > totalseeitems - remainingitems) {
      setSeealltext(false)
    }
    else if (remainingitems == 0) {
      if (parseInt(localStorage.getItem("seasonseeall")) > totalseeitems - 4) {
        setSeealltext(false)
      }
      else {
        setSeealltext(true)
      }
    }
    else {
      setSeealltext(true)
    }
  }, [parseInt(localStorage.getItem("seasonseeall"))])

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
      <div data-id={index} className={layout?.includes("2_3") ? "card-wrapper-vertical-seeall" : "card-wrapper-seeall"}>
        {from !== "details" && <div className='row-title'>{title}</div>}
        <div ref={ref} className='card-block-seeall' >
          <div className='card-seeall-content' >
            {iterate &&
              iterate.map((ele, i) => {
                return (
                  <SeeallCardDetails
                    key={i}
                    from={from}
                    index={i + 1}
                    data={ele}
                    page={page}
                    setPage={setpage}
                    ui_type={data.ui_type}
                    display_title={title}
                    onFocus={onRowFocus}
                    // onArrowPress={onRowFocus}
                    onEnterPress={() => {
                      renderDetails(ele, friendly_id);
                    }}
                    friendly_id={friendly_id}
                    renderDetails={renderDetails}
                    layout={layout}
                  />
                );
              })}
          </div>
        </div>
        {seealltext && <div className='row-title' style={{ textAlign: 'center' }}><img className="arrowbtn" src={down_Arrow} /></div>}
        {seealltext == false && <div className='row-title' style={{ textAlign: 'center' }}><img className="arrowbtn" src={up_Arrow} /></div>}
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
      </div>
    </FocusContext.Provider>
  )
}

export default SeeallCard