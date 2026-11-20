
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import *  as api from "../../api/index.jsx"
const initialState = {
    loading: false,
    data: {},
    updateDataloading:false,
    endoflist:false,

}
export const getFoodData = createAsyncThunk("food/getFoodData", async (link) => {
    try {
        const { data } = await api.homeData(link)
        return data.data
    } catch (error) {
        // console.log(error.response.status)
    }
})
export  const getUpdateFoodData=createAsyncThunk("Food/getUpdateFoodData", async (link) => {
try {
    // console.log("link",link)
    const { data } = await api.updateFoodData(link)
    return data.data
} catch (error) {
    
}
})

const foodReducer = createSlice({
    name: "food",
    initialState,
    extraReducers: (bulider) => {
        bulider.addCase(getFoodData.pending, (state, action) => {
            state.loading=true
        })
        bulider.addCase(getFoodData.fulfilled, (state, action) => {
            state.loading=false
            state.endoflist=false
            state.data = action.payload
        })
      
        bulider.addCase(getUpdateFoodData.pending, (state, action) => {
            state.updateDataloading = true
        })
      
      
       
        bulider.addCase(getUpdateFoodData.fulfilled, (state, action) => {
            state.updateDataloading = false
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

export default foodReducer.reducer