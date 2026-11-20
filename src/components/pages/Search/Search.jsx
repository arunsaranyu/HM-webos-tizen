import React, { useCallback, useState, useEffect, useRef } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import InputSearch from './InputSearch.jsx'
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import { activeIndexSidebar, sidebarAllow, sidebarToggleFalse, sidebarToggleTrue } from '../../../redux/reducer/landingReducer.jsx'
import Card from "../../reusable/Card/Card.jsx"
import SearchGrid from "./SearchGrid.jsx"
import noresultfound from "../../../assets/images/noResultsFound.svg"
import Toast from '../../../helper/Toasty.jsx'
import icon_error from "../../../assets/images/icon_error.png";
import { onClicked } from '../../../redux/reducer/commonReducer.jsx'
import { useNavigate } from 'react-router-dom'
import Popup from '../../../helper/Popup.jsx'
import { sidebarFocused } from '../../../redux/reducer/sidebarReducer.jsx'
import { getTrendingSearch, searchValue, setEmptySearch } from '../../../redux/reducer/SearchReducer.jsx'
const Search = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const inputFocus = useRef(null)
    const { ref, focusSelf, focusKey } = useFocusable({})
    const onclikedStatus = useSelector((state) => state?.common?.clicked)
    const lastfocused = useSelector((state) => state?.sidebar?.sidebarFocuseKey)
    const trending = useSelector((state) => state?.search?.trendingData)
    const searchvalue = useSelector((state) => state?.search?.searchParams)
    useEffect(() => {
        dispatch(sidebarAllow())
        dispatch(onClicked(""))
        dispatch(setEmptySearch())
        dispatch(searchValue(""))
        dispatch(getTrendingSearch())
        //     const inputElement = document.getElementById("input-search");

        // if (inputElement) {
        //     inputElement.focus();
        // }
        dispatch(activeIndexSidebar(window.location.hash.slice(2)))
        dispatch(sidebarFocused("search"))
    }, [])

    useEffect(() => {

        focusSelf()
    }, [lastfocused])
    useEffect(() => {

    }, [onclikedStatus])
    const onRowFocus = useCallback(
        ({ y }) => {
            if (!!ref.current) {
                ref.current.scrollTop = y
            }
        },
        [ref]
    )
    const [count, setcount] = useState(1)
    const searchResult = useSelector((state) => state?.search?.data)
    const sidebartoggole = useSelector((state) => state?.common?.sidebartoggle)
    const loading = useSelector((state) => state?.search?.loading)

    const updateCount = () => {
        setcount(count + 1)

    }
    const onSubmit = (confirm) => {
        dispatch(onClicked(""))

        if (confirm === "Go Back") {

            dispatch(onClicked(""))
        }
        else {
            navigate("/plans")
        }
    }
    return (
        <div className="main-card">
            <div className=" parent-container">
                <FocusContext.Provider value={focusKey}>
                    <div ref={ref} className='search-container'>
                        <InputSearch id="input-search" inputFocus={inputFocus} onFocus={onRowFocus} />
                    </div>
                    {
                        !searchvalue || searchvalue.trim() === "" ? (
                            trending && (trending?.items?.length > 0 || trending?.catalog_list_items?.length > 0 || (Array.isArray(trending) && trending.length > 0)) ? (
                                <Card
                                    data={trending}
                                    layout={trending?.tv_layout_type || ""}
                                    count={count}
                                    updateCount={updateCount}
                                    from="trending"
                                    index={"0"}
                                />
                            ) : null
                        ) : searchResult?.items?.length == 0 ? (
                            <div className='nodata'>
                                <img src={noresultfound} alt={""} />
                                <h3>Sorry!</h3>
                                <h4>We couldn't find anything that matches your search :(</h4>
                            </div>
                        ) : (
                            <SearchGrid
                                data={searchResult?.items || []}
                                searchvalue={searchvalue}
                                count={searchResult?.count ?? searchResult?.total_items_count ?? searchResult?.items?.length}
                            />
                    )
                    }

                </FocusContext.Provider>
            </div>

            {
                onclikedStatus == "clicked" ?
                    <Popup
                        alert=""
                        alertType="Subscription Alert"
                        heading="No Subscription Found"
                        Description="You need a subscription to access the content"
                        from={"details"}
                        onSubmit={onSubmit}
                    /> : ""
            }
        </div>
    )
}

export default Search