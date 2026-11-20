import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import InstaPlayer from '../../reusable/InstaPlayer/InstaPlayer.jsx'

import { sidebarDisable } from '../../../redux/reducer/landingReducer.jsx'
import { endpoint, secret_key, type, session_Id, session_text, getAuthToken, getSecretKey } from '../../../assets/constant/index.jsx'

import md5 from 'md5'
import { contentDetails, getAllDetailsData, getupNext, positionInPlayer } from '../../../redux/reducer/detailsReducer.jsx'
import { onClicked } from '../../../redux/reducer/commonReducer.jsx'
import Popup from '../../../helper/Popup.jsx'
import { signoutall } from '../../../redux/reducer/loginReducer.jsx'
import { getNextStatus } from '../../../redux/reducer/playerReducer.jsx'
import { activeIndexSidebar } from '../../../redux/reducer/landingReducer.jsx'

import Card from '../../reusable/Card/Card.jsx'
import YoutubePlayer from '../../reusable/YoutubePlayer/YoutubePlayer.jsx'
import { resolveYoutubeItem, getYoutubeVideoId } from '../../../helper/youtube.js'
import * as api from '../../../api/index.jsx'

function Player(props) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    dispatch(sidebarDisable())

    const { type, player } = useParams()
    var [playerConfig, setPlayerConfig] = useState('')
    const content = useSelector((state) => state?.details?.content)
    const appConfigData = useSelector((state) => state?.common?.appConfig)
    const getAlldetails = useSelector((state) => state?.details?.getAllDetails)
    const nextEpisode = useSelector((state) => state?.player?.nextData)
    const activeIndex = useSelector((state) => state?.landing?.activeIndex)

    const url = useSelector((state) => state?.details?.playbackUrl)
    const isSecured = useSelector((state) => state?.details?.is_secured)
    const adaptive_url = useSelector((state) => state?.details?.playbackUrl_adaptive_url)
    const seasonlastepisode = useSelector((state) => state?.season?.data);
    const card = useSelector((state) => state?.details?.card)
    const detailsData = useSelector((state) => state?.details?.data)
    const upNext = useSelector((state) => state?.details?.upNext)
    const thumbnailSeekbar = useSelector((state) => state.details?.seekbarImageUrl)

    const firstIndexValue = useSelector((state) => state?.landing?.firstIndex)
    const durationStr = useSelector((state) => state?.details?.position) || "";

    const [hours, minutes, seconds] = durationStr ? durationStr.split(':').map(Number) : [0, 0, 0];
    const totalSeconds = (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);

    let content_security, playbackURL, is_Secured, content_type, playerType, hideTimeout, liveStatus = false, nextEpisodeStatus = true
    var featureConfig = ['bigicons', 'backwardSeek', 'title', 'secondarytitle', 'progressbar', 'time', 'qualityswitch', 'subtitles', "multiaudio", 'eventcallbacks', "nextepisode", "advertisement"];
    playerType = type
    playbackURL = url

    const getContentType = (u) => {
        if (!u) return 'hls';
        const cleanUrl = u.split('?')[0];
        const ext = cleanUrl.split('.').pop().toLowerCase();
        if (ext === 'mpd') return 'dash';
        if (ext === 'mp4') return 'mp4';
        return 'hls';
    };

    content_type = getContentType(playbackURL);

    window.trackChanged = false;
    localStorage.removeItem("trackChanged");
    localStorage.removeItem("skip_intro_status");
    localStorage.removeItem("subclick");
    localStorage.removeItem("subclickmultiaudio");
    localStorage.removeItem("selectedQuality");
    localStorage.removeItem("isPlayedfirstSubtitles");
    localStorage.removeItem("currentSubtitles");
    localStorage.removeItem("subtitles_language");
    window.isPlayedfirstSubtitles = false;
    window.currentSubtitles = -1;

    is_Secured = isSecured

    const [adConfig, setadConfig] = useState([])

    var nextcard
    window.showFullControls = function (key) {
        if (typeof window.InstaPlayer !== 'undefined' && window.InstaPlayer !== null && localStorage.getItem("ads_status") == "false") {
            if (key == 40 || key == 38) {
                window.InstaPlayer.playerLayers.bigplay && window.InstaPlayer.playerLayers.bigplay.hide()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.progressbar.show()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.quality.show()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.multiaudio && window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.show()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.show();
                window.InstaPlayer.fullControls.bottomControlBar.show();
                window.InstaPlayer.fullControls.bottomControlBar.videoTitle.show()
                window.InstaPlayer.fullControls.bottomControlBar.secondaryTitle.show()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.slash.show()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.leftTime.show()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.rightTime.show()
                if (window.subtitleTracks && window.subtitleTracks.length > 0) {
                    window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.subtitles && window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.subtitles.show()
                    $(".sp-subtitles-switch").show()
                } else {
                    window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.subtitles && window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.subtitles.hide()
                    $(".sp-subtitles-switch").hide()
                }

            }

            else {
                if (window.isLongPress) {
                    $(".skipButton").hide();
                    window.InstaPlayer.fullControls.bottomControlBar.show();
                    window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.progressbar.show()
                    window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.quality.hide()
                    window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.multiaudio && window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.hide()
                    window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.subtitles && window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.subtitles.hide()
                    $(".sp-subtitles-switch").hide()
                    window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.show();
                    window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.backgroundGradient.show()

                    window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.thumbnailContainer.show();
                    window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.thumbnailsCenterContainer.show();
                    window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.thumbnailsCenterContainerMiddle.show();
                    window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.thumbnailsCenterContainerPadding.show();
                    window.InstaPlayer.fullControls.bottomControlBar.videoTitle.hide()
                    window.InstaPlayer.fullControls.bottomControlBar.secondaryTitle.hide()
                    window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.slash.show()
                    window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.leftTime.show()
                    window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.rightTime.show()

                } else {

                    window.InstaPlayer.fullControls.bottomControlBar.show();
                    window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.progressbar.show()
                    window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.quality.show()
                    window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.multiaudio && window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.show()
                    if (window.subtitleTracks && window.subtitleTracks.length > 0) {
                        window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.subtitles && window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.subtitles.show()
                        $(".sp-subtitles-switch").show()
                    } else {
                        window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.subtitles && window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.subtitles.hide()
                        $(".sp-subtitles-switch").hide()
                    }
                    window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.show();
                    window.InstaPlayer.fullControls.bottomControlBar.videoTitle.show()
                    window.InstaPlayer.fullControls.bottomControlBar.secondaryTitle.show()
                    window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.slash.show()
                    window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.leftTime.show()
                    window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.rightTime.show()

                }
            }
        }
    }

    window.hideFullControls = function () {
        if (typeof window.InstaPlayer !== 'undefined' && window.InstaPlayer !== null && localStorage.getItem("ads_status") == "false") {

            if (window.InstaPlayer && window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.backgroundGradient && window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.backgroundGradient.css('display') !== 'none') {
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.progressbar.show()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.quality.hide()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.multiaudio && window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.hide()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.subtitles && window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.subtitles.hide()
                $(".sp-subtitles-switch").hide()
                window.InstaPlayer.fullControls.bottomControlBar.secondaryTitle.hide()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.slash.show()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.leftTime.show()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.rightTime.show()

            }
            else if (window.InstaPlayer && window.isLongPress) {
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.progressbar.show()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.slash.show()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.leftTime.show()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.rightTime.show()
            }

            else if ($("#SidebarQuality").is(":visible") || $("#SidebarSubtitles").is(":visible") || $("#SidebarMultiaudio").is(":visible")) {
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.show()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.progressbar.show()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.quality.show()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.multiaudio && window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.show()
                if (window.subtitleTracks && window.subtitleTracks.length > 0) {
                    window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.subtitles && window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.subtitles.show()
                    $(".sp-subtitles-switch").show()
                }
                window.InstaPlayer.fullControls.bottomControlBar.show()
                window.InstaPlayer.fullControls.bottomControlBar.videoTitle.show()
                window.InstaPlayer.fullControls.bottomControlBar.secondaryTitle.show()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls && window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.slash.show()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.leftTime.show()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.rightTime.show()
            }
            else {
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.hide()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.quality.hide()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.multiaudio && window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.hide()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.subtitles && window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.subtitles.hide()
                $(".sp-subtitles-switch").hide()
                window.InstaPlayer.playerLayers.bigplay.playPause.hide()
                window.InstaPlayer.fullControls.bottomControlBar.hide()
                window.InstaPlayer.fullControls.bottomControlBar.secondaryTitle.hide()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.slash.hide()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.leftTime.hide()
                window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.rightTime.hide()
            }
        }
    }
    let muteStatus = false

    const playPause = (key) => {
        if (ME && playerType !== 'live-banner' && playerType !== 'vod') {
            if (playerType === 'live') {
                if (ME.paused) {
                    ME.play()

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
            case 13:
                if (ME && playerType !== 'live-banner') {
                    window.isLongPress = false
                    if ($('.sp-quality-switch-popup-wrap').is(':visible')) {
                        $('.sp-quality-switch-popup-wrap').focus()
                        window.InstaPlayer.playerLayers.bigplay.hide()
                    }

                    else {

                    }

                }
                break;

            case 19:
                if (ME && playerType !== 'live-banner') {
                    ME.pause();
                }
                break;

            case 37:
                if (ME && playerType !== 'live-banner') {

                    if (window.isLongPress && window.downArrowPress) {
                        window.showFullControls()

                        window.timeoutControls()
                    }
                }
                break;

            case 39:
                if (ME && playerType !== 'live-banner') {
                    if (window.isLongPress && window.downArrowPress) {
                        window.showFullControls()

                        window.timeoutControls()
                    }

                }
                break;

            case 38:
                if (ME && playerType !== 'live-banner') {
                    window.showFullControls(key)
                    window.timeoutControls()
                }
                break;

            case 40:
                if (ME && playerType !== 'live-banner') {
                    window.showFullControls(key)
                    window.timeoutControls()
                }
                break;

            case 415:
                if (ME && playerType !== 'live-banner') {
                    ME.play();
                }
                break;

            case 417:
                if (ME && playerType !== 'live-banner') {
                    if ((ME.currentTime + 10) >= 0) {
                        ME.currentTime += 10;
                    } else {
                        ME.currentTime = 0;
                    }
                }
                break;

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
    }, [keyPress, playerType !== 'live-banner'])

    useEffect(() => {
        if (playerConfig !== '') {
            window.addEventListener('keydown', keyPress)
            return () => window.removeEventListener("keydown", keyPress);
        }
    }, [keyPress, playerConfig])

    var timeoutId;
    window.timeoutControls = function () {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            window.hideFullControls();
        }, 5000);
    }

    window.registerCallBacks = function () {
        if (window.InstaPlayer.eventcallbacks) {
            let startTime = 0;
            let endTime = 0;
            var timerInterval;
            var hashcalled = false;
            let counter = 0;
            let playbackTime = 0;
            var watchTime = 0;
            let isbuffering = false;
            var watch10 = false;
            var watch25 = false;
            var watch50 = false;
            var watch75 = false;
            var watch90 = false;

            var totalDuration
            var watchPoint

            function timeUpdateHandler() {
                if (window.location.hash == '#/player/vod' || window.location.hash == "#/liveplayer/live") {

                    var currentTime = window.InstaPlayer.mediaElement.videoElement.currentTime
                    endTime = new Date().getTime();
                    totalDuration = ME.duration
                    watchPoint = (ME.currentTime / totalDuration) * 100

                    isbuffering = false;
                    if (watchPoint >= 10 && !watch10) {
                        watch10 = true

                    } else if (watchPoint >= 25 && !watch25) {
                        watch25 = true

                    } else if (watchPoint >= 50 && !watch50) {
                        watch50 = true

                    } else if (watchPoint >= 75 && !watch75) {
                        watch75 = true

                    } else if (watchPoint >= 90 && !watch90) {
                        watch90 = true

                    }

                }

            }
            if (ME && ME !== null) {
                ME.addEventListener('timeupdate', timeUpdateHandler);
            }

            window.
                window.InstaPlayer.eventcallbacks.onPlay = function () {
                    if (window.location.hash == '#/player/vod' || window.location.hash == "#/liveplayer/live") {
                        if (typeof $ !== 'undefined') {
                            $(".sp-subtitles-switch").hide();
                        }
                        if (window.InstaPlayer && window.InstaPlayer.fullControls && window.InstaPlayer.fullControls.bottomControlBar && window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls && window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.subtitles) {
                            window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.subtitles.hide();
                        }
                        totalDuration = ME.duration
                        watchPoint = (ME.currentTime / totalDuration) * 100
                        window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.progressbar.handle.focus()
                        let firstPlay = true
                        window.contentGradingShown = false
                        if (!window.contentGradingShown) {
                            window.contentGradingShown = true;

                            setTimeout(function () {
                                window.InstaPlayer && window.InstaPlayer.fullControls.topControlBar.contentGrading.hide();
                            }, 5000);
                        }

                        firstPlay = false
                        timerInterval = setInterval(function () {
                            watchTime++;
                        }, 1000);

                        startTime = new Date().getTime();

                    }

                };

            window.InstaPlayer.eventcallbacks.onPause = function () {
                clearInterval(timerInterval);
                if (window.location.hash == '#/player/vod' || window.location.hash == "#/liveplayer/live") {
                    playbackTime = (endTime - startTime) / 1000;
                    startTime = 0;
                    if (ME.currentTime > 1 && isbuffering == false && ME.currentTime <= ME.duration) {


                    }
                }

            };
            window.InstaPlayer.eventcallbacks.onResume = function () {
                if (window.location.hash == '#/player/vod' || window.location.hash == "#/liveplayer/live") {
                    timerInterval = setInterval(function () {
                        watchTime++;
                    }, 1000);
                    startTime = new Date().getTime();


                }
            }
            window.InstaPlayer.eventcallbacks.createNext = function (cardy) {
                try {
                    if (window.InstaPlayer && typeof window.InstaPlayer._destroyMedia === 'function') {
                        window.InstaPlayer._destroyMedia();
                    }
                } catch (e) {
                }
                if (window.InstaPlayer != null) {
                    $(".instaPlayer").empty();
                    window.InstaPlayer = null;
                }
                if (!!cardy) {
                    const catalogId = cardy?.catalog_id || card?.catalog_id || (cardy?.catalog_object && cardy?.catalog_object?.friendly_id) || "shows";
                    const contentId = cardy?.content_id || cardy?.id;
                    const nextCard = {
                        ...cardy,
                        catalog_id: catalogId,
                        content_id: contentId,
                    };
                    dispatch(contentDetails(nextCard));
                    const session_id =
                        localStorage.getItem("session_id") != null
                            ? localStorage.getItem("session_id")
                            : "";
                    const ts = parseInt(new Date().getTime() / 1000);
                    var allDetails = {
                        content_id: contentId,
                        catalog_id: catalogId,
                        auth_token: getAuthToken(),
                        id: session_id,
                        md5: md5(
                            catalogId + contentId + session_id + ts + secret_key
                        ),
                        ts: String(ts),
                        category: "",
                        region: localStorage.getItem("region") || "IN",
                    };

                    const theme = "vod";
                    dispatch(positionInPlayer("00:00:00"));
                    dispatch(getAllDetailsData({ allDetails, navigate, theme }));
                }
            };
            window.InstaPlayer.eventcallbacks.onBackwardSeek = function () { };
            window.InstaPlayer.eventcallbacks.onForwardSeek = function () {
                if (ME.currentTime > 1) {
                    if (ME.duration - ME.currentTime > 15) {
                        counter += 1;
                    }

                }
            };
            window.InstaPlayer.eventcallbacks.onSeeked = function () {
            };
            window.InstaPlayer.eventcallbacks.onBuffering = function () {
                isbuffering = true;
            };
            window.InstaPlayer.eventcallbacks.onBack = function () {

                history.back()
            };
            window.InstaPlayer.eventcallbacks.onError = function (type, code) {

            };
            window.InstaPlayer.eventcallbacks.onComplete = function () {
                history.back()
            };

            window.InstaPlayer.eventcallbacks.adLoaded = function (adsData, content_type, adsCurrentTime) {

            }
            window.InstaPlayer.eventcallbacks.adStarted = function (adsData, content_type, adsCurrentTime) {

            }
            window.InstaPlayer.eventcallbacks.adsMIDPOINT = function (adsData, content_type, adsCurrentTime) {

            }

            window.InstaPlayer.eventcallbacks.adsFIRSTQUARTILE = function (adsData, content_type, adsCurrentTime) {



            }
            window.InstaPlayer.eventcallbacks.adsCOMPLETED = function (adsData, content_type, adsCurrentTime) {

            }
            window.InstaPlayer.eventcallbacks.adsTHIRDQUARTILE = function (adsData, content_type, adsCurrentTime) {

            }

            window.InstaPlayer.eventcallbacks.adsError = function (adsDatamessage, adsDataerror, content_type) {

            }
            window.addEventListener('hashchange', () => {
                clearInterval(timerInterval);
                if (ME && ME != null && !hashcalled) {
                    hashcalled = true;
                    playbackTime = (endTime - startTime) / 1000;
                    startTime = 0;
                    ME.removeEventListener('timeupdate', timeUpdateHandler);

                    watchTime = 0
                    var script = document.getElementById("ima-sdk-script");

                    window.InstaPlayer._destroyMedia();

                    window.InstaPlayer = null

                }
            });

            return () => window.removeEventListener("hashchange");
        }
        return
    }

    // ---- YouTube content ----------------------------------------------
    // When get_all_details (or item details) returns play_url_type === "youtube"
    // and youtube_id, play via YoutubePlayer instead of InstaPlayer.
    const allDetailsItem = getAlldetails?.data || getAlldetails
    const ytFromState = resolveYoutubeItem(card, detailsData, getAlldetails)
    const cardKey = card?.content_id || card?.friendly_id || ''
    const [ytLookup, setYtLookup] = useState({ key: null, item: null, done: false })

    useEffect(() => {
        if (ytFromState) {
            setYtLookup({ key: cardKey, item: ytFromState, done: true })
            return
        }
        const catalogFriendlyId = card?.catalog_object?.friendly_id
        // Card already carries play_url_type (not youtube) or can't be looked up -> normal player
        if (!card || card.play_url_type !== undefined || !card.friendly_id || !catalogFriendlyId) {
            setYtLookup({ key: cardKey, item: null, done: true })
            return
        }

        // Card came from a list without play_url_type: check item details once
        let cancelled = false
        setYtLookup({ key: cardKey, item: null, done: false })
        const isEpisode = card.theme === 'episode' || card.theme === 'show_episode'
        const request = isEpisode
            ? api.episodeDetails({ show_object: card.show_object, friendly_id: card.friendly_id, catalog_object_friendly_id: catalogFriendlyId })
            : api.getDetails({ catalog_object_friendly_id: catalogFriendlyId, friendly_id: card.friendly_id })
        const timeout = new Promise((resolve) => setTimeout(() => resolve(null), 4000))

        Promise.race([request, timeout])
            .then((res) => {
                if (cancelled) return
                const item = res?.data?.data
                const yt = getYoutubeVideoId(item) ? item : null
                setYtLookup({ key: cardKey, item: yt, done: true })
            })
            .catch(() => {
                if (!cancelled) setYtLookup({ key: cardKey, item: null, done: true })
            })
        return () => { cancelled = true }
    }, [cardKey, ytFromState?.content_id])

    const youtubeItem = ytFromState || (ytLookup.key === cardKey ? ytLookup.item : null) || allDetailsItem
    const ytResolved = !!ytFromState || !!getYoutubeVideoId(allDetailsItem) || (ytLookup.key === cardKey && ytLookup.done)
    const youtubeVideoId = getYoutubeVideoId(allDetailsItem) || getYoutubeVideoId(youtubeItem)
    // ---------------------------------------------------------------------

    useEffect(() => {
        // YouTube content (or still checking): don't start InstaPlayer
        if (!ytResolved || youtubeVideoId) return

        localStorage.setItem("ads_status", "false");

        localStorage.setItem("invalidsession", false)
        localStorage.setItem("preroll_status_ads_callback", "false")
        window.isLongPress = false;
        window.setIntervalTime = 600;
        window.longPressDuration = 300;
        window.playbackTime = Number(!!totalSeconds ? totalSeconds : "0"),
            localStorage.setItem("setInterval", 10)
        window.IntervalTime = 10
        if (!!window.InstaPlayer) {
            window.InstaPlayer = null
        }
        window.isQuality = false
        window.skipIntroStatus = false
        window.subtitlesStatus = false
        window.multiaudioStatus = false
        localStorage.removeItem("isPlayedfirstSubtitles");
        localStorage.removeItem("currentSubtitles");
        localStorage.removeItem("subtitles_language");
        localStorage.removeItem("subclick");
        window.isPlayedfirstSubtitles = false;
        window.currentSubtitles = -1;

        const rawSkipIntro = getAlldetails?.data?.skip_intro ?? card?.skip_intro ?? content?.skip_intro;
        const rawStartTime = getAlldetails?.data?.skip_start_time ?? card?.skip_start_time ?? content?.skip_start_time ?? card?.intro_start_time_sec;
        const rawEndTime = getAlldetails?.data?.skip_end_time ?? card?.skip_end_time ?? content?.skip_end_time ?? card?.intro_end_time_sec;

        const startTime = Number(rawStartTime || 0);
        const endTime = Number(rawEndTime || 0);
        const isSkipIntro = (rawSkipIntro === true || rawSkipIntro === "true" || (rawSkipIntro !== false && rawSkipIntro !== "false" && rawStartTime != null && rawStartTime !== "" && rawStartTime !== 0)) && (endTime > startTime);

        if (!!window.InstaPlayer) {
            window.InstaPlayer = null
        }

        const streamInfo = getAlldetails?.data?.stream_info || {};
        const isSubscribed = getAlldetails?.data?.is_subscribed;
        const isStreamLimitExceed = streamInfo?.is_stream_limit_exceed ?? getAlldetails?.data?.is_stream_limit_exceed ?? false;
        const seekbarThumbnailUrl = streamInfo?.seekbar_thumbnail_url || getAlldetails?.data?.seekbar_thumbnail_url || "";
        const isLoggedIn = !!localStorage.getItem("session_id");
        const contentType = getContentType(playbackURL);

        adConfig.length = 0;
        if (card && card.access_control) {
            // Pre-roll
            const preRollUrl = card.access_control.pre_role_settings?.ads_url;
            if (preRollUrl) {
                adConfig.push({
                    adurl: preRollUrl,
                    schedule: "preroll"
                });
            }

            // Mid-roll
            const midRollSettings = card.access_control.mid_role_settings;
            if (midRollSettings && midRollSettings.midroll_position) {
                const midRollPositions = midRollSettings.midroll_position;
                if (Array.isArray(midRollPositions) && midRollPositions.length > 0) {
                    midRollPositions.forEach(position => {
                        const midRollUrl = midRollSettings.ads_url;
                        if (midRollUrl) {
                            adConfig.push({
                                adurl: midRollUrl,
                                schedule: parseInt(position)
                            });
                        }
                    });
                }
            }

            // Post-roll
            const postRollUrl = card.access_control.post_role_settings?.ads_url;
            if (postRollUrl) {
                adConfig.push({
                    adurl: postRollUrl,
                    schedule: "postroll"
                });
            }
        }
        console.log("content", contentType)
        if (isLoggedIn && card?.access_control?.is_free == true && isSubscribed == false) {
            if (!!playbackURL && !!adConfig) {
                let playerConfig = window.SaranyuInstaPlayer(contentType, '.instaPlayer', {
                    'file': [{
                        'content_url': playbackURL,
                        'content_security': content_security,
                        'encryption': contentType == "dash" ? true : false,
                        'drm': {
                            'widevine': {
                                'LA_URL': "",
                            }
                        },
                        'label': '',
                        'mediaid': '1A2B3C4D',
                        'videotitle': card?.title,
                        'secondarytitle': card?.item_captions ? card?.item_captions : "",
                        'poster': '',
                        'duration': card?.duration_string,
                        'seekonload': Number(!!totalSeconds ? totalSeconds : "0"),
                        'thumbnails': seekbarThumbnailUrl,
                    }],
                    'contentGrading': {
                        'genres': (!!card?.display_ott_guidelines) ? (card?.display_ott_guidelines) : "",
                        'cbfc_rating': (!!card?.cbfc_rating) ? (card?.cbfc_rating) : (""),
                    },

                    'advertisement': {
                        'cue': false,
                        'adsets': adConfig
                    },
                    'playerType': "vod",
                    'thumbnailSeekbarUrl': thumbnailSeekbar,
                    'is_secured': is_Secured,
                    'live': false,
                    'videotitle': card?.title,
                    'secondarytitle': card?.item_captions ? card?.item_captions : "",
                    'autoplay': true,
                    'skipIntro': {
                        "skip_intro_status": isSkipIntro,
                        'start_time': startTime,
                        'end_time': endTime,
                    },
                    'upNext': {
                        upnextStatus: (!!upNext?.content_id) ? (true) : (false),
                        'upnextData': upNext
                    },
                    'mute': muteStatus,
                    "nextEpisodeStatus": nextEpisodeStatus,
                    'hideControlsWhenInactive': true,
                    'hideControlsTimeout': 3000,
                    'qualityswitch': { 'label': 'auto', 'metric': 'resolution' },

                    'features': featureConfig,
                    'endpoint': `${endpoint}`,
                    'theme': card?.theme,
                    'card': card,
                    'access_token': "",
                    'heartBeat': {
                        'catalogID': (card?.catalog_id) ? (card?.catalog_id) : (""),
                        'contentID': (card?.content_id) ? (card?.content_id) : (""),
                        'region': localStorage.getItem("region"),
                        'authKey': getAuthToken(),
                        'beatInterval': parseInt(localStorage.getItem("watchhistory_interval_sec")) ? (parseInt(localStorage.getItem("watchhistory_interval_sec"))) : (30),
                        'url': `${!!localStorage.getItem("watchhistory_api") ? (localStorage.getItem("watchhistory_api")) : (endpoint)}/users/${localStorage.getItem("session_id")}/playlists/watchhistory/`
                    },
                    'registerCallBacks': window.registerCallBacks,

                });

                setPlayerConfig(playerConfig);
            }
        }
        else if (!isLoggedIn && card?.access_control?.is_free == true) {

            if (!!playbackURL && !!adConfig) {
                let playerConfig = window.SaranyuInstaPlayer(contentType, '.instaPlayer', {
                    'file': [{
                        'content_url': playbackURL,
                        'content_security': content_security,
                        'encryption': content_type == "dash" ? true : false,
                        'drm': {
                            'widevine': {
                                'LA_URL': "",
                            }
                        },
                        'label': '',
                        'mediaid': '1A2B3C4D',
                        'videotitle': card?.title,
                        'secondarytitle': card?.item_captions ? card?.item_captions : "",
                        'poster': '',
                        'duration': card?.duration_string,
                        'seekonload': Number(!!totalSeconds ? totalSeconds : "0"),
                        'thumbnails': seekbarThumbnailUrl,
                    }],
                    'contentGrading': {
                        'genres': (!!card?.display_ott_guidelines) ? (card?.display_ott_guidelines) : "",
                        'cbfc_rating': (!!card?.cbfc_rating) ? (card?.cbfc_rating) : (""),
                    },
                    'playerType': "vod",
                    'thumbnailSeekbarUrl': thumbnailSeekbar,
                    'live': false,
                    'is_secured': is_Secured,
                    'videotitle': card?.title,
                    'secondarytitle': card?.item_captions ? card?.item_captions : "",
                    'autoplay': true,
                    'skipIntro': {
                        "skip_intro_status": isSkipIntro,
                        'start_time': startTime,
                        'end_time': endTime,
                    },
                    'upNext': {
                        upnextStatus: (!!upNext?.content_id) ? (true) : (false),
                        'upnextData': upNext
                    },
                    'mute': muteStatus,

                    "nextEpisodeStatus": nextEpisodeStatus,
                    'hideControlsWhenInactive': true,
                    'hideControlsTimeout': 3000,
                    'qualityswitch': { 'label': 'auto', 'metric': 'resolution' },
                    'advertisement': {
                        'cue': false,
                        'adsets': adConfig
                    },
                    'features': featureConfig,
                    'endpoint': `${endpoint}`,
                    'theme': card?.theme,
                    'card': card,
                    'access_token': "",
                    'registerCallBacks': window.registerCallBacks,

                });

                setPlayerConfig(playerConfig);
            }
        }
        else if (card?.access_control?.is_free == false) {
            if (isLoggedIn && isSubscribed == true && isStreamLimitExceed == false) {
                if (!!playbackURL && !!adConfig) {
                    let playerConfig = window.SaranyuInstaPlayer(contentType, '.instaPlayer', {
                        'file': [{
                            'content_url': playbackURL,
                            'content_security': content_security,
                            'encryption': contentType == "dash" ? true : false,
                            'drm': {
                                'widevine': {
                                    'LA_URL': "",
                                }
                            },
                            'label': '',
                            'mediaid': '1A2B3C4D',
                            'videotitle': card?.title,
                            'secondarytitle': card?.item_captions ? card?.item_captions : "",
                            'poster': '',
                            'duration': card?.duration_string,
                            'seekonload': Number(!!totalSeconds ? totalSeconds : "0"),
                            'thumbnails': seekbarThumbnailUrl,
                        }],
                        'contentGrading': {
                            'genres': (!!card?.display_ott_guidelines) ? (card?.display_ott_guidelines) : "",
                            'cbfc_rating': (!!card?.cbfc_rating) ? (card?.cbfc_rating) : (""),
                        },
                        'thumbnailSeekbarUrl': thumbnailSeekbar,
                        'playerType': "vod",
                        // 'advertisement': {
                        //     'cue': false,
                        //     'adsets': adConfig
                        // },
                        'live': false,
                        'videotitle': card?.title,
                        'secondarytitle': card?.item_captions ? card?.item_captions : "",
                        'autoplay': true,
                        'is_secured': is_Secured,
                        'skipIntro': {
                            "skip_intro_status": isSkipIntro,
                            'start_time': startTime,
                            'end_time': endTime,
                        },
                        'upNext': {
                            upnextStatus: (!!upNext?.content_id) ? (true) : (false),
                            'upnextData': upNext
                        },
                        'mute': muteStatus,
                        'thumbnailSeekbarUrl': thumbnailSeekbar,

                        "nextEpisodeStatus": nextEpisodeStatus,
                        'hideControlsWhenInactive': true,
                        'hideControlsTimeout': 3000,
                        'qualityswitch': { 'label': 'auto', 'metric': 'resolution' },

                        'features': featureConfig,
                        'endpoint': `${endpoint}`,
                        'theme': card?.theme,
                        'card': card,
                        'access_token': "",
                        'heartBeat': {
                            'catalogID': (card?.catalog_id) ? (card?.catalog_id) : (""),
                            'contentID': (card?.content_id) ? (card?.content_id) : (""),
                            'region': localStorage.getItem("region"),
                            'authKey': getAuthToken(),
                            'beatInterval': parseInt(localStorage.getItem("watchhistory_interval_sec")) ? (parseInt(localStorage.getItem("watchhistory_interval_sec"))) : (30),
                            'url': `${!!localStorage.getItem("watchhistory_api") ? (localStorage.getItem("watchhistory_api")) : (endpoint)}/users/${localStorage.getItem("session_id")}/playlists/watchhistory/`
                        },
                        'registerCallBacks': window.registerCallBacks,

                    });

                    setPlayerConfig(playerConfig);
                }
            }
        }
        else if (isLoggedIn && card?.access_control?.is_free == true && isSubscribed == true) {
            if (!!playbackURL && adConfig) {
                let playerConfig = window.SaranyuInstaPlayer(contentType, '.instaPlayer', {

                    'file': [{
                        'content_url': playbackURL,
                        'content_security': content_security,
                        'encryption': contentType == "dash" ? true : false,
                        'drm': {
                            'widevine': {
                                'LA_URL': "",
                            }
                        },
                        'label': '',
                        'mediaid': '1A2B3C4D',
                        'videotitle': card?.title,
                        'secondarytitle': card?.item_captions ? card?.item_captions : "",
                        'poster': '',
                        'duration': card?.duration_string,
                        'seekonload': Number(!!totalSeconds ? totalSeconds : "0"),
                        'thumbnails': seekbarThumbnailUrl,
                    }],
                    'contentGrading': {
                        'genres': (!!card?.display_ott_guidelines) ? (card?.display_ott_guidelines) : "",
                        'cbfc_rating': (!!card?.cbfc_rating) ? (card?.cbfc_rating) : (""),
                    },
                    'thumbnailSeekbarUrl': thumbnailSeekbar,
                    'playerType': "vod",
                    'live': false,
                    'videotitle': card?.title,
                    'secondarytitle': card?.item_captions ? card?.item_captions : "",
                    'autoplay': true,
                    'skipIntro': {
                        "skip_intro_status": isSkipIntro,
                        'start_time': startTime,
                        'end_time': endTime,
                    },
                    'upNext': {
                        upnextStatus: (!!upNext?.content_id) ? (true) : (false),
                        'upnextData': upNext
                    },
                    'mute': muteStatus,
                    "nextEpisodeStatus": nextEpisodeStatus,
                    'hideControlsWhenInactive': true,
                    'hideControlsTimeout': 3000,
                    'is_secured': is_Secured,
                    'qualityswitch': { 'label': 'auto', 'metric': 'resolution' },
                    // 'advertisement': {
                    //     'cue': false,
                    //     'adsets': adConfig
                    // },
                    'features': featureConfig,
                    'endpoint': `${endpoint}`,
                    'theme': card?.theme,
                    'card': card,
                    'access_token': "",
                    'heartBeat': {
                        'catalogID': (card?.catalog_id) ? (card?.catalog_id) : (""),
                        'contentID': (card?.content_id) ? (card?.content_id) : (""),
                        'region': localStorage.getItem("region"),
                        'authKey': getAuthToken(),
                        'beatInterval': parseInt(localStorage.getItem("watchhistory_interval_sec")) ? (parseInt(localStorage.getItem("watchhistory_interval_sec"))) : (30),
                        'url': `${!!localStorage.getItem("watchhistory_api") ? (localStorage.getItem("watchhistory_api")) : (endpoint)}/users/${localStorage.getItem("session_id")}/playlists/watchhistory/`
                    },
                    'registerCallBacks': window.registerCallBacks,
                });

                setPlayerConfig(playerConfig);
            }
        }
    }, [getAllDetailsData, playbackURL, getAlldetails, card, ytResolved, youtubeVideoId])

    const onclikedStatus = useSelector((state) => state?.common?.clicked)
    const onSubmit = (confirm) => {
        dispatch(onClicked(""))

        if (confirm === "Go Back") {

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

    const streamInfo = getAlldetails?.data?.stream_info || {};
    // YouTube items skip get_all_details, so fall back to the stored subscription flag
    const isSubscribed = youtubeVideoId
        ? (streamInfo?.is_subscribed ?? getAlldetails?.data?.is_subscribed ?? localStorage.getItem("is_subscribed") === "true")
        : (streamInfo?.is_subscribed ?? getAlldetails?.data?.is_subscribed ?? false);
    const isStreamLimitExceed = streamInfo?.is_stream_limit_exceed ?? getAlldetails?.data?.is_stream_limit_exceed ?? false;
    const isLoggedIn = !!localStorage.getItem("session_id");

    return (

        <>

            {
                card?.access_control?.login_required == true && !isLoggedIn ?
                    <Popup
                        alert="Alert"
                        alertType="Login Alert"
                        heading="Action Required!"
                        Description="Login is mandatory for this action"
                        from={"login"}
                        onSubmit={onSubmit}
                    /> :
                    card?.access_control?.is_free == false && !isLoggedIn ?
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

                            youtubeVideoId ?
                                <YoutubePlayer
                                    videoId={youtubeVideoId}
                                    title={youtubeItem?.display_title || youtubeItem?.title || card?.title || allDetailsItem?.title}
                                    onEnded={() => window.history.back()}
                                    onExit={() => navigate(-1)}
                                /> :
                                <InstaPlayer config={playerConfig} player={player} />
            }

        </>
    )
}

export default Player;