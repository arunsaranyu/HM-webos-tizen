
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import *  as api from "../../api/index.jsx"

const initialState = {
    loading: false,
    data: {},
    sidebar:true,
    activeIndex: "home",
    sidebarVisibleWithTitle: false,
    sidebarFocuseKey:"home"

}
export const getSidebarData = createAsyncThunk("sidebar/getSidebarData", async (link) => {
    try {
        const { data } = await api.sidebarData(link)
        return data?.data?.catalog_list_items
    } catch (error) {
        // console.log(error.response.status)
    }
})


const sidebarReducer = createSlice({
    name: "sidebar",
    initialState,    reducers: {
        activeIndexSidebar: (state, action) => {
            state.activeIndex = action.payload
        },
        sidebarAllow: (state, action) => {
            state.sidebar = true
        },
        SidebarDisable: (state, action) => {
            state.sidebar = false
        },
        sidebarToggleTrue: (state, action) => {
            state.sidebarVisibleWithTitle = true
        },
        sidebarToggleFalse: (state, action) => {
            state.sidebarVisibleWithTitle = false
        },
        sidebarFocused:(state,action)=>{
            state.sidebarFocuseKey=action.payload
        }
    },
    extraReducers: (bulider) => {
        bulider.addCase(getSidebarData.fulfilled, (state, action) => {
            state.loading = false
            state.data = action.payload
        })

    }
})
export default sidebarReducer.reducer
export const {activeIndexSidebar,sidebarAllow,sidebarFocused,SidebarDisable,sidebarToggleFalse,sidebarToggleTrue}=sidebarReducer.actions