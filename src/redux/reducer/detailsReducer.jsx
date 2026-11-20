import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import * as api from "../../api/index.jsx"
const parseTimeToSeconds = (timeStr) => {
    if (!timeStr && timeStr !== 0) return 0;
    if (typeof timeStr === "number") return timeStr;
    const str = String(timeStr).trim();
    if (str.includes(":")) {
        const parts = str.split(":").map(Number);
        if (parts.length === 3) {
            return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
        } else if (parts.length === 2) {
            return (parts[0] || 0) * 60 + (parts[1] || 0);
        }
    }
    return parseFloat(str) || 0;
};

const initialState = {
    waterlaterToggle: false,
    continue: false,
    preview: false,
    loading: false,
    data: {},
    playbackUrl: '',
    previewContent: {},
    recommend: {},
    card: {},
    position: "",
    getAllDetails: {},
    addwatchlatertoast: false,
    removewatchtoast: false,
    addwatchlater: {},
    deletewaterlateritem: {},
    errorstatus: false,
    seekbarImageUrl: "",
    upNext: {},
    previouspath: "",
    upnextgetAllDetails: {},
    is_secured: false,

}
export const addWatchlater = createAsyncThunk("/addtowatchlater", async (contentdata) => {
    try {
        const { data } = await api.addtowatchlater(contentdata);
        return data.data;
    } catch (error) {
        return error.response
    }
}
);

export const deletewaterlateritem = createAsyncThunk(
    "/deletewateritem",
    async (list_id) => {
        try {
            const { data } = await api.deletewatchlater(list_id);
            return data.data;
        } catch (error) {
            return error.response
        }
    }
);
export const getDetailsData = createAsyncThunk("/DetailsPage", async (link) => {
    let response;
    if (link?.theme === "episode" || link?.theme === "show_episode") {
        response = await api.episodeDetails(link);
    } else {
        response = await api.getDetails(link);
    }
    return response.data.data;
})

export const getEpisodeDetailsData = createAsyncThunk("/EpisodeDetailsPage", async (link) => {
    const { data } = await api.episodeDetails(link);
    return data.data;
})
export const getAllDetailsData = createAsyncThunk("/getallDetails", async (link) => {
    const { allDetails, navigate, theme } = link

    const { data } = await api.getAllDetails(allDetails)
    // localStorage.setItem("is_subscribed", data.data.is_subscribed);
    if (theme == "live") {
        navigate(`/liveplayer/${theme}`)
    }
    else if (!!navigate) {
        if (window.location.hash == "#/player/vod") {
            navigate("/player/vod", { replace: true })
        }
        else {
            navigate("/player/vod")
        }

    }

    // console.log(data)
    return { data: data.data }
})


export const getupnextAllDetailsData = createAsyncThunk("/upnextgetallDetails/Details", async (link) => {
    const { allDetails, navigate, theme } = link

    const { data } = await api.getAllDetails(allDetails)
    // localStorage.setItem("is_subscribed", data.data.is_subscribed);
    if (theme == "live") {
        navigate(`/liveplayer/${theme}`)
    }
    else if (!!navigate) {
        if (window.location.hash == "#/player/vod") {
            navigate("/player/vod", { replace: true })
        }
        else {
            navigate("/player/vod")
        }

    }

    // console.log(data)
    return { data: data.data }
})
export const getupNext = createAsyncThunk("upnext/getupnext", async (link) => {
    try {
        const { data } = await api.upNext(link)
        // console.log(data)
        return data.data
    } catch (error) {

    }
})

