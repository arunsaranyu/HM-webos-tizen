import React, { useEffect, useRef, useState } from "react";
import "./UserDetails.scss";
import { useDispatch, useSelector } from "react-redux";
import { useFocusable ,FocusContext} from "@noriginmedia/norigin-spatial-navigation";
// import { deleteaccount } from "../../../Redux/reducer/signInReducer.jsx";
import { useNavigate } from "react-router-dom";
// import Popup from "../../../helpers/modals/Popup.jsx";

const UserDetailsContent = (props) => {

  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const{onEnterPress,toggleDeletePopup,each,onFocus}=props
  const {ref ,focused,}  =useFocusable({onEnterPress,onFocus})
  const onclickhandler=()=>{
    toggleDeletePopup(each)
  }
  return (
      <div ref={ref}>
      <button className={focused?"userdetails-button-focused":""} type="button" onClick={onclickhandler} style={{marginTop:'0',marginLeft:'0'}}>{each.text}</button>
      </div>
   
  );
};

export default UserDetailsContent;

