import React, { useCallback, useRef, useEffect, useState } from "react";
import CardDetails from "../CardDetails/CardDetails.jsx";
import {
  FocusContext,
  setFocus,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import "./Card.scss";

import { useDispatch, useSelector } from "react-redux";

import { getSeeall } from "../../../redux/reducer/seeallReducer.jsx";
import { useNavigate } from "react-router-dom";
import { auth_token, getAuthToken, secret_key } from "../../../assets/constant/index.jsx";
import md5 from "md5";
import { contentDetails, getAllDetailsData, getupNext, positionInPlayer } from "../../../redux/reducer/detailsReducer.jsx";



import { getUpdateCatalogData } from "../../../redux/reducer/catalogReducer.jsx";
import { onClicked } from "../../../redux/reducer/commonReducer.jsx";
import Popup from "../../../helper/Popup.jsx";
import { signoutall } from "../../../redux/reducer/loginReducer.jsx";
import { getUpdateLandingData } from "../../../redux/reducer/landingReducer.jsx";
import { activeIndexSidebar } from "../../../redux/reducer/landingReducer.jsx";

const Card = (props) => {
  const { homelink, data, onFocus, title, from, index, length, updateCount, list_id, count, multiplier, layout, friendly_id, setButtonPressed = () => { } } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loadingupdate = useSelector((state) => state?.home?.loadingupdate)

  const user_id = localStorage.getItem('user_id') != null ? localStorage.getItem('user_id') : "";
  const { ref, focusKey, focusSelf, hasFocusedChild } = useFocusable({
    onFocus,
    trackChildren: true,
  });

  const setFocusData = useSelector((state) => state?.landing?.setFocusData)
  const firstIndexValue = useSelector((state) => state?.landing?.firstIndex)
  const getAllDetail = useSelector((state) => state?.details?.getAllDetails)

  const searchword = useSelector((state) => state?.search?.searchParams);
  let iterate;

  if (from === "home" || from == "agriculture" || from == "movies" || from == "food" || from == "news" || from == "live" || from == "shows" || from == "health" || from == "catalog") {
    iterate = data.catalog_list_items;
    if (!!iterate) {
      const seeAll = {
        theme: "seeall",
        title: "See all",
        type: layout === "tv_shows" || layout === "exclusive-featured" || layout === "movie" ? 'vertical' : 'horizontal',
        description: "See all",
        content_id: `${list_id}`,
        catalog_id: `${list_id}`

      };

      if (layout == "banner") {
        iterate = iterate.slice(0, 10);
      }
      // else if (from == "catalog") {
      //   iterate = data.catalog_list_items
      // }
      else if (iterate.length > 10) {
        iterate = iterate.slice(0, 10);
        iterate = [...iterate, seeAll];
      }
    }
  } else if (from == "search-result") {
    iterate = data.items;
    const seeAll = {
      theme: "seeall",
      title: "See all",
      description: "See all",
      content_id: `${list_id}`,
      catalog_id: `${list_id}`
    };

    if (!!iterate) {
      if (iterate.length == 20) {
        iterate = iterate.slice(0, 20);
        iterate = [...iterate, seeAll];
      }
    }

  }
  else if (
    from == "watchlater" ||
    from == "season" ||
    from == "recommend" ||
    from == "search-result"
  ) {
    iterate = data.items;
  } else if (from == "trending") {
    iterate = data.catalog_list_items
  }

  const scrollingRef = useRef(null);

  const onAssetFocus = useCallback(
    ({ x }) => {
      if (!!scrollingRef.current) {

        scrollingRef.current.scrollTop = x
        scrollingRef.current.scrollLeft = x
          ;
      }
    },
    [scrollingRef]
  );
  const renderDetails = (data, friendly_id, from, navigate, i, display_title, parentdata) => {


    const conditionNavigation = true;
    setButtonPressed(true)

    if (from == "watchlater") {
    }
    dispatch(contentDetails(data));
    const ts = parseInt(new Date().getTime() / 1000);

    const isContinueWatching =
      data?.theme !== "seeall" && (
        display_title === "Continue Watching" ||
        title?.includes("Continue Watching") ||
        parentdata?.friendly_id === "continue-watching" ||
        parentdata?.friendly_id === "watch-history" ||
        from === "watch-history" ||
        from === "continue-watching"
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
    if (from == "search-result") {

    }
    if (data.theme == "livetv") {


      navigate(`/moviesdetails/${data.theme}/${data?.catalog_object?.friendly_id}/${data?.friendly_id}/${data.content_id}/${data.catalog_id}`);

    }
    else if (data.theme == "show_episode" || data.theme == "episode" || data.theme == "videolist") {
      const showFriendlyId = data?.show_object?.friendly_id || data?.catalog_object?.friendly_id;
      navigate(
        `/showsdetails/${data.theme}/${showFriendlyId}/${data?.friendly_id}/${data?.content_id}/${data?.catalog_id}`
      );
    }
    else if (
      data.theme == "movie" ||
      data.theme == "video" ||
      data.theme == "videolist"
    ) {

      navigate(`/moviesdetails/${data.theme}/${data?.catalog_object?.friendly_id}/${data?.friendly_id}/${data.content_id}/${data.catalog_id}`);
    } else if (data?.theme == "show") {

      if (!!data?.last_episode) {
        dispatch(contentDetails(data.last_episode))

        navigate(
          `/showsdetails/${data.theme}/${data?.catalog_object?.friendly_id}/${data?.friendly_id}/${data?.last_episode?.content_id}/${data?.last_episode.catalog_id}`
        );
      } else {


        navigate(
          `/showsdetails/${data.theme}/${data?.catalog_object?.friendly_id}/${data?.friendly_id}/${data?.content_id}/${data?.catalog_id}`
        );
      }
    }

    else if (data.theme === "seeall") {

      if (from == "search-result") {

        navigate(`/seeall/${from}`)
        // console.log("iam into search", data.title, searchword, true, data.theme, "SVOD", user_id)
      } else {
        navigate(`/seeall/${friendly_id}`)
      }

    }
    else if (data.theme === "catalog_list") {
      navigate(`/catalog/${data.friendly_id}`)
    }



  };


  useEffect(() => {
    if (hasFocusedChild) {
      if (!!ref.current.attributes[`data-id`].value) {
        const temp = Number(ref.current.attributes[`data-id`].value);
        if (length - 1 === temp) {
          updateCount();
          const pagination = {
            count: count,
            homelink: homelink,
          };
          console.log("homelink", pagination)
          dispatch(getUpdateLandingData(pagination));
        }
      }

    }
  }, [hasFocusedChild]);



  const onclikedStatus = useSelector((state) => state?.common?.clicked)
  const onSubmit = (confirm) => {
    dispatch(onClicked(""))

    if (confirm == "Retry") {
      dispatch(onClicked(""))
    }
    else if (confirm == "Signout all") {
      var details = {
        auth_token: getAuthToken(),

        type: session_text,
      };
      const firstIndex = {
        firstIndex: firstIndexValue
      }
      dispatch(activeIndexSidebar(firstIndexValue))
      dispatch(signoutall({ details, navigate, firstIndex }));
    }

  }

  // const updateLoading = useSelector((state) => state?.landing?.updateLoading)
  // useEffect(()=>{

  // },[updateLoading])
  return (

    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        data-id={index}
        className={layout === "tv_shows" || layout === "exclusive-featured" || layout === "movie"
          ? "card-wrapper-vertical"
          : "card-wrapper"
        }
      >
        <div className="row-title">
          {from == "recommend" || from == "watchlater"
            ? title
            : layout == "banner"
              ? ""
              : data?.display_title}
        </div>
        <div className="card-block" ref={scrollingRef}>
          <div className="card-content">
            {iterate &&
              iterate.map((ele, i) => {
                return (
                  <CardDetails
                    key={ele.content_id ? `${ele.content_id}-${i}` : (ele.id ? `${ele.id}-${i}` : i)}
                    from={from}
                    index={i}
                    data={ele}
                    dataid={index}
                    ui_type={data.ui_type}
                    display_title={title}
                    onFocus={onAssetFocus}
                    onEnterPress={() => {
                      renderDetails(ele, friendly_id, from, navigate, i, title, data);
                    }}
                    count={count}
                    // focusKey={list_id+ele.catalog_id+ele.content_id}
                    updateCount={updateCount}
                    renderDetails={renderDetails}
                    friendly_id={friendly_id}
                    layout={layout}
                    parentdata={data}
                  />
                );
              })
            }
          </div>
        </div>
      </div>
    </FocusContext.Provider>
  );
};

export default Card;