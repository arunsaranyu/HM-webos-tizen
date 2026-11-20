import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { activeIndexEpisode } from "../../../redux/reducer/seasonReducer.jsx";

export const EpisodeButton = (props) => {
  const { data, onEnterPress, renderDetails, index, onFocus } = props;
  const SeasonData = useSelector((state) => state?.season?.data);
  const episodeTitle = useSelector((state) => state?.season?.episodeIndex)

  

  const stylee = episodeTitle === data.title ? 'yes' : 'no'

  const { ref, focused } = useFocusable({ onEnterPress, onFocus });
  const onClickHandler = () => {
    // dispatch(activeIndexEpisode(data.title))
  
    renderDetails(SeasonData,index,data);
  };
  useEffect(()=>{
    if(focused==true){
      localStorage.setItem("focusedelement","episodebutton")
    }
  },[focused])
  return (
    <div
      ref={ref}
      style={stylee == 'yes' ? {border:'2px solid #F5841F',color:'#e1e1e2'} : {}}
      onClick={() => onClickHandler(data, index)}
      className={focused ? "season-button-focused" : "season-button"}
    >
      <p>{data.title}</p>
    </div>
  );
};
