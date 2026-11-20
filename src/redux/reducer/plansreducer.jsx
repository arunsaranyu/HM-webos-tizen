import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import * as api from "../../api/index.jsx"
const initialState = {
    loading: true,
    plans: {},
    pack: {},
    data: {},
    userplans: {},
    datatitle:"",
}

export const getSubscriptionPlans = createAsyncThunk("/plans", async () => {
    const { data } = await api.subscriptionPlans()
    return data.data.items
})

export const getUserPlans = createAsyncThunk("/userplans", async () => {
    try {
        const { data } = await api.userplans()
        const plansObj = data?.data !== undefined ? data.data : data
        const packObj = plansObj?.pack || plansObj?.user_pack || (Array.isArray(plansObj) ? plansObj[0] : plansObj)
        const title = packObj?.pack_name || packObj?.package_name || packObj?.subscription_title || packObj?.title || packObj?.plan_title || packObj?.name
        if (title) {
            localStorage.setItem("user_plan", title)
        }
        return plansObj
    } catch (error) {
        return null
    }
})

export const getUserplanData = createAsyncThunk("/plans/getplansData", async () => {
    // const { data } = await api.userplanData()
    // console.log(data)
    // return data.data
})
const plans = createSlice({
    name: "plans",
    initialState,
    reducers: {
        getpackdetails: (state, action) => {
            state.pack = action.payload
        },
        setFocusedPlanTitle: (state, action) => {
            state.datatitle = action.payload; // Set the focused plan title to the payload
        },
    },
    extraReducers: (bulider) => {
        bulider.addCase(getSubscriptionPlans.pending, (state, action) => {
            state.loading=true
        })
        bulider.addCase(getSubscriptionPlans.fulfilled, (state, action) => {
             state.loading=false
            state.plans = action.payload
        })
        bulider.addCase(getUserPlans.pending, (state, action) => {
            state.loading=true
            state.data = action.payload
        })
        bulider.addCase(getUserPlans.fulfilled, (state, action) => {
            state.loading=false
            state.data = action.payload
            state.userplans = action.payload
        })
        bulider.addCase(getUserplanData.fulfilled, (state, action) => {
            localStorage.setItem("is_subscribe",action.payload?.isUserSubscribed)
            state.userplans = action.payload
        })
    }
})

export default plans.reducer
export const { getpackdetails, setFocusedPlanTitle } = plans.actions