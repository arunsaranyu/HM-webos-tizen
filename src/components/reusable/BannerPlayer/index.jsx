import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import "./index.scss";

const BannerPlayer = ({
    videoUrl,
    posterUrl,
    onTimeUpdate,
    onEnded,
    layout,
    muted = true
}) => {
    const videoRef = useRef(null);
    const [hasEnded, setHasEnded] = useState(false);

    const onTimeUpdateRef = useRef(onTimeUpdate);
    const onEndedRef = useRef(onEnded);

    useEffect(() => {
        onTimeUpdateRef.current = onTimeUpdate;
    }, [onTimeUpdate]);

    useEffect(() => {
        onEndedRef.current = onEnded;
    }, [onEnded]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.poster = posterUrl || '';
        }
    }, [posterUrl]);

    useEffect(() => {
        const video = videoRef.current;

        if (!video || !videoUrl) {
            console.warn('Video element or video URL is missing');
            return;
        }

        let hls = null;
        let nativeLoadedHandler;
        let playTimer = null;
        let isReadyToPlay = false;
        let timerFinished = false;

        setHasEnded(false);

        video.poster = posterUrl || '';
        video.muted = muted;
        video.autoplay = false;
        video.playsInline = true;

        const tryPlay = () => {
            if (isReadyToPlay && timerFinished) {
                setHasEnded(false);
                video.play().catch((error) => {
                    console.warn('Autoplay failed:', error.message);
                });
            }
        };

        // Wait 5 seconds before starting playback
        playTimer = setTimeout(() => {
            timerFinished = true;
            tryPlay();
        }, 5000);

        if (Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true
            });

            hls.loadSource(videoUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                console.log('HLS attached to video element');
            });

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log('HLS manifest parsed successfully');
                isReadyToPlay = true;
                tryPlay();
            });

            hls.on(Hls.Events.ERROR, (_, data) => {
                console.error('HLS error:', data.type, data.details);

                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.error('Fatal network error');
                            hls.startLoad();
                            break;

                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.error('Fatal media error');
                            hls.recoverMediaError();
                            break;

                        default:
                            hls.destroy();
                            break;
                    }
                }
            });
        } else if (
            video.canPlayType('application/vnd.apple.mpegurl')
        ) {
            // Native HLS support, e.g. Safari and compatible TV browsers
            video.src = videoUrl;

            nativeLoadedHandler = () => {
                isReadyToPlay = true;
                tryPlay();
            };

            video.addEventListener(
                'loadedmetadata',
                nativeLoadedHandler
            );
        } else {
            console.error('HLS is not supported in this browser');
        }

        const handleTimeUpdate = () => {
            onTimeUpdateRef.current?.(video.currentTime);
        };

        const handleEnded = () => {
            setHasEnded(true);
            try {
                video.pause();
                video.currentTime = 0;
            } catch (e) { }
            onEndedRef.current?.();
        };

        const handlePlay = () => {
            setHasEnded(false);
        };

        video.addEventListener('play', handlePlay);
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('ended', handleEnded);

        return () => {
            if (playTimer) {
                clearTimeout(playTimer);
            }

            video.removeEventListener('play', handlePlay);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('ended', handleEnded);

            if (nativeLoadedHandler) {
                video.removeEventListener(
                    'loadedmetadata',
                    nativeLoadedHandler
                );
            }

            if (hls) {
                hls.destroy();
            }

            video.pause();
            video.removeAttribute('src');
            video.load();
        };
    }, [videoUrl, muted]);

    return (
        <div className={layout === "banner" || !layout ? "banner-player-fullscreen" : "banner-player"} style={{ position: 'relative' }}>
            <video
                ref={videoRef}
                controls={false}
                preload="auto"
                muted={muted}
                playsInline
                poster={posterUrl || ''}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: hasEnded ? 'none' : 'block'
                }}
            />
            {hasEnded && posterUrl ? (
                <img
                    src={posterUrl}
                    alt="poster"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 0
                    }}
                />
            ) : null}
            <div className="banner-overlay" />
        </div>
    );
};

export default React.memo(BannerPlayer);
