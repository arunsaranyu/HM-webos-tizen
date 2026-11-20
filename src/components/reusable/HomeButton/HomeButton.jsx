import { useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import React from 'react'
import btn_watchNow_inactive from "../../../assets/images/icon_play_default.svg";
import btn_watchNow_active from "../../../assets/images/icon_play_focused.svg";
const HomeButton = (props) => {
    const { onEnterPress, renderPreview, onFocus } = props
    const { ref, focused } = useFocusable({ onEnterPress, onFocus,
        focusKey: props.focusKey,
        trackChildren: true
     })
    const onClickPress = () => {
        renderPreview()
    }
    return (
        <div className="home-banner" style={focused ? { border:'2px solid #F5841F' }:{}}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <img className='home-banner-button-img' src={focused ? btn_watchNow_active : btn_watchNow_inactive} alt="" />
                <div>
                    <h1 ref={ref} onClick={() => onClickPress()} className={focused ? 'button-name-focused' : "button-name"}> Watch Now</h1>
                </div>
            </div>
        </div>
    

    )
}

export default HomeButton