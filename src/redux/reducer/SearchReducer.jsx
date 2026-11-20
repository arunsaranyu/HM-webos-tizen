import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import *  as api from "../../api/index.jsx"
const initialState = {
    loading: false,
    searchParams: "",
    data: {},
    trendingLoading: false,
    trendingData: {}
}

export const getSearch = createAsyncThunk("seeall/getSearchData", async (link) => {
    try {
        const { data } = await api.search(link)
        const payload = data?.data || data || {}
        const count = payload?.count ?? data?.count ?? payload?.total_items_count ?? payload?.total_count
        return {
            ...payload,
            count: count !== undefined ? count : payload?.items?.length
        }
    } catch (error) {

    }
})

export const getupdateSearch = createAsyncThunk("search/getUpdatesearchData", async (link) => {
    try {
        const { data } = await api.updateSearch(link)
        return data.data.items
    } catch (error) {

    }
})

export const getTrendingSearch = createAsyncThunk("trending/search", async () => {
    try {
        const { data } = await api.trendingSearch()
        return data.data
    } catch (error) {

    }
})

const searchReducer = createSlice({
    name: "search",
    initialState,

    reducers: {
        searchValue: (state, action) => {
            state.searchParams = action.payload
        },
        setEmptySearch: (state, action) => {
            state.data = {}
        }
    },
    extraReducers: (bulider) => {
        bulider.addCase(getSearch.pending, (state, action) => {
            state.loading = true
            state.data = {}
        })
        bulider.addCase(getSearch.fulfilled, (state, action) => {
            state.loading = false
            state.data = action.payload
        })
        bulider.addCase(getTrendingSearch.pending, (state, action) => {
            state.trendingLoading = true
            state.trendingData = {}
        })
        bulider.addCase(getTrendingSearch.fulfilled, (state, action) => {
            state.trendingLoading = false
            state.trendingData = action.payload
        })
        bulider.addCase(getupdateSearch.fulfilled, (state, action) => {

            if (action?.payload?.length > 0) {

                state.data = { ...state.data, items: [...state.data.items, ...action.payload] };
            }

        })
    }
})

export default searchReducer.reducer
export const { searchValue, setEmptySearch } = searchReducer.actions

