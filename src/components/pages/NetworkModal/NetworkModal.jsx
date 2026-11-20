import React from 'react'
import { useSelector } from 'react-redux'
import StaticReusable from '../../reusable/StaticReusable/StaticReusable.jsx'
import noInternetConnection from '../../../assets/images/noInternetConnection.svg'
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation'

const NetworkModal = ({ reloadApp, networkStatus, direction }) => {
    const firstIndex = useSelector((state) => state?.landing?.firstIndex);
    const {ref,focusKey}=useFocusable();
    return (
        <FocusContext.Provider value={focusKey}>
        <div ref={ref}>
        <StaticReusable
            alert="Alert"
            alertType="Network Error"
            image={noInternetConnection}
            heading="Opps..!"
            Description="Slow or no internet connection. Please check your internet setting."
            ButtonTextArray={["Retry"]}
            direction={direction || firstIndex || "home"}
            reloadApp={reloadApp}
            networkStatus={networkStatus}
        />
        </div>
        </FocusContext.Provider>
    )
}

export default NetworkModal