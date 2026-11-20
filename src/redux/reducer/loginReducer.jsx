
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import *  as api from "../../api/index.jsx"
import { Saranyu_Loginsuccess } from "../../analytics/saranyuAnalytics.jsx";
import { Loginsuccess } from "../../analytics/index.jsx";

const initialState = {
    data: {},
    verifytoken: {},
    generateOtp: {},
    token: "",
    phonenumber: "",
    errorstatus: false,
    unregisteredErrorStatus: false,
    errormessage: {},
    alertToast: false,
    signoutToast: false,
    otpScreen: false
}
export const generatetoken = createAsyncThunk("token/generatetoken", async () => {
    try {
        const { data } = await api.generatetoken()
        return data
    } catch (error) {

    }
})
export const getverifytoken = createAsyncThunk("verify/verifytoken", async (token) => {
    localStorage.setItem("is_verified", "false")
    const { tokenData, navigate } = token

    try {
        if (tokenData.token !== undefined) {
            const { data } = await api.verifytoken(tokenData);
            console.log("dataverify", data)
            if (data?.is_verified == "true") {

                console.log("verify")
                localStorage.setItem("is_verified", "true")
                localStorage.setItem("session_id", data?.session_id)
                localStorage.setItem("mobile_number", data?.mobile_number)
                // localStorage.setItem("user_id", data?.user_details.user_id)
                localStorage.setItem("firstname", data?.profile_obj?.firstname)
                localStorage.setItem("region", data?.profile_obj?.region)
                localStorage.setItem("userDetails", JSON.stringify(data?.user_details))

                navigate(`/`)
            }
            return data
        }
    } catch (error) {

    }
})
export const getloginwithnumber = createAsyncThunk("login/loginwithnumber", async (link) => {
    try {
        const { data } = await api.loginWithPhonenumber(link)
        console.log(data)
        return data
    } catch (error) {
        return error.response
    }
})

export const signout = createAsyncThunk("logout/signout", async (link) => {
    const { details, navigate, firstIndex } = link
    try {


        console.log("signout")
        const { data } = await api.logout(details)
        localStorage.removeItem("session_id")
        localStorage.removeItem("image_url")
        localStorage.removeItem("firstname")
        localStorage.removeItem("user_id")
        navigate(`/${firstIndex?.firstIndex}`)
        return data
    } catch (error) {
        return error.response
    }
})
export const signoutall = createAsyncThunk("logout/signoutall", async (link) => {
    const { details, navigate, firstIndex } = link
    try {

        // console.log(link)
        // const { data } = await api.signoutall(details)
        // localStorage.removeItem("session_id")
        // localStorage.removeItem("image_url")
        // localStorage.removeItem("firstname")
        // localStorage.removeItem("user_id")
        // navigate(`/${firstIndex?.firstIndex}`)
        // return data
    } catch (error) {
        return error.response
    }
})

export const otpverify = createAsyncThunk("otp/getotpverify", async (link) => {
    const { otpVerifyData, navigate } = link
    try {
        const { data } = await api.verifyOtp(otpVerifyData)

        localStorage.setItem("email_id", data?.data?.email_id)
        localStorage.setItem("mobile_number", data?.data?.mobile_number)
        localStorage.setItem("session_id", data?.data?.session)
        //  localStorage.setItem("user_id",data?.data?.user_id)
        localStorage.setItem("first_name", data?.data.first_name)
        localStorage.setItem("last_name", data?.data?.last_name)


        navigate("/")

        return data.data
    } catch (error) {

        return error.response
    }
})
const login = createSlice({
    name: "login",
    initialState,
    reducers: {
        disabletoken: (state, action) => {
            state.token = ""
        },
        toast: (state, action) => {
            state.alertToast = action.payload
            state.signoutToast = action.payload
        },
        setPhoneNumber: (state, action) => {
            state.phonenumber = action.payload
        },
        dislableToast: (state, action) => {
            state.errorstatus = false
        },
        setErrorMessageStatus(state, action) {
            state.errorstatus = action.payload;
        },
        setOtpScreen: (state, action) => {
            state.otpScreen = false
        },
        resetState: (state, action) => {
            state.unregisteredErrorStatus = false
            state.errormessage = ""
        },

    },
    extraReducers: (bulider) => {
        bulider.addCase(generatetoken.fulfilled, (state, action) => {

            state.token = action.payload.token
            state.data = action.payload
        })

        bulider.addCase(getverifytoken.fulfilled, (state, action) => {
            if (action?.payload?.is_verified == "true" || action?.payload?.is_verified === true) {
                state.alertToast = true;
            } else {
                state.alertToast = false;
            }
            state.verifytoken = action.payload;
        })
        bulider.addCase(getloginwithnumber.fulfilled, (state, action) => {
            console.log(action.payload)
            if (action.payload.status == 422) {

            } else if (action.payload.status == 499) {
                state.unregisteredErrorStatus = true
                state.errormessage = action.payload.data.message
            }

            else {

                state.generateOtp = action.payload
                state.otpScreen = true
            }
        })
        bulider.addCase(otpverify.fulfilled, (state, action) => {

            if (action.payload.status == 422) {
                state.errorstatus = true
                state.errormessage = action.payload.data.error
            }
            else {
                state.data = action.payload
                state.alertToast = true
            }
            // state.data = action.payload
        })
        bulider.addCase(signout.fulfilled, (state, action) => {

            if (action.payload.status == 422) {
                state.errorstatus = true
            }
            else {
                state.errorstatus = false
                state.signoutToast = true
                state.data = action.payload
            }
        })
        bulider.addCase(signoutall.fulfilled, (state, action) => {

            if (action.payload.status == 422) {
                state.errorstatus = true
            }
            else {
                state.errorstatus = false
                state.signoutToast = true
                state.data = action.payload
            }
        })
    }
})
export default login.reducer
export const { disabletoken, toast, setPhoneNumber, resetState, setOtpScreen, dislableToast, setErrorMessageStatus } = login.actions