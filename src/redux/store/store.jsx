import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "../reducer/sidebarReducer.jsx";
import commonReducer from "../reducer/commonReducer.jsx";
import seeallReducer from "../reducer/seeallReducer.jsx";
import detailsReducer from "../reducer/detailsReducer.jsx";
import watchlaterReducer from "../reducer/watchlaterReducer.jsx";
import loginReducer from "../reducer/loginReducer.jsx";
import SearchReducer from "../reducer/SearchReducer.jsx";
import userReducer from "../reducer/userReducer.jsx";
import plansreducer from "../reducer/plansreducer.jsx";
import profileReducer from "../reducer/profileReducer.jsx";
import seasonReducer from "../reducer/seasonReducer.jsx";
import recommendReducer from "../reducer/recommendReducer.jsx";
import playerReducer from "../reducer/playerReducer.jsx";
import catalogReducer from "../reducer/catalogReducer.jsx";
import landingReducer from "../reducer/landingReducer.jsx";
const store = configureStore({
    reducer: {
        sidebar: sidebarReducer,
        details: detailsReducer,
        watchlater: watchlaterReducer,
        login: loginReducer,
        landing:landingReducer,
        seeall: seeallReducer,
        common: commonReducer,
        search:SearchReducer,
        user:userReducer,
        plans:plansreducer,
        profile:profileReducer,
        season:seasonReducer,
        recommend:recommendReducer,
        player:playerReducer,
        catalog:catalogReducer,
        
    }
})
export default store