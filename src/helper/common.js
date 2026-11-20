export const detectPlatform = () => {


  const appversion = window.navigator.appVersion;
  let pattern = /WebOS/;
  let pattern3 = /Tizen/;
  let pattern2 = /TizenOS/;
  let pattern4 = /SmartTV/;
  let result = pattern.test(appversion);

  let result2 = pattern2.test(appversion);
  let result3 = pattern3.test(appversion);
  let result4 = pattern4.test(appversion);
  if (result || result4) {
    localStorage.setItem("platform", "WebOS");
  } else if (result2) {
    localStorage.setItem("platform", "TizenOS");
  } else if (result3) {
    localStorage.setItem("platform", "TizenOS");
  } else {
    localStorage.setItem("platform", "WebOS");
  }

  return localStorage.getItem("platform");
};

export default detectPlatform;
