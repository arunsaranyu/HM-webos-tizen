
import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";

import *  as api from "../../api/index.jsx"
const initialState = {
    loading: false,
    data: {},
}
export const getCatalogData = createAsyncThunk("catalog/getCatalogData", async (link) => {
    try {
        const { data } = await api.catalogData(link)
        return data.data
    } catch (error) {
        // console.log(error.response.status)
    }
})
export const getUpdateCatalogData = createAsyncThunk("catalog/getUpdateCatalogData", async (link) => {
    try {
        const { data } = await api.updateCatalogData(link)
        
        return data.data.catalog_list_items
    } catch (error) {

    }
})

const catalogReducer = createSlice({
    name: "catalog",
    initialState,
    extraReducers: (bulider) => {
        bulider.addCase(getCatalogData.pending, (state, action) => {
            state.loading = true
        })
        bulider.addCase(getCatalogData.fulfilled, (state, action) => {
            state.loading = false
            state.data = action.payload
        })
        bulider.addCase(getUpdateCatalogData.fulfilled, (state, action) => {
            let data = action.payload
            
           if(data?.length>0){
            state.data = { ...state.data, catalog_list_items: [...state.data.catalog_list_items, ...action.payload] };
           }
              
        })
    }
})

export default catalogReducer.reducer