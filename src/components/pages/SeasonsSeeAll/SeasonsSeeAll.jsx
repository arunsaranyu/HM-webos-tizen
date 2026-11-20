import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation"
import React, { useCallback, useEffect, useRef, useState } from "react"
// import Loader from "../../../helper/Loader"
import { useDispatch, useSelector } from 'react-redux'
import SeeallCard from "../Seeall/SeeallCard.jsx";
import Card from "../../reusable/Card/Card.jsx";
import { useParams } from "react-router-dom";
import { onClicked } from "../../../redux/reducer/commonReducer.jsx";
import Popup from '../../../helper/Popup.jsx'
import tag_premium from "../../../assets/images/tag_premium.svg"
import { EpisodeButton } from "../Season/EpisodeButton.jsx";
import { activeIndexEpisode, getUpdateSeason } from "../../../redux/reducer/seasonReducer.jsx";
import dot from "../../../assets/images/dot.svg"
import ItemCaption from "../../reusable/ItemCaption/ItemCaption.jsx";
const SeasonsSeeAll = () => {
  const detailsPageData = useSelector((state) => state?.details?.data);
  const { activeTitle } = useParams();
  const { ref, focusKey, focusSelf } = useFocusable({})
  const SeasonData = useSelector((state) => state?.season?.data);
  const bannerData = useSelector((state) => state?.common?.banner)
  const activeSeasonData = useSelector((state) => state?.season?.activeSeason
  )
  const dispatch = useDispatch()
  const onclikedStatus = useSelector((state) => state?.common?.clicked)

  useEffect(() => {
    // console.log("detailsPageData----------------------", detailsPageData)
    // console.log("activeSeasonData----------------------", activeSeasonData)
    focusSelf()
  }, [detailsPageData])


  useEffect(() => {
    if (SeasonData) {

    }
  }, [SeasonData])

  const [session_id_status, set_session_id_status] = useState(false)
  const invalidSession = localStorage.getItem("invalidsession") === "true";

  useEffect(() => {
    if (invalidSession) {
      set_session_id_status(true);
    }
  }, [invalidSession]);


  // let backgroundStyle
  // let backgroundImg
  // console.log(Object.keys(detailsPageData)?.length > 0)
  // if (Object.keys(detailsPageData).length > 0) {
  //     console.log(detailsPageData)
  //     backgroundImg = detailsPageData?.thumbnails ? detailsPageData.thumbnails?.high_16_9 ? detailsPageData?.thumbnails?.high_16_9.url : { url: '' } : { url: '' }
  //     backgroundStyle = {
  //         backgroundImage: `linear-gradient(90deg, rgb(24,29,37), rgba(24,29,37,0)), url('${backgroundImg}')`
  //     }
  // }
  let backgroundStyle
  let backgroundImg
  // console.log(Object.keys(bannerData)?.length > 0)
  if (Object.keys(bannerData).length > 0) {
    if (bannerData.theme == "catalog_list") {
      backgroundImg = !!bannerData?.list_item_object ? bannerData.list_item_object?.banner_image : ""

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



    } else {



      if (bannerData.thumbnails && bannerData.thumbnails.web_tvbanner_image) {
        backgroundImg = bannerData.thumbnails.web_tvbanner_image.url
      } else if (bannerData.thumbnails && bannerData.thumbnails.high_16_9) {
        backgroundImg = bannerData.thumbnails.high_16_9.url
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
  }

  const onSubmit = (confirm) => {
    dispatch(onClicked(""))

    if (confirm === "Go Back") {

      dispatch(onClicked(""))
    }
    else if (confirm === "Login") {
      localStorage.removeItem("session_id")
      localStorage.setItem("invalidsession", false)
      navigate('/activate')
    }
    else if (confirm === "Continue without login") {
      localStorage.removeItem("session_id")
      set_session_id_status(false)
      localStorage.setItem("invalidsession", false)
      dispatch(sidebarAllow())
    }
    else {
      navigate("/plans")
    }
  }
  const [buttons, setButtons] = useState([]);

  var renderEpisode


  const episodesPerPage = 20;

  useEffect(() => {

    const generateButtons = () => {
      const buttonsArray = [];
      if (SeasonData?.total_items_count < 20) {
        setButtons([]);
      } else {
        if (SeasonData?.content_order == "asc") {
          // for (
          //   let i = 0;
          //   i < Math.ceil(SeasonData?.total_items_count / episodesPerPage);
          //   i++
          // ) {
          //   const startRange = i * episodesPerPage + 37;
          //   const endRange = Math.min(37+
          //     (i + 1) * episodesPerPage,
          //     SeasonData?.total_items_count
          //   );
          //   buttonsArray.push({
          //     key: `E-${startRange} - E-${endRange}`,
          //     title: `E-${startRange} - E-${endRange}`,
          //     start: startRange,
          //     end: endRange,
          //   });
          // } 
          const episodesPerPage = 20;
          const totalItems = SeasonData?.total_items_count;
          const seq = SeasonData?.items?.length > 0 ? 1 : 1
          // Calculate the maximum episode number based on the total items
          let maxEpisode = seq + totalItems - 1;

          // Generate buttons from episode 37 to the maximum episode
          let startRange = seq;
          console.log("================================", startRange, maxEpisode, totalItems)
          while (startRange <= maxEpisode) {
            const endRange = Math.min(startRange + episodesPerPage - 1, maxEpisode);
            buttonsArray.push({
              key: `E${startRange} - E${endRange}`,
              title: `E${startRange} - E${endRange}`,
              start: startRange,
              end: endRange,
            });
            startRange += episodesPerPage;
          }
        }
        else if (SeasonData?.content_order == "desc") {
          const episodesPerPage = 20;
          const totalItems = SeasonData?.total_items_count;

          const totalButtons = Math.ceil(totalItems / episodesPerPage);

          for (let i = 0; i < totalButtons; i++) {
            const startRange = totalItems - i * episodesPerPage;
            const endRange = Math.max(1, startRange - (episodesPerPage - 1));

            buttonsArray.push({
              key: `E${startRange} - E${endRange}`,
              title: `E${startRange} - E${endRange}`,
              start: startRange,
              end: endRange,
            });
          }

        }
      }
      setButtons(buttonsArray);
    };
    if (buttons.length === 0) {
      generateButtons();
    }
    // generateButtons();

  }, [SeasonData?.total_items_count, SeasonData]);

  const [dispatched, setDispatched] = useState(false)
  if (buttons.length > 0) {
    // console.log("coming inside of it")
    if (dispatched == false) {
      // console.log("but comming only once");
      dispatch(activeIndexEpisode(buttons[0].title))
      setDispatched(true)
    }
  }
  renderEpisode = (data, index, each) => {
    // console.log("data in renderEpisode", data)

    let name = (data.seo_url.split("/")[2])

    const value = {
      catalog_object_friendly_id: data?.catalog_object?.friendly_id,
      // catalog_object_friendly_id: "tv-shows",
      friendly_id: name,
      // friendly_id: "padutha-theeyaga-1",
      subcategory_friendly_id: data?.friendly_id,
      // subcategory_friendly_id: "season-13",
      page: index,
    };
    // console.log("value-----------------------", value)
    dispatch(getUpdateSeason(value));
    dispatch(activeIndexEpisode(each.title))
  };

  const scrollingRef = useRef(null);
  const onAssetFocus = useCallback(
    ({ x }) => {
      if (!!scrollingRef.current) {
        scrollingRef.current.scrollLeft = x;
      }
    },
    [scrollingRef]
  );
  // const processCaption = (captions) => {
  //   // Split captions by " . "
  //   const parts = captions?.item_captions?.split(" . ");

  //   // Prepare an array to hold JSX elements
  //   const captionElements = [];

  //   // Loop through parts array and add color to dots
  //   !!parts && parts.forEach((part, index) => {
  //     // If it's not the last part, add dot with color
  //     if (index < parts.length - 1) {
  //       captionElements.push(<div style={{ color: '#E1E1E2', display: "inline-flex" }}>{part} <div style={{ display: "flex", alignItems: "center" }}> <img class="dot-style" src={dot} alt="" />  </div></div>);
  //     } else {
  //       // Otherwise, add the last part without dot
  //       captionElements.push(<div style={{ color: '#E1E1E2', display: "inline-flex", }}>{part}</div>);
  //     }
  //   });

  //   return captionElements;
  // };

  return (
    <FocusContext.Provider value={focusKey}>
      <div className='main-card'>
        {
          detailsPageData?.access_control?.is_free == false ? <img className="premium-tag-player" src={tag_premium} alt="" /> : ""
        }
        <div className='background-container-zero'>
          <div className='poster' style={backgroundStyle}>
          </div>
        </div>
        <div className='parent-container'>
          <div className="" style={{ "z-index": 1 }}>
            {
              bannerData?.title_image_display == true ?
                <div>
                  <img className="banner-img " src={bannerData?.title_image} alt="" />
                </div> :
                <div>
                  <h1 className='banner-title'>{bannerData?.title}</h1>
                </div>
            }
            <div className='banner-description-container'>
              {/* <p className="banner-captions">{ItemCaption(bannerData)}</p> */}
              <div className='banner-description'>{(!!bannerData?.short_description && bannerData?.short_description !== "") ? bannerData?.short_description : bannerData?.description}</div>

              {/* {!!bannerData?.is_original && bannerData?.is_original === "Yes" ?
                <div className="exclusive-container">
                  <div className="exclusive-gradient">
                  </div>
                  <h1 className="etv-win-exclusive">ETV Win Exclusive</h1>
                </div>

                : ""} */}
            </div>
          </div>
          <div className="season-content" >
            <div className='row-title' style={{ zIndex: '3' }}>{`${activeTitle}${" - "}${"See all"}`}</div>
            {
              <div className="episode-button-container" ref={scrollingRef} style={{ width: "95%", marginBottom: "1%" }}>
                <div className="card-content">
                  {
                    SeasonData &&
                    buttons?.map((each, i) => (
                      <EpisodeButton
                        data={each}
                        onEnterPress={() => {
                          renderEpisode(SeasonData, i, each);
                        }}
                        onFocus={onAssetFocus}
                        index={i}
                        renderDetails={renderEpisode}
                      />
                    ))
                  }
                </div>
              </div>

            }
            {SeasonData && (
              <div className='content-container-seeall'>
                {SeasonData &&
                  <SeeallCard
                    index={"0"}
                    ref={ref}
                    title={`${activeTitle}${" - "}${"See all"}`}
                    data={SeasonData}
                    layout={"t_16"}
                    from={'details'}
                    friendly_id={SeasonData?.friendly_id}
                  />}
              </div>
            )}
          </div>
        </div>
        {
          onclikedStatus == "clicked" &&
          <Popup
            alert=""
            alertType="Subscription Alert"
            heading="No Subscription Found"
            Description="You need a subscription to access the content"
            from={"details"}
            onSubmit={onSubmit}
          />
        }
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
      </div>

    </FocusContext.Provider>
  )


}
export default SeasonsSeeAll
