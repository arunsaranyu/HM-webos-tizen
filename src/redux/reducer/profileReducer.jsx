
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../api/index.jsx"
const initialState = {
    loading: false,
    createdData: {},
    updatedData: {},
    data: {},
    defaultData: {},
    deletedData: {},
    createProfileToast: false,
    listData: {},
    image: "",
    focusState: null,
    activeprofile: "",
    errorstatus: false,
    editstatus: false,

}

export const createProfile = createAsyncThunk("createprofiles/profiles", async (link) => {
    const { profileData, navigate } = link;
    try {
        const { data } = await api.createProfile(profileData)
        if (!!navigate) {
            navigate('/chooseprofile');
        }

        return data.data
    } catch (error) {
        return error.response
    }
})

export const UpdateProfile = createAsyncThunk("updateprofiles/profiles", async (link) => {
    const { newprofileData, navigate } = link;
    try {

        const { data } = await api.updateProfile(newprofileData)
        if (!!navigate) {
            navigate('/chooseprofile');
        }
        return data.data
    } catch (error) {
        return error.response
    }
})
export const ProfileList = createAsyncThunk("profilelist/profiles", async () => {
    try {
        const { data } = await api.profileList();
        // console.log("data is",data);
        return data.profiles
    } catch (error) {
        console.error("error", error)
        return error.response
    }
})

export const DefaultProfile = createAsyncThunk("defaultprofiles/profiles", async (link) => {
    try {
        const { id, navigate, firstIndex } = link


        const { data } = await api.defaultProfile(id)
        localStorage.setItem("user_clicked_profile_id", id)
        // localStorage.setItem("user_id",id)
        return { data: data.data, navigate: navigate, firstIndex: firstIndex }
    } catch (error) {
        return error.response
    }
})

export const DeleteProfile = createAsyncThunk("deleteprofiles/profiles", async (id) => {
    try {
        const { data } = await api.deleteProfile(id)
        return data.data
    } catch (error) {
        return error.response
    }
})
export const getprofiles = createAsyncThunk("getprofiles/profiles", async () => {
    try {
        // const { data } = await api.profiles()


        return data.data
    } catch (error) {

    }
})

const profile = createSlice({
    name: "profile",
    initialState,
    reducers: {
        userProfileImage: (state, action) => {
            state.image = action.payload
        },
        imageFocus: (state, action) => {
            state.focusState = action.payload
        },
        activeprofile: (state, action) => {
            state.activeprofile = action.payload
        },
        setErrorMessageStatus(state, action) {
            state.errorstatus = action.payload;
        },
        setEditStatus(state, action) {
            state.editstatus = action.payload;
        },
        setCreateProfile(state, action) {
            state.createProfileToast = action.payload
        }
    },
    extraReducers: (bulider) => {
        bulider.addCase(getprofiles.fulfilled, (state, action) => {
            state.data = action.payload
        })
        bulider.addCase(createProfile.fulfilled, (state, action) => {

            if (action?.payload?.data?.error?.code == 1016) {
                state.errorstatus = true
            }
            else {
                state.errorstatus = false
                state.createProfileToast = true
                state.createdData = action.payload
            }
        })
        bulider.addCase(UpdateProfile.fulfilled, (state, action) => {
            if (action?.payload?.data?.error?.code == 1016) {
                state.errorstatus = true
                state.editstatus = false
            }
            else {
                state.editstatus = true
                state.errorstatus = false
                state.updatedData = action.payload
            }
        })
        bulider.addCase(ProfileList.pending, (state, action) => {
            // console.log("listing",action.payload);
            state.loading = true
            state.listData = []
        })
        bulider.addCase(ProfileList.fulfilled, (state, action) => {
            // console.log("listing",action.payload);
            state.loading = false
            if (!!action.payload && action?.payload?.data?.error?.code == 1016) {
                state.errorstatus = true
            }
            else {
                state.errorstatus = false
                state.listData = action.payload
            }
        })
        bulider.addCase(DefaultProfile.fulfilled, (state, action) => {


            if (action?.payload?.data?.error?.code == 1016) {
                state.errorstatus = true
            }
            else {

                state.errorstatus = false
                state.defaultData = action?.payload?.data
                if (!!action?.payload?.navigate) {
                    action?.payload?.navigate(`/${action?.payload.firstIndex}`)
                }
            }
        })
        bulider.addCase(DeleteProfile.fulfilled, (state, action) => {

            if (action?.payload?.data?.error?.code == 1016) {
                state.errorstatus = true
            }
            else {
                state.errorstatus = false
                state.deletedData = action.payload
            }
        })
    }
})
export default profile.reducer
export const { userProfileImage, imageFocus, activeprofile, setErrorMessageStatus, setEditStatus, setCreateProfile } = profile.actions
