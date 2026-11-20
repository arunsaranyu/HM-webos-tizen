import React from 'react'




const sdkDolbyFunction = () => {
    const appversion = window.navigator.appVersion
    let pattern = /WebOS/;
    let pattern2 = /SmartTV/;
    let pattern3 = /Tizen/;
    let pattern4 = /TizenOS/;
    let result = pattern.test(appversion)
    let result2 = pattern2.test(appversion)
    let result3 = pattern3.test(appversion)
    let result4 = pattern4.test(appversion)

    function setVisionFalse() {
        try {
            localStorage.setItem("vision", "false");
        } catch (e) {
            console.error("Error saving to localStorage:", e);
        }
    }

  function atmosDetection() {
  try {
    // Default to false
    localStorage.setItem("atmos", "false");
  } catch (e) {
    console.warn("LocalStorage not available", e);
  }

  var config = {
    type: "media-source",
    audio: {
      contentType: 'audio/mp4; codecs="ec-3"',
      channels: "16",
      samplerate: 48000,
      bitrate: 1024000
    }
  };

  if (navigator.mediaCapabilities && navigator.mediaCapabilities.decodingInfo) {
    navigator.mediaCapabilities.decodingInfo(config).then(function(info) {
      if (info.supported) {
        try {
          localStorage.setItem("atmos", "true");
        } catch (e) {
          console.warn("LocalStorage not available", e);
        }
      }
      console.log("EC-3 channelM16 support:", info.supported);
    }).catch(function(err) {
      console.error("Error checking media capabilities:", err);
    });
  } else {
    console.warn("MediaCapabilities API not supported in this browser.");
  }
}


    function VisionDetection() {
        const configvision = {
            type: "media-source", // or "file" for direct file playback
            video: {
                contentType: 'video/mp4; codecs="dvhe.05.06"', // Dolby Vision Profile 5
                width: 1920,
                height: 1080,
                bitrate: 10000000,
                framerate: 30,


            },
        };

        // navigator.mediaCapabilities.decodingInfo(configvision).then((info) => {
        //     console.log("Dolby Vision support (dvhe.05.06):", info.supported);
        //     localStorage.setItem("vision", info.supported.toString());

        // });



        if (navigator.mediaCapabilities && navigator.mediaCapabilities.decodingInfo) {
            navigator.mediaCapabilities.decodingInfo(configvision)
                .then(function (info) {
                    console.log("Dolby Vision support (dvhe.05.06):", info.supported);
                    try {
                        localStorage.setItem("vision", info.supported ? "true" : "false");
                    } catch (e) {
                        console.error("Error saving to localStorage:", e);
                        setVisionFalse();
                    }
                })
                .catch(function (error) {
                    console.error("Error checking Dolby Vision support:", error);
                    setVisionFalse();
                });
        } else {
            console.warn("MediaCapabilities API not supported on this device/browser.");
            try {
                var videoEl = document.createElement('video');
                var canPlay = videoEl.canPlayType('video/mp4; codecs="dvhe.05.06"');
                var supported = (canPlay === "probably" || canPlay === "maybe");
                localStorage.setItem("vision", supported ? "true" : "false");
            } catch (e) {
                console.error("Error saving fallback result to localStorage:", e);
                setVisionFalse();
            }
        }
    }
    if (result || result2) {
        if (webOS.platform.tv === true) {
            if (window.webOS && window.webOS.deviceInfo) {
                window.webOS.deviceInfo((info) => {
                    // console.log("Device Information:", info);
                    if (info.dolbyVision == true) {
                        localStorage.setItem("vision", info.dolbyVision.toString());
                        atmosDetection()
                        // localStorage.setItem("atmos", info.dolbyAtmos.toString());
                    } else {
                        VisionDetection()
                        atmosDetection()
                    }
                    // if (info.dolbyAtmos == true || info.dolbyAtmos == false) {
                    //     localStorage.setItem("atmos", info.dolbyAtmos.toString());
                    //     localStorage.setItem("vision", info.dolbyVision.toString());


                    // }

                });
            }
        }

    }
    else if (result3 || result4) {
        // localStorage.setItem("vision", "false");
        VisionDetection()
        atmosDetection()
        // localStorage.setItem("atmos", "false");
        localStorage.setItem("platform", "TizenOS")
    }
    else {
        // localStorage.setItem("vision", "false");
        VisionDetection()
        atmosDetection()
        // localStorage.setItem("atmos", "false");
        localStorage.setItem("platform", "WebOS")
    }







    // if (window.webOS && window.webOS.deviceInfo) {
    //     window.webOS.deviceInfo((info) => {
    //         // console.log("Device Information:", info);
    //     });
    // }
    // else {
    //     // console.log("webOS SDK is not available.");
    // }

}


export default sdkDolbyFunction