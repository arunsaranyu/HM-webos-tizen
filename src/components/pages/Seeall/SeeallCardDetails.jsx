import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { bannerContent, layoutCard } from '../../../redux/reducer/commonReducer.jsx';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import tag_premium from "../../../assets/images/tag_premium.svg"
import placeholder_16_9 from "../../../assets/images/placeholder16_9.png";


import ph_web_43 from "../../../assets/images/ph_web_43.svg"
import ph_web_69 from "../../../assets/images/ph_web_169.svg"
import { getupdateSeeall } from '../../../redux/reducer/seeallReducer.jsx';
import { getupdateSearch } from '../../../redux/reducer/SearchReducer.jsx';
import veg from "../../../assets/images/veg.png"
import non_veg from "../../../assets/images/nonveg.png"
const SeeallCardDetails = (props) => {
    const dispatch = useDispatch()
    const { data, ui_type, onFocus, friendly_id, page, setPage, onEnterPress, index, setcountparam, countparam, from, onArrowPress, renderDetails, layout, display_title } = props
    const { ref, focused } = useFocusable({ onFocus, onEnterPress, onArrowPress });
    const navigate = useNavigate()
    console.log("seealldetails", data)
    // let [page,setpage]=useState(1)
    const searchvalue = useSelector((state) => state?.search?.searchParams)

    useEffect(() => {
        if (focused == true) {
            // console.log("index", index, 12, page)
            dispatch(bannerContent(data))
            localStorage.setItem("focusedelement", "seeallcard")
            localStorage.setItem("seasonseeall", index);
            if (from == "search-result") {
                if (index > 12 * page) {
                    const data = {
                        search: searchvalue,
                        count: page
                    }
                    dispatch(getupdateSearch(data))
                    setPage(page + 1)

                }
            }
            else if (from !== "watch-history" && from !== "continue-watching" && !display_title?.includes("Continue Watching") && index > 12 * page) {
                setPage(page + 1)
                const data = {
                    friendly_id: friendly_id,
                    page: page
                }
                dispatch(getupdateSeeall(data))

            }
            if (data?.theme !== "seeall") {
                dispatch(bannerContent(data))
                dispatch(layoutCard(layout))
                // console.log(data?.preview_available)
                // if(data?.preview_available===true){
                //     dispatch(getPlaybackData(data?.preview?.play_url?.saranyu?.url))
                // }
            }


            // else if (data?.theme === "seeall") {
            //     dispatch(bannerContent(data))
            // }
        }
    }, [focused, page])

    const imageOnError16x9 = (event) => {
        event.currentTarget.src = ph_web_69
    }
    const imageOnError2x3 = (event) => {
        event.currentTarget.src = ph_web_43
    }
    const onClickHandler = () => {
        renderDetails(data, from, navigate)
    }


    return (




        layout === "banner" ? (
            data.theme !== "seeall" ? (

                <div index={index} onClick={() => onClickHandler()} ref={ref} className={focused ? "card-focused" : "card"} style={{ margin: "0px 1.5% 1.2% 0px" }}>
                    {/* {data?.access_control?.is_free == false ?

                                <img className="premium-tag" src={tag_premium} alt="" /> : ""
                            } */}
                    {
                        !!data && data.title_image_display ? <img onError={imageOnError16x9} src={data?.title_image} className='img' alt="" loading="lazy" /> : <img onError={imageOnError16x9} src={placeholder_16_9} className='img' alt="" loading="lazy" />

                    }
                </div>

            ) : (
                <div ref={ref} onClick={() => onClickHandler()} className={focused ? "seeall-card-focused" : "seeall-card"}>
                    Seeall
                </div>

            )
        ) :
            layout == "catalog_list" || layout == "list_in_list" ? (
                data.theme !== "seeall" ? (

                    <div index={index} onClick={() => onClickHandler()} ref={ref} className={focused ? "card-focused" : "card"} style={{ margin: "0px 1.5% 1.2% 0px" }}>
                        {data?.access_control?.is_free == false ?

                            <img className="premium-tag" src={tag_premium} alt="" /> : ""
                        }
                        {
                            !!data && data?.list_item_object ? <img src={data?.list_item_object?.banner_image} onError={imageOnError16x9} className='img' alt="" loading="lazy" /> : <img src={placeholder_16_9} onError={imageOnError16x9} className='img' alt="" loading="lazy" />

                        }
                    </div>

                ) : (
                    <div ref={ref} onClick={() => onClickHandler()} className={focused ? "seeall-card-focused" : "seeall-card"} >
                        Seeall
                    </div>
                )
            ) :

                (
                    data.theme !== "seeall" ? !display_title.includes("Continue Watching") ?
                        (
                            <div index={index} onClick={() => onClickHandler()} ref={ref} className={focused ? "card-focused" : "card"} style={{ margin: "0px 1.5% 1.2% 0px" }}>
                                {data?.access_control?.is_free == false ?
                                    <img className="premium-tag" src={tag_premium} alt="" /> : ""
                                }
                                {
                                    !!data.thumbnails && (data?.thumbnails?.medium_16_9?.url ? <img onError={imageOnError16x9} src={data?.thumbnails?.medium_16_9?.url} className='img' alt="" loading="lazy" /> : data?.thumbnails?.l_medium?.url ? <img onError={imageOnError16x9} src={data?.thumbnails?.l_medium?.url} className='img' alt="" loading="lazy" /> :
                                        <img src={ph_web_69} className='img' alt="" loading="lazy" />
                                    )
                                }
                                {
                                    data?.sub_genres && data.sub_genres.length > 0 ? (
                                        data.sub_genres[0] === "non_veg" ? (
                                            <img className="food-type" src={non_veg} alt="non_veg" />
                                        ) : data.sub_genres[0] === "veg" ? (
                                            <img className="food-type" src={veg} alt="veg" />
                                        ) : (
                                            ""
                                        )
                                    ) : (
                                        ""
                                    )
                                }
                            </div>

                        ) : (
                            <div index={index} onClick={() => onClickHandler()} ref={ref} className={focused ? "card-focused" : "card"} style={{ margin: "0px 1.5% 1.2% 0px" }}>

                                {data?.access_control?.is_free == false ?
                                    <img className="premium-tag" src={tag_premium} alt="" /> : ""
                                }
                                {
                                    !!data.thumbnails && (data?.thumbnails?.medium_16_9?.url ? <img onError={imageOnError16x9} src={data?.thumbnails?.medium_16_9?.url} className='img' alt="" loading="lazy" /> : data?.thumbnails?.l_medium?.url ? <img onError={imageOnError16x9} src={data?.thumbnails?.l_medium?.url} className='img' alt="" loading="lazy" /> :
                                        <img src={ph_web_69} className='img' alt="" loading="lazy" />
                                    )
                                }
                                <div className="progress-line"><div className="progress-barcard">
                                    <div className="filler" style={{ width: `${data?.percentage}%` }} />;
                                </div></div>


                            </div>
                        ) : (
                        <div ref={ref} onClick={() => onClickHandler()} className={focused ? "seeall-card-focused" : "seeall-card"}>
                            Seeall
                        </div>
                    )



                )
    )





}

export default SeeallCardDetails