const detailsReducer = createSlice({
    name: "details",
    initialState,
    reducers: {
        positionInPlayer: (state, action) => {
            state.position = action.payload
        },
        getalldata: (state, action) => {
            state.getalldata = action.payload
        },
        waterlaterbuttonToggle: (state, action) => {
            // console.log(action.payload)
            state.waterlaterToggle = action.payload
        },

        contentDetails: (state, action) => {
            state.card = action.payload
        },

        playurl: (state, action) => {
            state.playbackurl = action.payload
        },

        watchlatertoast: (state, action) => {
            state.addwatchlatertoast = action.payload
            state.removewatchtoast = action.payload
        },
        setErrorMessageStatus: (state, action) => {
            state.errorstatus = action.payload;
        },
        onClickWaterlaterToggole: (state, action) => {
            state.waterlaterToggle = action.payload
        },
        setgetalldetails: (state, action) => {
            console.log("setgetalldetails", action.payload)
            state.getAllDetails = action.payload

        }
    },
    extraReducers: (bulider) => {
        bulider.addCase(addWatchlater.pending, (state, action) => {
            state.addwatchlatertoast = false
        }),
            bulider.addCase(addWatchlater.fulfilled, (state, action) => {

                if (action.payload.status == 422) {
                    if (localStorage.getItem("session_id") != null && localStorage.getItem("session_id") != undefined) {
                        if (action?.payload?.data?.error?.message.includes("Invalid Session")) {
                            state.errorstatus = true
                        }
                        else {
                            state.errorstatus = false
                        }
                    }
                }
                else {
                    state.errorstatus = false
                    state.addwatchlatertoast = true
                    state.removewatchtoast = false
                    state.waterlaterToggle = true
                    state.addwatchlater = action.payload;
                }
            }),
            bulider.addCase(deletewaterlateritem.pending, (state, action) => {
                state.removewatchtoast = false;
            }),
            bulider.addCase(deletewaterlateritem.fulfilled, (state, action) => {
                // console.log('aaaaaaaaaaaaaa', action.payload)
                if (!!action.payload && action.payload.status == 422) {
                    if (action?.payload?.data?.error?.message.includes("Invalid Listitem Id")) {
                        state.errorstatus = false
                    }
                    else {
                        state.errorstatus = true
                    }
                }
                else {
                    state.errorstatus = false
                    state.removewatchtoast = true;
                    state.waterlaterToggle = false;
                    state.dle = action.payload;
                }
            }),
            bulider.addCase(getDetailsData.pending, (state, action) => {
                state.loading = true
                state.data = {}
            }),
            bulider.addCase(getDetailsData.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
        bulider.addCase(getEpisodeDetailsData.pending, (state, action) => {
            state.loading = true
            state.data = {}
        })
        bulider.addCase(getEpisodeDetailsData.fulfilled, (state, action) => {
            state.loading = false
            state.data = action.payload
        })
        bulider.addCase(getAllDetailsData.pending, (state, action) => {

            state.getAllDetails = {}
            state.previewContent = {}
            state.preview = false
            state.continue = false
            state.waterlaterToggle = false
            state.playbackUrl = ""
        }),

            bulider.addCase(getAllDetailsData.fulfilled, (state, action) => {
                const { data, navigate, theme } = action.payload

                // console.log(data?.stream_info?.adaptive_url_ak)
                if (data?.seekbar_thumbnail_url != null && data?.seekbar_thumbnail_url != "") {
                    state.seekbarImageUrl = data?.seekbar_thumbnail_url
                } else {
                    state.seekbarImageUrl = ""
                }

                if (data?.preview?.preview_available === true) {
                    state.preview = true
                    state.previewContent = action?.payload?.preview
                } else {
                    state.previewContent = {}
                    state.preview = false
                }

                if (data?.stream_info?.is_secured) {
                    state.is_secured = data?.stream_info?.is_secured
                }
                const nextUrl = data?.adaptive_urls?.hd?.hls?.[0]?.playback_url
                    || data?.stream_info?.adaptive_url_ak
                    || data?.stream_info?.playback_url
                    || data?.playback_url
                    || data?.adaptive_url
                    || "";
                if (nextUrl) {
                    state.playbackUrl = nextUrl;
                }
                if (data?.playlists?.length > 0) {
                    data?.playlists.map((each) => {
                        if (each?.name === "Watch History") {
                            const watchedSeconds = parseTimeToSeconds(each?.pos);
                            const durationVal = each?.duration
                                || each?.total_duration
                                || each?.target_duration
                                || data?.duration
                                || data?.duration_string
                                || data?.target_duration
                                || state?.data?.duration
                                || state?.data?.duration_string
                                || state?.data?.target_duration;
                            const totalSeconds = parseTimeToSeconds(durationVal);

                            let isFinished = false;
                            if (totalSeconds > 0 && watchedSeconds > 0) {
                                const percentage = (watchedSeconds / totalSeconds) * 100;
                                if (percentage > 99.90) {
                                    isFinished = true;
                                }
                            } else if (typeof each?.pos === "number" && each?.pos > 99.90) {
                                isFinished = true;
                            }

                            if (isFinished) {
                                state.continue = false;
                                state.position = "00:00:00";
                            } else {
                                state.position = each.pos;
                                state.continue = true;
                            }
                        }
                        else if (each.name === "Watch Later") {
                            state.deletewaterlateritem = {}
                            state.addwatchlater = {}
                            state.waterlaterToggle = true
                        }
                    })
                }



                else if (action?.payload?.playlists?.length === 0) {
                    state.waterlaterToggle = false
                    state.continue = false
                    state.position = "00:00:00"
                    state.deletewaterlateritem = {}
                }
                else {
                    state.waterlaterToggle = false
                    state.continue = false
                    state.position = "00:00:00"
                }
                if (data?.stream_info?.percentage >= 99.5) {
                    state.continue = false
                    state.position = "00:00:00"

                }

                state.getAllDetails = action.payload

            })

        bulider.addCase(getupnextAllDetailsData.fulfilled, (state, action) => {
            const { data, navigate, theme } = action.payload

            // console.log(data?.stream_info?.adaptive_url_ak)
            if (data?.stream_info?.seekbar_thumbnail_url != null && data?.stream_info?.seekbar_thumbnail_url != "") {
                state.seekbarImageUrl = data?.stream_info?.seekbar_thumbnail_url
            } else {
                state.seekbarImageUrl = ""
            }

            if (data?.preview?.preview_available === true) {
                state.preview = true
                state.previewContent = action?.payload?.preview
            } else {
                state.previewContent = {}
                state.preview = false
            }

            if (data?.stream_info?.is_secured) {
                state.is_secured = data?.stream_info?.is_secured
            }
            if (data?.stream_info?.adaptive_url_ak !== "") {
                state.playbackUrl = data?.stream_info?.adaptive_url_ak
            }
            if (data?.playlists?.length > 0) {
                data?.playlists.map((each) => {
                    if (each?.name === "Watch History") {
                        const watchedSeconds = parseTimeToSeconds(each?.pos);
                        const durationVal = each?.duration
                            || each?.total_duration
                            || each?.target_duration
                            || data?.duration
                            || data?.duration_string
                            || data?.target_duration
                            || state?.data?.duration
                            || state?.data?.duration_string
                            || state?.data?.target_duration;
                        const totalSeconds = parseTimeToSeconds(durationVal);

                        let isFinished = false;
                        if (totalSeconds > 0 && watchedSeconds > 0) {
                            const percentage = (watchedSeconds / totalSeconds) * 100;
                            if (percentage > 99.90) {
                                isFinished = true;
                            }
                        } else if (typeof each?.pos === "number" && each?.pos > 99.90) {
                            isFinished = true;
                        }

                        if (isFinished) {
                            state.continue = false;
                            state.position = "00:00:00";
                        } else {
                            state.position = each.pos;
                            state.continue = true;
                        }
                    }
                    else if (each.name === "Watch Later") {
                        state.deletewaterlateritem = {}
                        state.addwatchlater = {}
                        state.waterlaterToggle = true
                    }
                })
            }



            else if (action?.payload?.playlists?.length === 0) {
                state.waterlaterToggle = false
                state.continue = false
                state.position = "00:00:00"
                state.deletewaterlateritem = {}
            }
            else {
                state.waterlaterToggle = false
                state.continue = false
                state.position = "00:00:00"
            }
            if (data?.stream_info?.percentage >= 99.5) {
                state.continue = false
                state.position = "00:00:00"

            }
            window.upnextgetAllDetails = action.payload
            state.upnextgetAllDetails = action.payload

        })
        bulider.addCase(getupNext.pending, (state, action) => {
            state.upNext = {}
        })
        bulider.addCase(getupNext.fulfilled, (state, action) => {
            window.upNext = action.payload
            state.upNext = action.payload
        })

        // bulider.addCase(getdetailsReducer.fulfilled, (state, action) => {
        //     state.loading = false
        //     if (action.payload.preview?.preview_available === true) {
        //         state.preview = true
        //     }else{
        //         state.preview=false 
        //     }

        //     state.data = action.payload
        // }),

        // bulider.addCase(detailsepisode.fulfilled, (state, action) => {
        //     state.data = action.payload
        // }),
        // bulider.addCase(getalldetails.fulfilled, (state, action) => {
        //       state.playbackurl=action.payload?.adaptive_url_aks?.hd?.dash[0]?.playback_url
        //     if (action?.payload?.playlists?.length) {
        //         action.payload.playlists.map((each) => {
        //             if (each?.name === "Watch History") {
        //                 state.position = each.pos
        //                 state.continue = true
        //             }
        //             else if (each.name === "Watch Later") {
        //                 state.waterlaterToggle = false
        //             }
        //         })
        //     }
        //     else if (action?.payload?.playlists?.length === 0) {
        //         state.waterlaterToggle = true
        //         state.continue=false
        //         state.position = "00:00:00"
        //     }
        //     else {
        //         state.position = "00:00:00"
        //     }
        //     state.getalldetails = action.payload
        // }),

        // bulider.addCase(getalldetails.rejected,(state,action)=>{
        //     state.getalldetails={}
        // })
    }
})

export default detailsReducer.reducer
export const { positionInPlayer, setgetalldetails, getalldata, waterlaterbuttonToggle, playurl, contentDetails, watchlatertoast, setErrorMessageStatus } = detailsReducer.actions