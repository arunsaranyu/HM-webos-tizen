
export const isHomePath = (pathname, firstIndex) => {
  if (!pathname) return true;

  // Strip leading hash, query parameters, and trim
  let clean = pathname.replace(/^#\/?/, '/').split('?')[0].trim();
  if (!clean.startsWith('/')) clean = '/' + clean;
  if (clean.length > 1 && clean.endsWith('/')) clean = clean.slice(0, -1);

  if (clean === '/' || clean === '/home-list') {
    return true;
  }

  if (firstIndex) {
    const cleanFirstIndex = firstIndex.replace(/^#\/?/, '/').replace(/^\/?/, '/');
    if (clean === cleanFirstIndex) {
      return true;
    }
  }

  return false;
};


export const isHomeHash = (hash = (typeof window !== 'undefined' ? window.location.hash : ''), firstIndex) => {
  if (!hash || hash === '#' || hash === '#/' || hash === '#!/') return true;
  const path = hash.replace(/^#\/?/, '/');
  return isHomePath(path, firstIndex);
};


export const requestExitPopup = () => {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent('trigger-exit-popup'));
  } catch (e) {
    const evt = document.createEvent('Event');
    evt.initEvent('trigger-exit-popup', true, true);
    window.dispatchEvent(evt);
  }
};


export const closeApp = () => {
  try {
    // 1. webOS application API
    if (
      typeof window !== 'undefined' &&
      window.webOS &&
      window.webOS.application &&
      typeof window.webOS.application.close === 'function'
    ) {
      window.webOS.application.close();
      return;
    }
  } catch (e) {
    console.warn('Error in webOS.application.close:', e);
  }

  try {
    // 2. webOS PalmSystem API
    if (
      typeof window !== 'undefined' &&
      window.PalmSystem &&
      typeof window.PalmSystem.exit === 'function'
    ) {
      window.PalmSystem.exit();
      return;
    }
  } catch (e) {
    console.warn('Error in window.PalmSystem.exit:', e);
  }

  try {
    // 3. Tizen application API
    if (typeof window !== 'undefined' && window.tizen && window.tizen.application) {
      const app = window.tizen.application.getCurrentApplication();
      if (app && typeof app.exit === 'function') {
        app.exit();
        return;
      }
    }
  } catch (e) {
    console.warn('Error in tizen.application.getCurrentApplication.exit:', e);
  }

  try {
    // 4. Custom window.exitApp
    if (typeof window !== 'undefined' && typeof window.exitApp === 'function') {
      window.exitApp();
      return;
    }
  } catch (e) {
    console.warn('Error in window.exitApp:', e);
  }

  try {
    // 5. Browser fallback
    if (typeof window !== 'undefined' && typeof window.close === 'function') {
      window.close();
    }
  } catch (e) {
    console.warn('Error in window.close:', e);
  }
};

