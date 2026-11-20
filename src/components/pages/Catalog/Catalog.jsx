import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import icon_success from "../../../assets/images/icon_success.png"
import Loader from '../../../helper/Loader.jsx'
import tag_premium from "../../../assets/images/tag_premium.svg"
import tag_Top10 from "../../../assets/images/tag_Top10.svg"
import icon_error from "../../../assets/images/icon_error.png";
import dot from "../../../assets/images/dot.svg"
import Card from '../../reusable/Card/Card.jsx'
import { sidebarDisable, sidebarAllow } from '../../../redux/reducer/landingReducer.jsx'
import InstaPlayerBanner from '../PlayerBanner/PlayerBanner.jsx'
import UserDetails from '../UserDetails/UserDetails.jsx'
import UserDetailsContent from '../UserDetails/UserDetailsContent.jsx'
import { getUserDetails } from '../../../redux/reducer/userReducer.jsx'
import HomeButton from '../../reusable/HomeButton/HomeButton.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import PlayerBanner from '../PlayerBanner/PlayerBanner.jsx'
import Alert from '../../../helper/Alert.jsx'
import Toast from '../../../helper/Toasty.jsx'
import ItemCaption from '../../reusable/ItemCaption/ItemCaption.jsx'
import { getAuthToken, secret_key } from '../../../assets/constant/index.jsx'
import md5 from 'md5'
import { getAllDetailsData } from '../../../redux/reducer/detailsReducer.jsx'
import { getCatalogData } from '../../../redux/reducer/catalogReducer.jsx'
import { onClicked } from '../../../redux/reducer/commonReducer.jsx'
import Popup from '../../../helper/Popup.jsx'


