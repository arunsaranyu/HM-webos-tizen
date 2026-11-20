import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { activeIndexSidebar, getContinueData, getLandingData, onSetFocusData, onWatchHistoryFalse, onWatchHistoryTrue, sidebarAllow } from '../../../redux/reducer/landingReducer.jsx'
import { FocusContext, setFocus, useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import icon_success from "../../../assets/images/icon_success.png"

import tag_premium from "../../../assets/images/tag_premium.svg"

import tag_Top10 from "../../../assets/images/tag_Top10.png"
import icon_error from "../../../assets/images/icon_error.png";
import Card from '../../reusable/Card/Card.jsx'
import Alert from '../../../helper/Alert.jsx'
// import btn_watchNow_inactive from "../../../assets/images/icon_play_default.svg";
// import btn_watchNow_active from "../../../assets/images/icon_play_focused.png";
import Loader from '../../../helper/Loader.jsx'
import HomeButton from '../../reusable/HomeButton/HomeButton.jsx'
import ItemCaption from "../../reusable/ItemCaption/ItemCaption.jsx"
import { onClicked, singleList } from '../../../redux/reducer/commonReducer.jsx'
import BannerPlayer from '../../reusable/BannerPlayer/index.jsx'
import { getUserDetails, setErrorMessageStatus } from '../../../redux/reducer/userReducer.jsx'
import { getAuthToken, secret_key } from '../../../assets/constant/index.jsx'
import Toast from "../../../helper/Toasty.jsx"
import Popup from '../../../helper/Popup.jsx'
import md5 from 'md5'
import { contentDetails, getAllDetailsData } from '../../../redux/reducer/detailsReducer.jsx'
import dot from "../../../assets/images/dot.svg"
import { sidebarFocused } from '../../../redux/reducer/sidebarReducer.jsx'


const Landing = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { friendly_id } = useParams()

    const firstIndex = useSelector((state) => state?.landing?.firstIndex)
    const sidebarData = useSelector((state) => state?.landing?.sidebarItems)
    const activeIndex = useSelector((state) => state?.landing?.activeIndex)

    const defaultTab = firstIndex || sidebarData?.[0]?.home_link || "home-list"
    const currentTab = (location.pathname === "/" || !friendly_id) ? defaultTab : (friendly_id || activeIndex || defaultTab)
    const landingData = useSelector((state) => state?.landing?.data[currentTab] || state?.landing?.data[defaultTab] || state?.landing?.data[activeIndex])
    const bannerData = useSelector((state) => state?.common?.banner)
    const loading = useSelector((state) => state?.landing?.loading)
    const layout = useSelector((state) => state?.common?.layout)

    const singleListStatus = useSelector((state) => state?.common?.singleList)

    const watchHistoryData = useSelector((state) => state?.landing?.watchhistory)
    const updateLoading = useSelector((state) => state?.landing?.updateLoading)
    const signOutToast = useSelector((state) => state?.login)
    const onclikedStatus = useSelector((state) => state?.common?.clicked)
    const continuewatchingLoading = useSelector((state) => state?.landing?.continuewatchingLoading)


    // const updateDataloading = useSelector((state) => state?.landing?.updateDataloading)
    const endoflist = useSelector((state) => state?.landing?.endoflist)

    const setFocusData = useSelector((state) => state?.landing?.setFocusData)

    const [trailerPlaying, setTrailerPlaying] = useState(true);

    const { ref, focusKey, focusSelf } = useFocusable({ trackChildren: true })
    const hasFetched = React.useRef(false)
    const [count, setcount] = useState(1)
    const [multiplier, setmultiplier] = useState(1)
    const [alertotp, setalertpopup] = useState(true)
    const errormessagestaus = useSelector((state) => state?.user?.errorstatus)

    const [session_id_status, set_session_id_status] = useState(false)
    const invalidSession = localStorage.getItem("invalidsession") === "true";

    useEffect(() => {
        if (invalidSession) {
            set_session_id_status(true);
        }
    }, [invalidSession]);
    // sidebar status managed in useEffect

    useEffect(() => {
        if (localStorage.getItem("session_id") != undefined || localStorage.getItem("session_id") != null) {
            // dispatch(getContinueData())
            dispatch(getUserDetails())
        } else {
            localStorage.setItem("is_subscribed", false)
        }
        dispatch(onWatchHistoryFalse())
    }, [])
    useEffect(() => {
        // Wait for sidebarData to resolve so activeIndex has the real tab key
        // and state.data already has the correct key slot created by getSidebarData.fulfilled
        if (!sidebarData || sidebarData.length === 0) return;

        const defaultTab = firstIndex || sidebarData?.[0]?.home_link || 'home-list';
        const tab = (location.pathname === "/" || !friendly_id) ? defaultTab : (friendly_id || activeIndex || defaultTab);
        console.log(tab, location);
        if (!tab) return;
        // Skip if this exact tab was already fetched (prevents multiple fires)
        if (hasFetched.current === tab) return;
        hasFetched.current = tab;

        const link = {
            link: tab,
            page_size: tab === 'live' ? 10 : 5
        };
        dispatch(sidebarFocused(tab));
        dispatch(activeIndexSidebar(tab));
        dispatch(getLandingData(link));
    }, [friendly_id, activeIndex, sidebarData, location.pathname, firstIndex]);


    useEffect(() => {
        dispatch(sidebarAllow())
        setcount(1)
        dispatch(setErrorMessageStatus(false));
        setmultiplier(1)
        dispatch(onSetFocusData(""))
        dispatch(singleList(false))
        dispatch(onWatchHistoryFalse(false))
    }, [])
    useEffect(() => {
        setcount(1)
        setmultiplier(1)
        if (location.pathname === "/" || !friendly_id) {
            const homeTab = firstIndex || sidebarData?.[0]?.home_link || "home-list";
            dispatch(activeIndexSidebar(homeTab));
        } else {
            dispatch(activeIndexSidebar(friendly_id));
        }
        // dispatch(onSetFocusData(""))
    }, [friendly_id, location.pathname, firstIndex, sidebarData])


    const handleTimeUpdate = (currentTime) => {
    };

    const handleEnded = (currentTime) => {
        setTrailerPlaying(false)
    };







    const watchHistoryStatus = useSelector((state) => state?.landing?.watchHistoryStatus)
    const [dataFilter, setDataFilter] = useState(null);
    useEffect(() => {

        if (landingData && landingData?.catalog_list_items) {
            const hasCatalog = landingData.catalog_list_items.some(ele => ele.catalog_list_items);
            if (!hasCatalog) {
                setDataFilter(landingData);
                dispatch(singleList(true));

            } else {
                dispatch(singleList(false));
                const filteredData = landingData.catalog_list_items.filter((ele) => {
                    if (ele.catalog_list_items) {
                        if (ele?.friendly_id === "watch-history" || ele?.friendly_id === "continue_watching" || ele?.friendly_id === "continue-watching") {

                            const sessionId = localStorage.getItem("session_id");
                            if (sessionId && sessionId !== "undefined" && sessionId !== "null") {
                                return ele.catalog_list_items.length > 0;
                            }
                            return false;

                        }
                        else if (ele.tv_layout_type == "list_in_list") {
                            return ele.catalog_list_items
                        } else {

                            return ele.catalog_list_items.length > 0;
                        }
                    }
                });
                setDataFilter(filteredData);
            }
        }
    }, [landingData, continuewatchingLoading, friendly_id, localStorage.getItem("user_clicked_profile_id"), activeIndex]);


    useEffect(() => {

    }, [dataFilter])
    const onRowFocus = useCallback(
        ({ y }) => {
            if (!!ref.current) {
                ref.current.scrollTop = y
            }
        },
        [ref]
    )

    const updateCount = () => {
        setcount(count + 1)
        // setmultiplier(multiplier + 1)
    }

    let backgroundStyle
    let backgroundImg

    if (Object.keys(bannerData).length > 0) {






        if (bannerData?.thumbnails?.large_16_9) {
            backgroundImg = bannerData?.thumbnails?.large_16_9?.url;
        }
        // else if (detailsPageData?.thumbnails?.medium_16_9) {
        //     backgroundImg = detailsPageData?.thumbnails?.medium_16_9?.url;
        // }
        // backgroundImg = bannerData?.thumbnails ? bannerData.thumbnails?.high_16_9 ? bannerData?.thumbnails?.high_16_9.url : { url: '' } : { url: '' }
        backgroundStyle = {
            backgroundImage: `linear-gradient(90deg, rgb(24,29,37), rgba(24,29,37,0)), url('${backgroundImg}')`
        }




    }








    useEffect(() => {
        const currentActiveTab = friendly_id || activeIndex || "home-list";
        const isHomeList = currentActiveTab === "home-list";
        const sessionId = localStorage.getItem("session_id");
        const isLoggedIn = !!sessionId && sessionId !== "undefined" && sessionId !== "null";

        if (isLoggedIn && isHomeList) {
            if (landingData?.catalog_list_items) {
                const filteredArray = landingData?.catalog_list_items?.some(
                    obj => obj.friendly_id === "watch-history" || obj.friendly_id === "continue_watching" || obj.friendly_id === "continue-watching"
                );

                if (filteredArray && watchHistoryStatus == false) {
                    dispatch(getContinueData("home-list"));
                }
            }
        }
    }, [landingData, friendly_id, activeIndex, watchHistoryStatus]);

    const renderCards = (items) => {
        return items.map((sample, j) => (
            <Card
                index={j}
                key={sample.list_id}
                title={sample.display_title}
                data={sample}
                layout={sample.tv_layout_type}
                onFocus={onRowFocus}
                from={'movies'}
                friendly_id={sample.friendly_id}
                homelink={landingData.friendly_id}
                count={count}
                length={items.length}
                updateCount={updateCount}
                multiplier={multiplier}
            // setButtonPressed={setButtonPressed}
            />
        ));
    };


    const ts = parseInt(new Date().getTime() / 1000);
    const renderPreview = () => {
        const session_id = !!localStorage.getItem("session_id") ? localStorage.getItem("session_id") : ""
        if (bannerData.theme == "episode" || bannerData.theme == "show") {
            dispatch(contentDetails(bannerData?.last_episode))
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
            dispatch(contentDetails(bannerData))
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
        else if (confirm === "Login") {
            localStorage.removeItem("session_id")
            localStorage.setItem("invalidsession", false)
            localStorage.removeItem("image_url")
            localStorage.removeItem("sidebarProfileName")
            dispatch(setErrorMessageStatus(false))
            navigate('/activate')
        }
        else if (confirm === "Continue without login") {

            dispatch(setErrorMessageStatus(false))
            localStorage.removeItem("session_id")
            set_session_id_status(false)
            localStorage.setItem("invalidsession", false)
            localStorage.removeItem("image_url")
            localStorage.removeItem("sidebarProfileName")
            dispatch(sidebarAllow())
        }
        else {
            navigate("/plans")
        }
    }

    useEffect(() => {
        setTrailerPlaying(true)
    }, [bannerData])

    useEffect(() => {

        focusSelf()

        // setFocus("Home")
    }, [dataFilter, focusSelf, loading])
    useEffect(() => {
        if (onclikedStatus == "") {
            focusSelf()
        }
    }, [onclikedStatus])


    // const processCaption = (captions) => {
    //     // Split captions by " . "
    //     const parts = captions?.item_captions?.split(" . ");

    //     // Prepare an array to hold JSX elements
    //     const captionElements = [];

    //     // Loop through parts array and add color to dots
    //     !!parts && parts.forEach((part, index) => {
    //       // If it's not the last part, add dot with color
    //       if (index < parts.length - 1) {
    //         captionElements.push(<><div style={{color:'#E1E1E2',display:"inline-flex"  }}>{part} </div> <div  style={{display:"flex",alignItems:"center"}}><img class="dot-style" src={dot} alt=""/>   </div> </>);
    //       } else {
    //         // Otherwise, add the last part without dot
    //         captionElements.push( <div style={{color:'#E1E1E2', display:"inline-flex", }}>{part}</div>);
    //       }
    //     });

    //     return captionElements;
    //   };
    return (
        loading === true ? (
            <Loader />
        ) : (
            <div className='main-card'>
                {bannerData?.access_control?.is_free === false && layout !== 'movie' && layout !== 'tv_shows' && layout !== 'exclusive-featured' && bannerData?.type !== 'vertical' ? (
                    <img className="premium-tag-player" src={tag_premium} alt="" />
                ) : null}
                <div className={layout === 'banner' ? 'background-container-fullscreen' : layout !== 'tv_shows' && layout !== 'movie' && layout !== 'movies' && bannerData?.type !== 'vertical' ? 'background-container' : ''}>
                    <div className="left-gradient"></div>
                    <div className='bottom-gradient'></div>


                    <div className='poster2' style={backgroundStyle}></div>


                </div>
                <div className='parent-container'>
                    <div style={layout === 'tv_shows' || layout === 'movie' || layout === 'movies' || bannerData?.type === 'vertical' ? { display: 'none' } : { display: 'block' }}
                        className={
                            'banner-container'
                        }>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            {bannerData?.theme !== 'seeall' &&
                                bannerData?.trending_sequence !== '' && bannerData?.trending_sequence !== null && bannerData?.trending_sequence !== undefined &&
                                layout === 'banner' ? (
                                <>
                                    <img className='img-top10' src={tag_Top10} alt='' />
                                    <h1 className='img-top-width banner-captions'>{bannerData?.trending_sequence}</h1>
                                </>
                            ) : null}
                            {layout !== 'banner' ? (
                                bannerData?.title_image_display === true ? (
                                    <div>
                                        <img className="banner-img" src={bannerData?.title_image} alt="" />
                                    </div>
                                ) : (
                                    <h1 className='banner-title'>

                                        {bannerData?.display_title || bannerData?.title}
                                    </h1>
                                )
                            ) : bannerData?.trending_sequence === '' ||
                                bannerData?.trending_sequence === null ||
                                bannerData?.trending_sequence === undefined ? (
                                <>
                                </>
                                // <h1 className='banner-title'>
                                //     {bannerData?.theme === 'show_episode' ||
                                //         bannerData?.theme === 'episode' ||
                                //         bannerData?.theme === 'episode'
                                //         ? bannerData?.show_name !== ''
                                //             ? bannerData?.show_name
                                //             : (bannerData?.display_title ? bannerData?.display_title : bannerData?.title)
                                //         : (bannerData?.display_title ? bannerData?.display_title : bannerData?.title)}
                                // </h1>
                            ) : null}
                        </div>
                        {layout === 'banner' ? (
                            <div className='banner-description-container-banner' style={{ height: 'auto' }}>
                                {/* {bannerData.theme !== 'seeall' && (
                                    <div>
                                        <HomeButton onFocus={onRowFocus} onEnterPress={renderPreview} renderPreview={renderPreview} focuskey="HOME-BUTTON" />
                                    </div>
                                )} */}
                                {/* <div className="banner-captions">{ItemCaption(bannerData)}</div> */}
                                <div className='banner-description'>{(!!bannerData?.short_description && bannerData?.short_description !== "") ? bannerData?.short_description : bannerData?.description}</div>
                                {/* {!!bannerData?.is_original && bannerData?.is_original === 'yes' ? (
                                    <div className="exclusive-container">
                                        <div className="exclusive-gradient"></div>
                                        <h1 className="etv-win-exclusive">ETV Win Exclusive</h1>
                                    </div>
                                ) : null} */}
                            </div>
                        ) : (
                            <div className='banner-description-container'>
                                {/* <div className="banner-captions">{ItemCaption(bannerData)}</div> */}
                                <div className='banner-description'>{(!!bannerData?.short_description && bannerData?.short_description !== "") ? bannerData?.short_description : bannerData?.description}</div>
                                {/* {!!bannerData?.is_original && bannerData?.is_original === 'yes' ? (
                                    <div className="exclusive-container">
                                        <div className="exclusive-gradient"></div>
                                        <h1 className="etv-win-exclusive">ETV Win Exclusive</h1>
                                    </div>
                                ) : null} */}
                            </div>
                        )}
                    </div>
                    <FocusContext.Provider value={focusKey}>
                        {dataFilter && (
                            <div className={layout === 'tv_shows' || layout === 'movie' || layout === 'movies' ? 'content-container-zero' : 'content-container'} ref={ref}>
                                {
                                    singleListStatus == false ? (
                                        singleListStatus === false &&
                                        dataFilter?.length > 0 &&
                                        dataFilter.map((ele, i) => {

                                            let items = ele?.catalog_list_items;

                                            if (!!items && items.length > 0 && ele?.catalog_list_items[0]?.catalog_list_items?.length > 0) {
                                                return ele?.catalog_list_items && renderCards(ele?.catalog_list_items, ele.list_id);
                                            } else {
                                                return (
                                                    <Card
                                                        index={i}
                                                        key={ele.list_id}
                                                        title={ele.display_title}
                                                        data={ele}
                                                        layout={ele.tv_layout_type}
                                                        onFocus={onRowFocus}
                                                        from={'home'}
                                                        friendly_id={ele.friendly_id}
                                                        homelink={landingData.friendly_id}
                                                        count={count}
                                                        length={dataFilter?.length}
                                                        updateCount={updateCount}
                                                        multiplier={multiplier}
                                                    // setButtonPressed={setButtonPressed}
                                                    />
                                                );
                                            }
                                        })
                                    ) :
                                        (
                                            <Card
                                                index={"0"}
                                                key={"0"}
                                                title={dataFilter.display_title}
                                                data={dataFilter}
                                                layout={dataFilter.tv_layout_type}
                                                onFocus={onRowFocus}
                                                from={'live'}
                                                friendly_id={dataFilter.friendly_id}
                                                homelink={dataFilter.friendly_id}
                                                count={count}
                                                list_id={dataFilter?.list_id}
                                                length={dataFilter?.length}
                                                updateCount={updateCount}
                                                multiplier={multiplier}
                                            />
                                        )}
                            </div>
                        )}
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

                    </FocusContext.Provider>
                    {updateLoading && <Loader backgroundcolor="transparent" />}
                </div>
                {signOutToast?.alertToast && (
                    <Alert imgicon={icon_success} text={"Signed in successfully!"} setalertpopup={setalertpopup} from={"home"} backgroundcolor=" #E6FAEB" bordercolor="#3FC063" />
                )}
                {signOutToast?.signoutToast && (
                    <Alert imgicon={icon_success} text={"Logged out successfully!"} setalertpopup={setalertpopup} from={"home"} backgroundcolor=" #E6FAEB" bordercolor="#3FC063" />
                )}


                {onclikedStatus === "clicked" && (
                    <Popup
                        alert=""
                        alertType="Subscription Alert"
                        heading="No Subscription Found"
                        Description="You need a subscription to access the content"
                        from={"details"}
                        onSubmit={onSubmit}
                    />
                )}
            </div>
        )


    )
}

export default Landing