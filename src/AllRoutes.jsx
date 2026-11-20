import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Search from "./components/pages/Search/Search.jsx";
import Sidebar from "./components/reusable/Sidebar/Sidebar.jsx";
import { useDispatch, useSelector } from "react-redux";

import Seeall from "./components/pages/Seeall/Seeall.jsx";
import DetailsPage from "./components/pages/Detailspage/Detailspage.jsx";
import Settings from "./components/pages/Settings/Settings.jsx";
import StaticPage from "./components/pages/StaticPage/StaticPage.jsx";
import ShowsDetails from "./components/pages/ShowsDetailsPage/ShowsDetails.jsx";
import Activate from "./components/pages/Activate/Activate.jsx";
import Login from "./components/pages/Login/Login.jsx";
import Player from "./components/pages/Player/Player.jsx";
import OtpPage from "./components/pages/OtpPage/OtpPage.jsx";
import UserDetails from "./components/pages/UserDetails/UserDetails.jsx";
import Planspage from "./components/pages/PlansPage/PlansPage.jsx";
import Profile from "./components/pages/Profile/Profile.jsx";
import CreateProfile from "./components/pages/Profile/createProfile.jsx";
import EditProfile from "./components/pages/Profile/EditProfile.jsx";
import Watchlater from "./components/pages/Watchlater/Watchlater.jsx";
import Season from "./components/pages/Season/Season.jsx";
import Recommend from "./components/pages/Recommend/Recommend.jsx";
import Info from "./components/pages/Info/Info.jsx";

import LoginManditory from "./components/pages/LoginManditory/LoginManditory.jsx";
import AlertsPage from "./components/pages/AlertsPage/AlertsPage.jsx";
import ExitAlert from "./components/pages/ExitAlert/ExitAlert.jsx";
import StaticReusable from "./components/reusable/StaticReusable/StaticReusable.jsx";
// import InstaPlayerBanner from "./components/pages/PlayerBanner/PlayerBanner.jsx";
import DeletePage from "./components/pages/AlertsPage/DeletePage.jsx";
import SeasonsSeeAll from "./components/pages/SeasonsSeeAll/SeasonsSeeAll.jsx";
import LivePlayer from "./components/pages/Player/LivePlayer.jsx"
import Catalog from "./components/pages/Catalog/Catalog.jsx";
import ProtectedRoutes from "./components/reusable/ProtectedRoutes/ProtectedRoutes.jsx";
import { getAppConfig } from "./redux/reducer/commonReducer.jsx";
import { getSidebarData } from "./redux/reducer/sidebarReducer.jsx";
import Landing from "./components/pages/Landing/Landing.jsx";
import Subscribe from "./components/pages/Subscribe/Subscribe.jsx";

const AllRoutes = (props) => {
  const { setShow } = props
  const { focusKey } = useFocusable({ isFocusBoundary: true });
  const sidebar = useSelector((state) => state?.landing?.sidebar);
  const regiondata = useSelector((state) => state?.common?.data);
  const dispatch = useDispatch()

  return (
    <FocusContext.Provider value={focusKey}>
      {sidebar === true ? <Sidebar focuskey="MENU" /> : ""}
      <Routes>
        <Route exact path="/settings" element={<Settings />} />
        <Route exact path="/" element={<Landing setShow={setShow} />} />
        <Route exact path="/:friendly_id" element={<Landing setShow={setShow} />} />

        <Route path="/watchlater" element={<Watchlater />} />
        <Route exact path="/seeall/:friendly_id" element={<Seeall />} />
        <Route exath path="/search" element={<Search />} />
        <Route path="/player/vod" element={<Player />} />
        <Route exath path="/liveplayer/:type" element={<LivePlayer />} />
        <Route exact path="/catalog/:friendly_id" element={<Catalog />} />
        <Route path="/season/:catalog_object_friendly_id/:friendly_id/:subcategory_friendly_id" element={<Seeall />} />
        <Route exath path="/moviesdetails/:theme/:catalog_object_friendly_id/:friendly_id/:content_id/:catalog_id" element={<DetailsPage />} />
        <Route exath path="/showsdetails/:theme/:catalog_object_friendly_id/:friendly_id/:content_id/:catalog_id" element={<ShowsDetails />} />
        <Route exath path="/recommended/:display_title/:catalog_object_friendly_id/:friendly_id/:genres" element={<Recommend />} />
        <Route path="/static-page/:page" element={<StaticPage />} />
        <Route path="/StaticPage/:page" element={<StaticPage />} />
        <Route path="/plans" element={<Subscribe />} />
        <Route path="/profile" element={<UserDetails />} />
        {/* <Route path="/chooseprofile" element={<Profile />} /> */}
        {/* <Route path="/createprofile" element={<CreateProfile />} />
        <Route path="/editprofile/:id" element={<EditProfile />} /> */}
        <Route path="/info" element={<Info />} />
        <Route path="/loginManditory" element={<LoginManditory />} />
        <Route path="/alert" element={<AlertsPage />} />
        <Route path="/exit" element={<ExitAlert />} />
        <Route path="/deleteaccount" element={<DeletePage />} />
        <Route path="/seasonsSeeAll/:activeTitle" element={<SeasonsSeeAll />} />
        <Route path="*" element={<Landing />} />

        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/activate" element={<Activate />} />
        {/* <Route path="/Otp" element={<OtpPage />} /> */}

      </Routes>
    </FocusContext.Provider>
  );
};

export default AllRoutes;
