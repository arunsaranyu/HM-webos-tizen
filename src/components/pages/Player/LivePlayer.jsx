import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { activeIndexSidebar, sidebarDisable } from '../../../redux/reducer/landingReducer.jsx';
import InstaPlayer from '../../reusable/InstaPlayer/InstaPlayer.jsx';

import { signoutall } from '../../../redux/reducer/loginReducer.jsx';
import { getAuthToken } from '../../../assets/constant/index.jsx';
import Popup from '../../../helper/Popup.jsx';
import { onClicked } from '../../../redux/reducer/commonReducer.jsx';

const LivePlayer = () => {
    const { type, player } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    dispatch(sidebarDisable())
    var [playerConfig, setPlayerConfig] = useState("")
    const firstIndexValue = useSelector((state) => state?.landing?.firstIndex)
    const content = useSelector((state) => state?.details?.content)
    const getAlldetails = useSelector((state) => state?.details?.getAllDetails)
    const url = useSelector((state) => state?.details?.playbackUrl)
    const card = useSelector((state) => state?.details?.card)
    const durationStr = useSelector((state) => state?.details?.position)
    const [hours, minutes, seconds] = durationStr.split(':').map(Number);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    const source = (!!localStorage.getItem("source") && localStorage.getItem("source") != undefined && localStorage.getItem("source") != null) ? localStorage.getItem("source") : "NA"
    const tray_name = (!!localStorage.getItem("tray_name") && localStorage.getItem("tray_name") != undefined && localStorage.getItem("tray_name") != null) ? localStorage.getItem("tray_name") : "NA"
    const tray_id = (!!localStorage.getItem("tray_id") && localStorage.getItem("tray_id") != undefined && localStorage.getItem("tray_id") != null) ? localStorage.getItem("tray_id") : "NA"
    const isLoggedIn = !!localStorage.getItem("session_id");
    let playbackURL, content_security, content_type, playerType, hideTimeout, liveStatus = false, featureConfig = ['bigicons', 'playpause', 'backwardSeek', , 'title', 'progressbar', 'time', 'livevolume', 'qualityswitch', 'fullscreen', 'advertisement', 'eventcallbacks', 'liveprogressbar', 'liveicon'];
    playerType = type

    const isSubscribed = getAlldetails?.data?.is_subscribed;


    if (getAlldetails && url) {  // Check if url is defined and truthy
        const playurl = url.split("?");
        playbackURL = playurl[0]; // URL before the query parameters
        content_security = playurl[1]; // Query parameters
    }
    if (!!playbackURL) {
        content_type = playbackURL.split('.').pop().toLowerCase() === 'mpd' ? 'dash' : playbackURL.split('.').pop().toLowerCase() === 'm3u8' ? "hls" : playbackURL.split('.').pop().toLowerCase() === 'mp4' ? 'mp4' : 'hls'
    }


    window.showFullControls = () => {
        window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.show()
        window.InstaPlayer.playerLayers.bigplay.show()
        $(".sp-controls-bottom-progress-bar").show()
        $(".sp-quality-switch-wrap").show()
        $(".sp-controls-top-video-secondary-text").show()
        window.InstaPlayer.fullControls.bottomControlBar.videoTitle.show()

        if (playerType == "live") {
            document.getElementsByClassName("backward focusable").display = "none"
            document.getElementsByClassName("fowardfocusable").display = "none"
        }
        // keep this @Subhra
        // $('.playPause').focus();
    }

    const isQualityActive = () => {
        const active = document.activeElement;
        const qualityPopup = window.InstaPlayer?.fullControls?.bottomControlBar?.bottomPlayerControls?.quality?.popup?.[0];
        const qualityMainPopup = window.InstaPlayer?.fullControls?.bottomControlBar?.bottomPlayerControls?.quality?.mainpopup?.[0];
        const isPopupOpen = (qualityPopup && qualityPopup.style.display !== "none" && qualityPopup.style.display !== "") ||
            (qualityMainPopup && qualityMainPopup.style.display !== "none" && qualityMainPopup.style.display !== "") ||
            $(".sp-quality-switch-popup-wrap").is(":visible") ||
            $(".sp-quality-switch-main-popup-wrap").is(":visible");

        const isElementFocused = active && (
            active.classList?.contains("sp-quality-switch-btn") ||
            active.classList?.contains("qualityitem") ||
            active.classList?.contains("sp-selected-quality-btn") ||
            active.closest?.(".sp-quality-switch-wrap") != null ||
            active.closest?.(".sp-quality-switch-popup-wrap") != null ||
            active.closest?.(".sp-quality-switch-main-popup-wrap") != null
        );

        return isElementFocused || isPopupOpen;
    };

    function hideFullControls() {
        if (isQualityActive()) {
            return;
        }
        $(".sp-controls-bottom-progress-bar").hide()
        $(".sp-quality-switch-wrap").hide()

        $(".sp-controls-top-video-secondary-text").hide()
        window.InstaPlayer?.fullControls?.bottomControlBar?.bottomPlayerControls?.hide?.()
        window.InstaPlayer?.playerLayers?.bigplay?.hide?.()
        window.InstaPlayer?.playerLayers?.bigplay?.playPause?.hide?.()
        window.InstaPlayer?.fullControls?.bottomControlBar?.videoTitle?.hide?.()
        window.InstaPlayer?.fullControls?.bottomControlBar?.secondaryTitle?.hide?.()

    }
    var timeoutId;
    function timeoutControls() {
        // Clear any existing timeout
        clearTimeout(timeoutId);

        // Set up a new timeout
        timeoutId = setTimeout(() => {
            hideFullControls();
        }, 5000); // Hides the control after 5 sec.
    }


    const playPause = (key) => {
        if (ME && playerType !== 'live-banner' && playerType !== 'vod' && playerType === 'live') {
            if (isQualityActive()) {
                return;
            }
            const qualityPopup = window.InstaPlayer?.fullControls?.bottomControlBar?.bottomPlayerControls?.quality?.popup[0];

            if (qualityPopup && qualityPopup.style.display === "none") {
                if (ME.paused) {
                    console.log("Playing...");
                    ME.play();
                    window.InstaPlayer.playerLayers.bigplay.show();
                    window.InstaPlayer.playerLayers.bigplay.playPause.show()
                    window.InstaPlayer.fullControls.bottomControlBar.videoTitle.hide()
                    window.InstaPlayer.fullControls.bottomControlBar.secondaryTitle.hide()
                    $(".sp-controls-bottom-progress-bar").hide()
                    $(".sp-quality-switch-wrap").hide()

                    $(".sp-controls-top-video-secondary-text").hide()
                    window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.hide()
                } else {
                    console.log("Pausing...");
                    ME.pause();
                    window.InstaPlayer.playerLayers.bigplay.show();
                    window.InstaPlayer.playerLayers.bigplay.playPause.show();
                    window.InstaPlayer.fullControls.bottomControlBar.videoTitle.hide()
                    window.InstaPlayer.fullControls.bottomControlBar.secondaryTitle.hide()
                    $(".sp-controls-bottom-progress-bar").hide()
                    $(".sp-quality-switch-wrap").hide()

                    $(".sp-controls-top-video-secondary-text").hide()
                    window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.hide()

                }
            }
        }
    };

    const keyPress = useCallback((event) => {
        let key
        if (event) {
            key = event.keyCode;
        } else if (event.which) {
            key = event.which;
        }

        switch (key) {
            // OK
            case 13:
                if (ME && playerType !== 'live-banner') {
                    if (isQualityActive()) {
                        showFullControls();
                        clearTimeout(timeoutId);
                        break;
                    }
                    showFullControls()
                    timeoutControls()
                    playPause()
                }
                break;

            // PAUSE
            case 19:
                if (ME && playerType !== 'live-banner') {
                    ME.pause();
                }
                break;

            // LEFT
            case 37:
                if (ME && playerType !== 'live-banner') {
                    showFullControls()
                    timeoutControls()
                }
                break;

            // RIGHT
            case 39:
                if (ME && playerType !== 'live-banner') {
                    showFullControls()
                    timeoutControls()
                }
                break;

            // UP
            case 38:
                if (ME && playerType !== 'live-banner') {
                    showFullControls()
                    timeoutControls()
                }
                break;

            // DOWN
            case 40:
                if (ME && playerType !== 'live-banner') {
                    showFullControls()
                    window.InstaPlayer.playerLayers.bigplay.hide();
                    window.InstaPlayer.playerLayers.bigplay.playPause.hide()
                    timeoutControls()

                }
                break;

            // PLAY
            case 415:
                if (ME && playerType !== 'live-banner') {
                    ME.play();
                }
                break;

            // FORWARD
            case 417:
                if (ME && playerType !== 'live-banner') {
                    if ((ME.currentTime + 10) >= 0) {
                        ME.currentTime += 10;

                    } else {
                        ME.currentTime = 0;
                    }
                }
                break;

            // BACKWARD - LG
            case 412:
                if (ME && playerType !== 'live-banner') {
                    if ((ME.currentTime - 10) >= 0) {
                        ME.currentTime -= 10;
                    }
                    else {
                        ME.currentTime = 0;
                    }
                }
                break;

            // BACKWARD - SAMSUNG
            case 419:
                if (ME && playerType !== 'live-banner') {
                    if ((ME.currentTime - 10) >= 0) {
                        ME.currentTime -= 10;

                    }
                    else {
                        ME.currentTime = 0;
                    }
                }
                break;
        }
    }, [playerType !== 'live-banner', keyPress])

    window.playerLoadedCallback = function () {
        var watch10 = false;
        var watch25 = false;
        var watch50 = false;
        var watch75 = false;
        var watch90 = false;
        ME && ME.addEventListener('timeupdate', function () {
            var currentTime = ME.currentTime
            var totalDuration = ME.duration
            var watchPoint = Math.floor((currentTime / totalDuration) * 100)

            // 10%
            if (watchPoint == 10 && !watch10) {
                watch10 = true

                // emmitEvents("Stream_10%_Completion", ME.currentTime, source, category_name, bucket_name, video_name, genre, language, full_screen, subtitles, chromecast, quality, my_list, share, consumption_type, content_type, content_price);
            } else if (watchPoint == 25 && !watch25) {
                watch25 = true
                // emmitEvents("Stream_25%_Completion", ME.currentTime, source, category_name, bucket_name, video_name, genre, language, full_screen, subtitles, chromecast, quality, my_list, share, consumption_type, content_type, content_price);
            } else if (watchPoint == 50 && !watch50) {
                watch50 = true
                // emmitEvents("Stream_50%_Completion", ME.currentTime, source, category_name, bucket_name, video_name, genre, language, full_screen, subtitles, chromecast, quality, my_list, share, consumption_type, content_type, content_price);
            } else if (watchPoint == 75 && !watch75) {
                watch75 = true
                // emmitEvents("Stream_75%_Completion", ME.currentTime, source, category_name, bucket_name, video_name, genre, language, full_screen, subtitles, chromecast, quality, my_list, share, consumption_type, content_type, content_price);
            } else if (watchPoint == 90 && !watch90) {
                watch90 = true
                // emmitEvents("Stream_90%_Completion", ME.currentTime, source, category_name, bucket_name, video_name, genre, language, full_screen, subtitles, chromecast, quality, my_list, share, consumption_type, content_type, content_price);
            }
        })
    }

    useEffect(() => {
        if (playerConfig !== '') {
            window.addEventListener('keydown', keyPress)
            return () => window.removeEventListener("keydown", keyPress);
        }
    }, [keyPress, playerConfig])

    let muteStatus = true

    // if (playerType === 'live-banner') {
    //     featureConfig = [];
    //     muteStatus = true
    // }

    if (playerType === 'live') {
        featureConfig = ['liveprogressbar', 'bigicons', 'time', 'title', 'secondarytitle', 'qualityswitch', 'eventcallbacks', "liveicon",];
        muteStatus = true
        liveStatus = true
    }

    var [watchTime, setWatchTime] = useState(0);
    var timerInterval;
    useEffect(() => {
        window.registerCallBacks = function () {
            var hashcalled = false;
            if (window.InstaPlayer.eventcallbacks) {
                hideFullControls();

                window.InstaPlayer.eventcallbacks.onPlay = function () {
                    // bringing focus to mid play / pause 

                    $('.playPause').focus()
                    let firstPlay = true
                    if (firstPlay) {

                        hideFullControls()
                        // hide controls after 5 sec of playback
                    }
                    firstPlay = false


                    //  playbackstart(
                    //     1,
                    //     "",
                    //     "",
                    //     (!!content?.theme == 'episode')?(content?.title):(content?.title)
                    //     ,content?.theme == 'show_episode' ? content?.show_name : 'NA',
                    //     content?.theme == 'show_episode' ? content?.title : 'NA',(!!content)?(content?.genres.join(', ')):(""),
                    //     (!!content)?(content?.language):(""),(content?.subtitle_languages.length>0) ? content?.subtitle_languages.join(', ') : ('NA'),
                    //     0,
                    //     "720p",
                    //     "Online",(!!content.theme)?(content.theme):(""),
                    //     content?.access_control?.is_free ? 'AVOD' : 'SVOD',1,(!!content)?(content?.content_id):("NA"),"dangal",localStorage.getItem("user_id")    

                    //  )
                    timerInterval = setInterval(function () {
                        setWatchTime(watchTime++);
                    }, 1000);
                    localStorage.setItem("endtime", watchTime)

                };
                window.InstaPlayer.eventcallbacks.onBack = function () {
                    window.InstaPlayer = null
                    history.back()
                };
                window.addEventListener('hashchange', () => {
                    clearInterval(timerInterval);
                    if (ME && ME != null && !hashcalled) {
                        hashcalled = true;
                        // ME.removeEventListener('timeupdate', timeUpdateHandler);

                        window.InstaPlayer._destroyMedia();

                    }
                });

                return () => window.removeEventListener("hashchange");
            }

        }


    }
        , [watchTime])



    window.onhashchange = (event) => {
        try {
            // here we are destroying the Player during window hash change
            ME.hlsObj.destroy();
        } catch (e) {
            console.log("Destroy failed", e);
        }
    }

    useEffect(() => {
        localStorage.setItem("invalidsession", false)
        // console.log("!!", !!window.InstaPlayer)
        if (!!window.InstaPlayer) {
            window.InstaPlayer = null
        }
        console.log("window.ins", window.InstaPlayer)
        if (isLoggedIn && card?.access_control?.is_free == true) {
            if (playbackURL && playerType == "live") {
                let playerConfig = window.SaranyuInstaPlayer('hls', '.instaPlayer', {
                    'file': [{
                        'content_url': playbackURL,
                        'content_security': content_security,
                        'encryption': false,
                        'drm': {
                            'widevine': {
                                'LA_URL': ""
                            }
                        },
                        'label': '',
                        'mediaid': '1A2B3C4D',
                        'videotitle': card?.title,

                        'poster': "",
                        'secondarytitle': card?.item_captions ? card?.item_captions : "",
                    }],
                    'playerType': 'live',
                    'live': liveStatus,
                    'videotitle': card?.title,
                    'autoplay': true,
                    'mute': true,
                    'secondarytitle': card?.item_captions ? card?.item_captions : "",
                    'hideControlsWhenInactive': true,
                    'hideControlsTimeout': 3000,
                    'qualityswitch': { 'label': 'auto', 'metric': 'resolution' },
                    'features': featureConfig,
                    'heartBeat': {
                        'catalogID': (card?.catalog_id) ? (card?.catalog_id) : (""),
                        'contentID': (card?.content_id) ? (card?.content_id) : (""),
                        'region': localStorage.getItem("region"),
                        'authKey': getAuthToken(),
                        'beatInterval': parseInt(localStorage.getItem("watchhistory_interval_sec")) ? (parseInt(localStorage.getItem("watchhistory_interval_sec"))) : (30),
                        'url': `${!!localStorage.getItem("watchhistory_api") ? (localStorage.getItem("watchhistory_api")) : (endpoint)}/users/${localStorage.getItem("session_id")}/playlists/watchhistory/`
                    },
                    'registerCallBacks': window.registerCallBacks
                });

                setPlayerConfig(playerConfig);
            }
        }
        else if (!isLoggedIn && card?.access_control?.is_free == true) {
            if (playbackURL && playerType == "live") {
                let playerConfig = window.SaranyuInstaPlayer('hls', '.instaPlayer', {
                    'file': [{
                        'content_url': playbackURL,
                        'content_security': content_security,
                        'encryption': false,
                        'drm': {
                            'widevine': {
                                'LA_URL': ""
                            }
                        },
                        'label': '',
                        'mediaid': '1A2B3C4D',
                        'videotitle': card?.title,

                        'poster': "",
                        'secondarytitle': card?.item_captions ? card?.item_captions : "",
                    }],
                    'playerType': 'live',
                    'live': liveStatus,
                    'videotitle': card?.title,
                    'autoplay': true,
                    'mute': true,
                    'secondarytitle': card?.item_captions ? card?.item_captions : "",
                    'hideControlsWhenInactive': true,
                    'hideControlsTimeout': 3000,
                    'qualityswitch': { 'label': 'auto', 'metric': 'resolution' },
                    'features': featureConfig,
                    'registerCallBacks': window.registerCallBacks
                });

                setPlayerConfig(playerConfig);
            }
        }
        else if (card?.access_control?.is_free == false) {
            if (isLoggedIn && isSubscribed == true) {
                if (playbackURL && playerType == "live") {
                    let playerConfig = window.SaranyuInstaPlayer('hls', '.instaPlayer', {
                        'file': [{
                            'content_url': playbackURL,
                            'content_security': content_security,
                            'encryption': false,
                            'drm': {
                                'widevine': {
                                    'LA_URL': ""
                                }
                            },
                            'label': '',
                            'mediaid': '1A2B3C4D',
                            'videotitle': card?.title,
                            'poster': "",
                            'secondarytitle': card?.item_captions ? card?.item_captions : "",
                        }],
                        'playerType': 'live',
                        'live': liveStatus,
                        'videotitle': card?.title,
                        'autoplay': true,
                        'mute': true,
                        'secondarytitle': card?.item_captions ? card?.item_captions : "",
                        'hideControlsWhenInactive': true,
                        'hideControlsTimeout': 3000,
                        'qualityswitch': { 'label': 'auto', 'metric': 'resolution' },
                        'features': featureConfig,
                        'heartBeat': {
                            'catalogID': (card?.catalog_id) ? (card?.catalog_id) : (""),
                            'contentID': (card?.content_id) ? (card?.content_id) : (""),
                            'region': localStorage.getItem("region"),
                            'authKey': getAuthToken(),
                            'beatInterval': parseInt(localStorage.getItem("watchhistory_interval_sec")) ? (parseInt(localStorage.getItem("watchhistory_interval_sec"))) : (30),
                            'url': `${!!localStorage.getItem("watchhistory_api") ? (localStorage.getItem("watchhistory_api")) : (endpoint)}/users/${localStorage.getItem("session_id")}/playlists/watchhistory/`
                        },
                        'registerCallBacks': window.registerCallBacks
                    });

                    setPlayerConfig(playerConfig);
                }
            }
        }

    }, [playbackURL]);
    const onSubmit = (confirm) => {
        dispatch(onClicked(""))

        if (confirm === "Go Back" ||"Cancel") {

            dispatch(onClicked(""))
            navigate(-1)
        }
        else if (confirm === "Login") {
            navigate('/activate')
        }
        else if (confirm == "Retry") {
            navigate(-1)
        }
        else if (confirm == "Signout all") {
            var details = {
                auth_token: getAuthToken(),
                type: session_text
            };

            const firstIndex = {
                firstIndex: firstIndexValue
            }
            dispatch(activeIndexSidebar(firstIndexValue))
            dispatch(signoutall({ details, navigate, firstIndex }));
        }
        else {
            navigate("/plans")
        }
    }

    return (
        <>
            {card?.access_control?.is_free == false && !isLoggedIn || (card?.access_control.login_required == true && !isLoggedIn)
                ?
                <Popup
                    alert="Alert"
                    alertType="Login Alert"
                    heading="Action Required!"
                    Description="Login is mandatory for this action"
                    from={"login"}
                    onSubmit={onSubmit}
                /> :
                isLoggedIn && isSubscribed == false && card?.access_control?.is_free == false ?
                    <Popup
                        alert=""
                        alertType="Subscription Alert"
                        heading="No Subscription Found"
                        Description="You need a subscription to access the content"
                        from={"details"}
                        onSubmit={onSubmit}
                    /> :

                    <InstaPlayer config={playerConfig} player={player} />
            }

        </>

    )


}

export default LivePlayer

