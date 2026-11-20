import axios from "axios";
import { session_Id, getAuthToken, endpoint, item_language, nested_list_items, region, version } from "../assets/constant/index.jsx";




export const API = axios.create({
    baseURL: `${endpoint}`
});



// --app config--
export const appConfig = () => API.get(`/catalogs/message/items/app-config-params.gzip?region=${localStorage.getItem("region")}&auth_token=${getAuthToken()}&current_version=${version}`)
// --region --
export const regionDetect = () => API.get(`/regions/autodetect/ip.gzip?auth_token=${getAuthToken()}`)
// --sidebar api-- 
export const sidebarData = () => API.get(`/catalog_lists/catalog-tabs.gzip?auth_token=${getAuthToken()}&region=${localStorage.getItem("region")}`)
export const continueData = () => API.get(`/users/${localStorage.getItem("session_id")}/playlists/watchhistory/listitems.gzip?&auth_token=${getAuthToken()}&item_language=${item_language}&region=${localStorage.getItem("region")}`)


// --seeall--
export const seeall = (data) => API.get(`/catalog_lists/${data}.gzip?region=${localStorage.getItem("region")}&auth_token=${getAuthToken()}&from=0&page=0&page_size=20&start_count=0`)
export const updateSeeall = (data) => API.get(`/catalog_lists/${data.friendly_id}.gzip?item_language=${item_language}&region=${localStorage.getItem("region")}&auth_token=${getAuthToken()}&from=0&page=${data.page}&page_size=20&start_count=0`)

// --search-results--
export const search = (data) => API.get(`/search?q=${data}&page_size=20&from=0&start_count=0&page=0&region=${localStorage.getItem("region")}&auth_token=${getAuthToken()}`)
export const updateSearch = (data) => API.get(`/search?q=${data.search}&page_size=20&from=0&start_count=0&page=${data.count}&region=${localStorage.getItem("region")}&auth_token=${getAuthToken()}`)


export const trendingSearch = (data) => API.get(`/catalog_lists/trending-search.gzip?region=${localStorage.getItem("region")}&auth_token=${getAuthToken()}`)
// --details api for live video and movies
export const getDetails = (data) => API.get(`/catalogs/${data.catalog_object_friendly_id}/items/${data.friendly_id}?auth_token=${getAuthToken()}&item_language=${item_language}&region=${localStorage.getItem("region")}`)

export const getAllDetails = (data) => API.post("/v2/users/get_all_details.gzip", data)

export const generatetoken = () => API.post(`/generate_token?region_val=${localStorage.getItem("region")}&auth_token=${getAuthToken()}`)
export const verifytoken = (token) => API.get(`/users/verify_tv_token?region=${localStorage.getItem("region")}&auth_token=${getAuthToken()}&token=${token.token}`)



export const createProfile = (data) => API.post(`/users/${localStorage.getItem("session_id")}/create_profile`, data);
export const updateProfile = (data) => API.post(`/users/${localStorage.getItem("session_id")}/update_profile`, data);
export const profileList = () => API.get(`/users/${localStorage.getItem("session_id")}/profile_list?auth_token=${getAuthToken()}`);
export const defaultProfile = (id) => API.get(`/users/${localStorage.getItem("session_id")}/${id}/default_selection?auth_token=${getAuthToken()}`);
export const deleteProfile = (id) => API.delete(`/users/${localStorage.getItem("session_id")}/${id}/delete_profile?auth_token=${getAuthToken()}`)


export const deleteUserAccount = () => API.get(`/users/${localStorage.getItem("session_id")}/false/delete_user_account?auth_token=${getAuthToken()}`);
export const subscriptionPlans = () => API.get(`/catalogs/subscription/items.gzip?region=${localStorage.getItem("region")}&auth_token=${getAuthToken()}`);
export const userplans = () => API.get(`/users/${localStorage.getItem("session_id")}/user_plans.gzip?auth_token=${getAuthToken()}&tran_history=true&region=${localStorage.getItem("region")}`);

