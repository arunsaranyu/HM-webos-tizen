
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import *  as api from "../../api/index.jsx"
const initialState = {
    loading: false,
    data: {},
}

// export const getRelatedData = createAsyncThunk("related/getrelated", async (link) => {
//     try {
//         const { data } = await api.
//         return data.data
//     } catch (error) {

//     }
// })
export const getRecommendmovies = createAsyncThunk("recommend/getcommend", async (link) => {
   
   
    try {
        const { data } = await api.moviesRecommend(link)
        return data.data
    } catch (error) {

    }
})


const recommendReducer = createSlice({
    name: "recommend",
    initialState,
    extraReducers: (bulider) => {
        bulider.addCase(getRecommendmovies.pending, (state, action) => {
            state.loading = true
            state.data = {}
        })
        bulider.addCase(getRecommendmovies.fulfilled, (state, action) => {
            state.loading = false
            state.data = action.payload
        })

    }
})

export default recommendReducer.reducer