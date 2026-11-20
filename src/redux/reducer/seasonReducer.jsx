
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import *  as api from "../../api/index.jsx"
const initialState = {
    loading: false,
    data: {},
    activeSeason: {},
    seasonIndex: "",
    episodeIndex: "",
    dataepisode: {},

}

export const getSeason = createAsyncThunk("season/getSeason", async (link) => {
    try {
        const { data } = await api.season(link)
        return data.data
    } catch (error) {

    }
})


export const getUpdateSeason = createAsyncThunk("season/getupdateSeason", async (link) => {
    try {
        const { data } = await api.updateSeason(link)
        console.log("data after episode button is changed", data.data)
        return data.data
    } catch (error) {

    }
})


// export const getupdateSeeall = createAsyncThunk("news/getUpdateseeallData", async (link) => {
//     try {
//         const { data } = await api.updateSeeall(link)
//         return data.data
//     } catch (error) {

//     }
// })

const seasonReducer = createSlice({
    name: "season",
    initialState,
    reducers: {
        activeIndexSeason: (state, action) => {
            state.seasonIndex = action.payload
        },
        activeIndexEpisode: (state, action) => {
            state.episodeIndex = action.payload
        },
        activeSeasonData: (state, action) => {
            state.activeSeason = action.payload
        }
    },
    extraReducers: (bulider) => {
        bulider.addCase(getSeason.pending, (state, action) => {
            state.loading = true
            state.data = {}
        })
        // bulider.addCase(getNextEpisode.fulfilled, (state, action) => {
        //     state.loading = true
        //     if(action.payload.status!=422){
        //         state.dataepisode = action.payload
        //     }
        // })

        bulider.addCase(getSeason.fulfilled, (state, action) => {
            state.loading = false
            state.data = action.payload
        })
        bulider.addCase(getUpdateSeason.pending, (state, action) => {
            state.data = {}
        })
        bulider.addCase(getUpdateSeason.fulfilled, (state, action) => {
            state.data = action.payload
        })


    }
})

export default seasonReducer.reducer
export const { activeSeasonData, activeIndexSeason, activeIndexEpisode } = seasonReducer.actions