const Catalog = () => {
    const sidebarData = useSelector((state) => state?.sidebar?.data)
    const catalogData = useSelector((state) => state?.catalog?.data)
    const loading = useSelector((state) => state?.catalog?.loading)
    const bannerData = useSelector((state) => state?.common?.banner)
    const layout = useSelector((state) => state?.common?.layout)
    let [layoutType, setlayout] = useState()
    const dispatch = useDispatch()
    const { friendly_id } = useParams();
    const onclikedStatus = useSelector((state) => state?.common?.clicked)
    useEffect(() => {
        dispatch(sidebarDisable())
        dispatch(getCatalogData(friendly_id))
    }, [])

    const { ref, focusKey, focusSelf } = useFocusable({})
    const [count, setcount] = useState(1)
    const [multiplier, setmultiplier] = useState(1)

    let dataFilter


    // if (!!catalogData) {
    //     if (catalogData.catalog_list_items) {
    //         dataFilter = catalogData?.catalog_list_items.filter((ele) => {
    //             if (ele.catalog_list_items) {
    //                 return ele.catalog_list_items.length > 0;
    //             }
    //         })
    //     }
    // }
    if (!!catalogData) {
        dataFilter = catalogData
    }
    const onRowFocus = useCallback(
        ({ y }) => {
            if (!!ref.current) {
                ref.current.scrollTop = y
            }
        },
        [ref]
    )
    const navigate = useNavigate()

    const updateCount = () => {
        setcount(count + 1)

    }

    const sidebartoggole = useSelector((state) => state?.common?.sidebartoggle)

    useEffect(() => {
        setlayout(layout)
    }, [layout])

    useEffect(() => {
        dispatch(sidebarDisable())
        dispatch(onClicked(""))

    }, [])

    useEffect(() => {
        focusSelf()
    }, [catalogData])
    useEffect(() => {

    }, [onclikedStatus])
    let backgroundStyle
    let backgroundImg

    if (Object.keys(bannerData).length > 0) {

        backgroundImg = bannerData?.thumbnails ? bannerData.thumbnails?.high_16_9 ? bannerData?.thumbnails?.high_16_9.url : { url: '' } : { url: '' }
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

    const session_id = localStorage.getItem("session_id") != null
        ? localStorage.getItem("session_id")
        : "";
    const ts = parseInt(new Date().getTime() / 1000);
    const renderPreview = () => {
        // const session=!!localStorage.getItem("session_id")? localStorage.getItem("session_id"):""
        if (bannerData.theme == "episode" || bannerData.theme == "show") {
            var allDetails = {
                content_id: bannerData.last_episode.content_id,
                catalog_id: bannerData.last_episode.catalog_id,
                auth_token: getAuthToken(),
                // access_token: access_token,
                id: session_id,
                md5: md5(bannerData.last_episode.catalog_id + bannerData.last_episode.content_id + session_id + ts + secret_key),
                ts: String(ts),
                category: "",
                region: localStorage.getItem("region"),
            };
            if (!!localStorage.getItem("session_id")) {
                if (localStorage.getItem("is_subscribed") === "true") {
                    dispatch(getAllDetailsData({ allDetails, navigate }))
                } else if (localStorage.getItem("is_subscribed") === "false") {
                    if (bannerData?.last_episode?.access_control?.is_free == true) {
                        dispatch(getAllDetailsData({ allDetails, navigate }))
                    }
                    else {
                        dispatch(onClicked("clicked"));
                    }
                }
            }
            else if (localStorage.getItem("session_id") == null || localStorage.getItem("session_id") == undefined) {
                if (bannerData?.last_episode?.access_control?.is_free == true) {
                    dispatch(getAllDetailsData({ allDetails, navigate }))
                } else {
                    navigate("/loginManditory");
                }
            }

        }
        else {
            var allDetails = {
                content_id: bannerData.content_id,
                catalog_id: bannerData.catalog_id,
                auth_token: getAuthToken(),
                // access_token: access_token,
                id: session_id,
                md5: md5(bannerData.catalog_id + bannerData.content_id + session_id + ts + secret_key),
                ts: String(ts),
                category: "",
                region: localStorage.getItem("region"),
            };
            if (!!localStorage.getItem("session_id")) {
                if (localStorage.getItem("is_subscribed") === "true") {
                    dispatch(getAllDetailsData({ allDetails, navigate }))
                } else if (localStorage.getItem("is_subscribed") === "false") {
                    if (bannerData?.access_control?.is_free == true) {
                        dispatch(getAllDetailsData({ allDetails, navigate }))
                    }
                    else {
                        dispatch(onClicked("clicked"));
                    }
                }
            }
            else if (localStorage.getItem("session_id") == null || localStorage.getItem("session_id") == undefined) {
                if (bannerData?.access_control?.is_free == true) {
                    dispatch(getAllDetailsData({ allDetails, navigate }))
                } else {
                    navigate("/loginManditory");
                }
            }
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
        loading == true ? <Loader /> :
            <FocusContext.Provider value={focusKey}>
                <div className='main-card'>
                    {
                        bannerData?.access_control?.is_free == false ? (layout !== 'movie' && layout !== 'tv_shows' && layout !== 'exclusive-featured' && <img className="premium-tag-player" src={tag_premium} alt="" />) : ""
                    }
                    {/* <div className={layout === "banner" ? 'background-container-fullscreen' : (layout !== "tv_shows" || layout !== "movie" || layout !== "movies") ? "background-container" : ""} >
                        {layout !== 'movie' && layout !== 'tv_shows' && layout !== 'exclusive-featured' && (
                            <>
                            {
                                previewState == true && !!bannerData?
                                <PlayerBanner playerType="live-banner" from={"home"}/>
                                :<></>
                            }
                            </>
                          
                        )}

                    </div> */}

                    <div className={layout === "banner" ? 'background-container-fullscreen' : (layout !== "tv_shows" || layout !== "movie" || layout !== "movies") ? "background-container" : ""} >
                        <div className="left-gradient">
                        </div>
                        <div className='bottom-gradient'>
                        </div>
                        {layout !== 'movie' && layout !== 'tv_shows' && layout !== 'exclusive-featured' && <div className='poster2' style={backgroundStyle}>
                        </div>}
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
                    <div className='parent-container'>
                        <div style={layout === "tv_shows" || layout === "movie" || layout === "movies" ? { display: 'none' } : { display: 'block' }} className={layout == "tv_shows" || layout == "movie" || layout == "movies" ? 'banner-container-zero' : "banner-container"}>
                            <div style={{ display: "flex", flexDirection: "row", alignItems: 'center' }}>
                                {
                                    bannerData?.theme !== "seeall" && bannerData?.trending_sequence !== "" && <>
                                        <img className='img-top10' src={tag_Top10} alt={""} />
                                        <h1 className='img-top-width banner-captions'>{bannerData?.trending_sequence}</h1>
                                    </>
                                }
                                {
                                    // bannerData?.title_image_display == true ?
                                    //     <div>
                                    //         <img className="banner-img" src={bannerData?.title_image} alt="" />
                                    //     </div> :
                                    bannerData?.trending_sequence == "" && <h1 className='banner-title'>{bannerData?.theme !== "show" || bannerData?.theme !== "show_episode" ? bannerData?.title : bannerData.theme == "show" || bannerData.theme == "show_episode" ? bannerData.show_name == "" ? bannerData.title : bannerData?.show_name : bannerData.title}</h1>
                                }
                            </div>
                            {
                                layout === "banner" ? <div className='banner-description-container-banner'>
                                    {/* <button>watch now</button> */}

                                    {bannerData.theme !== "seeall" && <div className="details-icons home-banner">


                                        {/* <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}> */}
                                        {/* <img className='home-banner-button-img' src={btn_watchNow_inactive} alt="" /> */}
                                        <div>
                                            <HomeButton onFocus={onRowFocus} onEnterPress={() => { renderPreview() }} renderPreview={renderPreview} />

                                        </div>
                                        {/* </div> */}

                                    </div>}
                                    {/* <p className="banner-captions">{ItemCaption(bannerData)}</p> */}
                                    <div className='banner-description'>{(!!bannerData?.short_description && bannerData?.short_description !== "") ? bannerData?.short_description : bannerData?.description}</div>
                                    {/* {!!bannerData?.is_original && bannerData?.is_original === "Yes" ?
                                        <div className="exclusive-container">
                                            <div className="exclusive-gradient">
                                            </div>
                                            <h1 className="etv-win-exclusive">ETV Win Exclusive</h1>
                                        </div>
                                        : ""} */}
                                </div> :
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
                            }
                        </div>

                        {dataFilter && (
                            <div className={layout == "tv_shows" || layout == "movie" || layout == "movies" ? 'content-container-zero' : 'content-container'} ref={ref} >


                                <Card
                                    index={"0"}
                                    key={"0"}
                                    title={dataFilter.display_title}
                                    data={dataFilter}
                                    layout={dataFilter.layout_type}
                                    onFocus={onRowFocus}
                                    from={'catalog'}
                                    friendly_id={dataFilter.friendly_id}
                                    homelink={dataFilter.friendly_id}
                                    count={count}
                                    length={dataFilter?.length}
                                    updateCount={updateCount}
                                    multiplier={multiplier}
                                />


                            </div>
                        )}
                    </div>
                    {/* {
                        <Toast imgicon={icon_error} text={`${dataFilter.display_title}`} backgroundcolor=" #E6EFFA" bordercolor="#076DE3" />
                    } */}
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

export default Catalog