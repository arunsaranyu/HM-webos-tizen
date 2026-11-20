import React from "react";
import AnalyticsSdk from "./saranyuAnalytics/sdk.analytics_v_2.js"

import { createRoot } from 'react-dom/client'

// import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store/store.jsx"



import App from "./App.jsx";



const root = createRoot(document.getElementById("app-root"))
root.render(
   <Provider store={store}>
      <App />
   </Provider>
)