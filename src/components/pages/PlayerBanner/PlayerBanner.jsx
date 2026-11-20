import React, { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { sidebarDisable, sidebarAllow } from "../../../redux/reducer/landingReducer.jsx";
import { useParams } from "react-router-dom";

import InstaPlayerBanner from "../../reusable/InstaPlayerBanner/InstaPlayerBanner.jsx";


function PlayerBanner(props) {
    const { type, player } = useParams()
    const dispatch = useDispatch()
    const content = useSelector((state) => state?.common?.banner)
    const getAllDetail = useSelector((state) => state?.details?.getAllDetails)
    const detailsPageData = useSelector((state) => state?.details?.data)
    const smarturl = useSelector((state) => state?.player?.playbackData)
    let content_type, playerType, hideTimeout, liveStatus = false, featureConfig = ['bigicons', 'playpause', 'backwardSeek', 'volume', 'title', 'progressbar', 'time', 'fullscreen', 'advertisement', 'eventcallbacks'];

    const bannerData = useSelector((state) => state?.common?.banner)
    let playbackURL
    const { from } = props

    if (from == "home") {
        playbackURL = bannerData?.preview_adaptive_url_ak
    } else if (type == "vod") {
        playbackURL = bannerData?.preview_adaptive_url_ak
    }

    else if (!!getAllDetail) {
        if (getAllDetail?.stream_info?.preview_available == true) {
            playbackURL = getAllDetail.stream_info?.preview?.adaptive_url_ak
        }

    }
    var [playerConfig, setPlayerConfig] = useState('')

    if (from == "home") {
        dispatch(sidebarAllow())
    } else {
        dispatch(sidebarDisable())
    }


    if (Object.keys(props).length > 0) {
        playerType = props.playerType
    }
    else {
        playerType = type

    }




















    //state for reloading the player after the n/w is gone
    const refresh = useSelector((state) => state?.player?.playerReloadStatus)

    function showFullControls() {
        window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.show()
        window.InstaPlayer.playerLayers.bigplay.show()
        window.InstaPlayer.fullControls.topControlBar.videoTitle.show()
        if (playerType == "live") {
            document.getElementsByClassName("backward focusable").display = "none"
            document.getElementsByClassName("fowardfocusable").display = "none"
        }
        // keep this @Subhra
        // $('.playPause').focus();
    }

    function hideFullControls() {
        window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.hide()
        window.InstaPlayer.playerLayers.bigplay.hide()
        window.InstaPlayer.fullControls.topControlBar.videoTitle.hide()
    }
    function timeoutControls() {
        // first we clear any existing timeouts
        clearTimeout(hideTimeout)
        // then we will setup new timeout 
        hideTimeout = setTimeout(() => {
            hideFullControls()
        }, 5000) // this hides the control after showing it for 5 sec.
    }

    const playPause = (key) => {

        if (ME && playerType !== 'live-banner' && playerType !== 'vod') {
            if (playerType === 'live') {
                if (ME.paused) {
                    ME.play()
                    console.log(ME)
                } else {
                    ME.pause();
                }
            }
        }
    }

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
                    // this ensures if there is any key down activity then don't hide the controls.
                    clearTimeout(hideTimeout)
                    // after clearing we need to again set a fresh timeout function.
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
    }, [playerType !== 'live-banner'])

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
        window.addEventListener('keydown', keyPress)
        return () => window.removeEventListener("keydown", keyPress);
    }, [keyPress])

    let muteStatus

    if (playerType === 'live-banner') {
        featureConfig = [];
        muteStatus = true
    }

    else if (playerType === 'live') {
        featureConfig = ['bigicons', 'playpause', 'progressbar', 'time', 'title'];
        muteStatus = true
        liveStatus = true
    }

    window.registerCallBacks = function () {
        if (window.InstaPlayer.eventcallbacks) {
            window.InstaPlayer.eventcallbacks.onPlay = function () {
                // bringing focus to mid play / pause 

                $('.playPause').focus()
                let firstPlay = true
                if (firstPlay) {
                    setTimeout(() => {
                        hideFullControls()
                    }, 5 * 1000); // hide controls after 5 sec of playback
                }
                firstPlay = false




            };
            window.InstaPlayer.eventcallbacks.onPause = function (

            ) {

            };
            window.InstaPlayer.eventcallbacks.onResume = function () {

            }
            window.InstaPlayer.eventcallbacks.onBackwardSeek = function () { };
            window.InstaPlayer.eventcallbacks.onForwardSeek = function () { };
            window.InstaPlayer.eventcallbacks.onSeeked = function () { };
            window.InstaPlayer.eventcallbacks.onComplete = function () {
                if (playerType === 'live-banner') {


                }

            };
            window.InstaPlayer.eventcallbacks.onBuffering = function () { };
            window.InstaPlayer.eventcallbacks.onBack = function () {

            };
            window.InstaPlayer.eventcallbacks.onError = function (type, code) {
                console.log(type, code);
            };
            window.InstaPlayer.eventcallbacks.onComplete = function () {

                history.back()
            };
        }
        return
    }

    useEffect(() => {



        if (playbackURL) {
            let playerConfig = window.SaranyuInstaPlayer('hls', '.poster', {
                'file': [{
                    'content_url': playbackURL,
                    'videotitle': '',
                    // 'seekonload': 0
                    'poster': (!!bannerData?.thumbnails?.large_16_9?.url) ? (bannerData?.thumbnails?.large_16_9?.url) : (bannerData.thumbnails?.xl_image_2_3?.url),
                }],
                'playerType': playerType,
                'live': liveStatus,
                'autoplay': true,
                'mute': true,
                'hideControlsWhenInactive': true,
                'hideControlsTimeout': 3000,
                'qualityswitch': { 'label': 'auto', 'metric': 'resolution' },
                // 'advertisement': {
                //     'cue': true,
                //     'adsets': [{
                //         'adurl':  'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=',
                //         //  'adurl': 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=', // midrole ad
                //         // 'adurl':`${base_Url}/access_controls/640ec3861e717108dffb307f/ads?auth_token=${auth_token}&region=&positions=667,1334,2001,2668,3335`,
                //         'schedule': 'preroll'
                //     }]
                // },
                'features': featureConfig,

                // 'heartBeat': {
                //     'catalogID': getalldata.catalog_id,
                //     'contentID': getalldata.content_id,
                //     'region': regiondata?.country_code2,
                //     'authKey': auth_token,
                //     'beatInterval': 10,
                //     // 'url': `http://216.48.179.109/users/${localStorage.getItem("session_id")}/playlists/watchhistory/`
                // },

                'registerCallBacks': window.registerCallBacks
            });
            setPlayerConfig(playerConfig);
            // console.log("player",playerConfig);
        }
        // else if (playerType == "live" && playerType != "live-banner") {
        //     let playerConfig = window.SaranyuInstaPlayer(content_type, '.instaPlayer', {
        //         'file': [{
        //             'content_url': playbackURL,
        //             // 'encryption': 'undefined' == mediaInfo.encryption ? false : mediaInfo.encryption,
        //             'encryption': content_type == "dash" ? true : false,
        //             'drm': {
        //                 'widevine': {
        //                     'LA_URL': (getalldetailsdata?.adaptive_url_aks?.liscense_urls?.dash?.la_url) ? (getalldetailsdata?.adaptive_url_aks?.liscense_urls?.dash?.la_url) : ""
        //                 }
        //             },
        //             'label': '',
        //             'mediaid': '1A2B3C4D',
        //             'videotitle': content.title,
        //             'poster': (!!content?.thumbnails?.medium_16_9?.url) ? (content?.thumbnails?.medium_16_9?.url) : (content.thumbnails?.xl_image_2_3?.url),
        //         }],
        //         'playerType': playerType,
        //         'live': liveStatus,
        //         'videotitle': content?.title,
        //         'autoplay': true,
        //         'mute': true,
        //         'hideControlsWhenInactive': true,
        //         'hideControlsTimeout': 3000,
        //         'qualityswitch': { 'label': 'auto', 'metric': 'resolution' },
        //         'advertisement': {
        //             'cue': false,
        //             // 'adsets': [{
        //             //     'adurl':  'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=',
        //             //     //  'adurl': 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=', // midrole ad
        //             //     // 'adurl':`${base_Url}/access_controls/640ec3861e717108dffb307f/ads?auth_token=${auth_token}&region=&positions=667,1334,2001,2668,3335`,
        //             //     'schedule': 'preroll'
        //             // }]
        //         },
        //         'features': featureConfig,

        //         //   'heartBeat': {
        //         //       'catalogID': (content?.catalogId)?(content?.catalogId):(""),
        //         //       'contentID': (content?.contentId)?(content?.contentId):(""),
        //         //       'region': regiondata?.country_code2,
        //         //       'authKey': auth_token,
        //         //       'beatInterval': 30,
        //         //       'url': `${baseUrl}/users/${localStorage.getItem("session_id")}/playlists/watchhistory/`
        //         //   },
        //         'registerCallBacks': window.registerCallBacks
        //     });

        //     setPlayerConfig(playerConfig);

        // }


    }, [playbackURL])



    // window.onhashchange = function() {
    //     if(ME) {
    //         ME.pause();
    //     }
    // }

    return (
        <>
            <InstaPlayerBanner config={playerConfig} player={player} type={type} />
        </>
    )
}

export default PlayerBanner;