// --watchlater
export const watchhistory = () => API.get(`/users/${localStorage.getItem("session_id")}/playlists/watchhistory/listitems.gzip?region=${localStorage.getItem("region")}&auth_token=${getAuthToken()}`)
export const watchlater = () => API.get(`users/${localStorage.getItem("session_id")}/playlists/watchlater/listitems?auth_token=${getAuthToken()}&region=${localStorage.getItem("region")}`)
export const addtowatchlater = (data) => API.post(`/users/${localStorage.getItem("session_id")}/playlists/watchlater`, data)
export const deletewatchlater = (data) => API.delete(`/users/${localStorage.getItem("session_id")}/playlists/watchlater/listitems/${data}.gzip?auth_token=${getAuthToken()}&region=${localStorage.getItem("region")}`)


// login with mobile 
export const loginWithPhonenumber = (data) => API.post("/users/generate_otp", data)
export const verifyOtp = (data) => API.post(`/users/verify_otp`, data)
export const logout = (data) => API.post(`/users/${localStorage.getItem("session_id")}/sign_out`, data)


export const userdetails = () => API.get(`/users/${localStorage.getItem("session_id")}/account.gzip?auth_token=${getAuthToken()}`)


export const season = (data) => API.get(`/catalogs/${data.catalog_object_friendly_id}/items/${data.friendly_id}/episodes.gzip?region=${localStorage.getItem("region")}&auth_token=${getAuthToken()}&page=0&page_size=20&status=published&order_by=desc`)
export const updateSeason = (data) => API.get(`/catalogs/${data.catalog_object_friendly_id}/items/${data.friendly_id}/episodes.gzip?region=${localStorage.getItem("region")}&auth_token=${getAuthToken()}&page=${data.page}&page_size=20&status=published&order_by=desc`)

export const relatedData = () => API.get(`/catalogs/shows/items/alitho-all-in-one-1/related.gzip?item_language=eng&region=${localStorage.getItem("region")}&auth_token=${getAuthToken()}&genres=game_show`)

export const moviesRecommend = (data) => API.get(`/catalogs/${data.catalog_object_friendly_id}/items/${data?.friendly_id}/related.gzip?item_language=eng&region=${localStorage.getItem("region")}&auth_token=${getAuthToken()}&genres=${data?.genres}`)




export const landingData = (link) => API.get(`/catalog_lists/${link.link}.gzip?region=${localStorage.getItem("region")}&auth_token=${getAuthToken()}&page=0&page_size=${link.page_size}&pagination=true`)
export const updateLandingData = (data) => API.get(`/catalog_lists/${data.homelink}.gzip?region=${localStorage.getItem("region")}&auth_token=${getAuthToken()}&page=${data.count}&page_size=5&pagination=true`)



//catalog api 
export const catalogData = (link) => API.get(`/catalog_lists/${link}.gzip?item_language=${item_language}&region=${localStorage.getItem("region")}&auth_token=${getAuthToken()}&page=0&page_size=20`)
export const updateCatalogData = (data) => API.get(`/catalog_lists/${data.homelink}.gzip?item_language=${item_language}&region=${localStorage.getItem("region")}&auth_token=${getAuthToken()}&page=${data.count}&page_size=20`)

export const upNext = (data) => API.get(`/catalogs/${data.catalog_id}/items/${data.content_id}/next_item?auth_token=${getAuthToken()}&region=${localStorage.getItem("region")}`)
export const signoutall = (data) => API.post(`/users/${localStorage.getItem("session_id")}/sign_out_all`, data);

// --episode details api--
export const episodeDetails = (data) => {
    const catalog = data.catalog || "shows";
    const showFriendlyId = data.show_friendly_id || data.show_object?.friendly_id || data.catalog_object_friendly_id;
    const episodeFriendlyId = data.episode_friendly_id || data.friendly_id;
    return API.get(`/catalogs/${catalog}/${showFriendlyId}/episodes/${episodeFriendlyId}.gzip?region=${localStorage.getItem("region")}&item_language=${item_language}&auth_token=${getAuthToken()}`);
};
export const getEpisodeDetails = episodeDetails;


