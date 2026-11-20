
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import *  as api from "../../api/index.jsx"

const initialState = {
    loading: false,
    updateDataloading:false,
    endoflist:false,
    data: {},
}
export const getShowsData = createAsyncThunk("shows/getShowsData", async (link) => {
    try {
        const { data } = await api.showsData(link)
        return data.data
    } catch (error) {
        // console.log(error.response.status)
    }
})
export  const getUpdateShowsData=createAsyncThunk("shows/getUpdateShowsData", async (link) => {
try {
    const { data } = await api.updateShowsData(link)
    return data.data
} catch (error) {
    
}
})

const showsReducer = createSlice({
    name: "shows",
    initialState,
    extraReducers: (bulider) => {
        bulider.addCase(getShowsData.pending, (state, action) => {
            state.loading=true
        })
        bulider.addCase(getShowsData.fulfilled, (state, action) => {
            state.loading=false
            state.endoflist=false
            state.data = action.payload
        })
        bulider.addCase(getUpdateShowsData.pending,(state,action)=>{
            state.updateDataloading=true
        })
      
        bulider.addCase(getUpdateShowsData.fulfilled, (state, action) => {
            state.updateDataloading=false
            let data = action?.payload?.catalog_list_items
            if (data?.length > 0) {
                state.endoflist=false
                let filterdata = data.filter((ele) => ele.catalog_list_items)
                let newCatlogArray = [...state.data.catalog_list_items, ...filterdata]

                const key = 'display_title'
                const unique = [...new Map(newCatlogArray.map(item => [item[key], item])).values()]


                if (state.data.catalog_list_items.length !== unique.length) {
                    state.data.catalog_list_items = unique

                }
                let d=state.data.catalog_list_items
                let filter = d.filter((ele) => ele.catalog_list_items && ele.catalog_list_items.length > 0); // Filtering out empty list items
                localStorage.setItem("totalcard",filter.length);
            }
            else{
                state.endoflist=true
            }
        })
    }
})

export default showsReducer.reducer