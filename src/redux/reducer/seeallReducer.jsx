
import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";

import *  as api from "../../api/index.jsx"
const initialState = {
    loading: false,
    data: {},
}

export const getSeeall = createAsyncThunk("seeall/getSeeall", async (link) => {
    try {
        const { data } = await api.seeall(link)
        return data.data
    } catch (error) {

    }
})

export const getupdateSeeall = createAsyncThunk("news/getUpdateseeallData", async (link) => {
    try {
   
        const { data } = await api.updateSeeall(link)
        return data.data.catalog_list_items
    } catch (error) {

    }
})

const seeallReducer = createSlice({
    name: "seeall",
    initialState,
    extraReducers: (bulider) => {
        bulider.addCase(getSeeall.pending, (state, action) => {
            state.loading = true
            state.data = {}
        })
        bulider.addCase(getSeeall.fulfilled, (state, action) => {
            state.loading = false
            state.data = action.payload
        })
        bulider.addCase(getupdateSeeall.fulfilled,(state,action)=>{
            // state.data=[...state.data,...action.payload]
        try{
            if(action?.payload?.length>0){
              
                state.data = { ...state.data, catalog_list_items: [...state?.data?.catalog_list_items, ...action?.payload] };

            }
        }
        catch(error){
       
        }
            
        })

    }
})

export default seeallReducer.reducer