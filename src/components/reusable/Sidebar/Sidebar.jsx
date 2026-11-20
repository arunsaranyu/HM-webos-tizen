import React, { useEffect, useState } from 'react'
import { FocusContext, setFocus, useFocusable } from '@noriginmedia/norigin-spatial-navigation'

import SearchIcon from './SearchIcon.jsx'
import SidebarItem from './SidebarItem.jsx'

import "./Sidebar.scss"

// import search_selected from "../../../assets/images/search_selected.svg";
import search_not_selected from "../../../assets/images/default_searchBar.svg";
import active_searchBar from "../../../assets/images/active_searchBar.svg";
import focused_searchBar from '../../../assets/images/focused_searchBar.svg'




import active_settings from "../../../assets/images/active_settings.svg"
import default_settings from "../../../assets/images/default_settings.svg"
import focus_settings from "../../../assets/images/focus_settings.svg"



import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import SettingIcon from './SettingIcon.jsx';
import { activeIndexSidebar, sidebarToggleFalse, sidebarToggleTrue } from '../../../redux/reducer/landingReducer.jsx'
import Profile from './Profile.jsx'

import openmenulineargradient from "../../../assets/images/open_lineargradient.png"
import logo from "../../../assets/images/logo.png"
import { setEmptySearch } from '../../../redux/reducer/SearchReducer.jsx'
import { sidebarFocused } from '../../../redux/reducer/sidebarReducer.jsx'
const Sidebar = (props) => {
    const [activeIndex, setactiveIndex] = useState(1)
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [visisble, setvisisble] = useState()
    const { ref, focusKey, hasFocusedChild } = useFocusable({
        focusKey: props.focusKey,
        trackChildren: true,
    })

    // console.log("focusedChild", console.log(`Focused on: ${props.focusKey}`))
    const active = useSelector((state) => state?.common?.activeIndex)
    const data = useSelector((state) => state?.landing?.sidebarItems)
    const firstIndex = useSelector((state) => state?.landing?.firstIndex)


    // Focus moves into the sidebar, but it stays collapsed (icons only, no titles).
    // Previously, focusing the sidebar dispatched sidebarToggleTrue(), which expanded it with titles.
    useEffect(() => {
        dispatch(sidebarToggleFalse())
        setvisisble(hasFocusedChild === true)
    }, [hasFocusedChild])


    const sidebartoggole = useSelector((state) => state?.landing?.sidebarVisibleWithTitle)
    const profileImg = useSelector((state) => state?.profile?.image)
    let imgURL = localStorage.getItem("image_url")

    // if (data?.length > 0) {
    //     let array = [].concat
    //     dynamicMenu?.splice(1, 0, ...staticMenu);
    // }

    let staticMenu = []
    let [dynamicMenu, setDynamicMenu] = useState()
    useEffect(() => {

        if (data.length > 0) {
            staticMenu.unshift({
                navTo: '/search',
                sidebarImage: { focused: focused_searchBar, notFocused: search_not_selected },
                navType: 'search',
                focusedImg: active_searchBar,
                title: "Search",
                alt: '',
            })

            data?.map((each) => {
                staticMenu.push({
                    navTo: `/${each.home_link}`,
                    sidebarImage: { focused: each?.thumbnails?.l_medium?.url, notFocused: each?.thumbnails?.l_medium?.url },
                    navType: `${each.home_link}`,
                    focusedImg: each?.thumbnails?.l_medium?.url,
                    title: `${each.display_title}`,
                    alt: '',
                })
            })
            staticMenu.push({
                navTo: '/settings',
                sidebarImage: { focused: focus_settings, notFocused: default_settings },
                navType: 'settings',
                focusedImg: active_settings,
                title: "Settings",
                alt: '',
            })
            setDynamicMenu(staticMenu)
        }

    }, [data])

    const lastfocusedKey = (key) => {
        dispatch(sidebarFocused(key))
    }
    const handleLogoClick = () => {
        dispatch(setEmptySearch({}))
        const targetTab = firstIndex || (data?.[0]?.home_link && data[0].home_link !== 'home' ? data[0].home_link : null) || 'home-list';
        navigate(`/${targetTab}`);
        dispatch(activeIndexSidebar(targetTab));
    }

    const handleEnterPress = (data) => {

        dispatch(setEmptySearch({}))

        navigate(`${data.navTo}`)
        dispatch(activeIndexSidebar(data.navType))

    }

    // const sidebartoggole = useSelector((state) => state?.common?.sidebartoggle);


    const onRenderProfile = (key) => {

        dispatch(setEmptySearch({}))
        navigate("/chooseprofile")
        lastfocusedKey("chooseprofile")
    }


    const lastfocused = useSelector((state) => state?.sidebar?.sidebarFocuseKey)


    //   useEffect(()=>{
    //     if(sidebartoggole==true){
    //       setFocus(lastfocused)
    //     }
    //   },[sidebartoggole])
    return (
        <FocusContext.Provider value={focusKey}>
            <div id="sidebar"

                className={sidebartoggole ? "sidebar-focused" : "sidebar"} ref={ref}>
                <div className={sidebartoggole ? "nav-items-toggle" : 'nav-items'}>
                    <div className={!!localStorage.getItem("session_id") ? 'top-section top-section-logged-in' : 'top-section'}>
                        {
                            !!localStorage.getItem("session_id") && (
                                <div
                                    className="sidebar-logo-container"
                                    onClick={handleLogoClick}
                                >
                                    <img src={logo} alt="Logo" className="sidebar-logo" />
                                </div>
                            )
                        }

                        {
                            dynamicMenu && dynamicMenu.filter(ele => ele.navType === "search").map((ele, i) => (
                                <SidebarItem
                                    key={ele.navType || `search-${i}`}
                                    index={ele.navType}
                                    route={ele}
                                    navType={ele.navType}
                                    focuskey={ele.navType}
                                    onEnterPress={() => handleEnterPress(ele)}
                                    handleEnterpress={handleEnterPress}
                                    lastfocusedKey={lastfocusedKey}
                                />
                            ))
                        }
                    </div>
                    {
                        dynamicMenu && dynamicMenu.filter(ele => ele.navType !== "search" && ele.navType !== "settings").map((ele, i) => (
                            <SidebarItem
                                key={ele.navType || i}
                                index={ele.navType}
                                route={ele}
                                navType={ele.navType}
                                focuskey={ele.navType}
                                onEnterPress={() => handleEnterPress(ele)}
                                lastfocusedKey={lastfocusedKey}
                                handleEnterpress={handleEnterPress}
                            />
                        ))
                    }
                    <div className='bottom-section'>
                        {
                            dynamicMenu && dynamicMenu.filter(ele => ele.navType === "settings").map((ele, i) => (
                                <SidebarItem
                                    key={ele.navType || `settings-${i}`}
                                    index={ele.navType}
                                    route={ele}
                                    focuskey={ele.navType}
                                    navType={ele.navType}
                                    lastfocusedKey={lastfocusedKey}
                                    onEnterPress={() => handleEnterPress(ele)}
                                    handleEnterpress={handleEnterPress}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
        </FocusContext.Provider>
    )
}

export default Sidebar
