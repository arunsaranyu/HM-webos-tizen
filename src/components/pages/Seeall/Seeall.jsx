import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSeeall } from '../../../redux/reducer/seeallReducer.jsx'
import BannerPlayer from '../../reusable/BannerPlayer/index.jsx'
import Card from '../../reusable/Card/Card.jsx'
import { useParams, useNavigate } from 'react-router-dom'
import Loader from '../../../helper/Loader.jsx'
import SeeallCard from './SeeallCard.jsx'
import { getContinueData, sidebarDisable } from '../../../redux/reducer/landingReducer.jsx'
import { bannerContent } from '../../../redux/reducer/commonReducer.jsx'
import "./Seeall.scss"
import Popup from '../../../helper/Popup.jsx'
import dot from "../../../assets/images/dot.svg"
import ItemCaption from '../../reusable/ItemCaption/ItemCaption.jsx'
import { getSeason } from '../../../redux/reducer/seasonReducer.jsx'
const Seeall = () => {

    const { catalog_object_friendly_id, friendly_id } = useParams();
    const navigate = useNavigate();
    const bannerData = useSelector((state) => state?.common?.banner)
    const seeallData = useSelector((state) => state?.seeall?.data)
    const loading = useSelector((state) => state?.seeall?.loading)
    const continueWatchingData = useSelector((state) => state?.landing?.watchHistory)
    const continuewatchingLoading = useSelector((state) => state?.landing?.continuewatchingLoading)
    const espidoeLoader = useSelector((state) => state?.season?.loading)
    const searchwordkey = useSelector((state) => state?.search?.searchParams)
    const searchResult = useSelector((state) => state?.search?.data)
    const SeasonData = useSelector((state) => state?.season?.data);

    const isContinueWatching = friendly_id === "watch-history" || friendly_id === "continue-watching" || friendly_id === "continue_watching" || friendly_id === "continue";

    const [trailerPlaying, setTrailerPlaying] = useState(true);
    // console.log("continueWatchingData- - - - -   -- - - -- - - -- - - - - - ", continueWatchingData)

    const { ref, focusKey, focusSelf } = useFocusable({})
    const [count, setcount] = useState(1)
    const [multiplier, setmultiplier] = useState(1)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(sidebarDisable())
        if (isContinueWatching) {
            dispatch(getContinueData())
        } else if (friendly_id != "search-result" && !window.location.hash.includes("#/season")) {
            dispatch(getSeeall(friendly_id))
        } else {
            const param = {
                catalog_object_friendly_id: catalog_object_friendly_id,
                friendly_id: friendly_id,
            }
            dispatch(getSeason(param))
        }
    }, [friendly_id])

    useEffect(() => {
        if (isContinueWatching && continueWatchingData) {
            const items = Array.isArray(continueWatchingData)
                ? continueWatchingData
                : (continueWatchingData?.items || continueWatchingData?.catalog_list_items || []);
            if (items.length > 0 && (!bannerData || Object.keys(bannerData).length === 0)) {
                dispatch(bannerContent(items[0]));
            }
        }
    }, [continueWatchingData, isContinueWatching])

    useEffect(() => {
        focusSelf()
        //  dispatch(sidebarallow())
    }, [seeallData, SeasonData, continueWatchingData])

    let dataFilter


    // console.log("seeAllData-------------------------------", seeallData)
    if (friendly_id == "search-result") {
        dataFilter = searchResult
    }
    else if (isContinueWatching) {
        dataFilter = continueWatchingData
    }
    else if (!window.location.hash.includes("#/season")) {
        dataFilter = seeallData
    } else {
        dataFilter = SeasonData
    }

    const onRowFocus = useCallback(
        ({ y }) => {
            if (!!ref.current) {
                ref.current.scrollTop = y
            }
        },
        [ref]
    )

    const onScroll = useCallback((direction) => {

        if (direction === 'down') {
            ref.current.scrollTop += 350
        } else if (direction === 'up') {
            ref.current.scrollTop -= 350
        }
    }, [ref]);
    const updateCount = () => {
        setcount(count + 1)
        setmultiplier(multiplier + 1)
    }

    const sidebartoggole = useSelector((state) => state?.common?.sidebartoggle)

    // const handleTimeUpdate = (currentTime) => {
    //     console.log(`Current time: ${currentTime}`);
    // };

    // const handleEnded = (currentTime) => {
    //     console.log(`Current time: ${currentTime}`);
    // };

    let backgroundStyle
    let backgroundImg
    // console.log(Object.keys(bannerData)?.length > 0)
    if (Object.keys(bannerData).length > 0) {


        if (bannerData?.thumbnails?.large_16_9) {
            backgroundImg = bannerData?.thumbnails?.large_16_9?.url;
        }
        // backgroundImg = bannerData?.thumbnails ? bannerData.thumbnails?.high_16_9 ? bannerData?.thumbnails?.high_16_9.url : { url: '' } : { url: '' }
        backgroundStyle = {
            backgroundImage: `linear-gradient(0deg, rgb(24,29,37), rgba(24,29,37,0)), linear-gradient(90deg, rgb(24,29,37), rgba(24,29,37,0)), url('${backgroundImg}')`
        }

    }

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


    const handleTimeUpdate = (currentTime) => {
    };

    const handleEnded = (currentTime) => {
        setTrailerPlaying(false)
    };
    console.log(dataFilter)

    const isLoading = isContinueWatching ? continuewatchingLoading : (loading == true || espidoeLoader == true);

    return (
        isLoading ? <Loader /> :
            <FocusContext.Provider value={focusKey}>
                <div className='main-card'>
                    <div className='background-container-zero' >
                        <div className={'background-container-fullscreen'}>
                            <div className="left-gradient"></div>
                            <div className='bottom-gradient'></div>
                            {/* {
                        !!bannerData?.preview_url_en && trailerPlaying? (
                            <BannerPlayer
                                videoUrl={bannerData?.preview_url_en}
                                posterUrl={backgroundImg}
                                onTimeUpdate={handleTimeUpdate}
                                onEnded={handleEnded}
                                layout={"banner"}
                            />
                        ) : ( */}
                            <div className='poster2' style={backgroundStyle}></div>
                            {/* ) */}
                            {/* } */}
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
                    <div className='parent-container'>
                        <div className="banner-container">
                            {
                                bannerData?.title_image_display == true ?
                                    <div>
                                        <img className="banner-img" src={bannerData?.title_image} alt="" />
                                    </div> :
                                    <div>
                                        <h1 className='banner-title'>
                                            {bannerData?.display_title}
                                        </h1>
                                    </div>
                            }
                            <div className='banner-description-container'>
                                {/* <p className="banner-captions">{ItemCaption(bannerData)}</p> */}
                                <div className='banner-description'>{(!!bannerData?.short_description && bannerData?.short_description !== "") ? bannerData?.short_description : bannerData?.description}</div>

                                {/* {!!bannerData?.is_original && bannerData?.is_original === "yes" ?
                                    <div className="exclusive-container">
                                        <div className="exclusive-gradient">
                                        </div>
                                        <h1 className="etv-win-exclusive">ETV Win Exclusive</h1>
                                    </div>
                                    : ""} */}
                            </div>
                        </div>
                        {dataFilter && (
                            <div className='content-container-seeall' >
                                {window.location.hash.includes("#/season") ?
                                    <SeeallCard
                                        index={"0"}
                                        ref={ref}
                                        title={`${dataFilter.display_title}${" - "}${" Episodes"}`}
                                        data={dataFilter}
                                        layout={dataFilter.layout_type}
                                        from={"season"}
                                        friendly_id={friendly_id}
                                    />
                                    :
                                    <SeeallCard
                                        index={"0"}
                                        ref={ref}
                                        title={friendly_id == "search-result" ? `${"See all"}${" - "}Search results of ${searchwordkey}` : isContinueWatching ? "Continue Watching" : `${"See all"}${" - "}${dataFilter?.display_title || ""}`}
                                        data={dataFilter}
                                        layout={dataFilter?.layout_type || dataFilter?.tv_layout_type || "horizontal"}
                                        from={friendly_id == "search-result" ? "search-result" : isContinueWatching ? "watch-history" : 'seeall'}
                                        friendly_id={friendly_id}
                                    />}
                            </div>
                        )}
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
                </div>

            </FocusContext.Provider>
    )
}
export default Seeall