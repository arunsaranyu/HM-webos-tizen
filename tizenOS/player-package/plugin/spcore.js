/**
 * Saranyu Insta Player
 * Player Version: 4.0.1
 * Base Version: 4.0.1
 */

var isFirstTime = true,
	userAgent = window.navigator.userAgent.toLowerCase(),
	isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
	keySystem,
	certificate,
	multiaudioKey,
	subtitleKey,
	networkTimer,
	SaranyuInstaPlayer = window.SaranyuInstaPlayer || {};
SaranyuInstaPlayer.PLUGIN_NAME = "Saranyu Insta Player",
	SaranyuInstaPlayer.BUILD_VERSION = "4.0.1",
	SaranyuInstaPlayer.inActivityTimeout = 3000,
	SaranyuInstaPlayer.bigPlayClickCounter = 0,
	SaranyuInstaPlayer.bigPlayClickDELAY = 350,
	SaranyuInstaPlayer.bigPlayClickCounterTimer,
	SaranyuInstaPlayer.IMASDK = "//imasdk.googleapis.com/js/sdkloader/ima3.js",
	window.IMASDKLoaded = false;
SaranyuInstaPlayer.defaultPoster = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiBmaWxsPSIjRTVFNUU1Ii8+CjxyZWN0IHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiIGZpbGw9ImJsYWNrIi8+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMCkiPgo8cGF0aCBkPSJNODEyLjkxNCAyOTUuMjg5Qzc2Ni43NTQgMjY4LjgxMSA3MjkuMzMxIDI5MC41MDIgNzI5LjMzMSAzNDMuNjk5VjczNi4yNjRDNzI5LjMzMSA3ODkuNTEzIDc2Ni43NTQgODExLjE3NiA4MTIuOTE0IDc4NC43MjNMMTE1Ni4wNCA1ODcuOTQ1QzEyMDIuMjEgNTYxLjQ1OCAxMjAyLjIxIDUxOC41NDUgMTE1Ni4wNCA0OTIuMDY0TDgxMi45MTQgMjk1LjI4OVoiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMTIiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMCI+CjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiBmaWxsPSJ3aGl0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzA0IDI4NCkiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K"
function getSkip(endtime) {
	if (!isFinite(endtime)) {

		return;  // Exit the function if the value is not a finite number
	}
	// console.log(Me.currentTime)
	ME.currentTime = endtime;  // Set the current time if valid
	window.playbackTime = isFinite(endtime) ? endtime : localStorage.getItem('endTime');
	$(".skipButton").hide();
	$('#skip_button').remove();
	window.skipIntroVisible = false;
	ME.play()  // Set focus to the play/pause icon
}

SaranyuInstaPlayer.defaultFeatures = { features: ['playpause', 'backwardSeek', 'volume', 'videotitle', 'secondarytitle', 'time', 'progressbar', 'qualityswitch', "subtitles", 'fullscreen', 'bigicons', 'hotkeys', 'backarrow', 'eventcallbacks'] },
	SaranyuInstaPlayer.defaultOptions = {
		debug: false,
		type: "video",
		autoplay: true,
		videotitle: "Saranyu Insta Player",
		secondarytitle: "Insta Player",
		content: "VOD",
		theme: "light",
		titleStrings: {
			multiaudio: "Default",
			subtitles: "OFF"
		},
		errorStrings: {
			generic: {
				text: "Something went wrong!",
				subtext: "There was an error processing your request. Please close the Player and try again."
			},
			issue: {
				text: "The movie stream is not compatible with this browser.",
				subtext: ""
			}
		}
	},
	SaranyuInstaPlayer.playerConfig = {
		hls: {
			debug: false,
			autoStartLoad: true,
			enableWebVTT: true
		}
	}
