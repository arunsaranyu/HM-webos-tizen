import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import * as api from "../../api/index.jsx"
const initialState = {
    loading: true,
    data: {},
    trendinglist: {},
    subscribedTo: [],
    errorstatus: false,
}

export const DeleteUserAccount = createAsyncThunk("/deleteuser", async (navigate) => {
    try {
        const { data } = await api.deleteUserAccount()
        localStorage.clear()
        navigate('/')
        return data?.data
    } catch (error) {
        return error.response
    }
})

export const getUserDetails = createAsyncThunk("/user", async () => {
    try {
        const { data } = await api.userdetails()
        if (data?.data) {
            localStorage.setItem("is_subscribed", data.data.isUserSubscribed);
            localStorage.setItem("user_id", data.data.user_id)
            return data.data
        }
        return {}
    } catch (error) {
        // console.log(error.response);
        return error.response
    }
})

export const userPlan = createAsyncThunk("userPlan", async () => {
    try {
        const { data } = await api.userplans()
        return Array.isArray(data?.data) ? data.data : []
    } catch (error) {
        return []
    }
})
const user = createSlice({
    name: "user",
    initialState,
    reducers: {
        setErrorMessageStatus(state, action) {
            state.errorstatus = action.payload;
        },
    },
    extraReducers: (bulider) => {
        bulider.addCase(DeleteUserAccount.fulfilled, (state, action) => {
            state.data = action.payload
        })
        bulider.addCase(getUserDetails.fulfilled, (state, action) => {
            if (action?.payload?.data?.error?.code == 1016) {
                state.errorstatus = true
            } else {
                state.errorstatus = false
                state.data = (action.payload && !action.payload.status) ? action.payload : {}
            }
        })
        bulider.addCase(userPlan.fulfilled, (state, action) => {
            state.subscribedTo = Array.isArray(action.payload) ? action.payload : []
        })
    }
})

export const { setErrorMessageStatus } = user.actions;
export default user.reducer