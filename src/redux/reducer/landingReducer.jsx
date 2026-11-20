import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";

import *  as api from "../../api/index.jsx"
const initialState = {
    loading: false,
    data: {},
    sidebarItems: [],
    endoflist: false,
    watchHistory: [],
    sidebar: true,
    continuewatchingLoading: false,
    activeIndex: "",
    endoflist: false,
    sidebarVisibleWithTitle: false,
    updateLoading: false,
    firstIndex: "",
    severError: false,
    setFocusData: "",
    watchHistoryStatus: false,

}


export const getSidebarData = createAsyncThunk("sidebarData/getsidebarData", async () => {
    try {
        const { data } = await api.sidebarData()
        return data.data
    } catch (error) {

    }

})
export const getLandingData = createAsyncThunk("home/getHomeData", async (link) => {
    // console.log(link, "home")
    try {
        const { data } = await api.landingData(link)
        console.log("data", data?.data, link.link)
        return { data: data?.data, link: link.link }
        // return { link: link.home_link, data: data.data }
    } catch (error) {
        // console.log(error.response.status)
    }
})
export const getUpdateLandingData = createAsyncThunk("home/getUpdateHomeData", async (link) => {
    try {
        const { data } = await api.updateLandingData(link)
        return { data: data.data, link: link.homelink }
    } catch (error) {
        return error.response
    }
})

export const getContinueData = createAsyncThunk("continue/continueData", async (link = "home-list") => {
    try {
        const sessionId = localStorage.getItem("session_id");
        if (sessionId && sessionId !== "undefined" && sessionId !== "null") {
            const { data } = await api.continueData();
            return { data: data.data, link: link || "home-list" };
        }
    } catch (error) {
        return error.response;
    }
});