SaranyuInstaPlayer.Utils = {
	DLOG: {
		ERR: function (t) {
			true == SaranyuInstaPlayer.defaultOptions.debug && (Logger.useDefaults(), Logger.setLevel(Logger.WARN), Logger.error(t))
		},
		WARN: function (t) {
			true == SaranyuInstaPlayer.defaultOptions.debug && (Logger.useDefaults(), Logger.setLevel(Logger.WARN), Logger.warn(t))
		},
		INFO: function (t) {
			true == SaranyuInstaPlayer.defaultOptions.debug && (Logger.useDefaults(), Logger.info(t))
		}
	},
	timeCodeToSeconds: function (t, e, o, l) {
		if (void 0 === o ? o = !1 : void 0 === l && (l = 25), t)
			if (t) {
				var a = t.split(":"),
					n = 0;
				if (3 == a.length) n = 60 * Number(a[0]) * 60 + 60 * Number(a[1]) + Number(a[2]);
				else if (2 == a.length) {
					n = 60 * Number(a[0]) + Number(a[1])
				}
			} else n = 0;
		return n
	},
	convertSecondsTimecode: function (t) {
		if (t > 0) {
			t = Math.max(0, Math.round(t * 1));
			var s = t % 60;
			var m = Math.floor(t / 60) % 60;
			var h = Math.floor(t / (60 * 60));
			if (s < 10) s = '0' + s;
			if (m < 10) m = '0' + m;
			if (h < 10) h = '0' + h;
			var f = '';
			f = f + h + ':';
			f = f + m + ':' + s;
			return f;
		}
	},
	convertAdsSecondsTimecode: function (t) {
		if (t > 0) {
			t = Math.max(0, Math.round(t)); // No need to multiply by 1
			var s = t % 60;
			var m = Math.floor(t / 60) % 60;
			if (s < 10) s = '0' + s;
			if (m < 10) m = + m;
			return ` (${m} : ${s})`; // Fixed template string syntax
		}
		return " (00 : 00)"; // Return default value for non-positive input
	},

	getWidthInPercentage: function (t) {
		var e = t.parent();
		return (t.width() / e.width() * 100).toFixed(0) + "%";
	},
	getHeightInPercentage: function (t) {
		var e = t.parent();
		return (t.height() / e.height() * 100).toFixed(0) + "%"
	},
	getPercentageForGivenDuration: function (t, e) {
		return t / e * 100
	},
	preventSelectionOfTextInMouseMove: function (t) {
		return t.stopPropagation && t.stopPropagation(),
			t.preventDefault && t.preventDefault(),
			t.cancelBubble = !0, t.returnValue = !1, t
	},
	checkDVR: function (u) {
		if ((u.indexOf('?dvr') != -1) || (u.indexOf('?DVR') != -1)) {
			return true;
		} else {
			return false;
		}
	}
},
	SaranyuInstaPlayer.MediaPlayer = function (t, e, o) {
		var l = this;
		l.masterElementid = t;
		l.options = e;
		l.playerType = o;
		l.$masterContainer = $(t);
		l.init();
	},
	SaranyuInstaPlayer.MediaPlayer.prototype = {
		init: function () {
			var t = this;
			var a = t.options.file[0];
			t.$masterContainer.empty();
			window.ME ? window.ME = null : '';
			t.container = $('<div id="playerContainer" class="sp-main-container"><div class="sp-player-inner">' + '<div class="sp-media-element"></div><div class="sp-player-layers"></div><div class="sp-full-controls"></div></div></div>').appendTo(t.$masterContainer),
				t.mainContainerWrapper = t.container.find(".sp-main-container-wrapper"),
				t.mainContainer = t.container.find(".sp-main-container"),
				t.playerInner = t.container.find(".sp-player-inner"),
				t.mediaElement = t.container.find(".sp-media-element"),
				t.playerLayers = t.container.find(".sp-player-layers"),
				t.fullControls = t.container.find(".sp-full-controls");
			t._createMediaElement();
			t._createFullControls();
			t._createIndividualControls();
			t._createAndAppendMedia(a);
			t._loadcallbacks();
			t._focusNavigation();
			t.bufferCheckInterval = null
			t.options.hasOwnProperty("contentGrading") && t._contentGrading()
			//  t._contentGradisking();
			t._createSkipIntro()
			// t._createNextEpisode();
			t._buildadvertisement.prerollPlayed = false;
			t._buildadvertisement.postrollPlayed = false;
			t.options.hasOwnProperty("heartBeat") && t._heartbeatMonitor();

		},
		_createMediaElement: function () {
			var t = this.mediaElement;
			t.append(`<video  id="video-master" tabindex="-1" preload="metadata" webkit-playsinline playsinline></video>`);
			ME = this.mediaElement.videoElement = t.find("video")[0];
		},

		_createFullControls: function () {
			var o = this;
			var theme = SaranyuInstaPlayer.defaultOptions.theme == "dark" ? 'theme-dark' : 'theme-light';
			o.fullControls.append('<div class="sp-controls-top"><div class="sp-controls-top-player-controls"></div></div>'),
				o.fullControls.topControlBar = o.fullControls.find(".sp-controls-top-player-controls"),
				o.fullControls.append('<div class="sp-controls-bottom"></div>'),
				o.fullControls.append('<div class="sp-skip-intro-control"></div>'),
				o.fullControls.append('<div class="sp-upnext-control"></div>')
			o.fullControls.bottomControlBar = o.fullControls.find(".sp-controls-bottom"),
				o.fullControls.skipIntroControlBar = o.fullControls.find(".sp-skip-intro-control"),
				o.fullControls.upNextControlBar = o.fullControls.find(".sp-upnext-control"),
				o.fullControls.bottomControlBar.append('<div class="sp-controls-bottom-player-controls ' + theme + '"></div>'),
				o.fullControls.bottomControlBar.bottomPlayerControls = o.fullControls.find(".sp-controls-bottom-player-controls")
		},
		_createIndividualControls: function () {
			var t = this;
			var p = t.playerType;
			var e = t.options.hasOwnProperty('features') ? t.options.features : SaranyuInstaPlayer.defaultFeatures.features;
			for (featureIndex in e) {
				feature = e[featureIndex];
				try {
					if (p == "mp4") {
						if ((feature != "qualityswitch") && (feature != "multiaudio") && (feature != "subtitles")) {
							t["_build" + feature] && t["_build" + feature]();
						}
					} else {
						t["_build" + feature] && t["_build" + feature]();
					}
				}
				catch (t) {

				}
			}
		},
		_createAndAppendMedia: function (t) {
			var o = this,
				l = o.mediaElement.videoElement,
				e = t.content_url,
				hdnts = t.content_security,
				a = o.options;

			t.seekonload ? (t.seekonload == SaranyuInstaPlayer.Utils.timeCodeToSeconds(t.duration) ? a.seekonload = 0 : a.seekonload = t.seekonload) : a.seekonload = 0;
			t.encryption ? a.encryption = t.encryption : a.encryption = false;

			t.drm && t.drm.hasOwnProperty('fairplay') ? a.fairplay = true : a.fairplay = false;
			t.drm && t.drm.hasOwnProperty('widevine') ? a.widevine = true : a.widevine = false;

			hlsConfig = {
				debug: false,
				autoStartLoad: true,
				enableWebVTT: true,
				backBufferLength: 0,
				maxBufferLength: 10,
				enableLowInitialPlaylist: true,
				abrEwmaDefaultEstimate: 500000,
				maxBufferSize: 10 * 1000 * 1000,
				maxMaxBufferLength: 300,
				nudgeMaxRetry: 10,
				nudgeOffset: 2,
				startLevel: 0,
				appendErrorMaxRetry: 10,

			};

			if (a.playerType === 'live') {
				hlsConfig = {
					debug: false,
					autoStartLoad: true,
					enableWebVTT: true,
					backBufferLength: 0,
					maxBufferLength: 10,
					enableLowInitialPlaylist: true,
					abrEwmaDefaultEstimate: 500000,
					maxBufferSize: 10 * 1000 * 1000,
					maxMaxBufferLength: 300,
					nudgeMaxRetry: 10,
					nudgeOffset: 2,
					startLevel: 0,
					appendErrorMaxRetry: 10,
					xhrSetup: function (xhr, a) {
						xhr.open('GET', a + "?" + hdnts);
					}
				};
			} else {
				hlsConfig = {
					debug: false,
					autoStartLoad: true,
					enableWebVTT: true,
					backBufferLength: 0,
					maxBufferLength: 10,
					enableLowInitialPlaylist: true,
					abrEwmaDefaultEstimate: 500000,
					maxBufferSize: 10 * 1000 * 1000,
					maxMaxBufferLength: 300,
					nudgeMaxRetry: 10,
					nudgeOffset: 2,
					startLevel: 0,
					appendErrorMaxRetry: 10,
					xhrSetup: function (xhr, a) {
						xhr.open('GET', a);
						if (o.options && o.options.is_secured === "true" || o.options && o.options.is_secured === "true") {
							xhr.setRequestHeader('user_id', localStorage.getItem("session_id"));
							xhr.setRequestHeader("subscriber_id", !!localStorage.getItem("user_id") ? localStorage.getItem("user_id") : "")
						}
					}
				};

			}

			/* MSE - HLS */
			o._createAndAppendMedia._attachHLStoVideo = function () {
				if (Hls.isSupported()) {
					o.mediaElement.videoElement.hlsObj = new Hls(hlsConfig);
					o.mediaElement.videoElement.hlsObj.loadSource(e);
					o.mediaElement.videoElement.hlsObj.attachMedia(l);
					o.mediaElement.videoElement.mediaId = t.mediaid;
					o.mediaElement.videoElement.hlsObj.on(Hls.Events.ERROR, function (event, data) {
						if (data.fatal) {
							console.log("data-fatal", data.fatal)
							switch (data.type) {
								case Hls.ErrorTypes.NETWORK_ERROR:
									SaranyuInstaPlayer.Utils.DLOG.ERR("Fatal Network Error, Retrying..."),
										o._attachErrorview(SaranyuInstaPlayer.defaultOptions.errorStrings.generic.text, SaranyuInstaPlayer.defaultOptions.errorStrings.generic.subtext);
									o.mediaElement.videoElement.hlsObj.startLoad();
									break;
								case Hls.ErrorTypes.MEDIA_ERROR:
									SaranyuInstaPlayer.Utils.DLOG.ERR("Media Error, Retrying..."),
										o._attachErrorview(SaranyuInstaPlayer.defaultOptions.errorStrings.generic.text, SaranyuInstaPlayer.defaultOptions.errorStrings.generic.subtext);
									o.mediaElement.videoElement.hlsObj.recoverMediaError();

									// n.resetHlsBuffer(o.mediaElement.videoElement.hlsObj, o.mediaElement.videoElement);

									break;
								default:
									o.mediaElement.videoElement.hlsObj.destroy();
									break;
							}
						}
					});

					o.mediaElement.videoElement.hlsObj.on(Hls.Events.MANIFEST_PARSED, function () {

						if (a.autoplay && a.seekonload >= 0) {





							let allowedResolutions;

							// Determine allowed resolutions based on 4K support
							if (localStorage.getItem("is_4k_supported") === "true") {
								allowedResolutions = [240, 360, 480, 720, 1080, 2160];
							} else {
								allowedResolutions = [240, 360, 480, 720, 1080];
							}




							// const filteredLevels = o.mediaElement.videoElement.hlsObj.levels.filter(level =>
							// 	allowedResolutions.includes(level.height == 2160)
							// );

							const filteredLevels = o.mediaElement.videoElement.hlsObj.levels.filter(level =>
								level.height === 2160
							);


							if (filteredLevels.length == 1) {
								if (localStorage.getItem("is_4k_supported") === "false") {
									o.mediaElement.videoElement.hlsObj.levels.pop()
								}
							} else {
								console.warn("No valid resolutions available after filtering.");
							}
							o.mediaElement.videoElement.hlsObj.startLoad(a.seekonload);

							l.play().then(() => {
								SaranyuInstaPlayer.Utils.DLOG.INFO("Autoplay Success With Volume!!!");
							}).catch(() => {
								SaranyuInstaPlayer.Utils.DLOG.ERR("Autoplay Prevented With Volume!!!");
								l.muted = true;
								l.play().then(() => {
									SaranyuInstaPlayer.Utils.DLOG.INFO("Autoplay Success With Mute!!!");
								});
							});
						}
						else if (!a.autoplay && a.seekonload >= 0) {
							o.mediaElement.videoElement.hlsObj.startLoad(a.seekonload);
						}

						//  console.log("o.mediaElement.videoElement.hlsObj.levels",o.mediaElement.videoElement.hlsObj.levels.pop())
						o.options.features.includes("qualityswitch") && o._buildqualityswitch._buildQualityPopup(o.mediaElement.videoElement.hlsObj.levels)
						o.options.features.includes("subtitles") && o._buildsubtitles._buildSubtitlesPopup(o.mediaElement.videoElement.hlsObj.subtitleTracks)
						o.options.features.includes("multiaudio") && o._buildmultiaudio._buildMultiaudioPopup(o.mediaElement.videoElement.hlsObj.audioTracks)
						o.mediaElement.videoElement.hlsObj.subtitleDisplay = false;
						o.mediaElement.videoElement.hlsObj.subtitleTrack = -1;
						// if(o.mediaElement.videoElement.hlsObj.subtitleTracks.length>0){
						// 	$(".sp-quality-switch-btn").attr("data-sn-right", ".sp-subtitles-switch-btn");
						// }else if (o.mediaElement.videoElement.hlsObj.subtitleTracks.length==0 && o.mediaElement.videoElement.hlsObj.audioTracks.length>0 ){
						// 	$(".sp-quality-switch-btn").attr("data-sn-right", ".sp-multiaudio-switch-btn");
						// }
					});

					o.mediaElement.videoElement.hlsObj.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, function (t, e) {
						// console.log(Hls.Events.SUBTITLE_TRACKS_UPDATED, o.mediaElement.videoElement.hlsObj.subtitleTracks, "hiiii")
						// const isActive = localStorage.getItem("isPlayedfirstSubtitles") == "true";
						// if (isActive == "true" || isActive == true)
						// 	o.mediaElement.videoElement.hlsObj.subtitleDisplay = true,
						// 		o.mediaElement.videoElement.hlsObj.subtitleTrack = parseInt(localStorage.getItem("currentSubtitles"))
						// else {
						// 	o.mediaElement.videoElement.hlsObj.subtitleDisplay = false
						// }
						window.subtitleTracks = o.mediaElement.videoElement.hlsObj.subtitleTracks
						// o.options.features.includes("subtitles") && o._buildsubtitles._buildSubtitlesPopup(o.mediaElement.videoElement.hlsObj.subtitleTracks)
						if (o.mediaElement.videoElement.hlsObj.subtitleTracks.length > 0) {
							$(".sp-subtitles-switch-btn").attr("data-sn-left", ".sp-quality-switch-btn");
							$(".sp-quality-switch-btn").attr("data-sn-right", ".sp-subtitles-switch-btn");
						}

						if (window.InstaPlayer.mediaElement.videoElement.hlsObj.subtitleTracks.length == 0 && window.InstaPlayer.mediaElement.videoElement.hlsObj.audioTracks.length > 0) {

							$(".sp-quality-switch-btn").attr("data-sn-right", ".sp-multiaudio-switch-btn");
							$(".sp-multiaudio-switch-btn").attr("data-sn-left", ".sp-quality-switch-btn");
						}
						if (window.InstaPlayer.mediaElement.videoElement.hlsObj.subtitleTracks.length > 0 && window.InstaPlayer.mediaElement.videoElement.hlsObj.audioTracks.length > 0) {

							$(".sp-subtitles-switch-btn").attr("data-sn-right", ".sp-multiaudio-switch-btn");
							$(".sp-multiaudio-switch-btn").attr("data-sn-left", ".sp-subtitles-switch-btn");
						}
					});
					o.mediaElement.videoElement.hlsObj.on(Hls.Events.AUDIO_TRACKS_UPDATED, function (t, e) {

						// const filteredLevels = o.mediaElement.videoElement.hlsObj.levels.filter(level =>
						// 	level.height === 2160
						// );
						// console.log("o.mediaElement.videoElement.hlsObj.audioTracks", o.mediaElement.videoElement.hlsObj.audioTracks)




					});



					o.mediaElement.videoElement.hlsObj.on(Hls.Events.LEVEL_LOADED, function (t, e) {
					});
					o.mediaElement.videoElement.hlsObj.on(Hls.Events.BUFFER_APPENDED, function () {
						console.log("BUFFER_APPENDED")
						// o.clearBuffer(o.mediaElement.videoElement.hlsObj, o.mediaElement.videoElement)
					})

					o.mediaElement.videoElement.hlsObj.on(Hls.Events.MEDIA_ATTACHED, function () {
						console.log("HLS is attached to video", o.mediaElement.videoElement.hlsObj.audioTracks, o.mediaElement.videoElement.hlsObj.subtitleTracks);




						console.log("bufferCheckInterval",)
						// Clear any existing interval before starting a new one
						if (o.bufferCheckInterval) {
							console.log("Clearing previous buffer check interval...");
							clearInterval(o.bufferCheckInterval);
							o.bufferCheckInterval = null
						}

						// Start buffer checking
						// o.bufferCheckInterval = setInterval(() => o.checkBufferAndClear(o.mediaElement.videoElement.hlsObj, o.mediaElement.videoElement), 2000);
					});

					function setupHlsEventListeners(hlsObj) {
						hlsObj.on(Hls.Events.MEDIA_ATTACHING, function (event, data) {
							console.log("MEDIA_ATTACHING", data);
						});

						hlsObj.on(Hls.Events.MEDIA_ATTACHED, function (event, data) {
							console.log("MEDIA_ATTACHED", data);
						});

						hlsObj.on(Hls.Events.MEDIA_DETACHING, function (event, data) {
							console.log("MEDIA_DETACHING", data);
						});

						hlsObj.on(Hls.Events.MEDIA_DETACHED, function (event, data) {
							console.log("MEDIA_DETACHED", data);
						});

						hlsObj.on(Hls.Events.BUFFER_RESET, function (event, data) {
							console.log("BUFFER_RESET", data);
						});

						hlsObj.on(Hls.Events.BUFFER_CODECS, function (event, data) {
							console.log("BUFFER_CODECS", data);
						});

						hlsObj.on(Hls.Events.BUFFER_CREATED, function (event, data) {
							console.log("BUFFER_CREATED", data);
						});

						hlsObj.on(Hls.Events.BUFFER_APPENDING, function (event, data) {
							console.log("BUFFER_APPENDING", data);
						});

						hlsObj.on(Hls.Events.BUFFER_APPENDED, function (event, data) {
							console.log("BUFFER_APPENDED", data);
						});

						hlsObj.on(Hls.Events.BUFFER_EOS, function (event, data) {
							console.log("BUFFER_EOS", data);
						});

						hlsObj.on(Hls.Events.BUFFER_FLUSHING, function (event, data) {
							console.log("BUFFER_FLUSHING", data);
						});

						hlsObj.on(Hls.Events.BUFFER_FLUSHED, function (event, data) {
							console.log("BUFFER_FLUSHED", data);
						});

						hlsObj.on(Hls.Events.BACK_BUFFER_REACHED, function (event, data) {
							console.log("BACK_BUFFER_REACHED", data);
						});
					}

					// Example usage (assuming you have your HLS object in 'hlsObj'):
					// setupHlsEventListeners(o.mediaElement.videoElement.hlsObj);



				} else {
					SaranyuInstaPlayer.Utils.DLOG.ERR("MSE (Media Source Extension) Not Supported On Your Browser");
				}
			};


			o.checkBufferAndClear = function (hls, video) {
				if (!hls || !video || !hls.media) return;

				var buffer = hls.media.buffered;
				if (!buffer || buffer.length === 0) {
					console.warn('No buffer available.');
					return;
				}

				var currentBuffer = buffer.end(buffer.length - 1) - video.currentTime;
				console.log('Current Buffer: ' + currentBuffer.toFixed(2) + 's');

				if (currentBuffer < 1) {
					console.warn('Low buffer detected, pausing and restarting playback...');
					video.pause();
					setTimeout(function () {
						hls.startLoad();
						video.play().catch(function (error) {
							console.error('Error resuming playback:', error);
						});
					}, 3000);
				}

				if (currentBuffer === 0) {
					console.warn('Buffer is empty, clearing and restarting playback...');
					o.clearBuffer(hls, video);
					hls.startLoad();
				}
			};

			// Function to clear buffer when needed
			o.clearBuffer = function (hls, video) {
				console.log("clearBuffer", hls, video)
				if (!hls || !video) return;


				var mediaSource = hls.mediaSource;
				if (mediaSource && mediaSource.readyState === 'open') {
					var sourceBuffer = hls.bufferController && hls.bufferController.sourceBuffer
						? hls.bufferController.sourceBuffer.video
						: null;

					if (sourceBuffer) {
						console.warn('Clearing buffer up to 10s before current time...');
						try {
							// var clearStart = Math.max(0, video.currentTime - 10);
							// var clearEnd = mediaSource.duration;
							// sourceBuffer.remove(clearStart, clearEnd);
							sourceBuffer.remove(0, mediaSource.duration);
						} catch (error) {
							console.error('Error while clearing buffer:', error);
						}
					}
				}
			};
			// o.clearHlsBuffer = function (hls, video) {
			// 	if (hls && hls.media) {
			// 		console.log("clear_Buffer")
			// 		const buffered = hls.media.buffered;
			// 		for (let i = 0; i < buffered.length; i++) {
			// 			let start = buffered.start(i);
			// 			let end = buffered.end(i);
			// 			if (video.currentTime < start || video.currentTime > end) {
			// 				console.log(`Clearing buffer from ${start} to ${end}`);
			// 				hls.removeLevel(0, start, end);
			// 			}
			// 		}
			// 	}
			// }
			// o.resetHlsBuffer = function (hls, video) {
			// 	if (!hls || !hls.media) return;

			// 	const buffer = hls.media.buffered;
			// 	let currentBuffer = 0;

			// 	if (buffer.length) {
			// 		currentBuffer = buffer.end(buffer.length - 1) - video.currentTime;
			// 	}

			// 	console.log(`Current Buffer: ${currentBuffer.toFixed(2)}s`);

			// 	if (currentBuffer < 1) { // If buffer is too low
			// 		console.warn("Low buffer detected, skipping forward...");
			// 		video.currentTime += 2; // Nudge forward
			// 		hls.startLoad(); // Restart buffering
			// 	}

			// 	if (currentBuffer === 0) { // If buffer is empty, clear it and recover
			// 		console.warn("Buffer is empty, clearing...");
			// 		o.clearHlsBuffer(hls);
			// 	}
			// }

			/* MSE - DASH */
			o._createAndAppendMedia._attachDashtoVideo = function () {
				// alert("DASH");
				o.mediaElement.videoElement.dashObj ? o.mediaElement.videoElement.dashObj.attachSource(t.content_url) : (o.mediaElement.videoElement.dashObj = dashjs.MediaPlayer().create()),
					"true" != t.encryption && 1 != t.encryption || (document.documentMode || /Edge/.test(navigator.userAgent) ? a["com.microsoft.playready"] = { serverURL: t.drm.playready.LA_URL } : a["com.widevine.alpha"] = { serverURL: t.drm.widevine.LA_URL },
						o.mediaElement.videoElement.dashObj.setProtectionData(a)),
					o.mediaElement.videoElement.dashObj.getProtectionController().setRobustnessLevel('SW_SECURE_CRYPTO')

				if (localStorage.getItem("is_4k_supported") === "false") {

					o.mediaElement.videoElement.dashObj.updateSettings({
						streaming: {

							buffer: {

								flushBufferAtTrackSwitch: true,

								resetSourceBuffersForTrackSwitch: true

								// Force both codecs to initialize
							},


							abr: {
								autoSwitchBitrate: {
									video: true,
									audio: false,
								},
								initialBitrate: {
									video: 3000,

								},
								maxBitrate: {
									video: 25000,

								},
								minBitrate: {
									video: 1500,

								},
								bandwidthSafetyFactor: 0.9,
								useDefaultABRRules: true,
								limitBitrateByPortal: true
							},

						}

					});
				} else {
					o.mediaElement.videoElement.dashObj.updateSettings({
						streaming: {
							buffer: {

								flushBufferAtTrackSwitch: true,

								resetSourceBuffersForTrackSwitch: true

								// Force both codecs to initialize
							},
							text: {
								defaultEnabled: true
							},
							// Force both codecs to initialize

							abr: {
								video: true,
							}
						}
					})
				}
				o.mediaElement.videoElement.dashObj.initialize(o.mediaElement.videoElement, e, o.options.autoplay);

				// 	streaming: {
				// 		abr: {
				// 			// ABR (Adaptive Bitrate) settings
				// 			autoSwitchBitrate: {
				// 				video: true, // Enable automatic quality switching
				// 				audio: true
				// 			},
				// 			initialBitrate: {
				// 				video: 3000, // Start with ~3Mbps (good for 1080p)
				// 				audio: 128
				// 			},
				// 			maxBitrate: {
				// 				video: 25000, // Max 25Mbps for 4K
				// 				audio: 192
				// 			},
				// 			minBitrate: {
				// 				video: 1500, // Min 1.5Mbps for fallback
				// 				audio: 64
				// 			},
				// 			bandwidthSafetyFactor: 0.9, // 10% safety margin
				// 			useDefaultABRRules: false, // Custom rules (ensure they handle track switches)
				// 			limitBitrateByPortal: true, // Consider device capabilities
				// 		},
				// 		scheduling: {
				// 			bufferToKeep: 10, // Seconds of buffer to maintain
				// 			bufferPruningInterval: 5, // Check buffer every 10s
				// 			stallThreshold: 4.0 // Relaxed to 2s to avoid stalls during track switches
				// 		}
				// 	}
				// });
				// }
				// o.mediaElement.videoElement.dashObj.updateSettings({ 'debug': { 'logLevel': dashjs.Debug.LOG_LEVEL_NONE } }),
				// o.mediaElement.videoElement.dashObj.setSynchronizeVideoWithAudio(true)

				o.mediaElement.videoElement.dashObj.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, function () {
					o.mediaElement.videoElement.dashObj.dashBitrate = o.mediaElement.videoElement.dashObj.getBitrateInfoListFor("video");
					o.mediaElement.videoElement.dashObj.dashMultiaudio = o.mediaElement.videoElement.dashObj.getTracksFor("audio");
					o.mediaElement.videoElement.dashObj.textTracks = o.mediaElement.videoElement.dashObj.getTracksFor("text")
					o.mediaElement.videoElement.dashObj.enableText(false)

					console.log("mpd11111", o.mediaElement.videoElement.dashObj.textTracks, o.mediaElement.videoElement.dashObj.dashMultiaudio)


					if (localStorage.getItem("is_4k_supported") === "false") {


						const original = o.mediaElement.videoElement.dashObj.dashBitrate;


						o.mediaElement.videoElement.dashObj.dashBitrate = original.filter((level, index) => {
							// console.log(`Checking #${index}: ${level.height}p`);
							return level.height !== 2160;
						});

					} else {
						console.log("4K is supported - no filtering needed");
					}




					if (o.mediaElement && o.mediaElement.videoElement && o.mediaElement.videoElement.dashObj) {
						o.mediaElement.videoElement.dashObj.enableText(false);
						o.mediaElement.videoElement.dashObj.setTextTrack(-1);
					}
					window.subtitleTracks = o.mediaElement.videoElement.dashObj.textTracks

					if (o.mediaElement.videoElement.dashObj.textTracks.length > 0) {
						$(".sp-subtitles-switch-btn").attr("data-sn-left", ".sp-quality-switch-btn");
						$(".sp-quality-switch-btn").attr("data-sn-right", ".sp-subtitles-switch-btn");
					}

					if (o.mediaElement.videoElement.dashObj.textTracks.length == 0 && o.mediaElement.videoElement.dashObj.dashMultiaudio.length > 0) {

						$(".sp-quality-switch-btn").attr("data-sn-right", ".sp-multiaudio-switch-btn");
						$(".sp-multiaudio-switch-btn").attr("data-sn-left", ".sp-quality-switch-btn");
					}
					if (o.mediaElement.videoElement.dashObj.textTracks.length > 0 && o.mediaElement.videoElement.dashObj.dashMultiaudio.length > 0) {

						$(".sp-subtitles-switch-btn").attr("data-sn-right", ".sp-multiaudio-switch-btn");
						$(".sp-multiaudio-switch-btn").attr("data-sn-left", ".sp-subtitles-switch-btn");
					}


					console.log("Subtitle Tracks", o.mediaElement.videoElement.dashObj.textTracks)
					try {

						o._buildsubtitles._buildSubtitlesPopup(o.mediaElement.videoElement.dashObj.textTracks);
						o._buildqualityswitch._buildQualityPopup(o.mediaElement.videoElement.dashObj.dashBitrate);
						o._buildmultiaudio._buildMultiaudioPopup(o.mediaElement.videoElement.dashObj.dashMultiaudio);

					}
					catch (e) {
						console.error("Error in building subtitles, quality, multiaudio popups", e);
					}

					if ((a.autoplay && a.seekonload >= 0) || window.trackChanged == true || localStorage.getItem("trackChanged") == "true") {

						console.log("seekonload2", a.seekonload, localStorage.getItem("currentTimeMpd"))
						if (window.trackChanged == true || localStorage.getItem("trackChanged") == "true") {
							const newAudioTracks = o.mediaElement.videoElement.dashObj.getTracksFor("audio");
							if (newAudioTracks) {
								ME.currentTime = parseInt(localStorage.getItem("currentTimeMpd"));
								const currentaudioTrack = newAudioTracks[localStorage.getItem("selectedMultiaudioMpd")]
								// console.log("tracks_chan", currentaudioTrack.role[0], currentaudioTrack.audioChannelConfiguration[0], audioChannelConfig, newAudioTracks[localStorage.getItem("selectedMultiaudioMpd")])
								// o.mediaElement.videoElement.dashObj.setInitialMediaSettingsFor("audio", {
								// 	lang: currentaudioTrack.lang, role: currentaudioTrack.role[0], audioChannelConfig: currentaudioTrack.audioChannelConfiguration[0]
								// })

								o.mediaElement.videoElement.dashObj.setCurrentTrack(newAudioTracks[localStorage.getItem("selectedMultiaudioMpd")]);
							}


							setTimeout(() => {
								o.mediaElement.videoElement.currentTime = parseInt(localStorage.getItem("currentTimeMpd"));
							}, 400);
							window.trackChanged = false;
							localStorage.removeItem("trackChanged");
						} else {
							o.mediaElement.videoElement.dashObj.setInitialMediaSettingsFor("audio", { role: "main" }),
								setTimeout(() => {
									o._videoPlayerControls("seek", a.seekonload);
								}, 250);
							l.play().then(() => {
								SaranyuInstaPlayer.Utils.DLOG.INFO("Autoplay Success With Volume!!!");
							}).catch(() => {
								SaranyuInstaPlayer.Utils.DLOG.ERR("Autoplay Prevented With Volume!!!");
								l.muted = true;
								l.play().then(() => {
									SaranyuInstaPlayer.Utils.DLOG.INFO("Autoplay Success With Mute!!!");
								});
							});
						}
					}
					else if (!a.autoplay && a.seekonload >= 0) {
						console.log("seekonload1", a.seekonload)


						setTimeout(() => {
							o._videoPlayerControls("seek", a.seekonload);
						}, 250);
					}
				});
				o.mediaElement.videoElement.dashObj.on(dashjs.MediaPlayer.events.ERROR, function (event) {
					o._attachErrorview(SaranyuInstaPlayer.defaultOptions.errorStrings.generic.text, SaranyuInstaPlayer.defaultOptions.errorStrings.generic.subtext);
				});
				o.mediaElement.videoElement.dashObj.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_REQUESTED, function (event) {
					SaranyuInstaPlayer.Utils.DLOG.INFO("Quality Change Requested");
				});
				o.mediaElement.videoElement.dashObj.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_RENDERED, function (event) {
					SaranyuInstaPlayer.Utils.DLOG.INFO("Quality Change Fullfilled");
				});
			};

			if ("hls" == o.playerType && o._isSupportedMSE()) {
				o._createAndAppendMedia._attachHLStoVideo();
			}
			else if ("mpd" == o.playerType && o._isSupportedMSE()) {
				o._createAndAppendMedia._attachDashtoVideo();
			}
			else if ("mp4" == o.playerType) {
				SaranyuInstaPlayer.Utils.DLOG.INFO("MP4 On Browser");
				o.mediaElement.videoElement.src = e;
				o.mediaElement.videoElement.mediaId = t.mediaid;
				if (a.autoplay && a.seekonload >= 0) {
					l.play().then(() => {
						SaranyuInstaPlayer.Utils.DLOG.INFO("Autoplay Success With Volume!!!");
					}).catch(() => {
						SaranyuInstaPlayer.Utils.DLOG.ERR("Autoplay Prevented With Volume!!!");
						l.muted = true;
						l.play().then(() => {
							SaranyuInstaPlayer.Utils.DLOG.INFO("Autoplay Success With Mute!!!");
						});
					});
					setTimeout(function () {
						SaranyuInstaPlayer.Utils.DLOG.INFO("Resume from: " + a.seekonload);
						o.mediaElement.videoElement.currentTime = a.seekonload;
					}, 3000);
				}
			}

			try {
				o.fullControls.bottomControlBar.videoTitle.changeTitle(t.videotitle);
				o.fullControls.bottomControlBar.videoSecondaryTitle.changeSecondaryTitle(t.secondarytitle);

				if (!a.autoplay) {
					if (null == t.poster) {
						o.playerLayers.poster.changePoster(SaranyuInstaPlayer.defaultPoster);
					}
					else {
						o.playerLayers.poster.changePoster(t.poster);
					}
				}
			}
			catch (e) { }
		},
		// _createNextEpisode: function () {
		// 	var t = this;
		// 	var m = t.mediaElement.videoElement;
		// 	var videoDuration = m.duration; // Duration of the video in seconds
		// 	var displayTime = videoDuration - 30;
		// 	var callback = false;
		// 	var cardtheme = t.options.theme
		// 	var endpoint = t.options.endpoint
		// 	var catalog_id = t.options.heartBeat.catalogID
		// 	var content_id = t.options.heartBeat.contentID
		// 	var auth_token = t.options.heartBeat.authKey
		// 	var access_token = t.options.access_token
		// 	var nextcard
		// 	if (cardtheme == 'show' || cardtheme == 'show_episode' || cardtheme == 'episode') {
		// 		fetch(`${endpoint}/catalogs/${catalog_id}/items/${content_id}/next_item?auth_token=${auth_token}&region=${localStorage.getItem("region")}&access_token=${access_token}`)
		// 			.then((res) => {
		// 				if (res.ok == true) {
		// 					return res.json()
		// 				}
		// 			})
		// 			.then((d) => {
		// 				nextcard = d.data
		// 				m.addEventListener('timeupdate', function () {
		// 					var currentTime = m.currentTime;
		// 					console.log("gggggggggggggggggg", currentTime, ME.duration)
		// 					if (Math.floor(ME.currentTime) >= Math.floor(ME.duration - 30)) {
		// 						if (!!nextcard && nextcard != null && nextcard != undefined && callback == false) {
		// 							var epidoseImage = nextcard?.thumbnails?.medium_16_9?.url
		// 							t.fullControls.bottomControlBar.append('<button class="next-episode episodelink focusable" id="next_episodefocus" data-sn-up="#playPauseCenterIcon"><div class=""><div class="next-episode-img"><div class="next-episode-img-overlay"></div><img src="' + epidoseImage + '"><div class="circluar_progress_wrap"><div id="prog" class="chart" data-percent="100" ><img src="../ui/assets/play1.svg" class="play_ico"></div></div></div><div class="next-episode-txt"><p id="fir">UP NEXT</p><p id="sec">' + nextcard?.title + '</br></p></div></div></button>');
		// 							$("#forward_btn, #backward_btn, #playPauseCenterIcon").attr("data-sn-down", "#next_episodefocus");
		// 							$("#next_episodefocus").focus();
		// 							callback = true
		// 						}
		// 						if (m.currentTime >= m.duration - 1) {
		// 							//   ME.pause();
		// 							console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
		// 							t.eventcallbacks.createNext(nextcard)
		// 						}
		// 						$(".episodelink").click(function () {
		// 							console.log("am here episodelink", nextcard)
		// 							t.eventcallbacks.createNext(nextcard)
		// 						});
		// 						$('#prog').easyPieChart({
		// 							size: 36,
		// 							barColor: "#ffffff",
		// 							scaleLength: 0,
		// 							lineWidth: 5,
		// 							trackColor: "#44474D",
		// 							lineCap: "circle",
		// 							animate: 10000,
		// 						});
		// 					}
		// 				});
		// 			}).catch((error) => {

		// 			})
		// 	}
		// },

		// _buildupNext: function () {
		// 	var t = this;
		// 	var m = t.mediaElement.videoElement;
		// 	var videoDuration = m.duration; // Duration of the video in seconds
		// 	var displayTime = videoDuration - 30;
		// 	var callback = false;
		// 	var nextcard = t.options?.upNext?.upnextData
		// 	if (t.options?.upNext?.upnextStatus == true) {
		// 		m.addEventListener('timeupdate', function () {
		// 			var currentTime = m.currentTime;
		// 			// console.log("gggggggggggggggggg", currentTime, ME.duration)
		// 			if (Math.floor(ME.currentTime) >= Math.floor(ME.duration - 30)) {
		// 				if (!!nextcard && nextcard != null && nextcard != undefined && callback == false) {
		// 					var epidoseImage = nextcard?.thumbnails?.medium_16_9?.url
		// 					t.fullControls.bottomControlBar.append('<button class="next-episode  episodelink focusable" id="next_episodefocus" data-sn-up="#playPauseCenterIcon"><div class=""><div class="next-episode-img"><div class="next-episode-img-overlay"></div><img src="' + epidoseImage + '"><div class="circluar_progress_wrap"><div id="prog" class="chart" data-percent="100" ><img src="./ui/assets/play1.svg" class="play_ico"></div></div></div><div class="next-episode-txt"><p id="fir">UP NEXT</p><p id="sec">' + nextcard?.title + '</br></p></div></div></button>');
		// 					$("#forward_btn, #backward_btn, #playPauseCenterIcon").attr("data-sn-down", "#next_episodefocus");
		// 					$("#next_episodefocus").focus();
		// 					callback = true
		// 				}
		// 				if (m.currentTime >= m.duration - 1) {
		// 					//   ME.pause();
		// 					t.eventcallbacks.createNext(nextcard)
		// 				}
		// 				$(document).ready(function () {
		// 					// Click event listener
		// 					$(document).on("click", "#next_episodefocus", function () {

		// 						t.eventcallbacks.createNext(nextcard);
		// 					});

		// 					// 'sn:enter-down' event listener
		// 					$(document).on("sn:enter-down", "#next_episodefocus", function () {

		// 						t.eventcallbacks.createNext(nextcard);
		// 						// Add your code logic here for 'sn:enter-down' event
		// 					});
		// 				});
		// 				$('#prog').easyPieChart({
		// 					size: 36,
		// 					barColor: "#ffffff",
		// 					scaleLength: 0,
		// 					lineWidth: 5,
		// 					trackColor: "#44474D",
		// 					lineCap: "circle",
		// 					animate: 10000,
		// 				});
		// 			}
		// 		});
		// 	}
		// },
		_buildnextepisode: function () {
			var t = this;
			var m = t.mediaElement.videoElement;
			var card = t.options.card || {};
			var cardtheme = t.options.theme || card.theme;

			if (cardtheme !== 'show' && cardtheme !== 'show_episode' && cardtheme !== 'episode') {
				return;
			}

			var endpoint = t.options.endpoint || "";
			var authKey = (t.options.heartBeat && t.options.heartBeat.authKey) ? t.options.heartBeat.authKey : "";
			var region = (t.options.heartBeat && t.options.heartBeat.region) ? t.options.heartBeat.region : (localStorage.getItem("region") || "IN");
			var catalogId = (t.options.heartBeat && t.options.heartBeat.catalogID) ? t.options.heartBeat.catalogID : (card.catalog_id || "");
			var contentId = (t.options.heartBeat && t.options.heartBeat.contentID) ? t.options.heartBeat.contentID : (card.content_id || "");
			var showFriendlyId = (card.show_object && card.show_object.friendly_id) ? card.show_object.friendly_id : (card.friendly_id || "");
			var catalogFriendlyId = (card.catalog_object && card.catalog_object.friendly_id) ? card.catalog_object.friendly_id : catalogId;

			var nextEpisodeData = null;
			var upNextVisible = false;
			var upNextTriggered = false;

			function removeUpNext() {
				if (upNextVisible) {
					$('#upnext_button').off('keydown.upnext');
					$('#sp-progress-bar-handle').off('keydown.upnext');
					$('#sp-progress-bar-handle').off('sn:up.upnext');
					$('#upnext_button').remove();
					upNextVisible = false;
					$('#sp-progress-bar-handle').attr("data-sn-up", "#playPauseCenterIcon");
				}
			}

			function triggerNext() {
				if (upNextTriggered) return;
				upNextTriggered = true;
				removeUpNext();
				if (nextEpisodeData && t.eventcallbacks && typeof t.eventcallbacks.createNext === 'function') {
					t.eventcallbacks.createNext(nextEpisodeData);
				}
			}

			function showUpNext() {
				if (upNextVisible || $('#upnext_button').length > 0 || !nextEpisodeData) return;
				var container = (t.fullControls && t.fullControls.upNextControlBar && t.fullControls.upNextControlBar.length > 0)
					? t.fullControls.upNextControlBar
					: $('.sp-upnext-control');

				if (container && container.length > 0) {
					container.empty();
					container.append(
						'<button id="upnext_button" class="sp-upnext-btn focusable" data-sn-left="#sp-progress-bar-handle" data-sn-down="#sp-progress-bar-handle" data-sn-up="#playPauseCenterIcon"><div class="sp-upnext-img focusable"></div>Next Episode</button>'
					);
					upNextVisible = true;
					var btn = $('#upnext_button');
					btn.focus();

					// Connect progress bar handle to Up Next button so pressing UP from progressbar focuses Up Next
					$('#sp-progress-bar-handle').attr("data-sn-up", "#upnext_button");
					$('#sp-progress-bar-handle').attr("data-sn-right", "#upnext_button");
					$(".sp-quality-switch-btn").attr("data-sn-up", "#sp-progress-bar-handle");

					// Down or Left arrow from Up Next button moves focus to progressbar
					btn.off("keydown.upnext").on("keydown.upnext", function (e) {
						var code = e.keyCode || e.which;
						if (code === 40 || code === 37) {
							e.preventDefault();
							e.stopPropagation();
							$('#sp-progress-bar-handle').focus();
						}
					});

					// Up arrow from progressbar moves focus to Up Next button
					$('#sp-progress-bar-handle').off("keydown.upnext").on("keydown.upnext", function (e) {
						var code = e.keyCode || e.which;
						if (code === 38) {
							if (upNextVisible && $('#upnext_button').length > 0) {
								e.preventDefault();
								e.stopPropagation();
								$('#upnext_button').focus();
							}
						}
					});

					// Spatial navigation up from progress bar moves focus to Up Next button
					$('#sp-progress-bar-handle').off("sn:up.upnext").on("sn:up.upnext", function () {
						if (upNextVisible && $('#upnext_button').length > 0) {
							$('#upnext_button').focus();
						}
					});

					btn.off("click").on("click", function () {
						triggerNext();
					});
					btn.off("sn:enter-down").on("sn:enter-down", function () {
						triggerNext();
					});
				}
			}

			function findNextEpisode(episodesList) {
				if (!episodesList || episodesList.length === 0) return null;
				var currentSeq = parseInt(card.sequence_no || card.sequence || card.episode_number || 0, 10);
				var next = null;

				if (currentSeq > 0) {
					next = episodesList.find(function (ep) {
						var s = parseInt(ep.sequence_no || ep.sequence || ep.episode_number || 0, 10);
						return s === (currentSeq + 1);
					});
				}

				if (!next) {
					var idx = episodesList.findIndex(function (ep) {
						return (ep.content_id && ep.content_id == contentId) || (ep.friendly_id && ep.friendly_id == card.friendly_id);
					});
					if (idx !== -1 && (idx + 1) < episodesList.length) {
						next = episodesList[idx + 1];
					}
				}
				return next;
			}

			function fallbackNextItem() {
				if (!catalogId || !contentId) return;
				var nextItemUrl = endpoint + "/catalogs/" + catalogId + "/items/" + contentId + "/next_item?auth_token=" + authKey + "&region=" + region;
				fetch(nextItemUrl)
					.then(function (res) {
						if (res && res.ok) return res.json();
					})
					.then(function (nData) {
						if (nData && nData.data && nData.data.content_id) {
							nextEpisodeData = nData.data;
							nextEpisodeData.catalog_id = nextEpisodeData.catalog_id || catalogId || card.catalog_id;
						}
					})
					.catch(function () { });
			}

			var episodesUrl = endpoint + "/catalogs/" + catalogFriendlyId + "/items/" + showFriendlyId + "/episodes.gzip?region=" + region + "&auth_token=" + authKey + "&page=0&page_size=100&status=published&order_by=asc";
			fetch(episodesUrl)
				.then(function (res) {
					if (res && res.ok) return res.json();
					throw new Error("Failed to fetch episodes list");
				})
				.then(function (resData) {
					var list = (resData && resData.data && resData.data.items) ? resData.data.items : (Array.isArray(resData.data) ? resData.data : []);
					nextEpisodeData = findNextEpisode(list);
					if (nextEpisodeData) {
						nextEpisodeData.catalog_id = nextEpisodeData.catalog_id || catalogId || card.catalog_id;
					} else {
						fallbackNextItem();
					}
				})
				.catch(function () {
					fallbackNextItem();
				});

			m.addEventListener('timeupdate', function () {
				if (!nextEpisodeData || upNextTriggered) return;
				var duration = m.duration;
				var currentTime = m.currentTime;

				if (duration > 0 && Math.floor(currentTime) >= Math.floor(duration - 30)) {
					if (!upNextVisible) {
						showUpNext();
					}
				} else {
					if (upNextVisible && duration > 0 && Math.floor(currentTime) < Math.floor(duration - 30)) {
						removeUpNext();
					}
				}

				if (duration > 0 && currentTime >= (duration - 1)) {
					triggerNext();
				}
			});
		},
		_buildbigicons: function () {
			var e = this, o = e.mediaElement.videoElement;
			var u = '<div class="sp-player-bigplay"><div class="backward"><span id="backwardTime">10</span></div><div id="playPauseCenterIcon" class="playPause play focusable" data-sn-up=""></div><div class="forward"><span id="forwardTime">10</span></div></div>';
			e.playerLayers.append('<div class="sp-player-poster"></div>');
			e.playerLayers.append(u);

			e.playerLayers.append('<div class="sp-player-loading"><div class="sp-loader"><div class="sp-spinner"><div class="sp-spinner-container"><div class="sp-spinner-rotator"><div class="sp-spinner-left"><div class="sp-spinner-circle"></div></div><div class="sp-spinner-right"><div class="sp-spinner-circle"></div></div></div></div></div></div>');
			e.playerLayers.append('<div class="sp-player-replay"><div class="replay focusable" data-sn-left="" data-sn-up="" data-sn-right="" ></div></div>');
			e.playerLayers.poster = e.playerLayers.find(".sp-player-poster");
			e.playerLayers.poster.changePoster = function (t) { e.playerLayers.poster.css("background-image", 'url("' + t + '")') };
			e.playerLayers.bigplay = e.playerLayers.find(".sp-player-bigplay");
			e.playerLayers.loading = e.playerLayers.find(".sp-player-loading");
			e.playerLayers.bigreplay = e.playerLayers.find(".sp-player-replay");
			e.playerLayers.bigplay.playPause = e.playerLayers.bigplay.find(".playPause");
			e.playerLayers.bigplay.backward = e.playerLayers.bigplay.find(".backward");
			e.playerLayers.bigplay.forward = e.playerLayers.bigplay.find(".forward");
			e.playerLayers.bigplay.backward.hide();
			e.playerLayers.bigplay.forward.hide();
			if (e.options.autoplay == true) {
				e.playerLayers.bigreplay.hide();
				e.playerLayers.bigplay.hide();
			}
			else {
				e.playerLayers.bigreplay.hide();
				// e.playerLayers.bigplay.show();
				e.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlaypause.addClass("sp-pause");
				e.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlaypause.removeClass("sp-play");
				e.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlaypause.removeClass("sp-replay");
				e.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlaypause.tooltip.html(SaranyuInstaPlayer.defaultOptions.tooltipText.play);
			}

			e.playerLayers.on("dblclick", function (t) {
				toggleFullscreen();
			});
			o.addEventListener("play", function () {
				e.playerLayers.poster.hide();
				e.playerLayers.loading.hide();
				//e.playerLayers.bigreplay.hide();
				// e.playerLayers.bigplay.show();

			});
			o.addEventListener("playing", function () {
				console.log("playing1")
				// window.InstaPlayer && window.InstaPlayer.container.adContainer && window.InstaPlayer.container.adContainer.loadingContainer && window.InstaPlayer.container.adContainer.loadingContainer.hide()
				localStorage.setItem("preroll_status_ads_callback", "true")
				e.playerLayers.poster.hide();
				//e.playerLayers.bigplay.hide();
				e.playerLayers.loading.hide();
				e.playerLayers.bigreplay.hide();
				e.playerLayers.bigplay.playPause.removeClass("pause").addClass("play");
			});
			o.addEventListener("pause", function () {
				// e.playerLayers.bigplay.show();
				e.playerLayers.loading.hide();
				e.playerLayers.bigreplay.hide();
				e.playerLayers.bigplay.playPause.removeClass("play").addClass("pause");
			});
			o.addEventListener("waiting", function () {
				o.paused || e.playerLayers.loading.show();
			});
			o.addEventListener("ended", function () {
				e.playerLayers.bigreplay.show();
				e.playerLayers.bigplay.playPause.hide();
				e.playerLayers.bigplay.forward.hide();
				e.playerLayers.bigplay.backward.hide();
				e.playerLayers.loading.hide();
			});

			// magic remote backward
			e.playerLayers.bigplay.backward.click(function () {
				if ((o.currentTime - 10) >= 0) {
					o.currentTime -= 10
					SaranyuInstaPlayer.Utils.DLOG.INFO("10s Backward Seek");
				} else {
					o.currentTime = 0;
				}
			});
			// magic remote play / pause
			e.playerLayers.bigplay.playPause.click(function () {
				if (o.paused) {
					e._videoPlayerControls("play");
					e.playerLayers.bigplay.playPause.removeClass("play").addClass("pause");
				} else {
					e._videoPlayerControls("pause");
					e.playerLayers.bigplay.playPause.removeClass("pause").addClass("play");
				}
			});
			// magic remote forward
			e.playerLayers.bigplay.forward.click(function () {
				if (o.currentTime != o.duration && (o.currentTime + 10) < o.duration) {
					o.currentTime += 10;
					SaranyuInstaPlayer.Utils.DLOG.INFO("10s Forward Seek");
				}
			});
			// remote backward
			e.playerLayers.bigplay.backward.on('sn:enter-down', function () {
				if ((o.currentTime - 10) >= 0) {
					o.currentTime -= 10
					SaranyuInstaPlayer.Utils.DLOG.INFO("10s Backward Seek");
				} else {
					o.currentTime = 0;
				}
			});
			// remote play / pause
			e.playerLayers.bigplay.playPause.on('sn:enter-down', function () {
				if (o.paused) {
					e._videoPlayerControls("play");
					e.playerLayers.bigplay.playPause.removeClass("play").addClass("pause");
				}
				else {
					e._videoPlayerControls("pause");
					e.playerLayers.bigplay.playPause.removeClass("pause").addClass("play");
				}
			});
			// remote forward
			e.playerLayers.bigplay.forward.on('sn:enter-down', function () {
				if (o.currentTime != o.duration && (o.currentTime + 10) < o.duration) {
					o.currentTime += 10;
					SaranyuInstaPlayer.Utils.DLOG.INFO("10s Forward Seek");
				}
			});
			//for replay button
			e.playerLayers.bigreplay.on('sn:enter-down', function () {
				e._videoPlayerControls("play");
			})
			// $(document).keydown(function (event) {
			// 	console.log(event,"event")
			// 	if (event.which == 37) { // Left arrow key
			// 		e.playerLayers.bigplay.backward.show();
			// 		if ((o.currentTime - 10) >= 0) {
			// 			o.currentTime -= 10
			// 			SaranyuInstaPlayer.Utils.DLOG.INFO("10s Backward Seek");
			// 		} else {
			// 			o.currentTime = 0;
			// 		} // Show the backward icon
			// 		setTimeout(function() {
			// 			e.playerLayers.bigplay.backward.hide(); // Hide the backward icon
			// 		}, 2000);
			// 	}
			// 	else if (event.which == 39) { // Left arrow key
			// 		e.playerLayers.bigplay.forward.show();
			// 		if (o.currentTime != o.duration && (o.currentTime + 10) < o.duration) {
			// 			o.currentTime += 10;
			// 			SaranyuInstaPlayer.Utils.DLOG.INFO("10s Forward Seek");
			// 		}
			// 		setTimeout(function() {
			// 			e.playerLayers.bigplay.forward.hide(); // Hide the backward icon
			// 		}, 2000);
			// 	}
			// });
			// var hideButtonsTimer;
			// var longPressTimer;
			// var longPressDelay = 800; // Adjust as needed
			// var hideButtonsDelay = 4000; // Adjust as needed
			// var seekInterval = 10; // Adjust as needed
			// if (e.options.playerType !== "live") {
			// 	$(document).on('keydown', function (event) {
			// 		var keyCode = event.key;
			// 		if (keyCode === 'ArrowLeft' || keyCode === 'ArrowRight') {
			// 			event.preventDefault(); // Prevent default browser behavior for arrow keys
			// 			// $('.sp-controls-bottom-progress-bar').hide()
			// 			// $('.sp-button.sp-quality-switch').hide()
			// 			// $('.sp-controls-top-video-title').hide()
			// 			// $('.sp-controls-top-video-secondarytitle').hide()
			// 			handleKeyDown(keyCode);
			// 		}
			// 	});

			// 	$(document).on('keyup', function (event) {
			// 		var keyCode = event.key;
			// 		if (keyCode === 'ArrowLeft' || keyCode === 'ArrowRight') {
			// 			event.preventDefault(); // Prevent default browser behavior for arrow keys
			// 			handleKeyUp(keyCode);
			// 		}
			// 	});

			// 	function handleKeyDown(keyCode) {
			// 		if (!longPressTimer) {
			// 			console.log(" forward")
			// 			showButton(keyCode);
			// 			longPressTimer = setTimeout(function () {
			// 				handleLongPress(keyCode);
			// 			}, longPressDelay);
			// 		}
			// 	}

			// 	function handleKeyUp(keyCode) {
			// 		if (longPressTimer) {
			// 			clearTimeout(longPressTimer);
			// 			longPressTimer = null;
			// 			stopSeeking(); // Stop seeking when long press is released
			// 			if (keyCode === 'ArrowLeft') {
			// 				e.playerLayers.bigplay.playPause.hide()
			// 				$('.sp-controls-bottom-progress-bar').hide()
			// 				$('.sp-button.sp-quality-switch').hide()
			// 				$('.sp-controls-top-video-title').show()
			// 				$('.sp-player-time-left').hide()
			// 				$('.sp-player-time-right').hide()
			// 				$('.slash').hide()
			// 				$('#backwardTime').hide();
			// 				$('.sp-controls-top-video-title').hide()
			// 				$('.sp-controls-top-video-secondarytitle').hide()
			// 				ME.play(); // Resume playing if releasing long press on the left arrow key
			// 			}
			// 			else if (keyCode === 'ArrowRight') {
			// 				e.playerLayers.bigplay.playPause.hide()
			// 				$('.sp-controls-bottom-progress-bar').hide()
			// 				$('.sp-button.sp-quality-switch').hide()
			// 				$('.sp-player-time-left').hide()
			// 				$('.sp-player-time-right').hide()
			// 				$('.slash').hide()
			// 				$('#backwardTime').hide();
			// 				$('.sp-controls-top-video-title').hide()
			// 				$('.sp-controls-top-video-secondarytitle').hide()
			// 				ME.play(); // Resume playing if releasing long press on the left arrow key
			// 			}
			// 			hideButtons();
			// 		} else {
			// 			hideButtons();
			// 			if (keyCode === 'ArrowLeft') {
			// 				// Handle short press for left arrow
			// 				$('.sp-controls-bottom-progress-bar').hide()
			// 				$('.sp-button.sp-quality-switch').hide()
			// 				$('.sp-player-time-left').hide()
			// 				$('.sp-player-time-right').hide()
			// 				$('.sp-controls-top-video-title-text').hide()
			// 				$('.sp-controls-top-video-secondary-text').hide()
			// 				$('.slash').hide()
			// 				seekBackward();
			// 			} else if (keyCode === 'ArrowRight') {
			// 				// Handle short press for right arrow
			// 				$('.sp-controls-bottom-progress-bar').hide()
			// 				$('.sp-button.sp-quality-switch').hide()
			// 				$('.sp-player-time-left').hide()
			// 				$('.sp-player-time-right').hide()
			// 				$('.sp-controls-top-video-title-text').hide()
			// 				$('.sp-controls-top-video-secondary-text').hide()
			// 				$('.slash').hide()
			// 				seekForward();
			// 			}
			// 		}
			// 	}

			// 	function handleLongPress(keyCode) {
			// 		console.log("forward 1x")
			// 		if (keyCode === 'ArrowLeft') {
			// 			e.playerLayers.bigplay.playPause.hide()
			// 			$('.sp-controls-bottom-player-controls').show()
			// 			$('.sp-controls-bottom-progress-bar').show()
			// 			$('.sp-button.sp-quality-switch').hide()
			// 			$('.sp-controls-top-video-title-text').show()
			// 			$('.sp-controls-top-video-secondary-text').show()
			// 			// Handle long press for left arrow
			// 			$('#backwardTime').hide();
			// 			$('.sp-player-time-left').show()
			// 			$('.sp-player-time-right').show()
			// 			$('.slash').show()
			// 			ME.pause(); // Pause the video
			// 			startSeekingBackward();
			// 		} else if (keyCode === 'ArrowRight') {
			// 			e.playerLayers.bigplay.playPause.hide()
			// 			$('.sp-controls-bottom-player-controls').show()
			// 			$('.sp-controls-bottom-progress-bar').show()
			// 			$('.sp-button.sp-quality-switch').hide()
			// 			$('.sp-controls-top-video-title-text').show()
			// 			$('.sp-controls-top-video-secondary-text').show()
			// 			$('.sp-player-time-left').show()
			// 			$('.sp-player-time-right').show()
			// 			$('.slash').show()
			// 			ME.pause();
			// 			// Handle long press for right arrow
			// 			$('#forwardTime').hide();
			// 			startSeekingForward();
			// 		}
			// 	}

			// 	function startSeekingBackward() {
			// 		seekBackward();
			// 		hideButtonsTimer = setInterval(seekBackward, longPressDelay);
			// 	}

			// 	function startSeekingForward() {
			// 		seekForward();
			// 		hideButtonsTimer = setInterval(seekForward, longPressDelay);
			// 	}

			// 	function stopSeeking() {
			// 		clearInterval(hideButtonsTimer);
			// 		ME.play()
			// 	}

			// 	function seekBackward() {
			// 		if (o && o.currentTime - seekInterval >= 0) {
			// 			o.currentTime -= seekInterval;
			// 			SaranyuInstaPlayer.Utils.DLOG.INFO(seekInterval + "s Backward Seek");
			// 		} else if (o) {
			// 			o.currentTime = 0;
			// 		}
			// 	}

			// 	function seekForward() {
			// 		if (o && o.duration && (o.currentTime + seekInterval) < o.duration) {
			// 			o.currentTime += seekInterval;
			// 			SaranyuInstaPlayer.Utils.DLOG.INFO(seekInterval + "s Forward Seek");
			// 		}
			// 	}

			// 	function showButton(keyCode) {
			// 		clearTimeout(hideButtonsTimer); // Clear hide buttons timer if a button is shown
			// 		if (keyCode === 'ArrowLeft') {
			// 			// Show backward button
			// 			if (e && e.playerLayers && e.playerLayers.bigplay && e.playerLayers.bigplay.backward && typeof e.playerLayers.bigplay.backward.show === 'function') {
			// 				e.playerLayers.bigplay.backward.show();
			// 				$('.sp-controls-top-video-title-text').hide()
			// 				$('.sp-controls-top-video-secondary-text').hide()
			// 				seekBackward()
			// 			}
			// 		} else if (keyCode === 'ArrowRight') {
			// 			// Show forward button
			// 			if (e && e.playerLayers && e.playerLayers.bigplay && e.playerLayers.bigplay.forward && typeof e.playerLayers.bigplay.forward.show === 'function') {
			// 				e.playerLayers.bigplay.forward.show();
			// 				$('.sp-controls-top-video-title-text').hide()
			// 				$('.sp-controls-top-video-secondary-text').hide()
			// 				seekForward()
			// 			}
			// 		}
			// 	}

			// 	function hideButtons() {
			// 		if (e && e.playerLayers && e.playerLayers.bigplay) {
			// 			if (e.playerLayers.bigplay.backward && typeof e.playerLayers.bigplay.backward.hide === 'function') {
			// 				e.playerLayers.bigplay.backward.hide();
			// 			}
			// 			if (e.playerLayers.bigplay.forward && typeof e.playerLayers.bigplay.forward.hide === 'function') {
			// 				e.playerLayers.bigplay.forward.hide();
			// 			}
			// 		}
			// 	}
			// }


		},

		_buildprogressbar: function () {
			SaranyuInstaPlayer.Utils.DLOG.INFO("Attaching Video Progress Slider");
			var y = this, c = y.mediaElement.videoElement;

			function loadVTT() {
				return $.ajax({
					url: y.options.file[0].thumbnails,
					dataType: 'text',
					beforeSend: function (xhr) {
						if (y.options && y.options.is_secured === "true" || y.options && y.options.is_secured === "true") {
							xhr.setRequestHeader('user_id', !!localStorage.getItem("session_id") ? localStorage.getItem("session_id") : "");
							xhr.setRequestHeader("subscriber_id", !!localStorage.getItem("user_id") ? localStorage.getItem("user_id") : "")
						}
					},
					success: function (vttText) {
						window.thumbnailCues = parseVTT(vttText);
					}
				});
			}

			// var intervalId = setInterval(function () {
			// 	if (window.thumbnailCues && window.thumbnailCues.length > 0) {
			// 		thumbnailsContainerDiv(window.thumbnailCues, 0);
			// 		$('.sp-background-gradient').hide();
			// 	}
			// 	// $('#thumbnail-container').hide();	
			// }, 2000);

			// // Clear the interval after 2 seconds (2,000 milliseconds)
			// setTimeout(function () {
			// 	clearInterval(intervalId);
			// 	$('.sp-background-gradient').hide();
			// }, 2000);
			function timeStrToSecondNum(time) {
				let secondTotal = 0;
				try {
					const h = Number(time.split(":")[0]);
					const m = Number(time.split(":")[1]);
					const s = Number(time.split(":")[2].split(".")[0]);
					if (h > 0) secondTotal = h * 3600;
					if (m > 0) secondTotal += m * 60;
					if (s >= 0) secondTotal += s;
				} catch (e) {
					secondTotal = -1;
				}
				return secondTotal;
			}

			function parseVTT(rawText) {
				try {
					var linesArr = rawText
						.split("\n")
						.map(function (v) {
							return v.trim();
						})
						.filter(function (v) {
							return !!v;
						});



					if (linesArr[0] === "WEBVTT") {
						linesArr.shift();
					}

					var data = [];
					var lineIndex = 0;

					while (lineIndex < linesArr.length) {
						var spliterTime = " --> ";
						var id = linesArr[lineIndex];
						var timeParts = linesArr[lineIndex + 1].split(spliterTime);
						var start = timeStrToSecondNum(timeParts[0]);
						var end = timeStrToSecondNum(timeParts[1]);
						var content = linesArr[lineIndex + 2];

						if (start < 0 || end < 0) {
							throw new Error("cannot convert start time or end time");
						}

						var imageAndPosition = content.split("#xywh=");

						var xywhParts = imageAndPosition[1].split(",");
						var xywh = [];
						for (var i = 0; i < xywhParts.length; i++) {
							xywh.push(Number(xywhParts[i]));
						}
						var width = xywh[2];
						var height = xywh[3];
						var x = Math.floor(xywh[0] / width);
						var y = Math.floor(xywh[1] / height);
						var xaxis = xywh[0];
						var yaxis = xywh[1];



						var sourceAndxywh = content.split("#xywh=");
						var filename = sourceAndxywh[0]; // '240p-28.jpg'
						var numberMatch = filename.match(/-(\d+)\.jpg/);
						var number = numberMatch ? numberMatch[1] : '';



						data.push({
							sprite: parseInt(number, 10),
							id: id,
							start: start,
							end: end,
							content: content,
							imageUrl: sourceAndxywh[0],
							height: height,
							width: width,
							x: x,
							y: y,
							transformScale: y * 20,
							xaxis: xaxis,
							yaxis: yaxis
						});
						lineIndex += 3;
					}
					return data;
				} catch (e) {
					console.error(e);
					return [];
				}
			}



			function i(t) {

				var e,
					o = y.fullControls.bottomControlBar.bottomPlayerControls.progressbar,
					l = o.offset(),
					a = o.width(),
					n = t.pageX - l.left;
				percentage = n / a;
				var d = 100 * percentage + "%";
				const clickTime = percentage * c.duration;
				// if ((e = percentage * c.duration) < 0 || e > c.duration || isNaN(e)) {
				// 	y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.timefloat.show();
				// } else {
				// 	y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.timefloat.html(SaranyuInstaPlayer.Utils.convertSecondsTimecode(e)),
				// 		y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.timefloat.css("left", d),
				// 		y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.timefloat.show();
				// 	// updateThumbnail();
				// 	// focusThumbnailForTime(clickTime)
				// 	// handleCardClick(thumbnails);

				// }
			}

			function e() {
				y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.timefloat.hide();
			}

			function a(t) {
				var e,
					o = y.fullControls.bottomControlBar.bottomPlayerControls.progressbar,
					l = o.offset(),
					a = o.width(),
					n = t.pageX - l.left;
				percentage = n / a,
					(e = percentage * c.duration) < 0 || e > c.duration || isNaN(e) || (c.ended && c.paused && (
						y.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlaypause.addClass("sp-pause"),
						y.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlaypause.removeClass("sp-play"),
						y.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlaypause.removeClass("sp-replay"),
						y.playerLayers.bigreplay.hide()
					),
						y._videoPlayerControls("seek", e),
						y._buildprogressbar.adjustCurrentAndHandleInSeek(percentage),
						i(t))
			}

			loadVTT();



			function centerThumbnail(currentTime, keycode) {

				const sprite = Math.trunc(currentTime / 10);


				const spritevalue = Math.trunc(sprite / 25);

				const filteredCues = window.thumbnailCues && window.thumbnailCues.filter(element => element.sprite >= spritevalue);


				const currentTimeThumbnails = window.thumbnailCues.find(element => {
					if (keycode === 37 && currentTime - 5 <= element.start) {
						// focusThumbnail($(`#${element.start}`));
						return true;
					} else if (keycode === 39 && currentTime + 5 <= element.start) {
						// focusThumbnail($(`#${element.start}`));
						return true;
					}
					return false;
				});

				if (currentTimeThumbnails) {

					const thumbnail = $('#' + currentTimeThumbnails.start);

					const thumbnailContainer = $('#thumbnail-container');

					window.playbackTime = currentTimeThumbnails.start
					$('.sp-player-current-time').text(SaranyuInstaPlayer.Utils.convertSecondsTimecode(window.playbackTime));
					y._buildprogressbar.adjustCurrentAndHandleInSeek(window.playbackTime / c.duration);

				} else {
					// console.log(currentTime, "No matching thumbnail found");
				}
			}



			function thumbnailsContainerDiv(thumbnailCues, currentTime) {
				if (thumbnailCues.length > 0) {
					const thumbnailContainer = $('.sp-thumbnails-container-padding-left');
					const baseUrl = y.options.file[0].thumbnails.split("webvtt_for_sprite.vtt")[0];
					const range = 20;

					// Filter the array to include values within the specified range around currentTime
					var result = thumbnailCues.filter(value =>
						value.start >= currentTime - range && value.start <= currentTime + range
					);

					const fragment = document.createDocumentFragment(); // Create a document fragment

					function handleThumbnailClick(event) {
						const id = $(event.currentTarget).attr('id');
						// console.log(id, "id")
						y.fullControls.bottomControlBar.bottomPlayerControls.backgroundGradient.hide()
						y.fullControls.bottomControlBar.bottomPlayerControls.thumbnailContainer.hide()
						y.fullControls.bottomControlBar.bottomPlayerControls.thumbnailsCenterContainer.hide()
						y.fullControls.bottomControlBar.bottomPlayerControls.thumbnailsCenterContainerMiddle.hide()
						y.fullControls.bottomControlBar.bottomPlayerControls.thumbnailsCenterContainerPadding.hide()
						y.fullControls.bottomControlBar.videoTitle.show();
						y.fullControls.bottomControlBar.secondaryTitle.show();
						y.fullControls.bottomControlBar.bottomPlayerControls.quality.show()
						y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.handle.focus()
						// console.log("fullControlcurrent", c.currentTime, window.playbackTime)
						c.currentTime = window.playbackTime
						ME.play()
						// Add your click handling logic here
					}

					function focusThumbnail(id) {
						const $thumbnail = $(`#${id}`); // Ensure this is a jQuery object
						// console.log(`Element with ID ${id} found.`);
						if ($thumbnail.length) {
							// Apply the border style
							// console.log(`#${id}`)
							$thumbnail.addClass('focused-thumbnail');
							$thumbnail.css('border', '3px solid #ffffff');
							// Set focus to the thumbnail
							// $thumbnail.focus();
						} else {
							console.error(`Element with ID ${id} not found.`);
						}
					}

					let containerLeft;

					result.forEach((each, i) => {
						const thumbnailWrapper = $('<div id="' + each.start + '" class="thumbnail-wrapper"></div>')[0];

						const thumbnail = $(
							'<div id="thumbnail" data-index="' + i +
							'" data-time="' + each.start +
							'" style="background-image: url(\'' + baseUrl + each.imageUrl + '\'); background-repeat: no-repeat; background-size=1920px 1080px;"></div>'
						)[0];

						// const thumbnailWrapperContain = $(
						// 	'<div class="thumbnails-background" style="background: linear-gradient(180deg, #4e5766 0%, #272c33 100%); width: 100%; height: 100%;"></div>'
						// )[0];
						const timeLabel = $('<div class="time-label">' + (SaranyuInstaPlayer.Utils.convertSecondsTimecode(each.start) || "00:00:00") + '</div>')[0];
						const thumbnailLeft = (i / thumbnailCues.length) * 100; // Distribute thumbnails horizontally

						if (each.start == currentTime) {
							if (each.start == 0) {
								// console.log("llll", thumbnailContainer);
								containerLeft = 'calc(50% - 17.375rem)';
								thumbnailContainer.css('left', containerLeft);
							} else if (each.start == 10) {
								containerLeft = '-10.75rem';
								thumbnailContainer.css('left', containerLeft);
							} else {
								if (window.innerWidth <= 1300) {
									containerLeft = '-46%';
									thumbnailContainer.css('left', containerLeft);
								} else {
									containerLeft = '-52%';
									thumbnailContainer.css('left', containerLeft);
								}
							}
						}

						thumbnail.tabIndex = 0;
						// thumbnail.style.left = thumbnailLeft + '%';
						thumbnail.style.display = 'block';
						thumbnail.style.backgroundPosition = '-' + each.xaxis + 'px ' + '-' + each.yaxis + 'px';

						let height;
						let width;

						if (window.innerWidth <= 1300) {
							height = 194 - 6;
							width = 336;
						} else {
							height = each.height;
							width = each.width + 10;
						}

						const thumbnailWrapperContain = $(
							`<div class="thumbnails-background" style="background: linear-gradient(180deg, #4e5766 0%, #272c33 100%);"></div>`
						)[0];

						thumbnailWrapper.style.height = height + 'px';
						thumbnailWrapper.style.width = width + 'px';
						thumbnailWrapper.appendChild(thumbnailWrapperContain)

						thumbnail.style.objectFit = 'none';

						thumbnailWrapper.appendChild(thumbnail);
						thumbnailWrapper.appendChild(timeLabel);

						fragment.appendChild(thumbnailWrapper); // Append each thumbnail to the document fragment

						// Add click event listener to the thumbnail
						$(thumbnailWrapper).on('click', handleThumbnailClick);
					});

					thumbnailContainer.empty().append(fragment);
					result.filter(each => each.start == currentTime).forEach(each => {
						if (window.innerWidth <= 1300) {
							$(`#${each.start}`).css({
								"border": "3px solid #ffffff",
								"padding": "4px"
							});
						} else {
							$(`#${each.start}`).css({
								"border": "3px solid #ffffff",
								"padding": "6px"
							});
						}
					});
				}
			}










			var backgroundGradient = $('<div class="sp-background-gradient">' +
				'<div class="sp-thumbnail-container">' +
				'<div class="sp-thumbnails-center-container">' +
				'<div class="sp-thumbnails-center-container-middle">' +
				'<div class="sp-thumbnails-center-container-padding">' +
				'<div class="sp-thumbnails-container-padding-left"></div>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'</div>');


			var thumbnailsContainer = $('<div id="thumbnail-container"><div class="thumbnails-container-card"></div></div>')
			//  var thumbnailFocus = $(`<div class="focus-thumbnail"></div>`)
			var progressBarElement = $('<div  id="sp-controls-bottom-progress-bar" class="sp-controls-bottom-progress-bar"><div class="sp-progress-bar-time-rail"><span class="sp-progress-bar-buffering"></span><span class="sp-progress-bar-loaded"></span><span class="sp-progress-bar-current"></span><span class="sp-progress-bar-cues"></span><span id="sp-progress-bar-handle" data-sn-down=".sp-quality-switch-btn" data-sn-up= tabindex="0" class="sp-progress-bar-handle focusable" data-sn-left="" data-sn-right="" data-sn-down=".sp-quality-switch-btn"></span><span class="sp-progress-bar-timefloat"></span></div></div>');
			var leftTimeElement = $('<div class="sp-player-time-left"><span class="sp-player-current-time">00:00:00</span></div>');
			var slashElement = $('<div class="slash">/</div>');
			var rightTimeElement = $('<div class="sp-player-time-right"><span class="sp-player-duration">00:00:00</span></div>');
			y.fullControls.bottomControlBar.bottomPlayerControls.append(backgroundGradient)
			y.fullControls.bottomControlBar.bottomPlayerControls.append('<div class="sp-time-progress"></div>');
			y.fullControls.bottomControlBar.bottomPlayerControls.find('.sp-time-progress').append(progressBarElement);
			y.fullControls.bottomControlBar.bottomPlayerControls.find('.sp-time-progress').append(leftTimeElement);
			if (y.options.live == false) {
				y.fullControls.bottomControlBar.bottomPlayerControls.find('.sp-time-progress').append(slashElement);
			}
			y.fullControls.bottomControlBar.bottomPlayerControls.append(thumbnailsContainer)
			// y.fullControls.bottomControlBar.bottomPlayerControls.append(thumbnailFocus)
			y.fullControls.bottomControlBar.bottomPlayerControls.append(backgroundGradient)

			y.fullControls.bottomControlBar.bottomPlayerControls.find('.sp-time-progress').append(rightTimeElement);

			y.fullControls.bottomControlBar.bottomPlayerControls.timeProgress = y.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-time-progress");
			y.fullControls.bottomControlBar.bottomPlayerControls.progressbar = y.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-controls-bottom-progress-bar"),
				y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.buffering = y.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-progress-bar-buffering"),
				y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.loaded = y.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-progress-bar-loaded"),
				y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.current = y.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-progress-bar-current"),
				y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.handle = y.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-progress-bar-handle"),
				y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.timefloat = y.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-progress-bar-timefloat"),
				y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.cues = y.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-progress-bar-cues"),
				y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.leftTime = y.fullControls.bottomControlBar.bottomPlayerControls.find('.sp-player-current-time')

			y.fullControls.bottomControlBar.bottomPlayerControls.backgroundGradient = y.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-background-gradient");
			y.fullControls.bottomControlBar.bottomPlayerControls.thumbnailContainer = y.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-thumbnail-container");
			y.fullControls.bottomControlBar.bottomPlayerControls.thumbnailsCenterContainer = y.fullControls.bottomControlBar.bottomPlayerControls.find("sp-thumbnails-center-container");
			y.fullControls.bottomControlBar.bottomPlayerControls.thumbnailsCenterContainerMiddle = y.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-thumbnails-center-container-middle");
			y.fullControls.bottomControlBar.bottomPlayerControls.thumbnailsCenterContainerPadding = y.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-thumbnails-center-container-padding");
			y.fullControls.bottomControlBar.bottomPlayerControls.thumbnailsContainerPaddingLeft = y.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-thumbnails-container-padding-left");
			y.fullControls.bottomControlBar.bottomPlayerControls.slash = y.fullControls.bottomControlBar.bottomPlayerControls.find(".slash")
			y.fullControls.bottomControlBar.bottomPlayerControls.rightTime = y.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-player-time-right")
			y.fullControls.bottomControlBar.bottomPlayerControls.leftTime = y.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-player-time-left")

			y._buildprogressbar.adjustCurrentAndHandleInSeek = function (t) {
				var e, o, l, a, n, i, r;
				t < 0 || 1 < t || (n = 100 * t + "%", i = y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.handle.width() / 2,
					y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.current.width(n)
					,
					y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.handle.css("left", "calc(" + n + " - " + i + "px)"),
					e = y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.handle.offset().left,
					o = y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.handle.width(),
					l = y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.offset().left,
					a = y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.width(),
					e < l ? (r = 0, y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.handle.css("left", r + "px")) : l + a < o + e && (r = a - o, i = y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.handle.width(), y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.handle.css("left", "calc(" + n + " - " + i + "px)")))
			},
				y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.bind("mouseover", function (t) {
					i(t),
						t = SaranyuInstaPlayer.Utils.preventSelectionOfTextInMouseMove(t),
						y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.mouseIsOver = !0
					// $('#thumbnail-container').show();
				}).bind("mousemove", function (t) {
					i(t),
						t = SaranyuInstaPlayer.Utils.preventSelectionOfTextInMouseMove(t),
						1 == y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.mouseIsDown && a(t)
				}).bind("mouseup", function (t) {
					// console.log("mouseup", t)
					t = SaranyuInstaPlayer.Utils.preventSelectionOfTextInMouseMove(t),
						y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.mouseIsDown = !1
				}).bind("mousedown", function (t) {
					// console.log("mousedown", t)
					a(t = SaranyuInstaPlayer.Utils.preventSelectionOfTextInMouseMove(t)),
						y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.mouseIsDown = !0
				}).bind("mouseleave", function (t) {
					e(),
						t = SaranyuInstaPlayer.Utils.preventSelectionOfTextInMouseMove(t),
						y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.mouseIsDown = !1
					$('#thumbnail').hide();
				}).on("touch drag", function (t) {
					alert("dragging")
					var l = t.gesture.touches;
					t.gesture.preventDefault(), o(e);
					for (var n = 0, r = l.length; n < r; n++) t.fullControls.bottomControlBar.bottomPlayerControls.progressbar.handle.mouseIsDown = !0, a(l[n])
				}).on("touchmove", function (t) { }).on("release", function (t) {
					a(t),
						y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.handle.mouseIsDown = !1,
						e();
				}).on("mouseleave", function (t) {
					y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.handle.mouseIsDown = !1
				}),
				// c.addEventListener("timeupdate", function (t) {
				// 	var e = y.mediaElement.videoElement
				// 	window.playbackTime = e.currentTime
				// 	var o = window.playbackTime / e.duration
				// 	y._buildprogressbar.adjustCurrentAndHandleInSeek(o)
				// }.bind(y)),

				c.addEventListener("timeupdate", function (t) {
					var e = y.mediaElement.videoElement;
					window.playbackTime = e.currentTime;
					var o = window.playbackTime / e.duration;
					y._buildprogressbar.adjustCurrentAndHandleInSeek(o);




					// 					// Reference to the video element
					// 					const video = document.getElementById("video-master");

					// 					// Inject cue styling once
					// 					function injectCueStyle() {
					// 						if (!document.querySelector('style[data-cue-style]')) {
					// 							const style = document.createElement("style");
					// 							style.setAttribute("data-cue-style", "true");
					// 							document.head.appendChild(style);
					// 						}
					// 						updateCueStyle(); // initial style update
					// 					}

					// 					// Dynamically update cue font size and background
					// 					function updateCueStyle() {
					// 						const style = document.querySelector('style[data-cue-style]');
					// 						const isSmallScreen = window.innerWidth < 1300;
					// 						const fontSize = isSmallScreen ? "16px" : "18px";

					// 						style.innerHTML = `
					//     video::cue {
					//       color: white;
					//       background: rgba(0, 0, 0, 0.6);
					//       font-size: ${fontSize};
					//       line-height: 1.4;
					//       text-align: center;
					//     }
					//   `;
					// 					}

					// 					// Optional: refresh subtitles if they disappear
					// 					function refreshSubtitleTrack() {
					// 						const tracks = video.textTracks;
					// 						for (let i = 0; i < tracks.length; i++) {
					// 							if (tracks[i].mode === "showing") {
					// 								tracks[i].mode = "hidden";
					// 								tracks[i].mode = "showing";
					// 							}
					// 						}
					// 					}

					// 					// On layout change or resize
					// 					window.addEventListener("resize", () => {
					// 						updateCueStyle();
					// 					});

					// 					// Track playback progress (optional, if you want to refresh subtitles during playback)
					// 					c.addEventListener("timeupdate", () => {
					// 						// Your playback-related logic can go here
					// 						refreshSubtitleTrack()
					// 						// If subtitles disappear, uncomment this line:
					// 						// refreshSubtitleTrack();
					// 					});

					// 					// Initialize cue styling on load
					// 					injectCueStyle();


					function updateMediaTextTrackStyle() {
						const progressBarVisible = $(".sp-progress-bar-handle").is(":visible");

						// Remove existing styles before appending new ones to avoid duplication
						let existingStyle = document.querySelector('style[data-media-text-track-style]');
						if (existingStyle) {
							existingStyle.remove();
						}

						// Create a <style> element
						const style = document.createElement('style');
						style.setAttribute('data-media-text-track-style', 'true');

						// Define base styles and media query-specific styles
						const progressBarTranslate = progressBarVisible && window.innerWidth >= 1300 ? "translateY(-1.5%)" : (window.innerWidth >= 1300) ? "translateY(10%)" : "translateY(-0.5%)";
						const progressBarTranslateSmallScreen = progressBarVisible && window.innerWidth <= 1300 ? "translateY(-1%)" : (window.innerWidth <= 1300) ? "translateY(10%)" : "translateY(-2%)";

						// Reset styles and define CSS with media queries
						style.innerHTML = `
					  /* Base styles for the text track container */
					  #video-master::-webkit-media-text-track-container {
					    position: absolute; /* Fixed position relative to the video container */
					    bottom: 0; /* Ensure baseline alignment */
					    transform: ${progressBarTranslate} !important;
					    -webkit-transform: ${progressBarTranslate} !important;
					  }

					  /* First @media screen section for smaller screens */
					  @media screen and (max-width: 1300px) {
					    #video-master::-webkit-media-text-track-container {
					      transform: ${progressBarTranslateSmallScreen} !important;
					      -webkit-transform: ${progressBarTranslateSmallScreen} !important;
					      position: absolute; /* Avoid any progressive cascading issues */
					      bottom: 0; /* Maintain consistent alignment */
					    }
					  }
					`;

						// Append the <style> element to the <head>
						document.head.appendChild(style);

					}

					// Call the function to update the CSS dynamically
					updateMediaTextTrackStyle();
				}.bind(y));




			c.addEventListener("progress", function (t) {
				for (var e = y.mediaElement.videoElement, o = 0, l = 0; l < e.buffered.length; l++)
					e.currentTime >= e.buffered.start(l) && e.currentTime <= e.buffered.end(l) && (o = e.buffered.end(l) / e.duration);
				y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.loaded.width(100 * o + "%")
			}.bind(y))


			var isPressing = false;
			window.isLongPress = false;
			var pressTimer;
			var longPressTimer;
			var setIntervalTime = 100; // Interval time to update seek during long press
			var longPressDuration = 600; // Duration to consider as long press
			window.playbackTime = Math.ceil(c.currentTime);
			window.islongpressTime;
			window.isFirstTime = false;
			window.isEnterPress = false
			window.longPressStartTime = null;
			window.downArrowPress = false
			var backwardTimeout, forwardTimeout;

			$(document).off('keydown').on('keydown', function (event) {
				var keyCode = event.which || event.keyCode;
				// console.log("ads_status3", localStorage.getItem("ads_status"), longPressTimer)
				// console.log("ads_status4", localStorage.getItem("ads_status"), pressTimer)
				// Non-live player conditions
				if (localStorage.getItem("ads_status") == "false") {

					// console.log("ads_status5", localStorage.getItem("ads_status"), longPressTimer)
					// console.log("ads_status6", localStorage.getItem("ads_status"), pressTimer)
					if ((window.InstaPlayer && window.InstaPlayer.options && window.InstaPlayer.options.playerType != "live" || document.activeElement == "sp-progress-bar-handle focusable") && (!$(".sp-subtitles-switch-main-popup-wrap").is(":visible") && !$(".sp-quality-switch-main-popup-wrap").is(":visible"))) {


						// Check if left/right arrow or enter key is pressed
						if (!isPressing && (keyCode === 37 || keyCode === 39 || keyCode === 13 || keyCode === 40)) {
							isPressing = true;
							window.isLongPress = false;
							window.isEnterPress = false

							if (y.fullControls.bottomControlBar.bottomPlayerControls.backgroundGradient.is(':visible') && keyCode === 13) {
								handleEnterKey();
							} else if (keyCode === 37 || keyCode === 39) {


								// Start long press detection
								// console.log("key deteched")

								clearInterval(longPressTimer);
								clearTimeout(pressTimer);

								pressTimer = setTimeout(function () {
									window.isLongPress = true;

									// Show thumbnails and handle UI during long press
									showThumbnails(keyCode);

									longPressTimer = setInterval(function () {
										if (localStorage.getItem("ads_status") == "true") {

											clearInterval(longPressTimer);
											clearTimeout(pressTimer);
										}
										else if (keyCode === 37 && localStorage.getItem("ads_status") == "false") {
											handleLongPressLeftArrowKey();
										} else if (keyCode === 39 && localStorage.getItem("ads_status") == "false") {
											handleLongPressRightArrowKey();
										}
										// Update thumbnails dynamically as playback time changes
										centerThumbnail(window.playbackTime, keyCode);
										thumbnailsContainerDiv(window.thumbnailCues, window.playbackTime);
									}, setIntervalTime);
								}, longPressDuration);
							}
						}
					}
				}
			});

			$(document).off('keyup').on('keyup', function (event) {
				var keyCode = event.which || event.keyCode;
				// console.log("ads_status1", localStorage.getItem("ads_status"), longPressTimer)
				// console.log("ads_status2", localStorage.getItem("ads_status"), pressTimer)
				if (localStorage.getItem("ads_status") == "false") {

					// console.log("ads_status7", localStorage.getItem("ads_status"), longPressTimer)
					// console.log("ads_status8", localStorage.getItem("ads_status"), pressTimer)
					if (window.InstaPlayer && window.InstaPlayer.options && window.InstaPlayer.options.playerType != "live" || document.activeElement.className == "sp-progress-bar-handle focusable") {

						if (isPressing && (keyCode === 37 || keyCode === 39 || keyCode === 40 || keyCode === 13)) {
							clearInterval(longPressTimer);
							clearTimeout(pressTimer);

							if (window.isLongPress) {

								handleLongPressRelease(keyCode);
							} else {
								handleShortPressRelease(keyCode);
							}

							// Hide thumbnails on keyup
							// hideThumbnails();

							isPressing = false;
						}
					}
					else if (window.InstaPlayer && window.InstaPlayer.options.playerType === "live") {

					}
				}
			});

			// Functions to handle showing and hiding thumbnails
			function showThumbnails(keyCode) {


				$('#skip_button').hide();
				window.InstaPlayer.playerLayers.bigplay && window.InstaPlayer.playerLayers.bigplay.hide();
				y.fullControls.bottomControlBar.videoTitle.hide();
				y.fullControls.bottomControlBar.secondaryTitle.hide();
				y.fullControls.bottomControlBar.bottomPlayerControls.quality.hide();
				y.fullControls.bottomControlBar.bottomPlayerControls.subtitles && y.fullControls.bottomControlBar.bottomPlayerControls.subtitles.hide()
				y.fullControls.bottomControlBar.bottomPlayerControls.multiaudio && y.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.hide()
				y.fullControls.bottomControlBar.bottomPlayerControls.backgroundGradient.show();

				if (window.thumbnailCues && window.thumbnailCues.length == 0) {
					y.fullControls.bottomControlBar.bottomPlayerControls.backgroundGradient.css('background', 'none');
				} else {
					y.fullControls.bottomControlBar.bottomPlayerControls.backgroundGradient.css('background', 'none');
				}
				// Show thumbnail-related UI elements
				y.fullControls.bottomControlBar.bottomPlayerControls.thumbnailContainer.show();
				y.fullControls.bottomControlBar.bottomPlayerControls.thumbnailsCenterContainer.show();
				y.fullControls.bottomControlBar.bottomPlayerControls.thumbnailsCenterContainerMiddle.show();
				y.fullControls.bottomControlBar.bottomPlayerControls.thumbnailsCenterContainerPadding.show();
				y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.show()
				y.fullControls.bottomControlBar.bottomPlayerControls.slash.show()
				y.fullControls.bottomControlBar.bottomPlayerControls.leftTime.show()
				y.fullControls.bottomControlBar.bottomPlayerControls.rightTime.show()

				// Show thumbnail depending on key (left or right arrow)
				if (keyCode === 37) {
					centerThumbnail(window.playbackTime - 10, keyCode);
				} else if (keyCode === 39) {
					centerThumbnail(window.playbackTime, keyCode);
				}

				thumbnailsContainerDiv(window.thumbnailCues, window.playbackTime);
				if (window.thumbnailCues && window.thumbnailCues.length == 0) {
					y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.handle.focus()
				} else {
					y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.handle.blur()
				}
			}

			function hideThumbnails() {
				// Restore UI when long press ends
				y.fullControls.bottomControlBar.videoTitle.show();
				y.fullControls.bottomControlBar.secondaryTitle.show();
				y.fullControls.bottomControlBar.bottomPlayerControls.quality.show();
				y.fullControls.bottomControlBar.bottomPlayerControls.backgroundGradient.hide();

				// Hide thumbnail-related UI elements
				y.fullControls.bottomControlBar.bottomPlayerControls.thumbnailContainer.hide();
				y.fullControls.bottomControlBar.bottomPlayerControls.thumbnailsCenterContainer.hide();
				y.fullControls.bottomControlBar.bottomPlayerControls.thumbnailsCenterContainerMiddle.hide();
				y.fullControls.bottomControlBar.bottomPlayerControls.thumbnailsCenterContainerPadding.hide();
				if (window.subtitleTracks && window.subtitleTracks.length > 0) {
					y.fullControls.bottomControlBar.bottomPlayerControls.subtitles && y.fullControls.bottomControlBar.bottomPlayerControls.subtitles.show();
				}
				y.fullControls.bottomControlBar.bottomPlayerControls.multiaudio && y.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.show()

			}

			// Functions to handle different key events
			function handleEnterKey() {


				window.InstaPlayer.playerLayers.bigplay && window.InstaPlayer.playerLayers.bigplay.hide();
				y.fullControls.bottomControlBar.bottomPlayerControls.backgroundGradient.hide();
				hideThumbnails();
				y.fullControls.bottomControlBar.videoTitle.show();
				y.fullControls.bottomControlBar.secondaryTitle.show();
				if (window.subtitleTracks && window.subtitleTracks.length > 0) {
					y.fullControls.bottomControlBar.bottomPlayerControls.subtitles && y.fullControls.bottomControlBar.bottomPlayerControls.subtitles.show();
				}
				y.fullControls.bottomControlBar.bottomPlayerControls.quality.show();
				c.currentTime = window.playbackTime
				updatePlaybackUI()
				ME.play()

				window.downArrowPress = false
				window.isEnterPress = true
				isPressing = false;
			}

			function handleLongPressLeftArrowKey() {
				window.skipIntroVisible = false;
				window.skipIntroStatus = true
				window.skipintroFocus = true
				if (window.InstaPlayer && window.InstaPlayer.options && window.InstaPlayer.options.playerType != "live") {


					ME.pause();
					if (!window.downArrowPress) {
						window.downArrowPress = true
						// Log and store the playbackTime only at the start of the long press

						window.longPressStartTime = window.playbackTime;
					}
					if (window.thumbnailCues && window.thumbnailCues.length > 0) {
						window.playbackTime -= 10;
					} else {
						if ((c.currentTime - 10) >= 0) {
							window.playbackTime -= 10
							SaranyuInstaPlayer.Utils.DLOG.INFO("10s Backward Seek");
						} else {
							window.playbackTime = 0;
						}
					}
					updatePlaybackUI();
				}
			}

			function handleLongPressRightArrowKey() {
				window.skipIntroVisible = false;

				window.skipIntroStatus = true

				window.skipintroFocus = true
				if (window.InstaPlayer && window.InstaPlayer.options && window.InstaPlayer.options.playerType != "live") {

					ME.pause();
					// console.log("!windowl", window.longPressStartTime)
					if (!window.downArrowPress) {
						// Log and store the playbackTime only at the start of the long press
						// console.log("Long press started. Initial playbackTime:", window.playbackTime);
						window.longPressStartTime = window.playbackTime;
						window.downArrowPress = true
					}
					if (window.thumbnailCues && window.thumbnailCues.length > 0) {
						window.playbackTime;
					}
					else {
						if (window.playbackTime != o.duration && (window.playbackTime + 10) < c.duration) {
							window.playbackTime += 10;
						} else {
							window.playbackTime = c.duration
						}
					}
					updatePlaybackUI();
				}
			}

			function handleLongPressRelease(keyCode) {

				// console.log("handleLongPressRelease", keyCode, window.playbackTime)
				if (keyCode === 37) {
					window.isLongPress = false;

					// c.currentTime = window.playbackTime;
					if (window.thumbnailCues && window.thumbnailCues.length > 0) {
						window.isFirstTime = false
						showThumbnails(keyCode)
						ME.pause()
					} else {
						hideThumbnails();
						c.currentTime = window.playbackTime
						ME.play();

					}
				} else if (keyCode === 39) {
					window.isLongPress = false;

					// c.currentTime = window.playbackTime;

					if (window.thumbnailCues && window.thumbnailCues.length > 0) {
						window.isFirstTime = false
						showThumbnails(keyCode)
						ME.pause()
					} else {
						c.currentTime = window.playbackTime
						hideThumbnails();
						ME.play();
					}

				}
				isPressing = false;
			}

			function handleShortPressRelease(keyCode) {

				if (keyCode === 37) {
					if (window.thumbnailCues && window.thumbnailCues.length > 0 && y.fullControls.bottomControlBar.bottomPlayerControls.backgroundGradient.is(':visible')) {

						window.playbackTime - 10;
						window.isFirstTime = false
						showThumbnails(keyCode)
						updatePlaybackUI()
						window.timeoutControls()

					} else if (document.activeElement.className == "sp-progress-bar-handle focusable" && document.activeElement.className !== "sp-subtitles-switch-btn focusable" && document.activeElement.className !== "sp-quality-switch-btn focusable" && document.activeElement.className !== "sp-multiaudio-switch-btn focusable") {

						c.currentTime = window.playbackTime - 10;
						handleForwardRewindIcons(keyCode)
						hideThumbnails()
						updatePlaybackUI()
						ME.play();
					}
					else {
						if ($(".sp-progress-bar-handle").is(":hidden")) {

							c.currentTime = window.playbackTime - 10;
							handleForwardRewindIcons(keyCode)
							hideThumbnails()
							ME.play();
						}
						//  if( document.activeElement.className !== "sp-quality-switch-btn focusable"){
						// 	c.currentTime = window.playbackTime - 10;
						// 	handleForwardRewindIcons(keyCode)
						// 	hideThumbnails()
						// 	updatePlaybackUI()
						// 	ME.play();
						// }
						// else if (document.activeElement.className !== "sp-subtitles-switch-btn focusable"){
						// c.currentTime = window.playbackTime - 10;
						// handleForwardRewindIcons(keyCode)
						// hideThumbnails()
						// updatePlaybackUI()
						// ME.play();
						// }
					}

				} else if (keyCode === 39) {
					if (window.thumbnailCues && window.thumbnailCues.length > 0 && y.fullControls.bottomControlBar.bottomPlayerControls.backgroundGradient.is(':visible')) {

						window.playbackTime + 10;
						window.isFirstTime = false
						showThumbnails(keyCode)
						updatePlaybackUI()
						window.timeoutControls()

					} else if (document.activeElement.className == "sp-progress-bar-handle focusable" && document.activeElement.className !== "sp-subtitles-switch-btn focusable" && document.activeElement.className !== "sp-quality-switch-btn focusable" && document.activeElement.className !== "sp-multiaudio-switch-btn focusable") {

						c.currentTime = window.playbackTime + 10;
						handleForwardRewindIcons(keyCode)
						hideThumbnails()
						ME.play();
					}
					else {

						if (document.activeElement.id == 'skip_button') {
							c.currentTime = window.playbackTime + 10;
							handleForwardRewindIcons(keyCode)
							hideThumbnails()
						}
						else if ($(".sp-progress-bar-handle").is(":hidden")) {

							c.currentTime = window.playbackTime + 10;
							handleForwardRewindIcons(keyCode)
							hideThumbnails()
							ME.play();
						}

					}


				}
				else if (keyCode === 40) {
					// console.log("confirm", window.downArrowPress, window.longPressStartTime)
					if (window.downArrowPress && window.thumbnailCues && window.thumbnailCues.length > 0) {
						c.currentTime = window.longPressStartTime
						$('.sp-player-current-time').text(SaranyuInstaPlayer.Utils.convertSecondsTimecode(c.currentTime));
						y._buildprogressbar.adjustCurrentAndHandleInSeek(c.currentTime / c.duration);
						hideThumbnails()
						window.isFirstTime = false
						ME.play()
						window.downArrowPress = false
						// window.longPressStartTime = 
					}


					// else if( window.InstaPlayer.playerLayers.bigplay && window.InstaPlayer.playerLayers.bigplay.show()){
					// 	window.InstaPlayer.playerLayers.bigplay && window.InstaPlayer.playerLayers.bigplay.hide()
					// } 
					// else if($("#SidebarQuality").is(":visible")){

					// }

				}
				else if (keyCode == 13) {
					if ($("#SidebarQuality").is(":visible") || $("#SidebarSubtitles").is(":visible") || $("#SidebarMultiaudio").is(":visible")) {

					}
					else {
						y._buildprogressbar._OnEnterPressKey()
					}
				}
				isPressing = false;

			}

			function handleForwardRewindIcons(keyCode) {
				// console.log(keyCode, "hii babu", document.activeElement.className, !$(".sp-subtitles-switch-main-popup-wrap").is(":visible"), !$(".sp-quality-switch-main-popup-wrap").is(":visible"));
				if ((keyCode == 37 && document.activeElement.className == "sp-progress-bar-handle focusable" && (!$(".sp-subtitles-switch-main-popup-wrap").is(":visible") && (!$(".sp-multiaudio-switch-main-popup-wrap").is(":visible") && !$(".sp-quality-switch-main-popup-wrap").is(":visible")))) && document.activeElement.className != "sp-subtitles-switch-btn focusable" && document.activeElement.className != "sp-quality-switch-btn focusable") {
					// Show backward UI
					y.playerLayers.bigplay.show();
					y.playerLayers.bigplay.playPause.hide();
					y.playerLayers.bigplay.backward.show();
					y.fullControls.bottomControlBar.bottomPlayerControls.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.quality.show();
					y.fullControls.bottomControlBar.hide();
					y.fullControls.bottomControlBar.videoTitle.hide();
					y.fullControls.bottomControlBar.secondaryTitle.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.slash.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.leftTime.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.rightTime.hide();

					// Clear any existing timeout

					backwardTimeout = setTimeout(function () {
						clearTimeout(backwardTimeout);
						y.playerLayers.bigplay.backward.hide();
					}, 1000);

				} else if ((keyCode == 39 && document.activeElement.className == "sp-progress-bar-handle focusable" && (!$(".sp-subtitles-switch-main-popup-wrap").is(":visible") && (!$(".sp-multiaudio-switch-main-popup-wrap").is(":visible") && !$(".sp-quality-switch-main-popup-wrap").is(":visible")))) && document.activeElement.className != "sp-subtitles-switch-btn focusable" && document.activeElement.className != "sp-quality-switch-btn focusable") {
					// Show forward UI
					y.playerLayers.bigplay.show();
					y.playerLayers.bigplay.playPause.hide();
					y.playerLayers.bigplay.forward.show();
					y.fullControls.bottomControlBar.bottomPlayerControls.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.quality.show();
					y.fullControls.bottomControlBar.hide();
					y.fullControls.bottomControlBar.videoTitle.hide();
					y.fullControls.bottomControlBar.secondaryTitle.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.slash.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.leftTime.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.rightTime.hide();

					// Clear any existing timeout
					clearTimeout(forwardTimeout);

					forwardTimeout = setTimeout(function () {
						y.playerLayers.bigplay.forward.hide();
					}, 1000);
				}

				else if ((keyCode == 37 && document.activeElement.className == '' && (!$(".sp-subtitles-switch-main-popup-wrap").is(":visible") && (!$(".sp-multiaudio-switch-main-popup-wrap").is(":visible") && !$(".sp-quality-switch-main-popup-wrap").is(":visible")))) && document.activeElement.className != "sp-subtitles-switch-btn focusable" && document.activeElement.className != "sp-quality-switch-btn focusable") {
					// Show backward UI
					y.playerLayers.bigplay.show();
					y.playerLayers.bigplay.playPause.hide();
					y.playerLayers.bigplay.backward.show();
					y.fullControls.bottomControlBar.bottomPlayerControls.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.quality.show();
					y.fullControls.bottomControlBar.hide();
					y.fullControls.bottomControlBar.videoTitle.hide();
					y.fullControls.bottomControlBar.secondaryTitle.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.slash.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.leftTime.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.rightTime.hide();

					// Clear any existing timeout

					backwardTimeout = setTimeout(function () {
						clearTimeout(backwardTimeout);
						y.playerLayers.bigplay.backward.hide();
					}, 1000);

				} else if ((keyCode == 39 && document.activeElement.className == '' && (!$(".sp-subtitles-switch-main-popup-wrap").is(":visible") && (!$(".sp-multiaudio-switch-main-popup-wrap").is(":visible") && !$(".sp-quality-switch-main-popup-wrap").is(":visible")))) && document.activeElement.className != "sp-subtitles-switch-btn focusable" && document.activeElement.className != "sp-quality-switch-btn focusable" && document.activeElement.className != "sp-multiaudio-switch-btn focusable") {
					// Show forward UI
					y.playerLayers.bigplay.show();
					y.playerLayers.bigplay.playPause.hide();
					y.playerLayers.bigplay.forward.show();
					y.fullControls.bottomControlBar.bottomPlayerControls.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.quality.show();
					y.fullControls.bottomControlBar.hide();
					y.fullControls.bottomControlBar.videoTitle.hide();
					y.fullControls.bottomControlBar.secondaryTitle.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.slash.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.leftTime.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.rightTime.hide();

					// Clear any existing timeout

					forwardTimeout = setTimeout(function () {
						clearTimeout(forwardTimeout);
						y.playerLayers.bigplay.forward.hide();
					}, 1000);
				}
				else if ((keyCode == 37 && document.activeElement.className == 'playPause focusable play' && (!$(".sp-subtitles-switch-main-popup-wrap").is(":visible") && !$(".sp-quality-switch-main-popup-wrap").is(":visible"))) && document.activeElement.className != "sp-subtitles-switch-btn focusable" && document.activeElement.className != "sp-quality-switch-btn focusable" || document.activeElement.className != "sp-multiaudio-switch-btn focusable") {
					// Show backward UI
					y.playerLayers.bigplay.show();
					y.playerLayers.bigplay.playPause.hide();
					y.playerLayers.bigplay.backward.show();
					y.fullControls.bottomControlBar.bottomPlayerControls.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.quality.show();
					y.fullControls.bottomControlBar.hide();
					y.fullControls.bottomControlBar.videoTitle.hide();
					y.fullControls.bottomControlBar.secondaryTitle.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.slash.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.leftTime.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.rightTime.hide();

					// Clear any existing timeout
					clearTimeout(backwardTimeout);

					backwardTimeout = setTimeout(function () {
						y.playerLayers.bigplay.backward.hide();
					}, 1000);

				}
				else if ((keyCode == 39 && document.activeElement.className == 'playPause focusable play' && (!$(".sp-subtitles-switch-main-popup-wrap").is(":visible") && !$(".sp-quality-switch-main-popup-wrap").is(":visible") && !$(".sp-multiaudio-switch-main-popup-wrap").is(":visible"))) && document.activeElement.className != "sp-subtitles-switch-btn focusable" && document.activeElement.className != "sp-quality-switch-btn focusable" && document.activeElement.className != "sp-multiaudio-switch-btn focusable") {
					// Show forward UI
					y.playerLayers.bigplay.show();
					y.playerLayers.bigplay.playPause.hide();
					y.playerLayers.bigplay.forward.show();
					y.fullControls.bottomControlBar.bottomPlayerControls.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.quality.show();
					y.fullControls.bottomControlBar.hide();
					y.fullControls.bottomControlBar.videoTitle.hide();
					y.fullControls.bottomControlBar.secondaryTitle.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.slash.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.leftTime.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.rightTime.hide();

					// Clear any existing timeout

					forwardTimeout = setTimeout(function () {
						clearTimeout(forwardTimeout);
						y.playerLayers.bigplay.forward.hide();
					}, 1000);
				}



				else if ((keyCode == 37 && document.activeElement.id == 'skip_button' && (!$(".sp-subtitles-switch-main-popup-wrap").is(":visible") && !$(".sp-quality-switch-main-popup-wrap").is(":visible"))) && document.activeElement.className != "sp-subtitles-switch-btn focusable" && document.activeElement.className != "sp-quality-switch-btn focusable" || document.activeElement.className != "sp-multiaudio-switch-btn focusable") {
					// Show backward UI
					y.playerLayers.bigplay.show();
					y.playerLayers.bigplay.playPause.hide();
					y.playerLayers.bigplay.backward.show();
					y.fullControls.bottomControlBar.bottomPlayerControls.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.quality.show();
					y.fullControls.bottomControlBar.hide();
					y.fullControls.bottomControlBar.videoTitle.hide();
					y.fullControls.bottomControlBar.secondaryTitle.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.slash.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.leftTime.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.rightTime.hide();

					// Clear any existing timeout

					backwardTimeout = setTimeout(function () {
						clearTimeout(backwardTimeout);
						y.playerLayers.bigplay.backward.hide();
					}, 1000);

				} else if ((keyCode == 39 && document.activeElement.id == 'skip_button' && (!$(".sp-subtitles-switch-main-popup-wrap").is(":visible") && !$(".sp-quality-switch-main-popup-wrap").is(":visible"))) && document.activeElement.className != "sp-subtitles-switch-btn focusable" && document.activeElement.className != "sp-quality-switch-btn focusable" && document.activeElement.className != "sp-multiaudio-switch-btn focusable") {
					// Show forward UI
					y.playerLayers.bigplay.show();
					y.playerLayers.bigplay.playPause.hide();
					y.playerLayers.bigplay.forward.show();
					y.fullControls.bottomControlBar.bottomPlayerControls.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.progressbar.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.quality.show();
					y.fullControls.bottomControlBar.hide();
					y.fullControls.bottomControlBar.videoTitle.hide();
					y.fullControls.bottomControlBar.secondaryTitle.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.slash.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.leftTime.hide();
					y.fullControls.bottomControlBar.bottomPlayerControls.rightTime.hide();

					// Clear any existing timeout

					forwardTimeout = setTimeout(function () {
						clearTimeout(forwardTimeout);
						y.playerLayers.bigplay.forward.hide();
					}, 1000);
				}
			}


			function updatePlaybackUI() {
				// console.log("windowplayback", window.playbackTime, ME.currentTime)

				$('.sp-player-current-time').text(SaranyuInstaPlayer.Utils.convertSecondsTimecode(Math.ceil(window.playbackTime)));
				y._buildprogressbar.adjustCurrentAndHandleInSeek(window.playbackTime / c.duration);
			}

			y._buildprogressbar._OnEnterPressKey = function () {
				window.skipIntroVisible = false;

				// window.skipIntroStatus = true

				window.skipintroFocus = true

				// console.log("_buildprogressbar._OnEnterPressKey", window.isQuality, window.skipIntroStatus)

				$('.sp-player-current-time').text(SaranyuInstaPlayer.Utils.convertSecondsTimecode(c.currentTime));
				y._buildprogressbar.adjustCurrentAndHandleInSeek(c.currentTime / c.duration);
				// console.info(window.isQuality, window.skipIntroStatus, window.multiaudioStatus, window.subtitlesStatus)

				if (window.isQuality == true) {
					// console.log(window.isQuality, "quaility")
					window.isQuality = false
					c.currentTime = window.playbackTime
					updatePlaybackUI()
					ME.play()

				}
				else if (window.skipIntroStatus == true) {
					// console.log(window.skipIntroStatus, "hshshhshshsh")
					window.skipIntroStatus = false
					window.playbackTime = localStorage.getItem('endTime');
					$(".skipButton").hide();
					// updatePlaybackUI()
					ME.play()

				}
				else if (window.subtitlesStatus == true) {
					window.subtitlesStatus = false
				}
				else if (window.multiaudioStatus == true) {
					window.multiaudioStatus = false
				}

				else {
					if (y.fullControls.bottomControlBar.bottomPlayerControls.backgroundGradient.is(':hidden')) {

						if (ME.paused) {
							// console.log("hey the video is paused");
							ME.play();
							window.InstaPlayer.playerLayers.bigplay.show()
							window.InstaPlayer.playerLayers.bigplay.playPause.show()
							window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.progressbar.hide()
							window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.quality.hide()
							// console.log("1223123124332413434342314")
							window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.hide();
							// window.InstaPlayer.playerLayers.bigplay && window.InstaPlayer.playerLayers.bigplay.show();
							window.InstaPlayer.fullControls.bottomControlBar.hide();
							window.InstaPlayer.fullControls.bottomControlBar.videoTitle.hide()
							window.InstaPlayer.fullControls.bottomControlBar.secondaryTitle.hide()
							window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.slash.hide()
							window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.leftTime.hide()
							window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.rightTime.hide()
							// timeoutControls();
							// console.log("so iam playing the video");
							window.timeoutControls()
						}
						else if (!ME.paused) {
							// console.log("hey the video is playing");
							window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.progressbar.hide()
							window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.quality.hide()
							// console.log("1223123124332413434342314")
							window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.hide();
							// window.InstaPlayer.playerLayers.bigplay && window.InstaPlayer.playerLayers.bigplay.show();
							window.InstaPlayer.fullControls.bottomControlBar.hide();
							window.InstaPlayer.fullControls.bottomControlBar.videoTitle.hide()
							window.InstaPlayer.fullControls.bottomControlBar.secondaryTitle.hide()
							window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.slash.hide()
							window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.leftTime.hide()
							window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.rightTime.hide()
							ME.pause();

							window.InstaPlayer.playerLayers.bigplay.show()
							window.InstaPlayer.playerLayers.bigplay.playPause.show()
							// timeoutControls();
							window.timeoutControls()
							// console.log("so iam pausing the video");



						}
					}
				}


				// else if(){

				// }

			}






		},
		_buildqualityswitch: function () {
			SaranyuInstaPlayer.Utils.DLOG.INFO("Attaching Quality Selection Element");
			var r = this;
			r.mediaElement.videoElement;
			r.options;
			isSubtitlesAvailable = window.subtitleT
			console.log("isSubtitlesAvailable", isSubtitlesAvailable)


			var q = `
  <div style="display:none;" class="sp-button sp-quality-switch sp-quality-switch-wrap focusable">
    <button class="sp-quality-switch-btn focusable" 
            data-sn-up=".sp-progress-bar-handle" 
            data-sn-left="" 
            data-sn-right="" 
            data-sn-down=".sp-quality-switch-btn">
    </button>
    <div class="sp-selected-quality-btn" type="button">Quality</div>
    <div class="sp-quality-switch-main-popup-wrap">
      <h1 class="sp-quality-switch-main-popup-wrap-heading">Quality</h1>
      <div class="sp-quality-switch-main-popup-wrap-heading-img"></div>
    </div>
    <div id="SidebarQuality" class="sp-quality-switch-popup-wrap">
    </div>
  </div>`;
			r.fullControls.bottomControlBar.bottomPlayerControls.append(q);
			r.fullControls.bottomControlBar.bottomPlayerControls.quality = r.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-quality-switch-wrap");
			r.fullControls.bottomControlBar.bottomPlayerControls.quality.button = r.fullControls.bottomControlBar.bottomPlayerControls.quality.find(".sp-quality-switch-btn");
			r.fullControls.bottomControlBar.bottomPlayerControls.quality.mainpopup = r.fullControls.bottomControlBar.bottomPlayerControls.quality.find(".sp-quality-switch-main-popup-wrap")
			r.fullControls.bottomControlBar.bottomPlayerControls.quality.popup = r.fullControls.bottomControlBar.bottomPlayerControls.quality.find(".sp-quality-switch-popup-wrap");
			r._buildqualityswitch._buildQualityPopup = function (t) {

				"descend" == r.options.qualityswitch.order ? t.reverse() : t;
				function i(t) {


					t.find("button").on('sn:enter-down', function (event) {
						$('#playPauseCenterIcon').hide();
						handleQualityButtonEnter(event);
						$('#playPauseCenterIcon').hide();
					});

					t.find("button").on('click', function (event) {
						$('#playPauseCenterIcon').hide();
						handleQualityButtonEnter(event);
						$('#playPauseCenterIcon').hide();
					});

					function handleQualityButtonEnter(event) {
						window.isQuality = true
						//  r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide()
						r.fullControls.bottomControlBar.bottomPlayerControls.quality.mainpopup.hide()
						ME.play();
						// setQualityInactivity = setTimeout(function () {
						// 	r.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.hide();
						// }, 5000);
						var target = $(event.target);
						// console.log("target", target.text())
						var e = Number(target.attr("index"));
						var o = target.html();
						// $('.sp-selected-quality-btn').text(o);
						r.mediaElement.videoElement;

						if (r.playerType === "hls") {
							r.mediaElement.videoElement.hlsObj.currentLevel = e;
						}
						else if (r.playerType === "mpd") {
							if (e === -1) {
								// Enable automatic quality switching
								r.mediaElement.videoElement.dashObj.updateSettings({
									streaming: {
										abr: {
											autoSwitchBitrate: {
												video: true
											}
										}
									}
								});
							} else {
								// Disable auto quality and set manual quality
								r.mediaElement.videoElement.dashObj.updateSettings({
									streaming: {
										abr: {
											autoSwitchBitrate: {
												video: false
											}
										}
									}
								});

								console.log("Setting manual quality to index", e);
								r.mediaElement.videoElement.dashObj.setQualityFor("video", e);
							}
						}


						target.parent().parent().find(".active").removeClass("active").addClass("inactive");
						target.addClass("active").removeClass("inactive");
						r.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.hide();
						SaranyuInstaPlayer.Utils.DLOG.INFO("Quality Index Changed to " + e + " OR Label " + o);
						$('#playPauseCenterIcon').hide();
					}
				}
				var e, o;
				r.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.hide();
				r.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.empty();
				1 < t.length ? "mpd" == r.playerType ? $.each(t, function (t, e) {

					if (e.height != 144 && e.height != 360 && e.height != 576) {
						var o = "",
							l = r.options.qualityswitch.label,
							a = (e.bitrate / 1024).toFixed(0),
							n = '';

						if (e.height <= 240) {
							n = "Low";
						} else if (e.height <= 480) {
							n = "Medium";
						} else if (e.height == 720) {
							n = "HD";
						} else if (e.height == 1080) {
							n = "Full HD";
						} else if (e.height == 2160) {
							n = "4K"
						}
						r.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.children().length || (classActiveOrInactive = "active", o = "<div><button id='OFFQA' class='active focusable qualityitem' type='button' data-sn-left='' data-sn-right='' data-sn-up='' label=" + l + " index=" + -1 + ">" + l + "</button></div>"), "both" == r.options.qualityswitch.metric ? o += "<div><button class='inactive focusable qualityitem' type='button' label=" + a + " index=" + r.mediaElement.videoElement.dashObj.dashBitrate[t].qualityIndex + ">" + n + " / " + a + " Kbps" + "</button></div>" : "resolution" == r.options.qualityswitch.metric ? o += "<div><button class='inactive focusable qualityitem' type='button' label=" + a + " index=" + r.mediaElement.videoElement.dashObj.dashBitrate[t].qualityIndex + ">" + n + "</button></div>" : "bitrate" == r.options.qualityswitch.metric && (o += "<div><button class='inactive focusable qualityitem' type='button' label=" + a + " index=" + r.mediaElement.videoElement.dashObj.dashBitrate[t].qualityIndex + ">" + a + " Kbps</button></div>"),
							i(r.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.append(o))
					}
				}) : "hls" == r.playerType && $.each(t, function (t, e) {

					if (e.height != 144 && e.height != 360 && e.height != 576) {
						var o = "",
							l = r.options.qualityswitch.label,
							a = (e.bitrate / 1024).toFixed(0),
							n;
						// HD / 4K
						if (e.height <= 240) {
							n = "Low";
						} else if (e.height <= 480) {
							n = "Medium";
						} else if (e.height == 720) {
							n = "HD";
						} else if (e.height == 1080) {
							n = "Full HD";
						} else if (e.height == 2160) {
							n = "4K"
						}

						r.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.children().length || (classActiveOrInactive = "active",
							o = "<div><button id='OFFQA' class='active focusable qualityitem' type='button' data-sn-up='' data-sn-left='' data-sn-right='' label=" + l + " index=" + -1 + ">" + l + "</button></div>"),
							"both" == r.options.qualityswitch.metric ? o += "<div><button class='focusable qualityitem' data-sn-left='' data-sn-right='' type='button' label=" + a + " index=" + t + ">" + n + " / " + a + " Kbps" + "</button></div>" :
								"resolution" == r.options.qualityswitch.metric ? o += "<div><button class='focusable qualityitem'  data-sn-left='' data-sn-right='' type='button' label=" + a + " index=" + t + ">" + n + "</button></div>" :
									"bitrate" == r.options.qualityswitch.metric && (o += "<div><button class='focusable qualityitem' type='button' data-sn-left='' data-sn-right='' label=" + a + " index=" + t + ">" + a + " kbps</button></div>"),
							i(r.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.append(o))

					}
				}) : (SaranyuInstaPlayer.Utils.DLOG.INFO("Attaching Quality Switching Auto Only, If There Is Just One Quality"),
					o = r.options.qualityswitch.label, classActiveOrInactive = "active",
					e = "<div><button class='active focusable qualityitem' type='button' data-sn-left='' data-sn-right='' label=" + o + " index=" + -1 + ">" + o + "</button></div>",
					i(r.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.append(e)))
			};


			r.fullControls.bottomControlBar.bottomPlayerControls.quality.button.on('sn:enter-down', function (t) {
				$('#playPauseCenterIcon').hide();
				window.isQuality = true
				$(".sp-quality-switch-main-popup-wrap").show()

				try {
					// if (ME.paused) {
					// 	ME.play();
					// 	// console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx")
					// };
					0 < r.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.children().length ? (r.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.show(), ME.play(),
						$(r.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.children().children().last()[0]).attr("data-sn-down", ""),
						r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.hide(),
						r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide(), ME.play()) : r.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.hide();
					if (ME.paused) {
						// console.log("lllllllllllllllllllllll")
						ME.play();
					};
				} catch (t) { }
				setTimeout(function () {
					r.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.children().children('.active').focus();
				}, 50);
				if (r.options.playerType == "live") {
					setTimeout(function () {
						if (ME.paused) {
							ME.play();
							// alert("google")
						};
					}, 50);
				}
			})
			r.fullControls.bottomControlBar.bottomPlayerControls.quality.button.on('click', function (event) {
				window.isQuality = true
				$(".sp-quality-switch-main-popup-wrap").show()
				$('#playPauseCenterIcon').hide();
				toggleQualityPopup();
			});

			$('.sp-selected-quality-btn').on('click', function (event) {

				$('#playPauseCenterIcon').hide();
				toggleQualityPopup();
			});

			function toggleQualityPopup() {
				try {
					// if (ME.paused) {
					// 	ME.play();
					// }
					if (r.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.children().length > 0) {
						r.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.show();
						$(r.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.children().children().last()[0]).attr("data-sn-down", "");
						r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.hide();
						r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide();
					} else {
						r.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.hide();
					}
				} catch (error) {
					console.error(error);
				}
				setTimeout(function () {
					r.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.children().children('.active').focus();
				}, 50);
				if (r.options.playerType == "live") {
					setTimeout(function () {
						if (ME.paused) {
							ME.play();
						}
					}, 50);
				}
			}

			if (document.activeElement === r.fullControls.bottomControlBar.bottomPlayerControls.quality) {
				// console.log("The quality control is focused.");
			} else {
				// console.log("The quality control is not focused.");
			}



			// r.fullControls.bottomControlBar.bottomPlayerControls.quality.on('focus', function () {
			// 	if ($(this).is(':focus')) {
			// 		console.log("quality button focused....")
			// 		$('.sp-button').css({
			// 			'border': '2px solid red',
			// 			'outline': 'none'
			// 		});
			// 	}
			// });
			// r.fullControls.bottomControlBar.bottomPlayerControls.quality.on('blur', function () {
			// 	if (!$(this).is(':focus')) {
			// 		console.log("quality button blurrrr....")
			// 		$('.sp-button').css({
			// 			'border': 'none'
			// 		});
			// 	}
			// });

		},


		_buildmultiaudio: function () {
			var r = this;
			r.mediaElement.videoElement;
			r.options;
			window.subclickmultiaudio = false;
			localStorage.removeItem("subclickmultiaudio");
			var q = '<div  style="display:none"; class="sp-button sp-multiaudio-switch sp-multiaudio-switch-wrap focusable">\
						<button class="sp-multiaudio-switch-btn focusable" data-sn-up=".sp-progress-bar-handle" data-sn-left="" data-sn-right="" data-sn-down=".sp-smultiaudio-switch-btn">\
						</button>\
						<div class="sp-selected-multiaudio-btn" type="button">Audio</div>\
						<div id="SidebarMultiaudio" class="sp-multiaudio-switch-main-popup-wrap">\
						<h1 class="sp-multiaudio-switch-main-popup-wrap-heading">Audio</h1>\
						<div  class="sp-multiaudio-switch-main-popup-wrap-heading-img"></div>\
						</div>\
						<div class="sp-multiaudio-switch-popup-wrap">\
						</div>\
					</div>';



			function filterUniqueMultiaudio(multiaudio) {
				var uniqueMultiaudio = [];
				var seenNames = new Set();


				multiaudio.forEach(function (subtitle) {

					if (!seenNames.has(subtitle.name)) {
						uniqueMultiaudio.push(subtitle);
						seenNames.add(subtitle.name);
					} else if (!seenNames.has(subtitle.labels[0].text) && r.playerType == "mpd") {
						uniqueMultiaudio.push(subtitle);
						seenNames.add(subtitle.lang);
					}
				});





				return uniqueMultiaudio;
			}
			// if (r.mediaElement.videoElement.hlsObj.audioTracks.length > 0 || r.mediaElement.videoElement.dashObj.dashMultiaudio.length > 0) {
			r.fullControls.bottomControlBar.bottomPlayerControls.append(q);
			// }

			r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio = r.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-multiaudio-switch-wrap");
			r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.button = r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.find(".sp-multiaudio-switch-btn");
			//  r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.mainpopup=r.fullControls.bottomPlayerControls.bottomPlayerControls.subtitles.find(".sp-subtitles-switch-main-popup-wrap")
			r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup = r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.find(".sp-multiaudio-switch-popup-wrap");

			r._buildmultiaudio._buildMultiaudioPopup = function (t) {

				if (t.length == 1) {
					r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.remove()
				}

				function Sh(t) {
					t.find("button").off("click sn:enter-down");
					// Bind the click and sn:enter-down events
					t.find("button").on("click sn:enter-down", function (event) {
						// r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.hide()

						console.log("event", Number($(event.target).attr("index")))
						$('.sp-multiaudio-switch-main-popup-wrap').hide()
						r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.hide()
						var e = Number($(event.target).attr("index"));
						console.log("e", e)
						var o = $(event.target).html();

						// Disable the clicked button to prevent multiple clicks
						$(event.target).prop("disabled", true);
						// console.log(event, "trigger")

						// Toggle subtitles on/off based on the index
						console.log("hhhhhhh", r.playerType, e)
						function clearAllIntervalsAndTimeouts() {
							console.log("🧹 Clearing all active intervals and timeouts...");

							activeIntervals.forEach(intervalId => clearInterval(intervalId));
							activeTimeouts.forEach(timeoutId => clearTimeout(timeoutId));

							activeIntervals = [];
							activeTimeouts = [];
						}

						function fullyResetDashPlayer({ player, videoElement, sourceUrl, selectedAudioIndex }) {
							const currentTime = videoElement.currentTime || 0;
							const wasPlaying = !videoElement.paused && !videoElement.ended;
							const currentVolume = videoElement.volume;
							const currentMuted = videoElement.muted;

							// Clear all custom timers
							// clearAllIntervalsAndTimeouts();

							// Remove all player event listeners (optional, for safety)
							// player.destroy();
							localStorage.setItem("currentTimeMpd", ME.currentTime)
							player.reset();
							r.mediaElement.videoElement.src = ""
							player = null
							// player.attachSource(sourceUrl);
							window.trackChanged = true;
							localStorage.removeItem("trackChanged");
							setTimeout(() => {
								console.log("Resetting player with source URL:", sourceUrl);
								r._createAndAppendMedia._attachDashtoVideo();

								// You can optionally restore volume/muted/playback later inside STREAM_INITIALIZED
							}, 100);






						}

						if (r.playerType == "mpd") {
							if (e === -1) {
								ME.play();
								window.InstaPlayer.mediaElement.videoElement.dashObj.setTextTrack(-1);
							} else {
								const player = window.InstaPlayer.mediaElement.videoElement.dashObj;
								const videoElement = window.InstaPlayer.mediaElement.videoElement;
								const audioTracks = window.InstaPlayer.mediaElement.videoElement.dashObj.getTracksFor("audio");

								const selectedAudioIndex = parseInt(e);
								const selectedAudioTrack = audioTracks[selectedAudioIndex];
								console.log("Switching to audio track index:", selectedAudioIndex, "or label:", o);

								localStorage.setItem("selectedMultiaudioMpd", selectedAudioIndex);
								// window.InstaPlayer.mediaElement.videoElement.dashObj.setCurrentTrack(selectedAudioTrack);
								const playbackTime = window.playbackTime



								// window.InstaPlayer.mediaElement.videoElement.currentTime = window.playbackTime
								const newAudioTracks = r.mediaElement.videoElement.dashObj.getTracksFor("audio");
								if (newAudioTracks) {
									// ME.currentTime = parseInt(localStorage.getItem("currentTimeMpd"));
									const currentaudioTrack = newAudioTracks[localStorage.getItem("selectedMultiaudioMpd")]
									// console.log("tracks_chan", currentaudioTrack.role[0], currentaudioTrack.audioChannelConfiguration[0], audioChannelConfig, newAudioTracks[localStorage.getItem("selectedMultiaudioMpd")])
									// o.mediaElement.videoElement.dashObj.setInitialMediaSettingsFor("audio", {
									// 	lang: currentaudioTrack.lang, role: currentaudioTrack.role[0], audioChannelConfig: currentaudioTrack.audioChannelConfiguration[0]
									// })

									r.mediaElement.videoElement.dashObj.setCurrentTrack(newAudioTracks[localStorage.getItem("selectedMultiaudioMpd")]);
									ME.play()
								}
								// fullyResetDashPlayer({
								// 	player: window.InstaPlayer.mediaElement.videoElement.dashObj,
								// 	videoElement: window.InstaPlayer.mediaElement.videoElement,
								// 	sourceUrl: window.InstaPlayer.options.file[0].content_url,
								// 	selectedAudioIndex: parseInt(e)
								// });
								// ME.play()
								// 	const playbackTime = parseInt(window.playbackTime || 0);

								// 	// Reset the player
								// 	player.reset();

								// 	// Re-initialize the player
								// 	player.initialize(window.InstaPlayer.mediaElement.videoElement, window.InstaPlayer.options.file[0].content_url, true);
								// 	// ME.pause()

								// 	const onStreamInitialized = function () {
								// 		console.log("Stream initialized, seeking to saved time:", playbackTime);

								// 		const audioTracks = player.getTracksFor("audio");
								// 		const selectedAudioTrack = audioTracks[selectedAudioIndex];

								// 		if (selectedAudioTrack) {
								// 			console.log("Selecting audio track:", selectedAudioTrack);
								// 			player.setCurrentTrack(selectedAudioTrack);
								// 		} else {
								// 			console.warn("Selected audio track index not found");
								// 		}
								// 		console.log("window.playbackTime2121212", playbackTime)
								// 		// window.InstaPlayer._videoPlayerControls("seek",playbackTime);
								// 		//  videoElement.currentTime = playbackTime;

								// 		// Optional: Unmute or apply any UI logic here
								// 		// o._videoPlayerControls("unmute");
								// 		window.hideFullControls();

								// 		// Play the video after setting track and time
								// 		// ME.play();

								// 		// Remove the event listener to avoid duplicate triggers
								// 		// player.off(dashjs.MediaPlayer.events.STREAM_INITIALIZED, onStreamInitialized);
								// 	};

								// 	// Listen for stream initialization to set track and seek
								// 	player.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, onStreamInitialized);
								// }
							}
						}

						else if (r.playerType == "hls") {
							if (e === -1) {

								window.InstaPlayer.mediaElement.videoElement.hlsObj.audioTrack = -1;
								ME.play();
							} else {


								window.InstaPlayer.mediaElement.videoElement.hlsObj.audioTrack = e;
								ME.play();

							}
						}
						// Update the UI to reflect the active/inactive state
						$(event.target).parent().parent().find(".active").removeClass("active");
						$(event.target).addClass("active");

						// Hide the subtitles popup and resume playback
						r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.hide();


						// Show the subtitle switch button
						$(".sp-multiaudio-switch-btn").show();

						// Re-enable the button after 1 second
						setTimeout(function () {
							window.subclickmultiaudio = false;
							$(event.target).prop("disabled", false);
						}, 1000);

						// Log the subtitle change
						SaranyuInstaPlayer.Utils.DLOG.INFO("Subtitle Index Changed to " + e + " OR Label " + o.toUpperCase());
					}.bind(r));
				}

				r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.hide();
				r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.empty();

				// Check if there are subtitle tracks available for HLS
				if (r.playerType == "hls" && r.mediaElement.videoElement.hlsObj.audioTracks.length == 0) {
					r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.remove();
				}
				console.log("r.", r.playerType)
				if (r.playerType === "hls") {
					const uniqueMultiaudio = filterUniqueMultiaudio(t);

					if (uniqueMultiaudio.length > 0) {
						const createMultiaudioButton = (subtitle, index, isActive) => `
						<div>
							<button class="${isActive ? 'active focusable qualityitem' : 'focusable qualityitem'}"
								data-sn-left="" data-sn-right="" 
								type="button" label="${subtitle}"  index="${index}">
								${subtitle}
							</button>
						</div>`;
						uniqueMultiaudio.forEach((audio, index) => {
							console.log("audio", audio.default)

							// const subtitleName = subtitle.name.toLowerCase().replace(/^\w/, c => c.toUpperCase());
							// const isActive = localStorage.getItem("isPlayedfirstSubtitles") == "true";
							// console.log("Active	subtitle", localStorage.getItem("isPlayedfirstSubtitles") == "true", subtitle, isActive)
							// if (isActive) {
							// 	r.mediaElement.videoElement.hlsObj.subtitleDisplay = true;
							// 	r.mediaElement.videoElement.hlsObj.subtitleTrack = 0;

							// }

							const multiaudioButton = createMultiaudioButton(audio.name, index, audio.default);

							r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.append(multiaudioButton);
						});

						// Refresh the subtitles popup to reflect added buttons
						Sh(r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup);
					}
				}
				else if (r.playerType == "mpd") {
					const uniqueMultiaudio = filterUniqueMultiaudio(t);

					if (uniqueMultiaudio.length > 0) {
						const createMultiaudioButton = (subtitle, index, isActive) => `
						<div>
							<button class="${isActive || index == 0 ? 'active focusable qualityitem' : 'focusable qualityitem'}"
								data-sn-left="" data-sn-right="" 
								type="button" label="${subtitle}"  index="${index}">
								${subtitle == "DDP" ? "Dolby 5.1" : subtitle}
							</button>
						</div>`;
						uniqueMultiaudio.forEach((audio, index) => {

							console.log("audio", audio.default)
							// const subtitleName = subtitle.name.toLowerCase().replace(/^\w/, c => c.toUpperCase());
							// const isActive = localStorage.getItem("isPlayedfirstSubtitles") == "true";
							// console.log("Active	subtitle", localStorage.getItem("isPlayedfirstSubtitles") == "true", subtitle, isActive)
							// if (isActive) {
							// 	r.mediaElement.videoElement.hlsObj.subtitleDisplay = true;
							// 	r.mediaElement.videoElement.hlsObj.subtitleTrack = 0;
							// }

							const multiaudioButton = createMultiaudioButton(r.playerType == "mpd" ? audio.labels[0].text : audio.name, index, audio.default);

							r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.append(multiaudioButton);
						});

						// Refresh the subtitles popup to reflect added buttons
						Sh(r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup);
					}
				}
			}

			r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.button.on('click', function () {
				ME.pause()
				$(".sp-multiaudio-switch-main-popup-wrap").show()

				// window.subtitlesStatus = true
				// $('.sp-subtitles-switch-main-popup-wrap').hide()
				r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.hide()

				if (r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.children().length > 0) {
					r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.toggle();
					// r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.mainpopup.toggle()

					// Add 'focusable' class to all buttons in the popup
					r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.find("button").addClass("focusable");

					// Focus on the first button in the subtitles popup
					setTimeout(function () {
						r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.find("button").first().focus();
					}, 50);
				} else {
					r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.hide();
					// r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.mainpopup.hide()
				}
			}.bind(r));

			// sn:enter-down event for toggling subtitles and focusing first button
			r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.button.on('sn:enter-down', function () {
				ME.pause()
				$(".sp-multiaudio-switch-main-popup-wrap").show()
				window.multiaudioStatus = true
				if (!window.subclickmultiaudio || window.subclickmultiaudio == "false") {

					if (r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.children().length > 0) {
						r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.toggle();
						// r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.mainpopup.toggle()

						// Add 'focusable' class to all buttons in the popup
						r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.find("button").addClass("focusable");

						// Focus on the first button in the subtitles popup
						setTimeout(function () {

							r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.find("button").first().focus();
						}, 50);
					} else {

						r.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.hide();
						// r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.mainpopup.hide()
					}
				}
			}.bind(r));
		},

		// _buildsubtitles: function () {
		// 	var r = this;

		// 	// Filter unique subtitles logic
		// 	function filterUniqueSubtitles(subtitles) {
		// 		var uniqueSubtitles = [];
		// 		var seenNames = new Set();

		// 		subtitles.forEach(function (subtitle) {
		// 			if (!seenNames.has(subtitle.name)) {
		// 				uniqueSubtitles.push(subtitle);
		// 				seenNames.add(subtitle.name);
		// 			}
		// 		});

		// 		return uniqueSubtitles;
		// 	}

		// 	// Initialize subtitles state
		// 	function initializeSubtitles() {
		// 		const isPlayedfirstSubtitles = localStorage.getItem("isPlayedfirstSubtitles") === "true";
		// 		const currentSubtitles = parseInt(localStorage.getItem("currentSubtitles"), 10);

		// 		if (isPlayedfirstSubtitles && currentSubtitles >= 0) {
		// 			r.mediaElement.videoElement.hlsObj.subtitleDisplay = true;
		// 			r.mediaElement.videoElement.hlsObj.subtitleTrack = currentSubtitles;
		// 			console.info(`Subtitles initialized to track: ${currentSubtitles}`);
		// 		} else {
		// 			r.mediaElement.videoElement.hlsObj.subtitleDisplay = false;
		// 			r.mediaElement.videoElement.hlsObj.subtitleTrack = -1;
		// 			console.info(`Subtitles disabled.`);
		// 		}

		// 		// Update UI to reflect subtitle state
		// 		const subtitleIndex = currentSubtitles >= 0 ? currentSubtitles : -1;
		// 		$(".sp-subtitles-switch-popup-wrap button").removeClass("active");
		// 		$(`.sp-subtitles-switch-popup-wrap button[index='${subtitleIndex}']`).addClass("active");
		// 	}

		// 	// Create subtitle switch button


		// 		// var q = '<div  style="display:none"; class="sp-button sp-subtitles-switch sp-subtitles-switch-wrap focusable">\
		// 		// 		<button class="sp-subtitles-switch-btn focusable" data-sn-up=".sp-progress-bar-handle" data-sn-left="" data-sn-right="" data-sn-down=".sp-subtitles-switch-btn">\
		// 		// 		</button>\
		// 		// 		<div class="sp-selected-subtitles-btn" type="button">Subtitles</div>\
		// 		// 		<div  id="SidebarSubtitles" class="sp-subtitles-switch-main-popup-wrap">\
		// 		// 		<h1 class="sp-subtitles-switch-main-popup-wrap-heading">Subtitles</h1>\
		// 		// 		<div  class="sp-subtitles-switch-main-popup-wrap-heading-img"></div>\
		// 		// 		</div>\
		// 		// 		<div  style="display:none"; class="sp-subtitles-switch-popup-wrap">\
		// 		// 		</div>\
		// 		// 	</div>';

		// 			var q = '<div  style="display:none"; class="sp-button sp-subtitles-switch sp-subtitles-switch-wrap focusable">\
		// 				<button class="sp-subtitles-switch-btn focusable" data-sn-up=".sp-progress-bar-handle" data-sn-left="" data-sn-right="" data-sn-down=".sp-subtitles-switch-btn">\
		// 				</button>\
		// 				<div class="sp-selected-subtitles-btn" type="button">Subtitles</div>\
		// 				<div id="SidebarMultiaudio" class="sp-subtitles-switch-main-popup-wrap">\
		// 				<h1 class="sp-subtitles-switch-main-popup-wrap-heading">Subtitles</h1>\
		// 				<div  class="sp-subtitles-switch-main-popup-wrap-heading-img"></div>\
		// 				</div>\
		// 				<div class="sp-subtitles-switch-popup-wrap">\
		// 				</div>\
		// 			</div>';

		// 	r.fullControls.bottomControlBar.bottomPlayerControls.append(q);
		// 	r.fullControls.bottomControlBar.bottomPlayerControls.subtitles = r.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-subtitles-switch-wrap");
		// 	r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.button = r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.find(".sp-subtitles-switch-btn");
		// 	r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup = r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.find(".sp-subtitles-switch-popup-wrap");

		// 	r._buildsubtitles._buildSubtitlesPopup = function (t) {
		// 		function Sh(t) {
		// 			t.find("button").off("click sn:enter-down");
		// 			t.find("button").on("click sn:enter-down", function (event) {
		// 				$('.sp-subtitles-switch-main-popup-wrap').hide();


		// 				r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide();
		// 				var e = Number($(event.target).attr("index"));
		// 				var o = $(event.target).html();

		// 				$(event.target).prop("disabled", true);

		// 				if (e === -1) {
		// 					localStorage.setItem("isPlayedfirstSubtitles", "false");
		// 					localStorage.setItem("currentSubtitles", e);
		// 					r.mediaElement.videoElement.hlsObj.subtitleDisplay = false;
		// 					r.mediaElement.videoElement.hlsObj.subtitleTrack = -1;
		// 				} else {
		// 					ME.play()
		// 					localStorage.setItem("isPlayedfirstSubtitles", "true");
		// 					localStorage.setItem("currentSubtitles", e);
		// 					r.mediaElement.videoElement.hlsObj.subtitleDisplay = true;
		// 					r.mediaElement.videoElement.hlsObj.subtitleTrack = e;
		// 				}

		// 				$(event.target).parent().parent().find(".active").removeClass("active");
		// 				$(event.target).addClass("active");

		// 				r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide();
		// 				ME.play();

		// 				setTimeout(function () {
		// 					localStorage.setItem("subclick", false);
		// 					$(event.target).prop("disabled", false);
		// 				}, 1000);

		// 				SaranyuInstaPlayer.Utils.DLOG.INFO("Subtitle Index Changed to " + e + " OR Label " + o.toUpperCase());
		// 			}.bind(r));
		// 		}


		// 		r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.empty();
		// 		if (r.playerType == "hls" && r.mediaElement.videoElement.hlsObj.subtitleTracks.length == 0) {
		// 			r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.remove();
		// 		}

		// 		if (r.playerType === "hls") {
		// 			const uniqueSubtitles = filterUniqueSubtitles(t);
		// 			if (uniqueSubtitles.length > 0) {
		// 				const isActive = localStorage.getItem("isPlayedfirstSubtitles") === "true";
		// 				const offButtonClass = isActive ? 'focusable qualityitem' : "active focusable qualityitem";
		// 				const offButton = `
		// 					<div>
		// 						<button class="${offButtonClass}"  data-sn-left="" data-sn-right=""  type="button" label="Off" index="-1">Off</button>
		// 					</div>`;

		// 				r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.append(offButton);
		// 				Sh(r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup);

		// 				uniqueSubtitles.forEach((subtitle, index) => {
		// 					const subtitleName = subtitle.name.toLowerCase().replace(/^\w/, c => c.toUpperCase());
		// 					const subtitleButton = `
		// 						<div>
		// 							<button class="${isActive ? 'active focusable qualityitem' : 'focusable qualityitem'}" 
		// 								type="button" label="${subtitleName}" data-sn-left="" data-sn-right="" index="${index}">
		// 								${subtitleName}
		// 							</button>
		// 						</div>`;
		// 					r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.append(subtitleButton);
		// 				});

		// 				Sh(r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup);
		// 			}
		// 		}
		// 	};

		// 	r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.button.on('click', function () {
		// 		$(".sp-subtitles-switch-main-popup-wrap").show()
		// 		console.log(r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.children().length,"hiiii")

		// 		// window.subtitlesStatus = true
		// 		// $('.sp-subtitles-switch-main-popup-wrap').hide()


		// 		if (r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.children().length > 0) {
		// 			r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.toggle();
		// 			// r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.mainpopup.toggle()

		// 			// Add 'focusable' class to all buttons in the popup
		// 			r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.find("button").addClass("focusable");

		// 			// Focus on the first button in the subtitles popup
		// 			setTimeout(function () {
		// 				r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.find("button").first().focus();
		// 			}, 50);
		// 		} else {
		// 			r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide();
		// 			// r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.mainpopup.hide()
		// 		}
		// 	}.bind(r));

		// 	// sn:enter-down event for toggling subtitles and focusing first button
		// 	r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.button.on('sn:enter-down', function () {
		// 		window.subtitlesStatus = true

		// 		$(".sp-subtitles-switch-main-popup-wrap").show()


		// 		console.log(window.subtitlesStatus == true)
		// 		if (localStorage.getItem("subclick") === "false") {

		// 			if (r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.children().length > 0) {
		// 				$(".sp-subtitles-switch-main-popup-wrap").show()
		// 				console.info(r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup ,"hhh")
		// 				r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.toggle();
		// 				// r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.mainpopup.toggle()

		// 				// Add 'focusable' class to all buttons in the popup
		// 				r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.find("button").addClass("focusable");

		// 				// Focus on the first button in the subtitles popup
		// 				setTimeout(function () {
		// 					r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.find("button").first().focus();
		// 				}, 50);
		// 			} else {

		// 				r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide();
		// 				// r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.mainpopup.hide()
		// 			}
		// 		}
		// 	}.bind(r));

		// 	// Initialize subtitles when the player is loaded
		// 	initializeSubtitles();

		// 	// Handle subtitle tracks update for HLS
		// 	r.mediaElement.videoElement.hlsObj.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, function () {
		// 		initializeSubtitles();
		// 	});
		// },

		// old version
		_buildsubtitles: function () {
			var r = this;
			r.mediaElement.videoElement;
			r.options;
			window.subclick = false;
			localStorage.removeItem("subclick");
			localStorage.removeItem("isPlayedfirstSubtitles");
			localStorage.removeItem("currentSubtitles");
			localStorage.removeItem("subtitles_language");
			window.isPlayedfirstSubtitles = false;
			window.currentSubtitles = -1;

			function filterUniqueSubtitlesDash(tracks) {
				var subtitleTracks = [];
				if (!tracks || !tracks.length) return subtitleTracks;
				for (var i = 0; i < tracks.length; i++) {
					subtitleTracks.push(tracks[i]);
				}
				return subtitleTracks;
			}

			// Filter unique subtitles logic
			function filterUniqueSubtitles(subtitles) {
				var uniqueSubtitles = [];
				if (!subtitles || !subtitles.length) return uniqueSubtitles;
				var seenNames = {};

				for (var i = 0; i < subtitles.length; i++) {
					var subtitle = subtitles[i];
					var name = subtitle && subtitle.name ? subtitle.name : "";
					if (name && !seenNames[name]) {
						uniqueSubtitles.push(subtitle);
						seenNames[name] = true;
					}
				}
				return uniqueSubtitles;
			}

			// Create subtitle switch button
			var q = '<div style="display:none;" class="sp-button sp-subtitles-switch sp-subtitles-switch-wrap focusable">\
						<button class="sp-subtitles-switch-btn focusable" data-sn-up=".sp-progress-bar-handle" data-sn-left=".sp-quality-switch-btn" data-sn-right="" data-sn-down=".sp-subtitles-switch-btn">\
						</button>\
						<div class="sp-selected-subtitles-btn" type="button">Subtitles</div>\
						<div id="SidebarSubtitles" class="sp-subtitles-switch-main-popup-wrap">\
						<h1 class="sp-subtitles-switch-main-popup-wrap-heading">Subtitles</h1>\
						<div class="sp-subtitles-switch-main-popup-wrap-heading-img"></div>\
						</div>\
						<div class="sp-subtitles-switch-popup-wrap">\
						</div>\
					</div>';

			r.fullControls.bottomControlBar.bottomPlayerControls.append(q);
			r.fullControls.bottomControlBar.bottomPlayerControls.subtitles = r.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-subtitles-switch-wrap");
			r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.button = r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.find(".sp-subtitles-switch-btn");
			r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup = r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.find(".sp-subtitles-switch-popup-wrap");

			// Subtitle toggle logic
			r._buildsubtitles._buildSubtitlesPopup = function (t) {
				if (!t || t.length == 0) {
					if (r.fullControls && r.fullControls.bottomControlBar && r.fullControls.bottomControlBar.bottomPlayerControls && r.fullControls.bottomControlBar.bottomPlayerControls.subtitles) {
						r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.hide();
					}
					return;
				}

				function Sh(popupEl) {
					popupEl.find("button").off("click sn:enter-down");
					// Bind the click and sn:enter-down events
					popupEl.find("button").on("click sn:enter-down", function (event) {
						$('.sp-subtitles-switch-main-popup-wrap').hide();
						r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide();
						var target = $(event.target);
						var e = Number(target.attr("index"));
						var o = target.html();
						window.subtitles_language = target.text();

						// Disable the clicked button to prevent multiple clicks
						target.prop("disabled", true);
						if (r.playerType == "mpd") {
							var dashObj = (window.InstaPlayer && window.InstaPlayer.mediaElement && window.InstaPlayer.mediaElement.videoElement) ? window.InstaPlayer.mediaElement.videoElement.dashObj : null;
							if (e == -1) {
								window.isPlayedfirstSubtitles = false;
								window.currentSubtitles = e;
								if (dashObj) {
									dashObj.enableText(false);
									dashObj.setTextTrack(-1);
								}
							} else {
								window.isPlayedfirstSubtitles = true;
								window.currentSubtitles = e;
								if (dashObj) {
									dashObj.enableText(true);
									dashObj.setTextTrack(e);
								}
							}
						}
						if (r.playerType == "hls") {
							var hlsObj = (window.InstaPlayer && window.InstaPlayer.mediaElement && window.InstaPlayer.mediaElement.videoElement) ? window.InstaPlayer.mediaElement.videoElement.hlsObj : null;
							if (e === -1) {
								window.isPlayedfirstSubtitles = false;
								window.currentSubtitles = e;
								if (hlsObj) {
									hlsObj.subtitleDisplay = false;
									hlsObj.subtitleTrack = -1;
								}
							} else {
								window.isPlayedfirstSubtitles = true;
								window.currentSubtitles = e;
								if (hlsObj) {
									hlsObj.subtitleDisplay = true;
									hlsObj.subtitleTrack = e;
								}
							}
						}

						// Update the UI to reflect the active/inactive state
						target.parent().parent().find(".active").removeClass("active");
						target.addClass("active");

						// Hide the subtitles popup and resume playback
						r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide();
						ME.play();

						// Show the subtitle switch button
						$(".sp-subtitles-switch-btn").show();

						// Re-enable the button after 1 second
						setTimeout(function () {
							window.subclick = false;
							target.prop("disabled", false);
						}, 1000);

						// Log the subtitle change
						SaranyuInstaPlayer.Utils.DLOG.INFO("Subtitle Index Changed to " + e + " OR Label " + (o ? o.toUpperCase() : ""));
					}.bind(r));
				}

				// Hide and clear the subtitles popup before rebuilding it
				r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide();
				r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.empty();

				var isSubActive = (window.isPlayedfirstSubtitles === true);
				var savedIndex = (typeof window.currentSubtitles === "number") ? window.currentSubtitles : -1;

				var tracksToBuild = (r.playerType === "mpd") ? filterUniqueSubtitlesDash(t) : filterUniqueSubtitles(t);

				if (tracksToBuild.length > 0) {
					var offActiveClass = (!isSubActive || savedIndex === -1) ? "active " : "";
					var offButton = '<div>' +
						'<button class="' + offActiveClass + 'focusable qualityitem" data-sn-left="" data-sn-right="" type="button" label="Off" index="-1">' +
						'Off' +
						'</button>' +
						'</div>';

					r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.append(offButton);

					for (var j = 0; j < tracksToBuild.length; j++) {
						var item = tracksToBuild[j];
						var label = (r.playerType === "mpd") ? (item.lang || item.label || "") : (item.name || "");
						if (label) {
							label = label.toLowerCase();
							label = label.charAt(0).toUpperCase() + label.slice(1);
						} else {
							label = "Track " + (j + 1);
						}
						var isTrackActive = (isSubActive && savedIndex === j);
						var btnClass = (isTrackActive ? "active " : "") + "focusable qualityitem";
						var subtitleButton = '<div>' +
							'<button class="' + btnClass + '" data-sn-left="" data-sn-right="" data-sn-down="" type="button" label="' + label + '" index="' + j + '">' +
							label +
							'</button>' +
							'</div>';

						r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.append(subtitleButton);
					}

					Sh(r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup);
				}
			};

			// Handle click and sn:enter-down events
			r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.button.on('click', function () {
				$(".sp-subtitles-switch-main-popup-wrap").show();
				r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide();

				if (r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.children().length > 0) {
					r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.show();
					r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.find("button").addClass("focusable");
					setTimeout(function () {
						var activeBtn = r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.find("button.active");
						if (activeBtn.length > 0) {
							activeBtn.first().focus();
						} else {
							r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.find("button").first().focus();
						}
					}, 50);
				} else {
					r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide();
				}
			}.bind(r));

			// sn:enter-down event for toggling subtitles and focusing active button
			r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.button.on('sn:enter-down', function () {
				ME.pause();
				window.subtitlesStatus = true;
				$(".sp-subtitles-switch-main-popup-wrap").show();

				if (!window.subclick || window.subclick === "false") {
					if (r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.children().length > 0) {
						r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.show();
						r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.find("button").addClass("focusable");
						setTimeout(function () {
							var activeBtn = r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.find("button.active");
							if (activeBtn.length > 0) {
								activeBtn.first().focus();
							} else {
								r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.find("button").first().focus();
							}
						}, 50);
					} else {
						r.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide();
					}
				}
			}.bind(r));

			function initializeSubtitles() {
				if (!r.mediaElement || !r.mediaElement.videoElement) return;

				var isPlayedfirstSubtitles = (window.isPlayedfirstSubtitles === true);
				var currentSubtitles = (typeof window.currentSubtitles === "number") ? window.currentSubtitles : -1;

				if (r.playerType === "hls") {
					var hls = r.mediaElement.videoElement.hlsObj;
					if (hls) {
						var hlsTracks = hls.subtitleTracks || [];
						if (isPlayedfirstSubtitles && currentSubtitles >= 0 && currentSubtitles < hlsTracks.length) {
							hls.subtitleDisplay = true;
							hls.subtitleTrack = currentSubtitles;
						} else {
							hls.subtitleDisplay = false;
							hls.subtitleTrack = -1;
							currentSubtitles = -1;
						}
					}
				} else if (r.playerType === "mpd") {
					var dash = r.mediaElement.videoElement.dashObj;
					if (dash) {
						var dashTracks = dash.textTracks || [];
						if (isPlayedfirstSubtitles && currentSubtitles >= 0 && currentSubtitles < dashTracks.length) {
							dash.enableText(true);
							dash.setTextTrack(currentSubtitles);
						} else {
							dash.enableText(false);
							dash.setTextTrack(-1);
							currentSubtitles = -1;
						}
					}
				}

				// Update UI to reflect subtitle state
				var subtitleIndex = (isPlayedfirstSubtitles && currentSubtitles >= 0) ? currentSubtitles : -1;
				$(".sp-subtitles-switch-popup-wrap button").removeClass("active");
				$(".sp-subtitles-switch-popup-wrap button[index='" + subtitleIndex + "']").addClass("active");
			}

			initializeSubtitles();
			if (r.playerType === "hls" && r.mediaElement && r.mediaElement.videoElement && r.mediaElement.videoElement.hlsObj) {
				r.mediaElement.videoElement.hlsObj.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, function () {
					initializeSubtitles();
				});
			}
		},






		// _buildsubtitles: function () {
		// 	SaranyuInstaPlayer.Utils.DLOG.INFO("Attaching Multi Subtitle Selection Element");
		// 	var i = this;
		// 	i.mediaElement.videoElement;
		// 	i.options;
		// 	localStorage.setItem("subclick",false)
		// 	function filterUniqueSubtitles(subtitles) {
		// 		var uniqueSubtitles = [];
		// 		var seenNames = new Set();

		// 		// Loop through the subtitles array and add only unique names
		// 		subtitles.forEach(function(subtitle) {
		// 			if (!seenNames.has(subtitle.name)) {
		// 				uniqueSubtitles.push(subtitle);
		// 				seenNames.add(subtitle.name);
		// 			}
		// 		});

		// 		return uniqueSubtitles;
		// 	}
		// 	// if (i.playerType == "hls" && i.mediaElement.videoElement.hlsObj.subtitleTracks.length < 1){
		// 	var s = '<div class="sp-button sp-subtitles-switch-wrap focusable"><span class="tooltiptext">' + "off" + '</span><button class="sp-subtitles-switch-btn" data-sn-left="sp-nextepisode-switch-btn" data-sn-right=".sp-controls-top-play-from-beginning"></button><div class="tooltext" style="display: none;">Subtitle</div> <div class="sp-subtitles-switch-popup-wrap"><div class="Subtitle-text">Subtitles</div><div class="outer"></div></div></div>';
		// 	i.fullControls.topControlBar.append(s);
		// 	i.fullControls.topControlBar.subtitles = i.fullControls.topControlBar.find(".sp-subtitles-switch-wrap");
		// 	i.fullControls.topControlBar.subtitles.button = i.fullControls.topControlBar.subtitles.find(".sp-subtitles-switch-btn");
		// 	i.fullControls.topControlBar.subtitles.popup = i.fullControls.topControlBar.subtitles.find(".sp-subtitles-switch-popup-wrap");
		// 	i.fullControls.topControlBar.subtitles.outer=i.fullControls.topControlBar.subtitles.find(".outer")
		// 	// $("#playPauseCenterIcon").attr("data-sn-up", ".sp-subtitles-switch-btn")
		// 	i._buildsubtitles._buildSubtitlesPopup = function (t) {
		// 		function Sh(t) {
		// 			t.find("button").unbind().click(function (t) {
		// 				i.mediaElement.videoElement.hlsObj.subtitleDisplay = true;
		// 				var e = Number($(t.target).attr("index"));
		// 				var o = $(t.target).html();
		// 				i.mediaElement.videoElement;
		// 				i.mediaElement.videoElement.hlsObj.subtitleTrack = e;
		// 				$(t.target).parent().parent().find(".active").removeClass("active").addClass("inactive");
		// 				$(t.target).addClass("active").removeClass("inactive");
		// 				i.fullControls.topControlBar.subtitles.popup.hide();
		// 				ME.play()
		// 				$(".sp-subtitles-switch-btn").show();
		// 				$(".sp-controls-top-play-from-beginning").show();
		// 				setTimeout(function() {
		// 					localStorage.setItem("subclick",false)
		// 				}, 1000);
		// 				SaranyuInstaPlayer.Utils.DLOG.INFO("Subtitle Index Changed to " + e + " OR Label " + o.toUpperCase())
		// 			}.bind(i));
		// 			t.find("button").unbind().on("sn:enter-down",function (t) {
		// 				i.mediaElement.videoElement.hlsObj.subtitleDisplay = true;
		// 				localStorage.setItem("subclick",true)
		// 				var e = Number($(t.target).attr("index"));
		// 				var o = $(t.target).html();
		// 				i.mediaElement.videoElement;
		// 				i.mediaElement.videoElement.hlsObj.subtitleTrack = e;
		// 				$(t.target).parent().parent().find(".active").removeClass("active").addClass("inactive");
		// 				$(t.target).addClass("active").removeClass("inactive");
		// 				i.fullControls.topControlBar.subtitles.popup.hide();
		// 				ME.play()
		// 				$(".sp-subtitles-switch-btn").show();
		// 				$(".sp-controls-top-play-from-beginning").show();
		// 				setTimeout(function() {
		// 					localStorage.setItem("subclick",false)
		// 				}, 1000);
		// 				SaranyuInstaPlayer.Utils.DLOG.INFO("Subtitle Index Changed to " + e + " OR Label " + o.toUpperCase())
		// 			}.bind(i));
		// 		}
		// 		function Sd(t) {
		// 			t.find("button").unbind().click(function (t) {
		// 				var e = Number($(t.target).attr("index"));
		// 				var o = $(t.target).html();
		// 				i.mediaElement.videoElement;
		// 				i.mediaElement.videoElement.dashObj.setTextTrack(e);
		// 				$(t.target).parent().parent().find(".active").removeClass("active").addClass("inactive");
		// 				$(t.target).addClass("active").removeClass("inactive");
		// 				i.fullControls.topControlBar.subtitles.popup.hide();
		// 				ME.play()
		// 				$(".sp-subtitles-switch-btn").show();
		// 				$(".sp-controls-top-play-from-beginning").show();
		// 				setTimeout(function() {
		// 					localStorage.setItem("subclick",false)
		// 				}, 1000);
		// 				SaranyuInstaPlayer.Utils.DLOG.INFO("Subtitle Index Changed to " + e + " OR Label " + o.toUpperCase());
		// 			}.bind(i));
		// 		}
		// 		var n;
		// 		i.fullControls.topControlBar.subtitles.popup.hide();
		// 		i.fullControls.topControlBar.subtitles.outer.empty();

		// 		if (i.playerType == "hls" && i.mediaElement.videoElement.hlsObj.subtitleTracks.length < 1) {
		// 			i.fullControls.topControlBar.subtitles.remove();
		// 		}
		// 		else if (i.playerType == "mpd" && i.mediaElement.videoElement.textTracks.length < 1) {
		// 			i.fullControls.topControlBar.subtitles.remove();
		// 		}
		// 		if (i.playerType == "hls") {
		// 			// alert("hls")
		// 			// console.log("xxxxxxxxxxxxxxxxxxxx",dummyNames[0].groupId),
		// 			// 0 < dummyNames.length && (n = dummyNames[0].groupId, $.each(dummyNames, function (t, e) {
		// 			// 	var o = "";
		// 			// 	l = SaranyuInstaPlayer.defaultOptions.titleStrings.subtitles;
		// 			// 	a = e.name;
		// 			// 	// e.groupId == n && (i.fullControls.topControlBar.subtitles.popup.children().length || (classActiveOrInactive = "active", o = "<div><button class=active type='button' data-sn-up='' data-sn-left='' data-sn-down='' label=" + l + " index=-1>" + l + "</button></div>"), o += "<div><button class=inactive type='button' data-sn-up='' data-sn-left='' data-sn-down='' label=" + a + " index=" + t + ">" + a + "</button></div>",
		// 			// 	// 	Sh(i.fullControls.topControlBar.subtitles.popup.append(o)));
		// 			// 	e.groupId == n && (i.fullControls.topControlBar.subtitles.outer.children().length || (classActiveOrInactive = "active", o = "<div><button class=active type='button' data-sn-up='.inactive' data-sn-left='' data-sn-down='.inactive' label=" + l + " index=-1>" + l + "</button></div>"), o += "<div><button class=inactive type='button' data-sn-up='.active , .inactive' data-sn-left='' data-sn-down='.active,.inactive' label=" + a + " index=" + t + ">" + a + "</button></div>",
		// 			// 		Sh(i.fullControls.topControlBar.subtitles.outer.append(o)));
		// 			// 		// $('.outer>button').eq(0).focus();
		// 			// }));
		// 			var uniqueSubtitles = filterUniqueSubtitles(t);
		// 			0 < uniqueSubtitles.length && (n = uniqueSubtitles[0].groupId, $.each(uniqueSubtitles, function (t, e) {
		// 				var o = "";
		// 				l = SaranyuInstaPlayer.defaultOptions.titleStrings.subtitles;
		// 				a = e.name;
		// 				e.groupId == n && (i.fullControls.topControlBar.subtitles.outer.children().length || (classActiveOrInactive = "active", o = "<div><button class=active type='button' label=" + l + " index=-1>" + l + "</button></div>"), o += "<div><button class=inactive type='button' label=" + a + " index=" + t + ">" + a + "</button></div>",
		// 					Sh(i.fullControls.topControlBar.subtitles.outer.append(o)));
		// 			}));
		// 		}
		// 		else if (i.playerType == "mpd") {
		// 			// alert("mpd")
		// 			var uniqueSubtitles = filterUniqueSubtitles(t);
		// 			0 < uniqueSubtitles.length && (n = uniqueSubtitles[0].language, $.each(uniqueSubtitles, function (t, e) {
		// 				var o = "";
		// 				l = SaranyuInstaPlayer.defaultOptions.titleStrings.subtitles;
		// 				a = e.language;
		// 				e.language == a && (i.fullControls.topControlBar.subtitles.outer.children().length || (classActiveOrInactive = "active", o = "<div><button class='active focusable' type='button' data-sn-up='' data-sn-left='' data-sn-down='' label=" + l + " index= -1>" + l + "</button></div>"), o += "<div><button class='inactive focusable' type='button' data-sn-up='' data-sn-left='' data-sn-down='' label=" + a + " index= " + t + ">" + a + "</button></div>",
		// 					Sd(i.fullControls.topControlBar.subtitles.outer.append(o)));
		// 			}));
		// 		}
		// 	};
		// 	i.fullControls.topControlBar.on('click', '.sp-button.sp-subtitles-switch-wrap', function () {
		// 		ME.pause();
		// 		$(".sp-controls-top-play-from-beginning").hide();
		// 		$(".sp-subtitles-switch-btn").hide();
		// 		$(".sp-nextepisode-switch-wrap").hide();
		// 		$(".sp-nextepisode-switch-btn").hide();
		// 		// i._buildsubtitles._buildSubtitlesPopup(i.mediaElement.videoElement.hlsObj.subtitleTracks)
		// 		0 < i.fullControls.topControlBar.subtitles.outer.children().length ? (i.fullControls.topControlBar.subtitles.popup.toggle()) : i.fullControls.topControlBar.subtitles.popup.hide()
		// 		setTimeout(function() {
		// 			$('.active').focus();
		// 		}, 50);
		// 	}.bind(i));
		// 	i.fullControls.topControlBar.on('sn:enter-down', '.sp-button.sp-subtitles-switch-wrap', function () {
		// 		if(localStorage.getItem("subclick")=="false"){
		// 			ME.pause();
		// 			$(".sp-controls-top-play-from-beginning").hide();
		// 			$(".sp-subtitles-switch-btn").hide();
		// 			// i._buildsubtitles._buildSubtitlesPopup(i.mediaElement.videoElement.hlsObj.subtitleTracks)
		// 			0 < i.fullControls.topControlBar.subtitles.popup.children().length ? (i.fullControls.topControlBar.subtitles.popup.toggle()) : i.fullControls.topControlBar.subtitles.popup.hide()
		// 			setTimeout(function() {
		// 				$('.active').focus();
		// 			}, 50);
		// 		}
		// 	}.bind(i));
		// 	i.playerInner.click(function (event) {
		// 		if (!$(event.target).closest('.sp-subtitles-switch-wrap').length && !$(event.target).is('.sp-subtitles-switch-wrap')) {
		// 			$(".sp-subtitles-switch-popup-wrap").hide();
		// 			$(".sp-subtitles-switch-btn").show();
		// 			$(".sp-nextepisode-switch-wrap").show();
		// 			$(".sp-nextepisode-switch-btn").show();

		// 		}
		// 	});
		// 	$('.sp-button.sp-subtitles-switch-wrap').attr("data-sn-left",".sp-nextepisode-switch-btn")
		// 	$('.sp-button.sp-subtitles-switch-wrap').attr("data-sn-down","#playPauseCenterIcon")
		// 	$('.outer').on('keydown', '.active , .inactive', function (e) {

		// 		// Left arrow key
		// 		if (e.keyCode === 37) {
		// 			$('.sp-subtitles-switch-popup-wrap').hide();
		// 			$('.sp-subtitles-switch-btn').show();
		// 			$(".sp-nextepisode-switch-wrap").show();
		// 			$('.sp-nextepisode-switch-btn').show();
		// 		}

		// 	});
		// 	$(".sp-button.sp-subtitles-switch-wrap").on('focus', function () {
		// 		console.log("the button focused")
		// 		$('.tooltext').show();
		// 		// $('.sp-button.sp-subtitles-switch-wrap').css({
		// 		// 	backgroundColor: '#D41F52', // Adjust as needed to be above the progress bar
		// 		// });
		// 	});

		// 	// Hide subtitle text when the button loses focus
		// 	$(".sp-button.sp-subtitles-switch-wrap").on('blur', function () {
		// 		$('.tooltext').hide();
		// 		// $('.sp-button.sp-subtitles-switch-wrap').css({
		// 		// 	backgroundColor: '#FFFFFF3D', // Adjust as needed to be above the progress bar
		// 		// });
		// 	});
		// 	// }
		// },


		// _buildsubtitles: function () {
		// 	console.log("_buildsubtitles: Start");
		// 	SaranyuInstaPlayer.Utils.DLOG.INFO("Attaching Multi Subtitle Selection Element");

		// 	var i = this;

		// 	function filterUniqueSubtitles(subtitles) {
		// 		var uniqueSubtitles = [];
		// 		var seenNames = new Set();

		// 		// Loop through the subtitles array and add only unique names
		// 		subtitles.forEach(function (subtitle) {
		// 			if (!seenNames.has(subtitle.name)) {
		// 				uniqueSubtitles.push(subtitle);
		// 				seenNames.add(subtitle.name);
		// 			}
		// 		});

		// 		return uniqueSubtitles;
		// 	}

		// 	var q = '<div class="sp-button sp-subtitle-switch sp-subtitle-switch-wrap">\
		// 				<button class="sp-subtitle-switch-btn focusable" data-sn-up=".sp-progress-bar-handle" data-sn-left="" data-sn-right="" data-sn-down=".sp-subtitle-switch-btn"></button>\
		// 				<div class="sp-selected-subtitle-btn" type="button">CC</div>\
		// 				<div id="Sidebarsubtitle" class="sp-subtitle-switch-popup-wrap">\
		// 					<div class="outer"></div>\
		// 				</div>\
		// 			</div>';

		// 	i.fullControls.bottomControlBar.bottomPlayerControls.append(q);

		// 	// Set up subtitle references
		// 	i.fullControls.bottomControlBar.bottomPlayerControls.subtitles = i.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-subtitle-switch-wrap");
		// 	i.fullControls.bottomControlBar.bottomPlayerControls.subtitles.button = i.fullControls.bottomControlBar.bottomPlayerControls.subtitles.find(".sp-subtitle-switch-btn");
		// 	i.fullControls.bottomBar.bottomPlayerControls.subtitles.popup = i.fullControls.bottomBar.bottomPlayerControls.subtitles.find(".sp-subtitle-switch-popup-wrap");
		// 	i.fullControls.bottomBar.bottomPlayerControls.subtitles.outer = i.fullControls.bottomBar.bottomPlayerControls.subtitles.find(".outer");

		// 	console.log("Subtitle controls initialized:", i.fullControls.bottomBar.bottomPlayerControls.subtitles);

		// 	// Function to build the subtitle options




		// 	i._buildsubtitles._buildSubtitlesPopup = function (t) {
		// 		function Sh(t) {
		// 			t.find("button").unbind().click(function (t) {
		// 				i.mediaElement.videoElement.hlsObj.subtitleDisplay = true;
		// 				var e = Number($(t.target).attr("index"));
		// 				var o = $(t.target).html();
		// 				i.mediaElement.videoElement;
		// 				i.mediaElement.videoElement.hlsObj.subtitleTrack = e;
		// 				$(t.target).parent().parent().find(".active").removeClass("active").addClass("inactive");
		// 				$(t.target).addClass("active").removeClass("inactive");
		// 				i.fullControls.bottomBar.bottomPlayerControls.subtitles.popup.hide();
		// 				ME.play()
		// 				$(".sp-subtitles-switch-btn").show();
		// 				setTimeout(function() {
		// 					localStorage.setItem("subclick",false)
		// 				}, 1000);
		// 				SaranyuInstaPlayer.Utils.DLOG.INFO("Subtitle Index Changed to " + e + " OR Label " + o.toUpperCase())
		// 			}.bind(i));
		// 			t.find("button").unbind().on("sn:enter-down",function (t) {
		// 				i.mediaElement.videoElement.hlsObj.subtitleDisplay = true;
		// 				localStorage.setItem("subclick",true)
		// 				var e = Number($(t.target).attr("index"));
		// 				var o = $(t.target).html();
		// 				i.mediaElement.videoElement;
		// 				i.mediaElement.videoElement.hlsObj.subtitleTrack = e;
		// 				$(t.target).parent().parent().find(".active").removeClass("active").addClass("inactive");
		// 				$(t.target).addClass("active").removeClass("inactive");
		// 				i.fullControls.bottomBar.bottomPlayerControls.subtitles.popup.hide();
		// 				ME.play()
		// 				$(".sp-subtitles-switch-btn").show();
		// 				$(".sp-controls-top-play-from-beginning").show();
		// 				setTimeout(function() {
		// 					localStorage.setItem("subclick",false)
		// 				}, 1000);
		// 				SaranyuInstaPlayer.Utils.DLOG.INFO("Subtitle Index Changed to " + e + " OR Label " + o.toUpperCase())
		// 			}.bind(i));
		// 		}
		// 		function Sd(t) {
		// 			t.find("button").unbind().click(function (t) {
		// 				var e = Number($(t.target).attr("index"));
		// 				var o = $(t.target).html();
		// 				i.mediaElement.videoElement;
		// 				i.mediaElement.videoElement.dashObj.setTextTrack(e);
		// 				$(t.target).parent().parent().find(".active").removeClass("active").addClass("inactive");
		// 				$(t.target).addClass("active").removeClass("inactive");
		// 				i.fullControls.bottomBar.bottomPlayerControls.subtitles.popup.hide();
		// 				ME.play()
		// 				$(".sp-subtitles-switch-btn").show();
		// 				$(".sp-controls-top-play-from-beginning").show();
		// 				setTimeout(function() {
		// 					localStorage.setItem("subclick",false)
		// 				}, 1000);
		// 				SaranyuInstaPlayer.Utils.DLOG.INFO("Subtitle Index Changed to " + e + " OR Label " + o.toUpperCase());
		// 			}.bind(i));
		// 		}
		// 		var n;
		// 		i.fullControls.bottomBar.bottomPlayerControls.subtitles.popup.hide();
		// 		i.fullControls.bottomBar.bottomPlayerControls.subtitles.outer.empty();

		// 		if (i.playerType == "hls" && i.mediaElement.videoElement.hlsObj.subtitleTracks.length < 1) {
		// 			i.fullControls.bottomBar.bottomPlayerControls.subtitles.remove();
		// 		}
		// 		else if (i.playerType == "mpd" && i.mediaElement.videoElement.textTracks.length < 1) {
		// 			i.fullControls.bottomBar.bottomPlayerControls.subtitles.remove();
		// 		}
		// 		if (i.playerType == "hls") {
		// 			// alert("hls")
		// 			// console.log("xxxxxxxxxxxxxxxxxxxx",dummyNames[0].groupId),
		// 			// 0 < dummyNames.length && (n = dummyNames[0].groupId, $.each(dummyNames, function (t, e) {
		// 			// 	var o = "";
		// 			// 	l = SaranyuInstaPlayer.defaultOptions.titleStrings.subtitles;
		// 			// 	a = e.name;
		// 			// 	// e.groupId == n && (i.fullControls.topControlBar.subtitles.popup.children().length || (classActiveOrInactive = "active", o = "<div><button class=active type='button' data-sn-up='' data-sn-left='' data-sn-down='' label=" + l + " index=-1>" + l + "</button></div>"), o += "<div><button class=inactive type='button' data-sn-up='' data-sn-left='' data-sn-down='' label=" + a + " index=" + t + ">" + a + "</button></div>",
		// 			// 	// 	Sh(i.fullControls.topControlBar.subtitles.popup.append(o)));
		// 			// 	e.groupId == n && (i.fullControls.topControlBar.subtitles.outer.children().length || (classActiveOrInactive = "active", o = "<div><button class=active type='button' data-sn-up='.inactive' data-sn-left='' data-sn-down='.inactive' label=" + l + " index=-1>" + l + "</button></div>"), o += "<div><button class=inactive type='button' data-sn-up='.active , .inactive' data-sn-left='' data-sn-down='.active,.inactive' label=" + a + " index=" + t + ">" + a + "</button></div>",
		// 			// 		Sh(i.fullControls.topControlBar.subtitles.outer.append(o)));
		// 			// 		// $('.outer>button').eq(0).focus();
		// 			// }));
		// 			var uniqueSubtitles = filterUniqueSubtitles(t);
		// 			0 < uniqueSubtitles.length && (n = uniqueSubtitles[0].groupId, $.each(uniqueSubtitles, function (t, e) {
		// 				var o = "";
		// 				l = SaranyuInstaPlayer.defaultOptions.titleStrings.subtitles;
		// 				a = e.name;
		// 				e.groupId == n && (i.fullControls.bottomBar.bottomPlayerControls.subtitles.outer.children().length || (classActiveOrInactive = "active", o = "<div><button class=active type='button' label=" + l + " index=-1>" + l + "</button></div>"), o += "<div><button class=inactive type='button' label=" + a + " index=" + t + ">" + a + "</button></div>",
		// 					Sh(i.fullControls.bottomBar.bottomPlayerControls.subtitles.outer.append(o)));
		// 			}));
		// 		}
		// 		else if (i.playerType == "mpd") {
		// 			// alert("mpd")
		// 			var uniqueSubtitles = filterUniqueSubtitles(t);
		// 			0 < uniqueSubtitles.length && (n = uniqueSubtitles[0].language, $.each(uniqueSubtitles, function (t, e) {
		// 				var o = "";
		// 				l = SaranyuInstaPlayer.defaultOptions.titleStrings.subtitles;
		// 				a = e.language;
		// 				e.language == a && (i.fullControls.bottomBar.bottomPlayerControls.subtitles.outer.children().length || (classActiveOrInactive = "active", o = "<div><button class='active focusable' type='button' data-sn-up='' data-sn-left='' data-sn-down='' label=" + l + " index= -1>" + l + "</button></div>"), o += "<div><button class='inactive focusable' type='button' data-sn-up='' data-sn-left='' data-sn-down='' label=" + a + " index= " + t + ">" + a + "</button></div>",
		// 					Sd(i.fullControls.bottomBar.bottomPlayerControls.subtitles.outer.append(o)));
		// 			}));
		// 		}
		// 	};
		// 	i.fullControls.topControlBar.on('click', '.sp-button.sp-subtitles-switch-wrap', function () {
		// 		ME.pause();
		// 		$(".sp-controls-top-play-from-beginning").hide();
		// 		$(".sp-subtitles-switch-btn").hide();
		// 		$(".sp-nextepisode-switch-wrap").hide();
		// 		$(".sp-nextepisode-switch-btn").hide();
		// 		// i._buildsubtitles._buildSubtitlesPopup(i.mediaElement.videoElement.hlsObj.subtitleTracks)
		// 		0 < i.fullControls.bottomBar.bottomPlayerControls.subtitles.outer.children().length ? (i.fullControls.bottomBar.bottomPlayerControls.subtitles.popup.toggle()) : i.fullControls.bottomBar.bottomPlayerControls.subtitles.popup.hide()
		// 		setTimeout(function() {
		// 			$('.active').focus();
		// 		}, 50);
		// 	}.bind(i));
		// 	i.fullControls.topControlBar.on('sn:enter-down', '.sp-button.sp-subtitles-switch-wrap', function () {
		// 		if(localStorage.getItem("subclick")=="false"){
		// 			ME.pause();
		// 			$(".sp-controls-top-play-from-beginning").hide();
		// 			$(".sp-subtitles-switch-btn").hide();
		// 			// i._buildsubtitles._buildSubtitlesPopup(i.mediaElement.videoElement.hlsObj.subtitleTracks)
		// 			0 < i.fullControls.bottomBar.bottomPlayerControls.subtitles.popup.children().length ? (i.fullControls.bottomBar.bottomPlayerControls.subtitles.popup.toggle()) : i.fullControls.bottomBar.bottomPlayerControls.subtitles.popup.hide()
		// 			setTimeout(function() {
		// 				$('.active').focus();
		// 			}, 50);
		// 		}
		// 	}.bind(i));
		// 	i.playerInner.click(function (event) {
		// 		if (!$(event.target).closest('.sp-subtitles-switch-wrap').length && !$(event.target).is('.sp-subtitles-switch-wrap')) {
		// 			$(".sp-subtitles-switch-popup-wrap").hide();
		// 			$(".sp-subtitles-switch-btn").show();
		// 			$(".sp-nextepisode-switch-wrap").show();
		// 			$(".sp-nextepisode-switch-btn").show();

		// 		}
		// 	});
		// 	// i._buildsubtitles._buildSubtitlesPopup = function (subtitles) {
		// 	// 	var n;
		// 	// 	i.fullControls.bottomBar.bottomPlayerControls.subtitles.popup.hide();
		// 	// 	i.fullControls.bottomBar.bottomPlayerControls.subtitles.outer.empty();

		// 	// 	if (i.playerType === "hls" && i.mediaElement.videoElement.hlsObj.subtitleTracks.length < 1) {
		// 	// 		i.fullControls.bottomBar.bottomPlayerControls.subtitles.remove();
		// 	// 	} else if (i.playerType === "mpd" && i.mediaElement.videoElement.textTracks.length < 1) {
		// 	// 		i.fullControls.bottomBar.bottomPlayerControls.subtitles.remove();
		// 	// 	}

		// 	// 	var uniqueSubtitles = filterUniqueSubtitles(subtitles);
		// 	// 	if (i.playerType === "hls") {
		// 	// 		if (uniqueSubtitles.length > 0) {
		// 	// 			n = uniqueSubtitles[0].groupId;
		// 	// 			$.each(uniqueSubtitles, function (index, subtitle) {
		// 	// 				var o = "";
		// 	// 				var label = SaranyuInstaPlayer.defaultOptions.titleStrings.subtitles;
		// 	// 				var name = subtitle.name;
		// 	// 				if (subtitle.groupId === n) {
		// 	// 					o += "<div><button class='inactive focusable' type='button' label='" + name + "' index='" + index + "'>" + name + "</button></div>";
		// 	// 				}
		// 	// 				i.fullControls.bottomBar.bottomPlayerControls.subtitles.outer.append(o);
		// 	// 			});
		// 	// 		}
		// 	// 	} else if (i.playerType === "mpd") {
		// 	// 		if (uniqueSubtitles.length > 0) {
		// 	// 			n = uniqueSubtitles[0].language;
		// 	// 			$.each(uniqueSubtitles, function (index, subtitle) {
		// 	// 				var o = "";
		// 	// 				var label = SaranyuInstaPlayer.defaultOptions.titleStrings.subtitles;
		// 	// 				var language = subtitle.language;
		// 	// 				if (language === n) {
		// 	// 					o += "<div><button class='inactive focusable' type='button' label='" + language + "' index='" + index + "'>" + language + "</button></div>";
		// 	// 				}
		// 	// 				i.fullControls.bottomBar.bottomPlayerControls.subtitles.outer.append(o);
		// 	// 			});
		// 	// 		}
		// 	// 	}

		// 	// 	// Click events for subtitle buttons
		// 	// 	i.fullControls.bottomBar.bottomPlayerControls.subtitles.outer.find('button').on('click sn:enter-down', function (event) {
		// 	// 		var subtitleIndex = Number($(event.target).attr("index"));
		// 	// 		var subtitleLabel = $(event.target).html();

		// 	// 		// Set the selected subtitle track
		// 	// 		if (i.playerType === "hls") {
		// 	// 			i.mediaElement.videoElement.hlsObj.subtitleDisplay = true;
		// 	// 			i.mediaElement.videoElement.hlsObj.subtitleTrack = subtitleIndex;
		// 	// 		} else if (i.playerType === "mpd") {
		// 	// 			i.mediaElement.videoElement.dashObj.setTextTrack(subtitleIndex);
		// 	// 		}

		// 	// 		// Update button states
		// 	// 		$(event.target).siblings().removeClass('active').addClass('inactive');
		// 	// 		$(event.target).removeClass('inactive').addClass('active');

		// 	// 		SaranyuInstaPlayer.Utils.DLOG.INFO("Subtitle Index Changed to " + subtitleIndex + " OR Label " + subtitleLabel.toUpperCase());

		// 	// 		// Hide the popup and resume playback
		// 	// 		i.fullControls.bottomBar.bottomPlayerControls.subtitles.popup.hide();
		// 	// 		ME.play();
		// 	// 		$(".sp-subtitles-switch-btn").show();
		// 	// 	});
		// 	// };

		// 	// // Toggle subtitle popup on button click
		// 	// i.fullControls.bottomBar.bottomPlayerControls.subtitles.button.on('sn:enter-down', function (event) {
		// 	// 	ME.pause();
		// 	// 	$(".sp-controls-top-play-from-beginning").hide();
		// 	// 	$(".sp-subtitles-switch-btn").hide();
		// 	// 	$(".sp-nextepisode-switch-wrap").hide();
		// 	// 	$(".sp-nextepisode-switch-btn").hide();

		// 	// 	if (i.fullControls.bottomBar.bottomPlayerControls.subtitles.outer.children().length > 0) {
		// 	// 		i.fullControls.bottomBar.bottomPlayerControls.subtitles.popup.show();
		// 	// 	} else {
		// 	// 		i.fullControls.bottomBar.bottomPlayerControls.subtitles.popup.hide();
		// 	// 	}

		// 	// 	setTimeout(function () {
		// 	// 		$('.active').focus();
		// 	// 	}, 50);
		// 	// });
		// 	// i.fullControls.bottomBar.bottomPlayerControls.subtitles.button.on('click', function (event) {
		// 	// 	ME.pause();
		// 	// 	$(".sp-controls-top-play-from-beginning").hide();
		// 	// 	$(".sp-subtitles-switch-btn").hide();
		// 	// 	$(".sp-nextepisode-switch-wrap").hide();
		// 	// 	$(".sp-nextepisode-switch-btn").hide();

		// 	// 	if (i.fullControls.bottomBar.bottomPlayerControls.subtitles.outer.children().length > 0) {
		// 	// 		i.fullControls.bottomBar.bottomPlayerControls.subtitles.popup.toggle();
		// 	// 	} else {
		// 	// 		i.fullControls.bottomBar.bottomPlayerControls.subtitles.popup.hide();
		// 	// 	}

		// 	// 	setTimeout(function () {
		// 	// 		$('.active').focus();
		// 	// 	}, 50);
		// 	// });

		// 	// Click outside to hide the subtitle popup
		// 	i.playerInner.click(function (event) {
		// 		if (!$(event.target).closest('.sp-subtitle-switch-wrap').length) {
		// 			i.fullControls.bottomBar.bottomPlayerControls.subtitles.popup.hide();
		// 			$(".sp-subtitles-switch-btn").show();
		// 		}
		// 	});
		// },










		_buildliveprogressbar: function () {
			// console.log("Building......")
			var c = this;
			var g = c.mediaElement.videoElement;
			var a = '<div class="sp-live-time-progress"><div class="sp-controls-bottom-progress-bar"><div class="sp-live-progress-bar-time-rail"><span class="sp-progress-bar-buffering"></span><span class="sp-progress-bar-loaded"></span><span class="sp-progress-bar-current"></span><span  id="sp-progress-bar-handle" class="sp-progress-bar-handle focusable" data-sn-down=".sp-quality-switch-btn"  data-sn-left="" data-sn-right=""></span></div></div></div>';
			c.fullControls.bottomControlBar.bottomPlayerControls.append(a);
		},
		_buildliveicon: function () {

			var c = this;
			var g = c.mediaElement.videoElement;
			var a = '<div class="sp-live-icon"></div>';
			c.fullControls.bottomControlBar.bottomPlayerControls.append(a);
		},

		_buildtime: function () {
			SaranyuInstaPlayer.Utils.DLOG.INFO("Attaching Current Time / Duration");
			var e = this,
				o = e.mediaElement.videoElement;
			var p = e.options.playerType;

			e.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTimeLeft = e.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-player-time-left"),
				e.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTimeRight = e.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-player-time-right"),
				e.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTimeLeft.currentTime = e.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTimeLeft.find(".sp-player-current-time"),
				e.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTimeRight.duration = e.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTimeRight.find(".sp-player-duration");

			o.addEventListener("loadedmetadata", function (t) {

				e.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTimeLeft.currentTime.html(SaranyuInstaPlayer.Utils.convertSecondsTimecode(o.currentTime));
				e.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTimeRight.duration.html(SaranyuInstaPlayer.Utils.convertSecondsTimecode(o.duration));
			});

			o.addEventListener("timeupdate", function (t) {
				// console.log(localStorage.getItem("isPlayedfirstSubtitles") )
				// e.container.adContainer.loadingContainer.hide()
				// if (localStorage.getItem("isPlayedfirstSubtitles") == "true" && e.playerType == "hls") {
				// 	e.mediaElement.videoElement.hlsObj.subtitleDisplay = true;
				// 	e.mediaElement.videoElement.hlsObj.subtitleTrack = parseInt(localStorage.getItem("currentSubtitles"));
				// } else if (localStorage.getItem("isPlayedfirstSubtitles") == "false" && e.playerType == "hls") {
				// 	// console.log("Played first subtitles","::::::::::::::::::::")
				// 	e.mediaElement.videoElement.hlsObj.subtitleDisplay = false;
				// 	e.mediaElement.videoElement.hlsObj.subtitleTrack = -1;

				// }
				if (document.activeElement.className == "sp-multiaudio-switch-btn focusable") {
					e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio && e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.css({
						'border': '2px solid #F5841F',
						'outline': 'none'
					});
					e.fullControls.bottomControlBar.bottomPlayerControls.quality && e.fullControls.bottomControlBar.bottomPlayerControls.quality.css({
						'border': 'none',
						'outline': 'none'
					});
					e.fullControls.bottomControlBar.bottomPlayerControls.subtitles && e.fullControls.bottomControlBar.bottomPlayerControls.subtitles.css({
						'border': 'none',
						'outline': 'none'
					});
				}
				if (document.activeElement.className == 'sp-quality-switch-btn focusable') {
					e.fullControls.bottomControlBar.bottomPlayerControls.quality.css({
						'border': '2px solid #F5841F',
						'outline': 'none'
					});

					e.fullControls.bottomControlBar.bottomPlayerControls.subtitles && e.fullControls.bottomControlBar.bottomPlayerControls.subtitles.css({
						'border': 'none',
						'outline': 'none'
					});
					e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio && e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.css({
						'border': 'none',
						'outline': 'none'
					});
				}
				else if (document.activeElement.className == "sp-subtitles-switch-btn focusable") {
					e.fullControls.bottomControlBar.bottomPlayerControls.quality.css({
						'border': 'none',
						'outline': 'none'
					});

					e.fullControls.bottomControlBar.bottomPlayerControls.subtitles && e.fullControls.bottomControlBar.bottomPlayerControls.subtitles.css({
						'border': '2px solid #F5841F',
						'outline': 'none'
					});
					e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio && e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.css({
						'border': 'none',
						'outline': 'none'
					});
				} else {
					e.fullControls.bottomControlBar.bottomPlayerControls.quality && e.fullControls.bottomControlBar.bottomPlayerControls.quality.css({
						'border': 'none',
						'outline': 'none'
					});
					e.fullControls.bottomControlBar.bottomPlayerControls.subtitles && e.fullControls.bottomControlBar.bottomPlayerControls.subtitles.css({
						'border': 'none',
						'outline': 'none'
					});
					e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio && e.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.css({
						'border': 'none',
						'outline': 'none'
					});
				}



				e.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTimeLeft.currentTime.html(SaranyuInstaPlayer.Utils.convertSecondsTimecode(o.currentTime)),
					e.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTimeRight.duration.html(SaranyuInstaPlayer.Utils.convertSecondsTimecode(o.duration))
				if (e.options.playerType != "live") {
					e._buildprogressbar.adjustCurrentAndHandleInSeek(o.currentTime / o.duration);

				}
				$('.sp-player-current-time').text(SaranyuInstaPlayer.Utils.convertSecondsTimecode(o.currentTime))
			});

			if (p == 'live') {
				e.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTimeLeft.remove();
				e.fullControls.bottomControlBar.bottomPlayerControls.saranyuPlayerTimeRight.remove();
				e.playerLayers.bigplay.hide();
			}
		},
		_buildbackwardSeek: function () {
			SaranyuInstaPlayer.Utils.DLOG.INFO("Attaching Backward Seek");
			var e = this;
			o = e.mediaElement.videoElement;
			e.playerInner.playerLayers.append('<div class="sp-button sp-backward-seek"><button class="sp-backward-seek-btn"></button></div>');
			e.playerInner.playerLayers.backwardSeek = e.playerInner.playerLayers.find('.sp-backward-seek'),
				e.playerInner.playerLayers.backwardSeek.click(function () {
					if ((o.currentTime - 10) >= 0) {
						o.currentTime -= 10
						SaranyuInstaPlayer.Utils.DLOG.INFO("10s Backward Seek");
					}
					else {
						o.currentTime = 0
					}
				});
		},
		_buildforwardSeek: function () {
			SaranyuInstaPlayer.Utils.DLOG.INFO("Attaching Forward Seek");
			var e = this;
			o = e.mediaElement.videoElement;
			e.fullControls.bottomControlBar.bottomPlayerControls.append('<div class="sp-button sp-forward-seek"><button class="sp-forward-seek-btn"></button></div>'),
				e.fullControls.bottomControlBar.bottomPlayerControls.forwardSeek = e.fullControls.bottomControlBar.bottomPlayerControls.find('.sp-forward-seek'),
				e.fullControls.bottomControlBar.bottomPlayerControls.forwardSeek.click(function () {
					if (o.currentTime != o.duration && (o.currentTime + 10) < o.duration) {
						o.currentTime += 10;
						SaranyuInstaPlayer.Utils.DLOG.INFO("10s Forward Seek");
					}
				});
		},



		_createSkipIntro: function () {
			var t = this;
			var m = t.mediaElement.videoElement;
			// console.log(t.options.skipIntro);

			var skipIntroOpt = (t.options && t.options.skipIntro) ? t.options.skipIntro : {};
			var skipStatus = (skipIntroOpt.skip_intro_status !== undefined) ? skipIntroOpt.skip_intro_status : localStorage.getItem('skipStatus');
			var startTime = (skipIntroOpt.start_time !== undefined) ? skipIntroOpt.start_time : localStorage.getItem('startTime');
			var endTime = (skipIntroOpt.end_time !== undefined) ? skipIntroOpt.end_time : localStorage.getItem('endTime');
			if (t.options.playerType !== "live") {


				var skipButton;
				window.skipIntroVisible = false;
				var skipIntroCompleted = false;  // Flag to track if the intro has been skipped
				var skipintroFocus = true;

				// Remove the skip button
				function removeSkipButton() {
					if (skipButton) {
						skipButton.remove();
						skipButton = null;
					}
					$('#skip_button').remove();
					window.skipIntroVisible = false;
				}

				// Create the skip button dynamically based on current playback time
				function createSkipButton() {
					if (!window.skipIntroVisible && (skipStatus === true || skipStatus === "true") && m.currentTime >= startTime && m.currentTime < endTime) {
						if ($('#skip_button').length === 0) {
							t.fullControls.skipIntroControlBar.append(
								'<button id="skip_button" data-sn-left="sp-quality-switch-btn" data-sn-up="#sp-progress-bar-handle" class="skipButton sp-skip-intro-btn focusable"><div class="sp-skip-intro-img focusable"></div>Skip Intro</button>'
							);
						}
						skipButton = $('#skip_button');
						window.skipIntroVisible = true;

						// Only set focus if the intro hasn't already been skipped
						if (skipintroFocus && !skipIntroCompleted) {
							skipButton.focus();
							skipintroFocus = false;
						}

						$('#sp-progress-bar-handle').attr("data-sn-down", ".sp-quality-switch-btn");
						$(".sp-quality-switch-btn").attr("data-sn-up", "#sp-progress-bar-handle");
						$('#sp-progress-bar-handle').attr("data-sn-up", "#skip_button");

						// Add event listeners for the skip button
						skipButton.off("click").on("click", function () {
							var currentEndTime = (t.options && t.options.skipIntro && t.options.skipIntro.end_time !== undefined) ? t.options.skipIntro.end_time : (localStorage.getItem('endTime') || endTime);
							getSkip(parseInt(currentEndTime));
							skipIntroCompleted = true;  // Mark intro as skipped
						});

						skipButton.off("sn:enter-down").on("sn:enter-down", function () {
							var currentEndTime = (t.options && t.options.skipIntro && t.options.skipIntro.end_time !== undefined) ? t.options.skipIntro.end_time : (localStorage.getItem('endTime') || endTime);
							getSkip(parseInt(currentEndTime));
							skipIntroCompleted = true;  // Mark intro as skipped
						});
					}
				}

				// Time update event listener that checks playback time
				function timeUpdateHandler() {
					// Fetch the latest localStorage values dynamically in the handler

					var skipIntroOpt = (t.options && t.options.skipIntro) ? t.options.skipIntro : {};
					var skipStatus = (skipIntroOpt.skip_intro_status !== undefined) ? skipIntroOpt.skip_intro_status : localStorage.getItem('skipStatus');
					var startTime = (skipIntroOpt.start_time !== undefined) ? skipIntroOpt.start_time : localStorage.getItem('startTime');
					var endTime = (skipIntroOpt.end_time !== undefined) ? skipIntroOpt.end_time : localStorage.getItem('endTime');

					if ((skipStatus === "true" || skipStatus === true) && window.isLongPress === false
						&& t.fullControls.bottomControlBar.bottomPlayerControls.backgroundGradient.is(':hidden')
						&& m.currentTime >= startTime && m.currentTime < endTime) {
						createSkipButton();
						window.skipIntroStatus = true;
					} else {
						if (isLongPress == false && m.currentTime >= endTime) {
							removeSkipButton();
							if ($(".replay.focusable").is(":visible")) {
								$(".sp-quality-switch-btn").attr("data-sn-up", "#replayicon");
							} else {
								$('#sp-progress-bar-handle').attr("data-sn-down", ".sp-quality-switch-btn");
								$(".sp-quality-switch-btn").attr("data-sn-up", "#sp-progress-bar-handle");
							}
						}
					}
				}

				// Remove old event listeners and add new ones for the current video
				m.removeEventListener("timeupdate", timeUpdateHandler);
				m.addEventListener("timeupdate", timeUpdateHandler);

				$(document).ready(function () {
					// Remove any previous event listeners for the skip button and re-bind to current video
					$(document).off("click", ".skipButton").on("click", ".skipButton", function () {
						var activeEndTime = (t.options && t.options.skipIntro && t.options.skipIntro.end_time !== undefined)
							? t.options.skipIntro.end_time
							: ((window.InstaPlayer && window.InstaPlayer.options && window.InstaPlayer.options.skipIntro && window.InstaPlayer.options.skipIntro.end_time !== undefined)
								? window.InstaPlayer.options.skipIntro.end_time
								: localStorage.getItem('endTime'));
						getSkip(parseInt(activeEndTime));
					});

					$(document).off("sn:enter-down", ".skipButton").on("sn:enter-down", ".skipButton", function () {
						var activeEndTime = (t.options && t.options.skipIntro && t.options.skipIntro.end_time !== undefined)
							? t.options.skipIntro.end_time
							: ((window.InstaPlayer && window.InstaPlayer.options && window.InstaPlayer.options.skipIntro && window.InstaPlayer.options.skipIntro.end_time !== undefined)
								? window.InstaPlayer.options.skipIntro.end_time
								: localStorage.getItem('endTime'));
						getSkip(parseInt(activeEndTime));
					});
				});
			}
		},




		// _createSkipIntro: function () {

		// 	var t = this
		// 	console.log(t.options)

		// 	if (t.options.playerType != "live") {
		// 		var skipStatus = t.options.skipIntro.skip_intro_status;

		// 		var startTime = t.options.skipIntro.start_time;
		// 		var endTime = t.options.skipIntro.end_time;
		// 		var m = t.mediaElement.videoElement;
		// 		var setSkip = false;
		// 		window.skipIntroStatus = false
		// 		let skipintroFocus = true
		// 		m.addEventListener("timeupdate", function (s) {
		// 			// console.log(window.playbackTime,"jjjjjjjj",skipStatus)
		// 			console.log("siva ", window.isLongPress == false, window.InstaPlayer.fullControls.bottomControlBar.bottomPlayerControls.backgroundGradient.is(':hidden'))
		// 			if ((skipStatus == "true" || skipStatus == true) && window.isLongPress == false && t.fullControls.bottomControlBar.bottomPlayerControls.backgroundGradient.is(':hidden') && window.playbackTime >= startTime && window.playbackTime < endTime && setSkip == false) {
		// 				window.skipIntroStatus = true
		// 				// $("#forward_btn, #backward_btn, #playPauseCenterIcon").attr("data-sn-down", "#skip_button");
		// 				// $("#sp-progress-bar-handle").attr("data-sn-up", "#skip_button")
		// 				// console.log(t.fullControls)
		// 				// console.log(t.fullControls.skipIntroControlBar)
		// 				t.fullControls.skipIntroControlBar.append('<button id="skip_button" data-sn-left="sp-quality-switch-btn" data-sn-up="#sp-progress-bar-handle" class="skipButton sp-skip-intro-btn focusable" onClick="getSkip(' + endTime + ');"><div class="sp-skip-intro-img focusable"></div>Skip Intro</button>')
		// 				// setSkip = true

		// 				if (skipintroFocus) {
		// 					$('.skipButton').focus();
		// 					skipintroFocus = false
		// 				}
		// 				$('#sp-progress-bar-handle').attr("data-sn-down", ".sp-quality-switch-btn")
		// 				$(".sp-quality-switch-btn").attr("data-sn-up", "#sp-progress-bar-handle")
		// 				$('#sp-progress-bar-handle').attr("data-sn-up", "#skipButton")
		// 				// $(".sp-quality-switch-btn").attr("data-sn-up", "#skipButton")
		// 			}
		// 			else if (window.playbackTime < startTime || window.playbackTime >= endTime) {
		// 				// console.log(window.playbackTime < startTime || window.playbackTime >= endTime)
		// 				$('.skipButton').remove();
		// 				// $("#forward_btn, #backward_btn, #playPauseCenterIcon").attr("data-sn-down", "#sp-progress-bar-handle")
		// 				// $("#playPauseCenterIcon").attr("data-sn-down", ".sp-quality-switch-btn")
		// 				if ($(".replay.focusable").is(":visible")) {
		// 					$(".sp-quality-switch-btn").attr("data-sn-up", "#replayicon")
		// 				}
		// 				else {
		// 					$('#sp-progress-bar-handle').attr("data-sn-down", ".sp-quality-switch-btn")
		// 					$(".sp-quality-switch-btn").attr("data-sn-up", "#sp-progress-bar-handle")
		// 				}
		// 				setSkip = false;
		// 			}
		// 		});
		// 		$(document).ready(function () {
		// 			// Click event listener
		// 			$(document).on("click", ".skipButton", function () {
		// 				console.log("am here episodelink");
		// 				getSkip(endTime)
		// 			});

		// 			// 'sn:enter-down' event listener
		// 			$(document).on("sn:enter-down", ".skipButton", function () {
		// 				console.log("'sn:enter-down' event occurred on episodelink");
		// 				getSkip(endTime)
		// 				// Add your code logic here for 'sn:enter-down' event
		// 			});
		// 		});
		// 	}
		// 	// t.loopCreateSkipIntro=function(currentTime){

		// 	// 		if (t.options.playerType != "live") {
		// 	// 			var skipStatus = t.options.skipIntro.skip_intro_status;
		// 	// 			var startTime = t.options.skipIntro.start_time;
		// 	// 			var endTime = t.options.skipIntro.end_time;
		// 	// 			var m = t.mediaElement.videoElement;
		// 	// 			var setSkip = false;

		// 	// 			if ((skipStatus == "true" || skipStatus == true)
		// 	// 				&& currentTime >= startTime && currentTime <= endTime && !setSkip) {

		// 	// 				$("#forward_btn, #backward_btn, #playPauseCenterIcon").attr("data-sn-down", "#skip_button");
		// 	// 				$(".sp-progress-bar-handle").attr("data-sn-up", "#skip_button");
		// 	// 				t.fullControls.skipIntroControlBar.append('<button id="skip_button" class="skipButton sp-skip-intro-btn focusable" onClick="getSkip(' + endTime + ');"><div class="sp-skip-intro-img focusable"></div>Skip Intro</button>');
		// 	// 				setSkip = true;
		// 	// 				$('.skipButton').focus();
		// 	// 				$(".sp-quality-switch-btn").attr("data-sn-up", "#skip_button");
		// 	// 			}
		// 	// 			else if (currentTime < startTime || currentTime >= endTime) {
		// 	// 				$('.skipButton').remove();
		// 	// 				$("#playPauseCenterIcon").attr("data-sn-down", ".sp-quality-switch-btn");
		// 	// 				if ($(".replay.focusable").is(":visible")) {
		// 	// 					$(".sp-quality-switch-btn").attr("data-sn-up", "#replayicon");
		// 	// 				}
		// 	// 				else {
		// 	// 					$(".sp-quality-switch-btn").attr("data-sn-up", "#playPauseCenterIcon");
		// 	// 				}
		// 	// 				setSkip = false;
		// 	// 			}

		// 	// 			$(document).ready(function () {
		// 	// 				// Ensure event listeners are added only once
		// 	// 				if (!window.skipButtonEventListenersAdded) {
		// 	// 					window.skipButtonEventListenersAdded = true;

		// 	// 					// Click event listener
		// 	// 					$(document).on("click", ".skipButton", function () {
		// 	// 						console.log("am here episodelink");
		// 	// 						getSkip(endTime);
		// 	// 					});

		// 	// 					// 'sn:enter-down' event listener
		// 	// 					$(document).on("sn:enter-down", ".skipButton", function () {
		// 	// 						console.log("'sn:enter-down' event occurred on episodelink");
		// 	// 						getSkip(endTime);
		// 	// 						// Add your code logic here for 'sn:enter-down' event
		// 	// 					});
		// 	// 				}
		// 	// 			});
		// 	// 		}   
		// 	// 	}





		// },












		_buildlivevolume: function () {
			var c = this;
			var e = c.mediaElement.videoElement;
			var b = c.options;
			var d = '<div class="sp-button"><button id="vol" class="sp-live-volume-btn unmute" data-sn-down=""></button></div>';
			c.fullControls.bottomControlBar.bottomPlayerControls.append(d);
			c.fullControls.bottomControlBar.bottomPlayerControls.livevolumebtn = c.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-live-volume-btn");

			c.fullControls.bottomControlBar.bottomPlayerControls.livevolumebtn.on('sn:enter-down', function (e) {
				if (ME.volume > 0.1) {
					ME.play()
					ME.volume = 0;
					c.fullControls.bottomControlBar.bottomPlayerControls.livevolumebtn.addClass("mute").removeClass("unmute");
				} else {
					ME.play()
					ME.volume = 1;
					c.fullControls.bottomControlBar.bottomPlayerControls.livevolumebtn.addClass("unmute").removeClass("mute");
				}
			});
		},
		_buildvolume: function () {
			var c = this;
			var e = c.mediaElement.videoElement;
			var b = c.options;
			// if(c.options.playerType!="live"){
			var d = '<div class="sp-button sp-volume-btn-wrap sp-unmute" ><button class="sp-volume-btn" data-sn-down="" data-sn-left=""></button></div>';
			c.fullControls.bottomControlBar.bottomPlayerControls.append(d);
			c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn = c.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-button.sp-volume-btn-wrap");
			var a = '<div class="sp-volume-slider sp-volume-slider-wrap"><div class="sp-volume-current"></div><div class="sp-volume-handle"></div></div>';
			c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.append(a);
			c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider = c.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-volume-slider.sp-volume-slider-wrap");
			c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeCurrent = c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.find(".sp-volume-current");
			c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeHandle = c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.find(".sp-volume-handle");
			c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.positionVolumeHandle = function (f) {
				// console.log("this.", f)
				c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeCurrent.css("height", f * 100 + "%");
				c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeCurrent.css("top", (1 - f) * 100 + "%");
				c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeHandle.css("top", "calc(" + (100 - (f * 100)) + "% - " + c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.volumeHandle.height() / 2 + "px)");
			};
			c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.handleVolumeMove = function (k) {
				var h = null,
					g = c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider,
					f = g.offset();
				var l = g.height(),
					i = k.pageY - f.top;
				h = 1 - (i / l);
				h = Math.max(0, h);
				h = Math.min(h, 1);
				c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.positionVolumeHandle(h);
				c._videoPlayerControls("volumechange", h)
			};
			e.addEventListener("volumechange", function () {
				try {
					if (e.muted) {
						c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.addClass("sp-mute");
						c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.removeClass("sp-unmute");
						c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.hide();
					} else {
						c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.addClass("sp-unmute");
						c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.removeClass("sp-mute");
						c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.show();
					}
				} catch (f) { }
			}, false);
			c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.click(function (f) {
				f.preventDefault();
				if (f.target.className == "sp-volume-btn") {
					if (e.muted) {
						c._videoPlayerControls("unmute")
					} else {
						c._videoPlayerControls("mute")
					}
				}
			});
			c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.on('sn:enter-down', function (f) {
				f.preventDefault();
				if (f.target.className == "sp-volume-btn") {
					if (e.muted) {
						c._videoPlayerControls("unmute")
					} else {
						c._videoPlayerControls("mute")
					}
				}
			});
			c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.bind("mouseover", function (f) {
				f = SaranyuInstaPlayer.Utils.preventSelectionOfTextInMouseMove(f);
				c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.mouseIsOver = true
			}).bind("mousemove", function (f) {
				f = SaranyuInstaPlayer.Utils.preventSelectionOfTextInMouseMove(f);
				c.playerInner.trigger("mousemove");
				if (c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.mouseIsDown == true) {
					c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.handleVolumeMove(f)
				}
			}).bind("mouseup", function (f) {
				// console.log("mouseup", f)
				f = SaranyuInstaPlayer.Utils.preventSelectionOfTextInMouseMove(f);
				c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.mouseIsDown = false
			}).bind("mousedown", function (f) {
				// console.log("mousedown", f)
				f = SaranyuInstaPlayer.Utils.preventSelectionOfTextInMouseMove(f);
				c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.handleVolumeMove(f);
				c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.mouseIsDown = true
			}).bind("mouseleave", function (f) {
				f = SaranyuInstaPlayer.Utils.preventSelectionOfTextInMouseMove(f);
				c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.mouseIsDown = false
			});
			if ((b.mute === "true") || (b.mute == true)) {
				c._videoPlayerControls("mute");
				c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.addClass("sp-mute");
				c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn.removeClass("sp-unmute");
				c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.hide()
			}
			$(c.fullControls.bottomControlBar.bottomPlayerControls.volumebtn).hover(function () {
				if (!e.muted) {
					c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.show();
				}
				// Check if the quality switch popup is open and close it
				if (c.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.is(":visible")) {
					c.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.hide();
				}
			},
				function () {
					if (!$(c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider).is(":hover")) {
						setTimeout(function () {
							c.fullControls.bottomControlBar.bottomPlayerControls.volumeSlider.hide();
						}, 5000)
					}
				});
			// }
		},
		// _buildsubtitles: function () {
		// 	var c = this;
		// 	var e = c.mediaElement.videoElement;
		// 	var b = c.options;
		// 	var a = "Subtitles";
		// 	var f = '<div class="sp-button sp-subtitles-switch sp-subtitles-switch-wrap"><button class="sp-subtitles-switch-btn"></button><div class="sp-subtitles-switch-wrap sp-subtitles-switch-popup-wrap"></div></div>';
		// 	c.fullControls.bottomControlBar.bottomPlayerControls.append(f);
		// 	c.fullControls.bottomControlBar.bottomPlayerControls.subtitles = c.fullControls.bottomControlBar.bottomPlayerControls.find(".sp-subtitles-switch-wrap");
		// 	c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.button = c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.find(".sp-subtitles-switch-btn");
		// 	c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup = c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.find(".sp-subtitles-switch-wrap");
		// 	// c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.button.html(a);
		// 	var d = '<div class="sp-subtitles-panel"></div>';
		// 	c.mediaElement.append(d);
		// 	c.mediaElement.subtitlesPanel = c.mediaElement.find(".sp-subtitles-panel");
		// 	c.mediaElement.subtitlesPanel.subtitlesArray = [];
		// 	c._buildsubtitles.hideSubTitlesContainer = function () {
		// 		c.mediaElement.subtitlesPanel.hide()
		// 	};
		// 	c._buildsubtitles.showSubTitlesContainer = function () {
		// 		if (c.mediaElement.subtitlesPanel.html().length > 1) {
		// 			c.mediaElement.subtitlesPanel.show()
		// 		} else {
		// 			c.mediaElement.subtitlesPanel.hide()
		// 		}
		// 	};
		// 	c._buildsubtitles.hideSubTitlesContainer();
		// 	c._buildsubtitles._buildSubtitlesPopup = function (m) {
		// 		var n = 0;
		// 		if (c.fullControls.playlistPanel.playingIndex) {
		// 			n = c.fullControls.playlistPanel.playingIndex
		// 		}
		// 		m = c.options.file[n].subtitles;
		// 		c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide();
		// 		c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.empty();
		// 		c.mediaElement.subtitlesPanel.subtitlesArray = [];
		// 		function i(q) {
		// 			if (isNaN(q)) {
		// 				c.mediaElement.subtitlesPanel.subtitlesArray = [];
		// 				return false
		// 			}
		// 			c.mediaElement.subtitlesPanel.subtitlesArray = [];
		// 			$.ajax({
		// 				url: c.options.file[n].subtitles[q].file,
		// 				context: c,
		// 				success: function (z) {
		// 					var B = this;

		// 					function u(t) {
		// 						return t.replace(/^\s+|\s+$/g, "")
		// 					}
		// 					var w = z.replace(/\r\n|\r|\n/g, "\n");
		// 					w = u(w);
		// 					var v = w.split("\n\n");
		// 					var D = 0;
		// 					for (s in v) {
		// 						var C = v[s].split("\n");
		// 						if (C.length >= 2) {
		// 							var y = C[0];
		// 							var r = u(C[1].split(" --> ")[0]);
		// 							var x = u(C[1].split(" --> ")[1]);
		// 							var A = C[2];
		// 							if (C.length > 2) {
		// 								for (j = 3; j < C.length; j++) {
		// 									A += "\n" + C[j]
		// 								}
		// 							}
		// 							B.mediaElement.subtitlesPanel.subtitlesArray[D] = {};
		// 							B.mediaElement.subtitlesPanel.subtitlesArray[D].number = y;
		// 							B.mediaElement.subtitlesPanel.subtitlesArray[D].start = r;
		// 							B.mediaElement.subtitlesPanel.subtitlesArray[D].end = x;
		// 							B.mediaElement.subtitlesPanel.subtitlesArray[D].text = A
		// 						}
		// 						D++
		// 					}
		// 				}
		// 			})
		// 		}

		// 		function p(q) {
		// 			q.find("button").unbind().click(function (u) {
		// 				var t = Number($(u.target).attr("index"));
		// 				var r = $(u.target).html();
		// 				var v = c.mediaElement.videoElement;
		// 				i(t);
		// 				$(u.target).parent().parent().find(".active").removeClass("active").addClass("inactive");
		// 				$(u.target).addClass("active").removeClass("inactive");
		// 				c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide();
		// 			}.bind(c))
		// 		}
		// 		if (m != undefined) {
		// 			if (m.length > 1) {
		// 				$.each(m, function (v, y) {
		// 					var t = "";
		// 					var r = "inactive";
		// 					var q = "active";
		// 					var x = "no";
		// 					var w = SaranyuInstaPlayer.defaultOptions.titleStrings.subtitles;
		// 					var u = y.lang;
		// 					if (!c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.children().length) {
		// 						classActiveOrInactive = "active";
		// 						t = "<div><button class=" + q + " type='button' label=" + w + " index=" + x + ">" + w + "</button></div>"
		// 					}
		// 					t += "<div><button class=" + r + " type='button' label=" + u + " index=" + v + ">" + u + "</button></div>";
		// 					p(c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.append(t))
		// 				})
		// 			}
		// 		} else {
		// 			var g = "";
		// 			var o = "inactive";
		// 			var l = "active";
		// 			var h = "no";
		// 			var k = SaranyuInstaPlayer.defaultOptions.titleStrings.subtitles;
		// 			c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.button.html(k);
		// 			classActiveOrInactive = "active";
		// 			g = "<div><button class=" + l + " type='button' label=" + k + " index=" + h + ">" + k + "</button></div>";
		// 			p(c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.append(g))
		// 		}
		// 	};
		// 	c.mediaElement.videoElement.addEventListener("timeupdate", function () {
		// 		function h(l) {
		// 			var k = l;
		// 			var i = k.split(":");
		// 			var m = (+i[0]) * 60 * 60 + (+i[1]) * 60 + (+i[2]);
		// 			return m
		// 		} (function g() {
		// 			var k = Math.floor(Number(c.mediaElement.videoElement.currentTime));
		// 			if (c.mediaElement.subtitlesPanel.subtitlesArray.length > 0) {
		// 				for (var m = 0; m < c.mediaElement.subtitlesPanel.subtitlesArray.length; m++) {
		// 					var n = h(c.mediaElement.subtitlesPanel.subtitlesArray[m].start.split(",")[0]);
		// 					var l = h(c.mediaElement.subtitlesPanel.subtitlesArray[m].end.split(",")[0]);
		// 					if (k >= n && k <= l) {
		// 						c._buildsubtitles.showSubTitlesContainer();
		// 						c.mediaElement.subtitlesPanel.html(c.mediaElement.subtitlesPanel.subtitlesArray[m].text);
		// 						return
		// 					}
		// 				}
		// 			}
		// 			c._buildsubtitles.hideSubTitlesContainer()
		// 		})()
		// 	});
		// 	c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.button.unbind().click(function (g) {
		// 		if (c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.children().length > 0) {
		// 			c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.toggle();
		// 			c.fullControls.bottomControlBar.bottomPlayerControls.multiaudio.popup.hide();
		// 			c.fullControls.bottomControlBar.bottomPlayerControls.nxplayback.popup.hide();
		// 			c.fullControls.bottomControlBar.bottomPlayerControls.quality.popup.hide();
		// 			c.fullControls.playlistPanel.hide()
		// 		} else {
		// 			c.fullControls.bottomControlBar.bottomPlayerControls.subtitles.popup.hide()
		// 		}
		// 	}.bind(c))
		// },
		_buildbackbutton: function () {
			SaranyuInstaPlayer.Utils.DLOG.INFO("Attaching Top Back Arrow");
			var t = this;
			l = t.mediaElement.videoElement;
			t.fullControls.topControlBar.append('<div class="sp-controls-top-backarrow"><div class="sp-button sp-backarrow"><button class="sp-back-btn"></div></div></div>');
			t.fullControls.topControlBar.backarrow = t.fullControls.topControlBar.find(".sp-backarrow");
			t.fullControls.topControlBar.backarrow.click(function () {
				try {
					if (t.fullControls.topControlBar.backarrow.is(":visible")) {
						t.eventcallbacks.onBack();
					}
					t._destroyMedia();
				}
				catch (t) {
					SaranyuInstaPlayer.Utils.DLOG.WARN(t);
				}
			});
		},
		_buildtitle: function () {
			SaranyuInstaPlayer.Utils.DLOG.INFO("Attaching Video Title Text");
			var e = this;
			e.fullControls.bottomControlBar.append('<div class="sp-controls-top-video-title"><div class="space-container"><span class="sp-controls-top-video-title-text"></span><span class="sp-controls-top-video-secondary-text"></span></div></div>'),
				e.fullControls.bottomControlBar.videoTitle = e.fullControls.bottomControlBar.find(".sp-controls-top-video-title-text"),
				e.fullControls.bottomControlBar.videoTitle.changeTitle = function (t) {
					e.fullControls.bottomControlBar.videoTitle.html(t)
					e.fullControls.bottomControlBar.videoTitle.hide()
				}
		},
		_buildsecondarytitle: function () {
			var e = this;
			// console.log("buildsecondarytitle", e.options.file[0].secondarytitle);
			// e.fullControls.topControlBar.append('<div class="sp-controls-top-video-secondarytitle"><span class="sp-controls-top-video-secondary-text"></span></div>');
			e.fullControls.bottomControlBar.vid = e.fullControls.bottomControlBar.find(".sp-controls-top-video-title"),
				e.fullControls.bottomControlBar.secondaryTitle = e.fullControls.bottomControlBar.vid.find(".sp-controls-top-video-secondary-text");
			e.fullControls.bottomControlBar.secondaryTitle.hide()
			if (e.options.file[0].secondarytitle == "") {
				e.fullControls.bottomControlBar.videoTitle.css({
					position: "relative",
					top: "55%"
				})
			} else {
				var x = processCaption(e.options.file[0].secondarytitle);
				e.fullControls.bottomControlBar.secondaryTitle.html(x);
			}
			// function processCaption(captions) {
			// 	// Split captions by " . "
			// 	var parts = captions ? captions.split(" . ") : null;

			// 	// Prepare an array to hold HTML elements
			// 	var captionElements = [];

			// 	// Loop through parts array and add color to dots
			// 	if (parts) {
			// 		parts.forEach(function (part, index) {
			// 			// If it's not the last part, add dot with color
			// 			if (index < parts.length - 1) {
			// 				captionElements.push('<span style="color:white;font-weight:bold;font-family: Fira Sans;">' + part + ' <span style="color:red"> ● </span></span>');
			// 			} else {
			// 				// Otherwise, add the last part without dot
			// 				captionElements.push('<span style="color:white;font-weight:bold;font-family: Fira Sans;">' + part + '</span>');
			// 			}
			// 		});
			// 	}

			// 	return captionElements.join('');



			// }

			function processCaption(captions) {
				// Split captions by " . "
				var parts = captions ? captions.split(" . ") : null;

				// Prepare an array to hold HTML elements
				var captionElements = [];

				// Loop through parts array and add color to dots
				if (parts) {
					parts.forEach(function (part, index) {
						// If it's not the last part, add dot with color




						if (index < parts.length - 1) {
							captionElements.push('<span style="color:white;font-weight:bold;">' + part + ' <span style="display: inline-flex;align-items: center;"><span id="dot-style" ></span></span></span>');
						} else {
							// Otherwise, add the last part without dot
							captionElements.push('<span style="color:white;font-weight:bold;">' + part + '</span>');
						}
					});
				}

				return captionElements.join('');
			}

		},
		_contentGrading: function () {
			SaranyuInstaPlayer.Utils.DLOG.INFO("Attaching Content Grading");
			var e = this;

			var a = e.options.contentGrading;
			var contentRating = a.cbfc_rating;
			var contentGenre = a.genres;

			// Append content grading elements to the top control bar
			e.fullControls.topControlBar.append('<div class="sp-controls-top-content-grading"><span class="content-grading-title"></span><span class="content-grading-text"></span></div>');
			e.fullControls.topControlBar.contentGrading = e.fullControls.topControlBar.find(".sp-controls-top-content-grading");
			e.fullControls.topControlBar.contentGrading.title = e.fullControls.topControlBar.contentGrading.find(".content-grading-title");
			e.fullControls.topControlBar.contentGrading.text = e.fullControls.topControlBar.contentGrading.find(".content-grading-text");

			// Set content rating and genre
			e.fullControls.topControlBar.contentGrading.title.html("RATED " + contentRating);
			if (contentGenre.length > 0) {
				e.fullControls.topControlBar.contentGrading.text.html(contentGenre.join(", "));
			} else {
				e.fullControls.topControlBar.contentGrading.text.addClass("nogenre-text");
			}

			// Show the content grading only once

		},
		_buildadvertisement: function () {
			SaranyuInstaPlayer.Utils.DLOG.INFO("Attaching Advertisement Module");
			var isCueContrusted = false;
			var t, e, o, l, n = this, a = n.options, i = ["Cue", "Label", "Volume", "Title", "Time"];
			var m = '<div class="sp-ad-container"></div>';
			n.container.append(m);
			n.container.adContainer = n.container.find(".sp-ad-container");
			t = '<div class="sp-ad-controls-top"><div class="sp-ad-controls-top-player-controls"></div></div>';
			e = '<div class="sp-ad-video-element"></div>';
			o = '<div class="sp-ad-controls-bottom"><div class="sp-ad-controls-bottom-player-controls"></div></div>';
			l = '<video class="sp-ad-element"></video>';
			j = '<div class="sp-ad-player-loading"><div class="sp-ad-loader"><div class="sp-ad-spinner"><div class="sp-ad-spinner-container"><div class="sp-ad-spinner-rotator"><div class="sp-ad-spinner-left"><div class="sp-ad-spinner-circle"></div></div><div class="sp-ad-spinner-right"><div class="sp-ad-spinner-circle"></div></div></div></div></div></div>';
			n.container.adContainer.append(l, t, e, j, o);
			n.container.adContainer.adTopControls = n.container.adContainer.find(".sp-ad-controls-top-player-controls");
			n.container.adContainer.adVideoElement = n.container.adContainer.find(".sp-ad-video-element");
			n.container.adContainer.adBottomControls = n.container.adContainer.find(".sp-ad-controls-bottom-player-controls");
			n.container.adContainer.adVideoTag = n.container.adContainer.find(".sp-ad-element");
			n.container.adContainer.loadingContainer = n.container.adContainer.find(".sp-ad-player-loading")
			n._buildadvertisement._buildAdCue = function (videoDuration) {
				if (!isCueContrusted) {
					SaranyuInstaPlayer.Utils.DLOG.INFO("Attaching AdCue Markers");
					try {
						$.each(a.advertisement.adsets, function (t, e) {
							if (Number(e.schedule)) {
								SaranyuInstaPlayer.Utils.DLOG.INFO("AD Schedule Found, Building Cues");
								var o = Math.floor(SaranyuInstaPlayer.Utils.getPercentageForGivenDuration(e.schedule, videoDuration));
								var l = "<span class='sp-ad-cue-points'" + "cue-id=" + t + " style='left:" + o + "%'></span>";
								if (!isNaN(o)) {
									n.fullControls.bottomControlBar.bottomPlayerControls.progressbar.cues.append(l);
								}
							}
						});
					} catch (err) {
						console.log(err);
					}
				}
			},
				n._buildadvertisement._buildAdLabel = function () {
					SaranyuInstaPlayer.Utils.DLOG.INFO("Attaching Ad Label");

					if (n.container.adContainer.adBottomControls.find('.ad-label').length === 0) {
						n.container.adContainer.adBottomControls.append('<div class="ad-label"></div>');
					}
				};

			n._buildadvertisement._buildAdTitle = function () {
				SaranyuInstaPlayer.Utils.DLOG.INFO("Attaching Ad Titles");
				n.container.adContainer.adTopControls.append('<div class="ad-video-title"><span class="ad-video-title-text"></span></div>');
				n.container.adContainer.adTopControls.adTitle = n.container.adContainer.adTopControls.find(".ad-video-title-text");
			}
			// n._buildadvertisement._buildAdPlayPause = function () {
			// 	SaranyuInstaPlayer.Utils.DLOG.INFO("Attaching Ad Play / Pause Icon");
			// 	n.container.adContainer.adBottomControls.append('<div class="sp-ad-button sp-ad-playpause sp-ad-play"><button></button></div>');
			// 	n.container.adContainer.adBottomControls.PlayPause = n.container.adContainer.adBottomControls.find(".sp-ad-playpause");
			// 	n.container.adContainer.adBottomControls.PlayPause.click(function () {
			// 		try {
			// 			n._buildadvertisement.initializeAd.adPaused ? (n._buildadvertisement.initializeAd.adsManager.resume(), n._buildadvertisement.initializeAd.adPaused = false) : (n._buildadvertisement.initializeAd.adsManager.pause(), n._buildadvertisement.initializeAd.adPaused = true)
			// 		} catch (err) {
			// 			SaranyuInstaPlayer.Utils.DLOG.ERR(err);
			// 		}
			// 	});
			// 	n.container.adContainer.adBottomControls.PlayPause.changeIcon = function () {
			// 		n._buildadvertisement.initializeAd.adPaused ? n.container.adContainer.adBottomControls.PlayPause.removeClass("sp-ad-play").addClass("sp-ad-pause") : n.container.adContainer.adBottomControls.PlayPause.removeClass("sp-ad-pause").addClass("sp-ad-play");
			// 	}
			// }
			n._buildadvertisement._buildAdVolume = function () {
				SaranyuInstaPlayer.Utils.DLOG.INFO("Attaching Ad Volume Control Icon");
			}
			n._buildadvertisement._buildAdTime = function () {
				SaranyuInstaPlayer.Utils.DLOG.INFO("Attaching Ad Timer");

				// Remove any existing instance before appending a new one
				n.container.adContainer.adBottomControls.find('.sp-ad-player-time').remove();
				if (n._buildadvertisement.initializeAd.ad.data.adPodInfo.totalAds > 1) {
					n.container.adContainer.adBottomControls.append(
						'<div class="sp-ad-player-time">' +
						n._buildadvertisement.initializeAd.ad.data.adPodInfo.adPosition +
						' of ' +
						n._buildadvertisement.initializeAd.ad.data.adPodInfo.totalAds + ' :&nbsp;' +
						'<span class="sp-ad-player-current-time"></span></div>'
					);
				} else {
					n.container.adContainer.adBottomControls.append(
						'<div class="sp-ad-player-time"><span class="sp-ad-player-current-time"></span></div>'
					);
				}


				n.container.adContainer.adBottomControls.timeContainer = n.container.adContainer.adBottomControls.find(".sp-ad-player-time");
				n.container.adContainer.adBottomControls.timeContainer.currentTime = n.container.adContainer.adBottomControls.timeContainer.find(".sp-ad-player-current-time");

				n._buildadvertisement._buildAdTime.changeCurrentTime = function () {
					try {
						var remainingTime = n._buildadvertisement.initializeAd.getRemainingTime
							;
						var displayTime = remainingTime > 0 ? remainingTime : 0;

						// console.log(SaranyuInstaPlayer.Utils.convertSecondsTimecode(displayTime));
						n.container.adContainer.adBottomControls.timeContainer.currentTime.html(
							SaranyuInstaPlayer.Utils.convertAdsSecondsTimecode(displayTime)
						);
					} catch (err) {
						SaranyuInstaPlayer.Utils.DLOG.ERR(err);
					}
				};
			};


			n._buildadvertisement._createAdControls = function () {
				var t = i;
				for (featureIndex in t) {
					feature = t[featureIndex];
					try {
						n._buildadvertisement["_buildAd" + feature]();
					} catch (err) {
						console.log(err);
					}
				}
			}
			n._buildadvertisement._destroyAdControls = function () {
				n.container.adContainer.adTopControls.empty(),
					n.container.adContainer.adBottomControls.empty(),
					n.container.adContainer.adVideoElement.empty();
			}
			n._buildrestarthls = function () {
				console.log("hlsrestart", ME.currentTime)
				n.container.adContainer.loadingContainer.hide()
				var e = this,
					o = e.mediaElement.videoElement;
				if (e.playerType == "hls") {
					const adSetTimeout = null
					// if (adSetTimeout) {
					// 	clearTimeout(adSetTimeout)
					// 	adSetTimeout = null
					// }
					// adSetTimeout = setTimeout(() => {
					localStorage.setItem("ads_status", "false");
					window.InstaPlayer.mediaElement.videoElement.hlsObj.detachMedia()
					window.InstaPlayer.mediaElement.videoElement.hlsObj.loadSource(e.options.file[0].content_url);
					window.InstaPlayer.mediaElement.videoElement.hlsObj.attachMedia(window.InstaPlayer.mediaElement.videoElement);
					ME.currentTime = window.playbackTime
					window.InstaPlayer.mediaElement.videoElement.hlsObj.startLoad();
					e._videoPlayerControls("unmute")
					// }, 1000)

					// window.InstaPlayer.mediaElement.videoElement.hlsObj.detachMedia()
					// window.InstaPlayer.mediaElement.videoElement.hlsObj.loadSource(e.options.file[0].content_url);
					// window.InstaPlayer.mediaElement.videoElement.hlsObj.attachMedia(window.InstaPlayer.mediaElement.videoElement);
					// ME.currentTime = window.playbackTime
					// window.InstaPlayer.mediaElement.videoElement.hlsObj.startLoad();
				} else {
					// const adSetTimeout = null
					// if (adSetTimeout) {
					// 	clearTimeout(adSetTimeout)
					// 	adSetTimeout = null
					// }
					// adSetTimeout = setTimeout(() => {
					localStorage.setItem("ads_status", "false");
					e._videoPlayerControls("play")
					e._videoPlayerControls("unmute")
					// }, 1000)
				}
				// 	e.mediaElement.videoElement.hlsObj.startLoad(parseInt(window.playbackTime))
				// e.mediaElement.videoElement.hlsObj.attachMedia(o);
				// e.mediaElement.videoElement.hlsObj.loadSource(e.options.file[0].content_url);
				// n._videoPlayerControls("play")
			},

				n._buildadvertisement.initializeAd = function (t) {


					const cleanup = () => {
						try {
							if (n._buildadvertisement.initializeAd.adsManager) {
								n._buildadvertisement.initializeAd.adsManager.destroy();
								n._buildadvertisement.initializeAd.adsManager = null;
							}

							if (n._buildadvertisement.initializeAd.adsLoader) {
								n._buildadvertisement.initializeAd.adsLoader.destroy();
								n._buildadvertisement.initializeAd.adsLoader = null;
							}

							if (n._buildadvertisement.initializeAd.intervalTimer) {
								clearInterval(n._buildadvertisement.initializeAd.intervalTimer);
								n._buildadvertisement.initializeAd.intervalTimer = null;
							}

							if (n._buildadvertisement.initializeAd.adDisplayContainer) {
								n._buildadvertisement.initializeAd.adDisplayContainer.destroy();
								n._buildadvertisement.initializeAd.adDisplayContainer = null;
							}

							n.container.adContainer.adVideoElement.empty();
							n.container.adContainer.adVideoElement.hide()

							// Reset state variables
							n._buildadvertisement.initializeAd.adStarted = false;
							n._buildadvertisement.initializeAd.isLinear = false;
							n._buildadvertisement.initializeAd.adPaused = false;
							n._buildadvertisement.initializeAd.adMuted = false;

							n.container.adContainer.removeClass("sp-ad-container-display");
							n.container.adContainer.removeClass("sp-ad-active");
							n.container.adContainer.removeClass("sp-ad-banner");
						} catch (err) {
							console.error("Error during cleanup:", err);
						}
					};

					// Run cleanup before initializing new instance
					cleanup();
					try {
						try {
							n.container.adContainer.adBottomControls.volumeMuteUnmute.checkDefaultContentVolume();
						} catch (err) {

						}
						"false" !== n.options.advertisement.vmap && void 0 !== n.options.advertisement.vmap || n._buildadvertisement.initializeAd.onAdError();
					}
					catch (err) { }


					n._buildadvertisement.initializeAd.adsManager;
					n._buildadvertisement.initializeAd.adsLoader;
					n._buildadvertisement.initializeAd.adDisplayContainer;
					n._buildadvertisement.initializeAd.intervalTimer;
					n._buildadvertisement.initializeAd.videoContent;
					n._buildadvertisement.initializeAd.adStarted = false;
					n._buildadvertisement.initializeAd.isLinear = false;
					n._buildadvertisement.initializeAd.adObj;
					n._buildadvertisement.initializeAd.adPaused = false;
					n._buildadvertisement.initializeAd.adMuted = false;
					n._buildadvertisement.initializeAd.init = function (t) {
						n._buildadvertisement.initializeAd.videoContent = n.container.adContainer.adVideoTag[0];
						console.log(n._buildadvertisement.initializeAd.videoContent)
						n._buildadvertisement.initializeAd.setUpIMA(t);

					},
						n._buildadvertisement.initializeAd.setUpIMA = function (t) {
							n._buildadvertisement.initializeAd.createAdDisplayContainer();
							n._buildadvertisement.initializeAd.adsLoader = new google.ima.AdsLoader(n._buildadvertisement.initializeAd.adDisplayContainer);
							n._buildadvertisement.initializeAd.adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, n._buildadvertisement.initializeAd.onAdsManagerLoaded, false),
								n._buildadvertisement.initializeAd.adsLoader.getSettings().setAutoPlayAdBreaks(false);
							console.log("n._buildadvertisement.initializeAd.adsLoader", n._buildadvertisement.initializeAd.adsLoader.getSettings())

							n._buildadvertisement.initializeAd.adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function (event) {
								// console.log("Ad Error: ", event.getError());
								const error = event.getError()

								n.eventcallbacks.adsError(error.data.errorMessage, error.data.errorCode, n._buildadvertisement.initializeAd.adObj)
								// console.log("error message", error.data.errorCode),
								localStorage.setItem("ads_status", "false");
								// n._videoPlayerControls("play")

								n._buildrestarthls()
								// 	console.log("error code", error.data.errorMessage)

							}, false)


							n._buildadvertisement.initializeAd.adsRequest = new google.ima.AdsRequest(),

								console.log("google.ima.settings", google.ima.settings)

							n._buildadvertisement.initializeAd.adsRequest.adTagUrl = t.adurl



							// replace('[TIMESTAMP]', Date.now()) // Use Date.now() for unique timestamp
							// .replace('%%CACHEBUSTER%%', Math.floor(Math.random() * 1000000000)); // Use random for cache busting
							// n._buildadvertisement.initializeAd.adsRequest.setAdWillPlayMuted(true),
							// n._buildadvertisement.initializeAd.adsRequest.setAdWillAutoPlay(true);
							//  n._buildadvertisement.initializeAd.adsRequest.setContinuousPlayback(true);
							n._buildadvertisement.initializeAd.adsLoader.requestAds(n._buildadvertisement.initializeAd.adsRequest);
						},
						n._buildadvertisement.initializeAd.createAdDisplayContainer = function () {
							try {
								// n.container.adContainer.adVideoElement.empty();
								n.container.adContainer.adVideoElement.hide()

							}
							catch (err) { }

							// google.ima.settings.setDebugMode(true);
							console.log("google.ima.settings", google.ima.settings)
							google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED),
								n._buildadvertisement.initializeAd.adDisplayContainer = new google.ima.AdDisplayContainer(n.container.adContainer.adVideoElement[0],
									n._buildadvertisement.initializeAd.videoContent[0]);
						},
						n._buildadvertisement.initializeAd.playAds = function () {
							try {
								n.container.adContainer.addClass("sp-ad-container-display");
								// localStorage.setItem("ads_status", "true");
								// n.container.adContainer.loadingContainer.show()
							}
							catch (err) { }
							localStorage.setItem("ads_status", "true");
							n._buildadvertisement.initializeAd.videoContent.load();
							n._buildadvertisement.initializeAd.adDisplayContainer.initialize();
							// n.container.adContainer.loadingContainer.show()
							try {
								n._buildadvertisement.initializeAd.adsManager.init(n.container.adContainer.adVideoElement.width(), n.container.adContainer.adVideoElement.height(), google.ima.ViewMode.NORMAL),
									n._buildadvertisement.initializeAd.adsManager.start();
							}
							catch (err) {
								n._buildadvertisement.initializeAd.videoContent.play();
							}
						},
						n._buildadvertisement.initializeAd.onAdsManagerLoaded = function (t) {
							n._buildadvertisement.initializeAd.adsRenderingSettings = new google.ima.AdsRenderingSettings(),
								n._buildadvertisement.initializeAd.adsRenderingSettings.enablePreloading = true,
								n._buildadvertisement.initializeAd.adsRenderingSettings.useVideoAdUi = false,
								n._buildadvertisement.initializeAd.adsRenderingSettings.bitrate = 15000,
								//  n._buildadvertisement.initializeAd.adsRenderingSettings.loadVideoTimeout=3000,

								// console.log("enablePreloading", n._buildadvertisement.initializeAd.adsRenderingSettings)
								// n._buildadvertisement.initializeAd.adsRenderingSettings.loadVideoTimeout = 30000,


								// n._buildadvertisement.initializeAd.adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
								console.log(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED)

							n._buildadvertisement.initializeAd.adsManager = t.getAdsManager(n._buildadvertisement.initializeAd.videoContent, n._buildadvertisement.initializeAd.adsRenderingSettings),
								n._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, n._buildadvertisement.initializeAd.onAdError),
								// n._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, n._buildadvertisement.initializeAd.onContentPauseRequested),
								// n._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, n._buildadvertisement.initializeAd.onContentResumeRequested),
								n._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, n._buildadvertisement.initializeAd.onAdEvent),
								n._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, n._buildadvertisement.initializeAd.onAdEvent),
								n._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, n._buildadvertisement.initializeAd.onAdEvent),
								n._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.CLICK, n._buildadvertisement.initializeAd.onAdEvent),
								n._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.PAUSED, n._buildadvertisement.initializeAd.onAdEvent),
								n._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.RESUMED, n._buildadvertisement.initializeAd.onAdEvent),
								n._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.VOLUME_CHANGED, n._buildadvertisement.initializeAd.onAdEvent),
								n._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.VOLUME_MUTED, n._buildadvertisement.initializeAd.onAdEvent),
								n._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, n._buildadvertisement.initializeAd.onAdEvent),
								n._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, n._buildadvertisement.initializeAd.onAdEvent),
								n._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, n._buildadvertisement.initializeAd.onAdEvent),
								n._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, n._buildadvertisement.initializeAd.onAdEvent)

							n._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.FIRST_QUARTILE, n._buildadvertisement.initializeAd.onAdEvent)
							n._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.THIRD_QUARTILE, n._buildadvertisement.initializeAd.onAdEvent)
							n._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.MIDPOINT, n._buildadvertisement.initializeAd.onAdEvent)
							n._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.AD_PROGRESS, n._buildadvertisement.initializeAd.onAdEvent)
							n._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.TIME_UPDATE, n._buildadvertisement.initializeAd.onAdEvent)
							// n._buildadvertisement.initializeAd.adsManager.addEventListener(google.ima.AdEvent.Type.AD_ERROR, n._buildadvertisement.initializeAd.onAdError)
							n._buildadvertisement.initializeAd.playAds();
						},
						n._buildadvertisement.initializeAd.onAdError = function (t) {
							try {

								console.log("error1")
								localStorage.setItem("ads_status", "false");
								SaranyuInstaPlayer.Utils.DLOG.WARN("Ad Load Error: " + t.getError());
							}
							catch (err) { }
							try {
								console.log("error2")
								n._buildadvertisement.initializeAd.isLinear && (n._buildadvertisement.initializeAd.adMuted ? n._videoPlayerControls("mute") : n._videoPlayerControls("unmute"));
							}
							catch (err) {

								console.log(err);
							}
							try {
								console.log("error3")
								n._buildadvertisement.initializeAd.adsManager.destroy();
								n._buildrestarthls()
							} catch (err) { }
							try {
								clearInterval(n._buildadvertisement.initializeAd.intervalTimer);
							} catch (err) { }
							try {
								console.log("error4")
								SaranyuInstaPlayer.Utils.DLOG.INFO("Resetting Ad Container Height");
								n.container.adContainer.height("100%");
							} catch (err) { }
							try {
								console.log("error5")
								n.container.adContainer.removeClass("sp-ad-container-display");
							} catch (err) { }
							console.log("n._buildadvertisement.initializeAd.adObj.schedule", n._buildadvertisement.initializeAd.adObj.schedule)
							if (n._buildadvertisement.initializeAd.adObj.schedule) n._videoPlayerControls("play");

							else
								try {
									console.log("error6")
									Number(n.fullControls.playlistPanel.playingIndex) + 1 < n.options.file.length && n._videoPlayerControls("play")
								}
								catch (err) { }
							console.log("error7")
							n.container.adContainer.removeClass("sp-ad-active"),
								n.container.adContainer.removeClass("sp-ad-banner"),
								n._buildadvertisement.initializeAd.adStarted = false,
								n._buildadvertisement.initializeAd.isLinear = false;
						},
						// Variable to track current ad in pod


						n._buildadvertisement.initializeAd.onAdEvent = function (t) {



							switch (n._buildadvertisement.initializeAd.ad = t.getAd(), t.type) {

								case google.ima.AdEvent.Type.LOADED:
									if (n._buildadvertisement.initializeAd.ad.isLinear()) {
										console.log("Loading", n._buildadvertisement.initializeAd.adsManager);
										console.log("initial", n._buildadvertisement.initializeAd.ad.data.adPodInfo);
										localStorage.setItem("ads_status", "true");

										n.container.adContainer.loadingContainer.show()

										n._buildadvertisement.initializeAd.adStarted = true;
										n._buildadvertisement.initializeAd.isLinear = true;

										n.container.adContainer.addClass("sp-ad-active");

										try {
											n.container.adContainer.adBottomControls.volumeMuteUnmute.checkDefaultContentVolume();
										}
										catch (err) { }

										// n._buildadvertisement.initializeAd.setIntervalTimeLinear()
										// n._buildadvertisement.initializeAd.intervalTimer = setInterval(function () {
										// 	if (n._buildadvertisement.initializeAd.adsManager) {
										// 		try {
										// 			n._buildadvertisement.initializeAd.remainingTime = n._buildadvertisement.initializeAd.adsManager.getRemainingTime();
										// 			n._buildadvertisement.initializeAd.remainingTime = 0 <= n._buildadvertisement.initializeAd.remainingTime ? n._buildadvertisement.initializeAd.remainingTime : 0;
										// 			n._buildadvertisement._buildAdTime.changeCurrentTime();
										// 		} catch (err) {
										// 			SaranyuInstaPlayer.Utils.DLOG.WARN("Error accessing adsManager properties: " + err);
										// 		}
										// 	}
										// }, 100);
										// n._videoPlayerControls("pause");
										n.eventcallbacks.adLoaded(n._buildadvertisement.initializeAd.ad.data, n._buildadvertisement.initializeAd.adObj, parseInt(n.container.adContainer.adBottomControls.timeContainer.adscurrentTime));
										n._buildadvertisement.initializeAd.adsManager.resize(n.container.adContainer.adVideoElement.width(), n.container.adContainer.adVideoElement.height(), google.ima.ViewMode.NORMAL);
									}
									else {
										localStorage.setItem("ads_started", true);
										n._buildadvertisement.initializeAd.adStarted = true;
										n._buildadvertisement.initializeAd.isLinear = false;
										n.container.adContainer.addClass("sp-ad-banner");

										try {
											n.container.adContainer.adBottomControls.volumeMuteUnmute.checkDefaultContentVolume();
										} catch (err) { }

										n.container.adContainer.height(n._buildadvertisement.initializeAd.ad.getHeight() + 10);
										n._buildadvertisement.initializeAd.adsManager.resize(n.container.adContainer.adVideoElement.width(), n.container.adContainer.adVideoElement.height(), google.ima.ViewMode.NORMAL);
										n.container.adContainer.adVideoElement.append('<div class="sp-ad-banner-close">Close</div>');
										n.container.adContainer.adVideoElement.bannerAdClose = n.container.adContainer.adVideoElement.find(".sp-ad-banner-close");
										n.container.adContainer.adVideoElement.bannerAdClose.click(function () {
											n.container.adContainer.removeClass("sp-ad-banner");
											$(this).remove();
										});
									}
									break;
								case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED:
									console.log("CONTENT_RESUME_REQUESTED")
									n.container.adContainer.loadingContainer.show()
									n.clearBuffer(n.mediaElement.videoElement.hlsObj, n.mediaElement.videoElement)
									localStorage.setItem("ads_status", "false");
									n._buildrestarthls()
									// const adSetTimeout = null
									// if (adSetTimeout) {
									// 	clearTimeout(adSetTimeout)
									// 	adSetTimeout = null
									// }
									// adSetTimeout = setTimeout(() => {
									// 	n._videoPlayerControls("play")
									// }, 1000)

									break;


								case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED:
									console.log("CONTENT_PAUSE_REQUESTED")
									//  n.container.adContainer.loadingContainer.hide()
									// n._videoPlayerControls("pause");

									break;
								case google.ima.AdEvent.Type.STARTED:
									if (n._buildadvertisement.initializeAd.ad.isLinear()) {
										// n._buildadvertisement.initializeAd.setIntervalTimeLinear()
										n.container.adContainer.adVideoElement.show()
										n._videoPlayerControls("pause");

										n._buildadvertisement.initializeAd.ad.isLinear();
										n._buildadvertisement._createAdControls();
										// n._videoPlayerControls("pause");
										n.container.adContainer.loadingContainer.hide()
										n.eventcallbacks.adStarted(n._buildadvertisement.initializeAd.ad.data, n._buildadvertisement.initializeAd.adObj, parseInt(n.container.adContainer.adBottomControls.timeContainer.adscurrentTime));

										localStorage.setItem("ads_status", "true");
									}
									break;
								case google.ima.AdEvent.Type.CLICK:
									t.preventDefault();
									// n._buildadvertisement.initializeAd.adsManager.play();
									break;
								case google.ima.AdEvent.Type.PAUSED:
									// n._buildadvertisement.initializeAd.adPaused = true;
									// n.container.adContainer.adBottomControls.PlayPause.changeIcon();
									break;
								case google.ima.AdEvent.Type.RESUMED:
									// n._buildadvertisement.initializeAd.adPaused = false;
									// n.container.adContainer.adBottomControls.PlayPause.changeIcon();
									break;
								case google.ima.AdEvent.Type.TIME_UPDATE:
								case google.ima.AdEvent.Type.AD_PROGRESS:
									const adData = t.getAdData();
									// console.log(adData)
									const duration = adData.duration;
									const currentTime = adData.currentTime; // Correct way to get the ad's current time
									n._buildadvertisement.initializeAd.getRemainingTime = duration - currentTime
									n._buildadvertisement._buildAdTime.changeCurrentTime()


									break;

								case google.ima.AdEvent.Type.VOLUME_CHANGED:
									if (0 == n._buildadvertisement.initializeAd.adsManager.getVolume()) {
										n._buildadvertisement.initializeAd.adMuted = true;
									} else {
										n._buildadvertisement.initializeAd.adMuted = false;
										n.container.adContainer.adBottomControls.volumeSlider.positionVolumeHandle(n._buildadvertisement.initializeAd.adsManager.getVolume());
									}
									n.container.adContainer.adBottomControls.volumeMuteUnmute.changeIcon();
									break;
								case google.ima.AdEvent.Type.VOLUME_MUTED:
									n._buildadvertisement.initializeAd.adMuted = true;
									n.container.adContainer.adBottomControls.volumeMuteUnmute.changeIcon();
									break;
								case google.ima.AdEvent.Type.MIDPOINT:
									n.eventcallbacks.adsMIDPOINT(n._buildadvertisement.initializeAd.ad.data, n._buildadvertisement.initializeAd.adObj, n.container.adContainer.adBottomControls.timeContainer.adscurrentTime);
									break;
								case google.ima.AdEvent.Type.THIRD_QUARTILE:
									n.eventcallbacks.adsTHIRDQUARTILE(n._buildadvertisement.initializeAd.ad.data, n._buildadvertisement.initializeAd.adObj, parseInt(n.container.adContainer.adBottomControls.timeContainer.adscurrentTime));
									break;
								case google.ima.AdEvent.Type.FIRST_QUARTILE:
									n.eventcallbacks.adsFIRSTQUARTILE(n._buildadvertisement.initializeAd.ad.data, n._buildadvertisement.initializeAd.adObj, parseInt(n.container.adContainer.adBottomControls.timeContainer.adscurrentTime));
									break;
								case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
									n._buildadvertisement._destroyAdControls();

									localStorage.setItem("ads_status", "false");
									break;
								case google.ima.AdEvent.Type.COMPLETE:
									n.eventcallbacks.adsCOMPLETED(n._buildadvertisement.initializeAd.ad.data, n._buildadvertisement.initializeAd.adObj, parseInt(n.container.adContainer.adBottomControls.timeContainer.adscurrentTime));
									break;
								// localStorage.setItem("ads_status", "false");

								// // If there are more ads in the pod, play the next one
								// if (n._buildadvertisement.initializeAd.ad.data.adPodInfo.adPosition < n._buildadvertisement.initializeAd.ad.data.adPodInfo.totalAds) {
								// 	// n._buildadvertisement.initializeAd.setIntervalTimeLinear()
								// 	n._buildadvertisement.initializeAd.clearsetIntervalTimeLinear()
								// 	console.log("ads1 play position", n._buildadvertisement.initializeAd.ad.data.adPodInfo.adPosition)
								// 	return
								// } else {
								// 	n._buildadvertisement.initializeAd.clearsetIntervalTimeLinear()

								// 	n._buildadvertisement._destroyAdControls();
								// 	// n.resetHlsBuffer(o.mediaElement.videoElement.hlsObj, o.mediaElement.videoElement);

								// 	// n._buildadvertisement.setIntervalPlaybackAfterAds()

								// 	// let count = 0;
								// 	// const maxTriggers = 5;

								// 	// n.intervalId = setInterval(function () {
								// 	// 	if (ME.paused === false || count >= maxTriggers) {
								// 	// 		console.log("ads1 play clear")
								// 	// 		clearInterval(n.intervalId); // Stop if video is playing or count reaches max
								// 	// 		return;
								// 	// 	}

								// 	// 	count++;
								// 	// 	console.log(`Triggeredplay ${count} time(s)`);
								// 	// }, 1000);
								// 	// n._videoPlayerControls("play"); // Attempt to play video


								// }
								// break;



								case google.ima.AdEvent.Type.SKIPPED:
									localStorage.setItem("ads_status", "false");
									n._buildadvertisement.initializeAd.onAdError();
									break;
							}
						};
					n._buildadvertisement.initializeAd.clearsetIntervalTimeLinear = function () {
						clearInterval(n._buildadvertisement.initializeAd.intervalTimer)

					};
					n._playercontrolsbufferReset = function () {

					};

					// n._buildadvertisement.initializeAd.setIntervalTimeLinear = function () {

					// 	console.log("setInterval Time:")
					// 	n._buildadvertisement.initializeAd.intervalTimer = setInterval(function () {
					// 		if (n._buildadvertisement.initializeAd.adsManager) {
					// 			try {

					// 				n._buildadvertisement.initializeAd.remainingTime = n._buildadvertisement.initializeAd.adsManager.getRemainingTime();
					// 				n._buildadvertisement.initializeAd.remainingTime = 0 <= n._buildadvertisement.initializeAd.remainingTime ? n._buildadvertisement.initializeAd.remainingTime : 0;
					// 				n._buildadvertisement._buildAdTime.changeCurrentTime();
					// 				n._videoPlayerControls("pause");
					// 			} catch (err) {
					// 				SaranyuInstaPlayer.Utils.DLOG.WARN("Error accessing adsManager properties: " + err);
					// 			}
					// 		}
					// 	}, 1000);
					// }


					n._buildadvertisement.initializeAd.onContentPauseRequested = function () {
						n._buildadvertisement.initializeAd.videoContent.pause();
					},
						n._buildadvertisement.initializeAd.onContentResumeRequested = function () {
							n._buildadvertisement.initializeAd.videoContent.play();
						},
						n._buildadvertisement.initializeAd.init(t);
				}
			n._buildadvertisement.adsets = a.advertisement.adsets;
			n._buildadvertisement.adinvoker = function () {
				n._buildadvertisement.adinvoker.peroll;
				n._buildadvertisement.adinvoker.midroll = [];
				n._buildadvertisement.adinvoker.postroll;
				$.each(n._buildadvertisement.adsets, function (t, e) {
					try {
						if (!isNaN(e.schedule)) {
							e.flag = true;
							n._buildadvertisement.adinvoker.midroll.push(e);
						}
					} catch (err) {
						SaranyuInstaPlayer.Utils.DLOG.ERR(err);
					}

					// Uncomment this section if you want postroll ads
					// try {
					//     if (e.schedule === "postroll") {
					//         n.mediaElement.videoElement.addEventListener("ended", function () {
					//             if (n._buildadvertisement.adinvoker.postroll) {
					//                 SaranyuInstaPlayer.Utils.DLOG.INFO("Postroll ad has been played");
					//             } else {
					//                 SaranyuInstaPlayer.Utils.DLOG.INFO("Postroll ad has been invoked");
					//                 n._buildadvertisement.initializeAd.adObj = e;
					//                 n._buildadvertisement.initializeAd(n._buildadvertisement.initializeAd.adObj);
					//                 n._buildadvertisement.adinvoker.postroll = true;
					//             }
					//         });
					//     }
					// } catch (err) {
					//     SaranyuInstaPlayer.Utils.DLOG.ERR(err);
					// }
				});

				let lastAdTime = -1; // Store last triggered ad time
				let lastCheckedTime = -1; // Store last checked time to reduce redundant searches
				n._buildadvertisement.prerollPlayed = false
				n.mediaElement.videoElement.addEventListener("timeupdate", function () {

					var o = n.mediaElement.videoElement;
					if (!o || !n._buildadvertisement.adinvoker.midroll) return;

					let currentTime = Math.floor(o.currentTime);
					if (currentTime === lastCheckedTime) return; // Skip redundant checks
					lastCheckedTime = currentTime;

					if (n.options.advertisement.cue && o.duration) {
						n._buildadvertisement._buildAdCue(o.duration);
					}

					// Mid-roll ad logic
					let left = 0,
						index = 0,
						right = n._buildadvertisement.adinvoker.midroll.length - 1,
						closestSmaller = null;

					while (left <= right) {
						let mid = Math.floor((left + right) / 2);


						if (parseInt(o.currentTime) >= n._buildadvertisement.adinvoker.midroll[mid].schedule) {
							index = mid;

							closestSmaller = n._buildadvertisement.adinvoker.midroll[index];
							left = mid + 1; // Move right to find the closest smaller value
						} else {
							right = mid - 1; // Move left
						}
					}

					if (!o.paused && closestSmaller && closestSmaller.flag) {
						if (lastAdTime === closestSmaller.schedule) return; // Prevent multiple triggers for the same ad


						n._buildprogressbar.adjustCurrentAndHandleInSeek(window.playbackTime / o.duration);
						n._buildadvertisement.initializeAd.adObj = closestSmaller;
						n._buildadvertisement.initializeAd(closestSmaller);

						n._buildadvertisement.adinvoker.midroll[index].flag = false;

						lastAdTime = closestSmaller.schedule; // Store last triggered ad time
					}


					// Ensure tracking flags exist
					if (!n._buildadvertisement) {
						n._buildadvertisement = {};
					}

					if (!n._buildadvertisement.prerollPlayed) {
						n._buildadvertisement.prerollPlayed = false;
					}

					if (!n._buildadvertisement.postrollPlayed) {
						n._buildadvertisement.postrollPlayed = false;
					}

					$.each(n._buildadvertisement.adsets, function (_, e) {

						if (e.schedule === "preroll" && !n._buildadvertisement.prerollPlayed) {
							if (localStorage.getItem("preroll_status_ads_callback") == "true") {
								SaranyuInstaPlayer.Utils.DLOG.INFO("Preroll ad has been invoked");
								n._buildadvertisement.initializeAd.adObj = e;

								n._buildadvertisement.initializeAd(n._buildadvertisement.initializeAd.adObj);
								n._buildadvertisement.adinvoker.preroll = true;
								n._buildadvertisement.prerollPlayed = true
								n._buildadvertisement.adinvoker.midroll.push(e)
							}
							// Preroll Ad (Only triggers once)

						}
						// Postroll Ad (Only triggers once)
						if (o.currentTime >= o.duration - 15 && !n._buildadvertisement.postrollPlayed) {
							;

							try {

								if (e.schedule === "postroll") {
									SaranyuInstaPlayer.Utils.DLOG.INFO("Postroll ad has been invoked");
									n._buildadvertisement.initializeAd.adObj = e;
									n._buildadvertisement.initializeAd(n._buildadvertisement.initializeAd.adObj);
									n._buildadvertisement.postrollPlayed = true; // Mark postroll as played
								}
							} catch (err) {
								SaranyuInstaPlayer.Utils.DLOG.ERR(err);
							}
						}
					});

				});


			},
				(function () {
					// if (!window.IMASDKLoaded) {
					// 	var i = document.createElement("script");
					// 	i.type = "text/javascript",
					// 		i.src = SaranyuInstaPlayer.IMASDK,
					// 		document.getElementsByTagName('head')[0].appendChild(i);
					// 	i.addEventListener("load", function () {
					// 		window.IMASDKLoaded = true;

					// 		n._buildadvertisement.adinvoker()
					// 	});
					// } else {

					n._buildadvertisement.adinvoker();
					// }
				})();

		},

		_heartbeatMonitor: function () {
			var l = this;
			pauseInterval = null;
			beatInterval = l.options.heartBeat.beatInterval;
			catalogID = l.options.heartBeat.catalogID;
			contentID = l.options.heartBeat.contentID;
			regionID = l.options.heartBeat.region;
			apiendPoint = l.options.heartBeat.url;
			authKey = l.options.heartBeat.authKey;
			beatInterval = beatInterval * 1000;
			throttle = function (fn, threshhold, scope) {
				threshhold || (threshhold = 250);
				var last, deferTimer;
				return function () {
					var context = scope || this;
					var now = +new Date,
						args = arguments;
					if (last && now < last + threshhold) {
						clearTimeout(deferTimer);
						deferTimer = setTimeout(function () {
							last = now;
							fn.apply(context, args);
						}, threshhold);
					}
					else {
						last = now;
						fn.apply(context, args);
					}
				};
			};
			generateAJAX = function (playbackTime) {
				$.ajax({
					type: "POST",
					url: apiendPoint,
					contentType: "application/json",
					data: JSON.stringify({
						"auth_token": authKey,
						"region": regionID,
						"listitem": {
							"catalog_id": catalogID,
							"content_id": contentID,
							"play_back_time": playbackTime,

						}
					}),
					success: function (response) {
						localStorage.setItem("invalidsession", false)
					},
					error: function (error) {

						console.log(error)
						if (localStorage.getItem("session_id") != null && localStorage.getItem("session_id") != undefined && error.responseJSON.error.code == 1016) {
							localStorage.setItem("invalidsession", true)
							l.eventcallbacks.onBack();
						}
					}
				});
			};
			window.watchhistory = generateAJAX(playbackTime)
			ME.addEventListener('timeupdate', throttle(function () {
				var intPlayedTime = parseInt(ME.currentTime, 10);
				var playbackTime = SaranyuInstaPlayer.Utils.convertSecondsTimecode(intPlayedTime);
				if (intPlayedTime > 0) {
					if (window.location.hash == '#/player/vod' || window.location.hash == "#/liveplayer/live") {
						generateAJAX(playbackTime);
					}
					// generateAJAX(playbackTime);
					SaranyuInstaPlayer.Utils.DLOG.INFO("Beat Firing from TIMEUPDATE Event " + new Date().getSeconds());
				}
			}, beatInterval));
			ME.addEventListener('pause', function () {
				pauseInterval = setInterval(function () {
					if (l._ifsourceAvailable()) {
						var intPlayedTime = parseInt(ME.currentTime, 10);
						var playbackTime = SaranyuInstaPlayer.Utils.convertSecondsTimecode(intPlayedTime);
						if (intPlayedTime > 0) {

							if (window.location.hash == '#/player/vod' || window.location.hash == "#/liveplayer/live") {
								generateAJAX(playbackTime);
							}

						}
						SaranyuInstaPlayer.Utils.DLOG.INFO("Beat Firing from PAUSE Event " + new Date().getSeconds());
					}
					else {
						clearInterval(pauseInterval);
						SaranyuInstaPlayer.Utils.DLOG.INFO("Source Not Found, Clearing Beat Interval");
					}
				}, beatInterval);
			});
			ME.addEventListener('play', function () {
				clearInterval(pauseInterval);
			});
			ME.addEventListener('playing', function () {
				clearInterval(pauseInterval);
			});
			ME.addEventListener('timeupdate', function () {
				if (window.location.hash == '#/player/vod' || window.location.hash == "#/liveplayer/live") {
					if(ME.duration - ME.currentTime ==10 || ME.duration - ME.currentTime <=2)
							generateAJAX(playbackTime);
						}
			});
			ME.addEventListener('ended', function () {
				if (l._ifsourceAvailable()) {
					var intPlayedTime = parseInt(ME.currentTime, 10);
					var playbackTime = SaranyuInstaPlayer.Utils.convertSecondsTimecode(intPlayedTime);
					if (intPlayedTime > 0) {
						if (window.location.hash == '#/player/vod' || window.location.hash == "#/liveplayer/live") {
							generateAJAX(playbackTime);
						}


						// generateAJAX(playbackTime);
					}
					SaranyuInstaPlayer.Utils.DLOG.INFO("Beat Firing from PAUSE Event " + new Date().getSeconds());
				}
				else {
					clearInterval(pauseInterval);
					SaranyuInstaPlayer.Utils.DLOG.INFO("Source Not Found, Clearing Beat Interval");
				}
			});
		},
		_attachErrorview: function (a, b) {
			SaranyuInstaPlayer.Utils.DLOG.INFO("Attaching Error Screen Element");
			var e = this;
			e.playerInner.append('<div class="sp-player-errors"><div class="sp-error-icon"></div><div class="sp-error-info"></div><div class="sp-error-subinfo"></div><div class="sp-error-btn focusable">GO BACK</div></div>');
			e.playerInner.errorLayer = e.playerInner.find(".sp-player-errors");
			e.playerInner.errorLayer.errorInfo = e.playerInner.errorLayer.find(".sp-error-info");
			e.playerInner.errorLayer.errorsubInfo = e.playerInner.errorLayer.find(".sp-error-subinfo");
			e.playerInner.errorLayer.errorInfo.html(a);
			e.playerInner.errorLayer.errorsubInfo.html(b);

			$('.sp-error-btn').click(function () {
				window.history.back();
			});

			$('.sp-error-btn').on('sn:enter-down', function () {
				window.history.back();
			})

			try {
				e.fullControls.bottomControlBar.hide(), e._destroyMedia();
			}
			catch (e) { }
		},
		_buildeventcallbacks: function () {
			SaranyuInstaPlayer.Utils.DLOG.INFO("Attaching Event Callbacks");
			var t = this;
			var pastTime = 0;
			var presentTime = 0;
			e = t.mediaElement.videoElement;
			t.eventcallbacks = {};

			e.addEventListener("play", function () {
				try {
					e.currentTime <= 1 ? t.eventcallbacks.onPlay(e.currentTime, e.duration, e.mediaId) : t.eventcallbacks.onResume(e.currentTime, e.duration, e.mediaId);
				}
				catch (t) {
					SaranyuInstaPlayer.Utils.DLOG.WARN("Callback Event Play / Resume: Not Listened")
				}
			});
			e.addEventListener("pause", function () {
				try {
					t.eventcallbacks.onPause(e.currentTime, e.duration, e.mediaId);
				}
				catch (t) {
					SaranyuInstaPlayer.Utils.DLOG.WARN("Callback Event Pause: Not Listened")
				}
			});
			e.addEventListener("timeupdate", function () {
				pastTime = presentTime;
				presentTime = e.currentTime;
				$("#sp-subtitles-wrapper").is

				if (isFirstTime === true) { }
			});
			e.addEventListener("seeking", function () {
				if (e.currentTime < pastTime) {
					try {
						t.eventcallbacks.onBackwardSeek(pastTime, e.currentTime, e.duration, e.mediaId);
					}
					catch (i) {

					}
				}
				else {
					try {
						t.eventcallbacks.onForwardSeek(pastTime, e.currentTime, e.duration, e.mediaId);
					}
					catch (i) { }
				}
			});
			e.addEventListener("seeked", function () {
				try {
					t.eventcallbacks.onSeeked(pastTime, e.currentTime, e.duration, e.mediaId)
				}
				catch (t) {
					SaranyuInstaPlayer.Utils.DLOG.WARN("Callback Event Seeked: Not Listened")
				}
			});
			e.addEventListener("waiting", function () {
				try {
					if (!e.paused) {
						t.eventcallbacks.onBuffering(e.currentTime, e.duration, e.mediaId)
					}
				}
				catch (t) {
					SaranyuInstaPlayer.Utils.DLOG.WARN("Callback Event Buffering: Not Listened")
				}
			});
			e.addEventListener("ended", function () {
				try {
					t.eventcallbacks.onComplete(e.currentTime, e.duration, e.mediaId);
				}
				catch (t) { }
			});
			e.addEventListener("volumechange", function () {
				try {
					SaranyuInstaPlayer.Utils.DLOG.INFO("Player Volume Updated");
				}
				catch (t) { }
			});
		},
		_videoPlayerControls: function (t, e) {

			var o = this,
				l = o.mediaElement.videoElement;

			switch (o.options, t) {
				case "play":
					if ("hls" === o.playerType && 0 === o.mediaElement.videoElement.duration) {
						o._createAndAppendMedia._attachHLStoVideo();
					}
					else {
						l.play().then(() => {
						}).catch(() => {
							l.muted = true;
							l.play().then(() => { });
						});
					}
					break;
				case "pause":
					l.pause();
					break;
				case "mute":
					l.muted = true;
					break;
				case "unmute":
					l.muted = false;
					break;
				case "volumechange":
					l.volume = e;
					break;
				case "seek":
					l.currentTime = e;
					break;
				case "backwardseek":
					l.currentTime = e;
			}
		},
		_getCurrentTime: function () {
			return ME.currentTime;
		},
		_getTotalDuration: function () {
			return ME.duration;
		},
		_isSupportedMSE: function () {
			return window.MediaSource = window.MediaSource || window.WebKitMediaSource, window.MediaSource && "function" == typeof window.MediaSource.isTypeSupported && window.MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"')
		},
		_checkHLS: function () {
			return !!(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i))
		},
		_loadcallbacks: function () {
			window.playerLoadedCallback && window.playerLoadedCallback();
		},
		_ifsourceAvailable: function () {
			if (ME.attributes.src) {
				return true;
			}
			return false;
		},
		_destroyMedia: function () {

			var t = window.InstaPlayer;
			e = ME
			n = this;
			const cleanup = () => {
				try {
					if (n._buildadvertisement.initializeAd.adsManager) {
						n._buildadvertisement.initializeAd.adsManager.destroy();
						n._buildadvertisement.initializeAd.adsManager = null;
					}

					if (n._buildadvertisement.initializeAd.adsLoader) {
						n._buildadvertisement.initializeAd.adsLoader.destroy();
						n._buildadvertisement.initializeAd.adsLoader = null;
					}

					if (n._buildadvertisement.initializeAd.intervalTimer) {
						clearInterval(n._buildadvertisement.initializeAd.intervalTimer);
						n._buildadvertisement.initializeAd.intervalTimer = null;
					}

					if (n._buildadvertisement.initializeAd.adDisplayContainer) {
						n._buildadvertisement.initializeAd.adDisplayContainer.destroy();
						n._buildadvertisement.initializeAd.adDisplayContainer = null;
					}

					n.container.adContainer.adVideoElement.empty();
					n.container.adContainer.adVideoElement.hide()

					// Reset state variables
					n._buildadvertisement.initializeAd.adStarted = false;
					n._buildadvertisement.initializeAd.isLinear = false;
					n._buildadvertisement.initializeAd.adPaused = false;
					n._buildadvertisement.initializeAd.adMuted = false;

					n.container.adContainer.removeClass("sp-ad-container-display");
					n.container.adContainer.removeClass("sp-ad-active");
					n.container.adContainer.removeClass("sp-ad-banner");
				} catch (err) {
					console.error("Error during cleanup:", err);
				}
			};

			// Run cleanup before initializing new instance
			cleanup();

			if (t.playerType == "hls") {
				try {
					e.hlsObj.destroy();
				}
				catch (i) { }
			}
			else if (t.playerType == "mpd") {
				try {
					e.dashObj.destroy();
				}
				catch (i) { }
			}
			else if (t.playerType == "mp4") {
				try {
					e = "";
				}
				catch (i) { }
			}
		},

		// 	try {
		// 		// Initialize Spatial Navigation
		// 		SpatialNavigation.init();

		// 		// Log to check if the init is successful
		// 		console.log('SpatialNavigation initialized');

		// 		// Add focusable elements
		// 		SpatialNavigation.add({
		// 			selector: '.playerContainer .focusable', // Ensure this selector is correct
		// 			defaultElement: '.sp-progress-bar-handle', // Ensure this element exists and is focusable
		// 			enterTo: '.sp-progress-bar-handle' // Same as defaultElement
		// 		});

		// 		$('.sp-progress-bar-handle').focus()
		// 		// Log to confirm elements are added
		// 		console.log('Focusable elements added');

		// 		// Make elements focusable
		// 		SpatialNavigation.makeFocusable();

		// 		// Set focus
		// 		SpatialNavigation.focus();

		// 		// Log to confirm focus
		// 		console.log('Focus set to', '#sp-progress-bar-handle');

		// 	} catch (error) {
		// 		console.error('Error in focusNavigation:', error);
		// 	}
		// },
		_focusNavigation: function () {
			SpatialNavigation.init();
			SpatialNavigation.add({
				selector: '#playerContainer .focusable',
				defaultElement: '#sp-progress-bar-handle',
				enterTo: "#sp-progress-bar-handle"
			});

			// SpatialNavigation.add({
			// 	selector: '.sp-quality-switch-btn',
			// });
			SpatialNavigation.add({
				selector: '#sp-progress-bar-handle',
			});

			SpatialNavigation.makeFocusable();
			SpatialNavigation.focus();
		},
		_testCapabilities: function (type) {
			var t = this;
			var videoData = t.mediaElement.videoElement;
			if (type == 'hevc') {
				const codec = 'video/mp4; codecs="hev1"';
				var canPlay = videoData.canPlayType(codec);
				if (canPlay === 'probably' || canPlay === 'maybe') {
					return (true);
				} else {
					return (false);
				}
			}
		}
	}