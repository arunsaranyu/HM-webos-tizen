import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as api from "../../api/index.jsx"
const initialState = {
    data:{},
    playbackData : {},
    smarturlData:{},
    playerReloadStatus:false,
    nextData:{},
    nextstatus:false,
}

//playback api
export const getPlaybackData = createAsyncThunk('details/getPlaybackData',(smarturl) => {
   if(!!smarturl){
    return axios.get(`${smarturl}?service_id=10&play_url=yes&protocol=hls&us=defa12946f1469398be25b1b7b197c65`)
    .then((response) => {
        console.log(response)
        return response.data
    })
    .catch((e) => console.log(e))
   }
     
})

// export const getNextStatus=createAsyncThunk("next/updatenext",async(link)=>{
//     try {
//         const {data}=await api.nextEpisode(link)
//         console.log(data)
//         return data.data
//     } catch (error) {
//         console.log(error.response)
//         return error.response 
//     }

// }) 
const playerReducer = createSlice({
    name:'player',
    initialState,
    reducers:{
        smarturlData: (state,action) =>{
            state.smarturlData = action.payload
        },
        reloadStatus:(state,action) =>{
            state.playerReloadStatus =  !state.playerReloadStatus
        }
    },
    extraReducers: (builder) =>{
        builder.addCase(getPlaybackData.pending,(state,action)=> {
            state.playbackData = {}
        })
        builder.addCase(getPlaybackData.fulfilled,(state,action)=> {
            state.playbackData = action.payload
        })
        // builder.addCase(getNextStatus.pending,(state,action)=>{
        //     state.nextstatus=false,
        //     state.nextData={}

        // })
        // builder.addCase(getNextStatus.fulfilled,(state,action)=>{
        //     console.log(action.payload.status)
        //       if(action.payload.status==422){
        //         state.nextstatus=false
        //       }else{
        //         state.nextstatus=true
        //         state.nextData=action.payload

        //       }
        // //    state.nextData=true,
        // })
    }
})

export default playerReducer.reducer
export const{smarturlData,reloadStatus} = playerReducer.actions