export const userAgent = () => {
    const appVersion = window.navigator.appVersion;
    const patternWebOS = /WebOS/;
    const patternTizen = /Tizen/;
    const patternWebOSTV = /SmartTV/;

    if (!patternWebOS.test(appVersion) && !patternTizen.test(appVersion) && !patternWebOSTV.test(appVersion)) {
        // If the appVersion doesn't match WebOS or Tizen
        window.location.href = "https://HelloMeghalaya.in/";
    } // Replace with your desired URL

}