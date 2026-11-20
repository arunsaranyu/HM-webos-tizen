
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import *  as api from "../../api/index.jsx"
const initialState = {
    loading: false,
    data: {},
    appConfig: {},
    banner: {},
    layout: "banner",
    clicked: "",
    bpurl: "",
    singleList: true

}
export const getStaticPage = createAsyncThunk("getstaticpage/staticpage", async () => {
    // try {
    //     const {data}=await api.
    // } catch (error) {

    // }
})
export const getAppConfig = createAsyncThunk("Appconfig/getAppconfig", async () => {
    try {
        const { data } = await api.appConfig()
        return data.data
    } catch (error) {
        // console.log(error.response.status)
    }
})
export const getRegion = createAsyncThunk("region/regionData", async () => {
    try {
        const { data } = await api.regionDetect()


        return data
    } catch (error) {

    }
})

const commonReducer = createSlice({
    name: "common",
    initialState,
    reducers: {
        singleList: (state, action) => {
            state.singleList = action.payload
        },
        bannerContent: (state, action) => {
            state.banner = action.payload
        },
        layoutCard: (state, action) => {
            state.layout = action.payload
        },
        onClicked: (state, action) => {
            state.clicked = action.payload
        },
        bannerplayurl: (state, action) => {
            state.bpurl = action.payload
        }

    },
    extraReducers: (builder) => {

        builder.addCase(getRegion.fulfilled, (state, action) => {

            localStorage.setItem("region", action?.payload?.region?.country_code2)
            // localStorage.setItem("region", "US")
            state.data = action?.payload
        })

        // builder.addCase(getRegion.pending, (state, action) => {

        //     state.data = {}
        // })

        builder.addCase(getAppConfig.fulfilled, (state, action) => {
            localStorage.setItem("watchhistory_api", action?.payload?.params_hash2?.config_params?.watch_history_api)
            localStorage.setItem("watchhistory_interval_sec", action?.payload?.params_hash2?.config_params?.watchhistory_interval_sec)
            // console.log(action?.payload?.params_hash2?.config_params)
            state.appConfig = action.payload
        })

    }
})

export default commonReducer.reducer
export const { bannerContent, layoutCard, onClicked, bannerplayurl, singleList } = commonReducer.actions

