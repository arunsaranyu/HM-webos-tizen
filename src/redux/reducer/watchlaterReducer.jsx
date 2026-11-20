
// // import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// // import *  as api from "../../api/index.js"
// // const initialState = {
// //     loading: false,
// //     watchlater: {},
// // }


// // export const getwatchlater = createAsyncThunk("watchlater/getwatchlater", async () => {
// //     try {

// //         const { data } = await api.getwatchlaterlist()
// //         console.log(data)
// //         return data.data
// //     } catch (error) {

// //     }


// // })



// // const watchlater = createSlice({
// //     name: "watchlater",
// //     initialState,
// //     extraReducers: (bulider) => {
// //         bulider.addCase(getwatchlater.fulfilled, (state, action) => {
// //             state.watchlater = action.payload
// //         })
// //     }
// // })
// // export default watchlater.reducer

// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import * as api from "../../api/index.jsx";

// export const addWatchlater = createAsyncThunk("/addtowatchlater",async (contentdata) => {
//     const { data } = await api.addtowatchlater(contentdata);
//     return data.data;
//   }
// );

// export const deletewaterlateritem = createAsyncThunk(
//   "/deletewateritem",
//   async (list_id) => {
//     // const { data } = await api;


//     return data.data;
//   }
// );
// // export const getwatchhistory = createAsyncThunk(
// //   "/getwatchhistory",
// //   async () => {
// //     const { data } = await api.watchhistory();
// //     console.log(data.data, "getwatchlater");
// //     return data.data;
// //   }
// // );
// export const watchhistory=createAsyncThunk("/watchhistory/getwatchhistory",async()=>{
//   // const{data}=await api.watchhistory()
//   console.log("ndblhb....",data);
//   return data.data
// })
// export const getwatchlater = createAsyncThunk("/getwatchlater", async () => {
//   try {
//     // const { data } = await api.watchlater();

//     let items = [];

//     for (let item in data.data.items) {
//       data.data.items[item]["Items"].forEach((element) => {
//         items.push(element);
//       });
//     }

//     return items;
//   } catch (error) {
//     console.log(error);
//   }
// });

// const initialState = {
//   addwatchlatertoast: false,
//   removewatchtoast:false,
//   loading: true,
//   data: {},
//   addwatchlater: {},
//   deletewaterlateritem: {},
//   watchhistory: {},
// };

// const watchlaterReducer = createSlice({
//   name: "watchlater",
//   initialState,
//   reducers: {

//     watchlatertoast: (state, action) => {
//         state.addwatchlatertoast=action.payload
//         state.removewatchtoast=action.payload
//     }
// },
//   extraReducers: (bulider) => {
//     bulider.addCase(addWatchlater.pending, (state, action) => {
//       state.addwatchlatertoast = false
//     }),
//       bulider.addCase(addWatchlater.fulfilled,(state, action) => {
//         state.addwatchlatertoast = true
//         state.addwatchlater = action.payload;
//       }),
//       bulider.addCase(deletewaterlateritem.pending, (state, action) => {
//         state.removewatchtoast = false;
//       });
//       bulider.addCase(deletewaterlateritem.fulfilled, (state, action) => {
//         state.removewatchtoast = true;
//         state.deletewaterlateritem = action.payload;
//       });
//     bulider.addCase(getwatchlater.fulfilled, (state, action) => {
//       state.data = action.payload;
//     });
//     bulider.addCase(watchhistory.fulfilled,(state,action)=>{
//       let data2=action.payload.items
//       if(data2?.length>0){
//           state.homeData.catalog_list_items.map((each)=>{
//               if( each.display_title==="Continue Watching"){
//                 each.catalog_list_items.push(...data2)
//               }
//               })
//           }
//   })

//   },
// });

// export default watchlaterReducer.reducer;
// export const{watchlatertoast} = watchlaterReducer.actions


import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";

import *  as api from "../../api/index.jsx"
const initialState = {
  addwatchlatertoast: false,
  removewatchtoast: false,
  loading: true,
  data: {},
  addwatchlater: {},
  deletewaterlateritem: {},
  watchhistory: {},
  errorstatus:false,
};

export const getWatchLater = createAsyncThunk("/getwatchlater/watchlater", async () => {
  try {
    const { data } = await api.watchlater();
    return data.data

  } catch (error) {
 
    return error.response
  }
});

export const addWatchlater = createAsyncThunk("/addtowatchlater", async (contentdata) => {
  const { data } = await api.addtowatchlater(contentdata);
  return data.data;
}
);

export const deletewaterlateritem = createAsyncThunk("/deletewateritem",async (list_id) => {
    const { data } = await api.deletewatchlater(list_id);


    return data.data;
  }
);

const watchlaterReducer = createSlice({
  name: "watchlater",
  initialState,
  reducers: {

    watchlatertoast: (state, action) => {
      state.addwatchlatertoast = action.payload
      state.removewatchtoast = action.payload
    }, 
    setErrorMessageStatus(state, action) {
      state.errorstatus = action.payload;
  },
  },
  extraReducers: (bulider) => {
    bulider.addCase(addWatchlater.pending, (state, action) => {
      state.addwatchlatertoast = false
    }),
      bulider.addCase(addWatchlater.fulfilled, (state, action) => {
        
        state.addwatchlatertoast = true
        state.addwatchlater = action.payload;
      }),
      bulider.addCase(deletewaterlateritem.pending, (state, action) => {
        state.removewatchtoast = false;
      });
    bulider.addCase(deletewaterlateritem.fulfilled, (state, action) => {
      state.removewatchtoast = true;
      state.deletewaterlateritem = action.payload;
    });
    bulider.addCase(getWatchLater.pending, (state, action) => {
      state.loading = true
      state.data = {};
    });
    bulider.addCase(getWatchLater.fulfilled, (state, action) => {
      state.loading = false
      
      if(action?.payload?.data?.error?.code==1016 ){
        state.errorstatus=true
      }
      else{
          state.errorstatus=false
          state.data = action.payload;
      }
    });
    //   bulider.addCase(watchhistory.fulfilled,(state,action)=>{
    //     let data2=action.payload.items
    //     if(data2?.length>0){
    //         state.homeData.catalog_list_items.map((each)=>{
    //             if( each.display_title==="Continue Watching"){
    //               each.catalog_list_items.push(...data2)
    //             }
    //             })
    //         }
    // })

  },
});

export default watchlaterReducer.reducer;
export const { watchlatertoast ,setErrorMessageStatus} = watchlaterReducer.actions