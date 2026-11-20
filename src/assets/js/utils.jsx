let splashHandled = false;

export const hideSplash = function () {
  if (splashHandled) return;

  const splashEl = document.getElementById("splash");
  const videoEl = document.getElementById("video");

  if (!splashEl) {
    splashHandled = true;
    return;
  }

  const closeSplash = () => {
    if (splashHandled) return;
    splashHandled = true;

    if (videoEl) {
      try {
        videoEl.pause();
        videoEl.muted = true;
        videoEl.currentTime = 0;
        videoEl.removeAttribute("src");
        videoEl.removeAttribute("autoplay");
        const sourceEl = videoEl.querySelector("source");
        if (sourceEl) {
          sourceEl.removeAttribute("src");
          sourceEl.remove();
        }
        videoEl.load();
      } catch (e) {
        console.warn("Error cleaning up splash video:", e);
      }
    }

    if (splashEl) {
      splashEl.style.display = "none";
      if (splashEl.parentNode) {
        splashEl.parentNode.removeChild(splashEl);
      }
    }
  };

  // If there is no video element, close splash with a short delay
  if (!videoEl) {
    setTimeout(closeSplash, 500);
    return;
  }

  // If video has already finished playing
  if (videoEl.ended) {
    closeSplash();
    return;
  }

  // Safety fallback: ensure splash is dismissed even if video stalls or fails (6.5s)
  const fallbackTimer = setTimeout(() => {
    closeSplash();
  }, 6500);

  // Wait for the splash video to play in full until 'ended'
  videoEl.addEventListener(
    "ended",
    () => {
      clearTimeout(fallbackTimer);
      closeSplash();
    },
    { once: true }
  );

  videoEl.addEventListener(
    "error",
    () => {
      clearTimeout(fallbackTimer);
      closeSplash();
    },
    { once: true }
  );
};