const landingReducer = createSlice({
    name: "landing",
    initialState,

    reducers: {

        activeIndexSidebar: (state, action) => {
            state.activeIndex = action.payload
        },
        sidebarAllow: (state, action) => {
            state.sidebar = true
        },
        sidebarDisable: (state, action) => {
            state.sidebar = false
        },
        sidebarToggleTrue: (state, action) => {
            state.sidebarVisibleWithTitle = true
        },
        sidebarToggleFalse: (state, action) => {
            state.sidebarVisibleWithTitle = false
        },
        onSetFocusData: (state, action) => {
            state.setFocusData = action.payload
        },
        onWatchHistoryTrue: (state, action) => {
            state.watchHistoryStatus = true
        },
        onWatchHistoryFalse: (state, action) => {
            state.watchHistoryStatus = false
        }

    },
    extraReducers: (builder) => {
        builder.addCase(getSidebarData.pending, (state, action) => {

        })
        builder.addCase(getSidebarData.fulfilled, (state, action) => {
            state.loading = false


            const data = action.payload
            const items = {}

            data?.catalog_list_items.forEach((ele, i) => {
                if (i == 0) {
                    state.firstIndex = ele.home_link
                    state.activeIndex = ele.home_link
                }

                items[`${ele.home_link}`] = {}
            });

            state.sidebarItems = data?.catalog_list_items
            state.data = items



        })
        builder.addCase(getSidebarData.rejected, (state, action) => {
            state.sidebarItems = []
            state.data = {}
        })
        builder.addCase(getLandingData.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(getLandingData.fulfilled, (state, action) => {
            state.loading = false

            if (action?.payload?.data) {
                // state.setFocusData=action?.payload?.data?.catalog_list_items[0]?.list_id+action?.payload?.data?.catalog_list_items[0]?.catalog_list_items[0]?.catalog_id+action?.payload?.data?.catalog_list_items[0]?.catalog_list_items[0]?.content_id
                // console.log(action?.payload?.data?.catalog_list_items[0].list_id+action?.payload?.data?.catalog_list_items[0].catalog_list_items[0].content_id+action?.payload?.data?.catalog_list_items[0].catalog_list_items[0].catalog_id,"fullfilled")
                const link = action.payload.link
                const data = action.payload.data

                const linkData = current(state.data)

                if (linkData.hasOwnProperty(action.payload.link) && Object.keys(linkData[link]).length == 0) {

                    state.data = {
                        ...linkData, [link]: data
                    }
                }
            }
        })
        builder.addCase(getUpdateLandingData.pending, (state, action) => {
            // state.loading = true
            state.updateLoading = true
        })
        builder.addCase(getUpdateLandingData.fulfilled, (state, action) => {
            state.updateLoading = false
            // console.log(action.payload)

            let data = action.payload.data.catalog_list_items
            let homelink = action.payload.link
            if (data?.length > 0) {
                state.endoflist = false
                let filterdata = data.filter((ele) => ele.catalog_list_items)
                let newCatlogArray = [...state.data[homelink].catalog_list_items, ...filterdata]

                const key = 'display_title'
                const unique = [...new Map(newCatlogArray.map(item => [item[key], item])).values()]


                if (state.data[homelink].catalog_list_items.length !== unique.length) {
                    state.data[homelink].catalog_list_items = unique

                }
            } else {
                state.endoflist = true
            }





        })
        builder.addCase(getContinueData.pending, (state, action) => {
            state.continuewatchingLoading = true
            state.watchHistory = []
        })

        builder.addCase(getContinueData.fulfilled, (state, action) => {
            state.continuewatchingLoading = false;

            if (action?.payload?.status == 422) {
                return;
            }

            const sessionId = localStorage.getItem("session_id");
            if (sessionId && sessionId !== "undefined" && sessionId !== "null") {
                if (action?.payload && action?.payload?.data) {
                    state.watchHistory = action.payload.data;
                    var link = action.payload.link || "home-list";
                    var catalogListItems = (state.data[link] && state.data[link].catalog_list_items) || [];
                    var watchHistoryCatalogItem = catalogListItems.find(function (each) {
                        return each.friendly_id === "continue-watching" || each.friendly_id === "watch-history" || each.friendly_id === "continue_watching";
                    });

                    if (watchHistoryCatalogItem) {
                        var items = (action.payload.data.items && Array.isArray(action.payload.data.items)) ? action.payload.data.items.slice() : [];
                        var updatedCatalogItem = Object.assign({}, watchHistoryCatalogItem, { catalog_list_items: items });
                        var updatedCatalogList = catalogListItems.map(function (item) {
                            if (item.friendly_id === "continue-watching" || item.friendly_id === "watch-history" || item.friendly_id === "continue_watching") {
                                return updatedCatalogItem;
                            }
                            return item;
                        });

                        state.data[link] = Object.assign({}, state.data[link], { catalog_list_items: updatedCatalogList });
                        state.watchHistoryStatus = true;
                    }
                }
            } else {
                state.watchHistory = [];
                state.watchHistoryStatus = false;
            }
        });
        builder.addCase(getContinueData.rejected, (state, action) => {
            state.continuewatchingLoading = false;
        });

        // builder.addCase(getRegion.pending, (state, action) => {
        //     state.loading = true
        //     state.data = {}
        // })
        // builder.addCase(getRegion.fulfilled, (state, action) => {
        //     if (action?.payload?.status == 200) {
        //         const { data } = action.payload
        //         localStorage.setItem("region", data?.region?.country_code2)
        //         localStorage.setItem("calling_code", data?.region?.calling_code)
        //         localStorage.setItem(" min_digits", data?.region?.min_digits)
        //         localStorage.setItem("max_digits", data?.region?.max_digits)

        //         state.data = data
        //     }


        // })
        // builder.addCase(getRegion.rejected, (state, action) => {
        //     state.loading = false
        //     state.data = {}
        // })
        // builder.addCase(getAppConfig.pending, (state, action) => {
        //     state.loading = true
        //     state.appConfig = {}
        // })
        // builder.addCase(getAppConfig.fulfilled, (state, action) => {
        //     state.loading=false
        //     if (action.payload.status == 200) {
        //         const { data } = action.payload
        //         localStorage.setItem("watchhistory_interval_sec", parseInt(data?.data?.params_hash2?.config_params?.watchhistory_interval_sec))
        //         localStorage.setItem("watchhistory_api", data?.data?.params_hash2?.config_params?.watchhistory_interval_sec)
        //         state.appConfig = action.payload
        //     }
        // })
        // builder.addCase(getAppConfig.rejected, (state, action) => {
        //     state.loading=false
        //     state.appConfig={}
        // })

    }
})

export default landingReducer.reducer

export const { activeIndexSidebar, sidebarAllow, sidebarDisable, sidebarToggleFalse, sidebarToggleTrue, onSetFocusData, onWatchHistoryTrue, onWatchHistoryFalse } = landingReducer.actions