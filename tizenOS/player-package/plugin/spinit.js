/**
 * Saranyu Insta Player
 * Player Version: 4.0.0
 * Base Version: 4.0.0
 */

var spBundle, spjQuery, spCore, spNavigation, Player, baseURL, isLoaded = false;
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

baseURL = './'





function SaranyuInstaPlayer(e, n, a) {
    if (!isLoaded) {
        loadAssets(e, n, a);
    } else {
        Player = new SaranyuInstaPlayer.MediaPlayer(n, a, checkExtension(a));
        window.InstaPlayer = Player;
        a.registerCallBacks();
    }
}

function checkExtension(e) {
    return "" == e.file[0].content_url ? (mediaType = "hls", "hls") : -1 != e.file[0].content_url.indexOf("mpd") ? (mediaType = "mpd", "mpd") : -1 != e.file[0].content_url.indexOf("m3u8") ? (mediaType = "hls", "hls") : (mediaType = "mp4", "mp4")
}

function licenseChecker(e, n) {
    generatePlayer(e, n)
}

function loadAssets(e, n, a) {
    isLoaded = true;
    spBundle = baseURL + "player-package/plugin/core/bundle.min.js";
    spNavigation = baseURL + "player-package/external/navigation/spNavigation.js";
    spjQuery = baseURL + "player-package/external/jquery/jquery.min.js";
    spCore = baseURL + "player-package/plugin/spcore.js";
    spui = baseURL + "player-package/ui/spweb-ui.css";
    // sppiechart    = "https://cdnjs.cloudflare.com/ajax/libs/easy-pie-chart/2.1.6/jquery.easypiechart.min.js";
    var h = document.createElement("link");
    h.rel = "stylesheet";
    h.type = "text/css";
    h.href = spui;
    document.getElementsByTagName('head')[0].appendChild(h);
    var l = document.createElement("script");
    l.type = "text/javascript";
    l.async = true;
    l.src = spNavigation;
    document.body.appendChild(l);
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = spBundle;
    document.body.appendChild(s);
    s.addEventListener("load", function () {
        licenseChecker(n, a)
    });
}

function generatePlayer(e, n) {
    var j = document.createElement("script");
    j.type = "text/javascript";
    j.src = spjQuery;
    document.body.appendChild(j);
    var a = document.createElement("script");
    a.type = "text/javascript";
    a.src = spCore;
    // var p = document.createElement("script");
    // p.type = "text/javascript";
    // p.src = sppiechart;
    j.addEventListener("load", function () {
        document.body.appendChild(a)

    });
    a.addEventListener("load", function () {
        Player = new SaranyuInstaPlayer.MediaPlayer(e, n, checkExtension(n));
        try {
            window.InstaPlayer = Player;
            n.registerCallBacks();
        } catch (e) {
            SaranyuInstaPlayer.Utils.DLOG.INFO(e);
        }
    });
}
