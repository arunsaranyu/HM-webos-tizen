import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFocusable, FocusContext } from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate } from "react-router-dom";
import './Profile.scss';
import { imageFocus } from "../../../redux/reducer/profileReducer.jsx";

const ProfileImage = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { onEnterPress, handleClickFunc, each, index, onFocus } = props
    const { ref, focused } = useFocusable({ onFocus, onEnterPress })
    const handleClick = (each, index) => {
        handleClickFunc(each, index)
    }

    useEffect(() => {

        if (focused === true) {
            dispatch(imageFocus(each.id))
        }
        if (each.default == "true") {
            localStorage.setItem("default_id", each.id)
        }

    }, [focused]);
    const active = useSelector((state) => state?.profile?.activeprofile);
    const design = active === each.id ? 'yes' : 'no'
    return (
        <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            <div className={focused ? 'profile-button-focused' : 'profile-button'} onClick={() => handleClick(each, index)} style={focused ? { border: '4px solid white' } : design == 'yes' ? { border: '4px solid #F5841F' } : {}}>
                <img src={each.img_src} />
            </div>
        </div>
    );
}

export default ProfileImage