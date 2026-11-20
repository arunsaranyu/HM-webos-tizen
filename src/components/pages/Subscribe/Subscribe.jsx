import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sidebarDisable } from '../../../redux/reducer/landingReducer.jsx'
import "./Subscribe.scss"
const Subscribe = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(sidebarDisable())
    }, [])
    const subUrl = useSelector((state) => state?.common?.appConfig?.params_hash2?.config_params?.subscription_url)
    return (
        <div className='plans-subscribe'>
            <h1 className='sub-heading'>Subscribe to Tarang plus to watch all the premium content On your phone or computer go to:</h1>
            <p className='sub-url'>{"https://tarangplus.in/plans"}</p>
        </div>
    )
}

export default Subscribe