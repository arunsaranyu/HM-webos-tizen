import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { bannerContent, layoutCard, onClicked } from '../../../redux/reducer/commonReducer.jsx';
import tag_premium from "../../../assets/images/tag_premium.svg"
import { useNavigate } from 'react-router-dom';
import ph_web_69 from "../../../assets/images/ph_web_169.svg"
import "../Card/Card.scss"

const CardDetails = (props) => {
    const dispatch = useDispatch()
    const { data, ui_type, display_title, count, updateCount, onFocus, onEnterPress, index, setcountparam, countparam, focusKey, from, onArrowPress, renderDetails, layout, friendly_id, parentdata, dataid } = props
    const { ref, focused } = useFocusable({ onFocus, onEnterPress, onArrowPress, });
    const navigate = useNavigate()

    const searchvalue = useSelector((state) => state?.search?.searchParams)
    useEffect(() => {
        if (focused == true) {
            dispatch(onClicked(""))
            if (data?.theme !== "seeall") {
                dispatch(bannerContent(data))
                dispatch(layoutCard(layout))
            } else {
                dispatch(layoutCard(layout))
            }
        }
    }, [focused])

    const imageOnError16x9 = (event) => {
        event.currentTarget.src = ph_web_69
    }

    // Content tag (top-right badge) — home page cards only, and only when content_tag is a real string (not null / "NA")
    const HOME_PAGE_SOURCES = ["home", "movies", "live"]
    const rawTag = data?.content_tag
    const contentTag =
        HOME_PAGE_SOURCES.includes(from) &&
            typeof rawTag === "string" &&
            rawTag.trim() !== "" &&
            rawTag.trim().toUpperCase() !== "NA"
            ? rawTag.trim()
            : null

    const onClickHandler = () => {
        renderDetails(data, friendly_id, from, navigate, index, display_title, parentdata)
    }

    return (
        data.theme !== "seeall" ? (
            display_title != "Continue Watching" ? (
                <div index={index} onClick={() => onClickHandler()} ref={ref} className={focused ? "card-focused" : "card"}>
                    {data?.access_control?.is_free == false &&
                        <img className="premium-tag" src={tag_premium} alt="" />
                    }
                    {contentTag && <div className="content-tag">{contentTag}</div>}
                    {!!data.thumbnails && (
                        data?.thumbnails?.medium_16_9?.url
                            ? <img onError={imageOnError16x9} src={data?.thumbnails?.medium_16_9?.url} className='img' alt="" loading="lazy" />
                            : data?.thumbnails?.l_medium?.url
                                ? <img onError={imageOnError16x9} src={data?.thumbnails?.l_medium?.url} className='img' alt="" loading="lazy" />
                                : <img src={ph_web_69} className='img' alt="" loading="lazy" />
                    )}
                </div>

            ) : (
                <div index={index} onClick={() => onClickHandler()} ref={ref} className={focused ? "card-focused" : "card"}>
                    {data?.access_control?.is_free == false &&
                        <img className="premium-tag" src={tag_premium} alt="" />
                    }
                    {contentTag && <div className="content-tag">{contentTag}</div>}
                    {!!data.thumbnails && (
                        data?.thumbnails?.medium_16_9?.url
                            ? <img onError={imageOnError16x9} src={data?.thumbnails?.medium_16_9?.url} className='img' alt="" loading="lazy" />
                            : data?.thumbnails?.l_medium?.url
                                ? <img onError={imageOnError16x9} src={data?.thumbnails?.l_medium?.url} className='img' alt="" loading="lazy" />
                                : <img src={ph_web_69} className='img' alt="" loading="lazy" />
                    )}
                    <div className="progress-line"><div className="progress-barcard">
                        <div className="filler" style={{ width: `${data?.percentage}%` }} />;
                    </div></div>
                </div>
            )
        ) : (
            <div ref={ref} onClick={() => onClickHandler()} className={focused ? "seeall-card-focused" : "seeall-card"}>
                See All
            </div>
        )
    )
}

export default CardDetails