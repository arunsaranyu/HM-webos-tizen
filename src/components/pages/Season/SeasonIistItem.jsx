import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sidebarDisable,
  sidebarAllow,
} from "../../../redux/reducer/landingReducer.jsx";
import { activeIndexSeason, getSeason } from '../../../redux/reducer/seasonReducer.jsx'
import { useParams } from "react-router-dom";
const SeasonIistItem = (props) => {
  const { onFocus, data, title, focuseditem, onEnterPress, onEnterSeasonList} =
    props;
  const {catalog_object_friendly_id,friendly_id} = useParams();
  const dispatch = useDispatch();
  const { ref, focused } = useFocusable({ onFocus, onEnterPress});
  const activeTitle=useSelector((state)=> state?.season?.seasonIndex);
  console.log(activeTitle)
  useEffect(()=>{
    dispatch(sidebarDisable())
  },[]);

  const onEnterList = () => {
    onEnterSeasonList(data);
  };
 
  const stylee= activeTitle===data.title? 'yes':'no'
  return (
    <div ref={ref} onClick={onEnterList}>
      <div className={focused ? "season-item-focused" : "season-item"} style={stylee == 'yes'? {border:'2px solid #F5841F',color:'#e1e1e2'} :{}}>
        {!!data &&  (
          <>
            {!!data.title ? (
              <div style={stylee == 'yes'? {color:'#e1e1e2'} :{}}>{data.title}</div>
            ) : (
              <div style={stylee == 'yes'? {color:'#e1e1e2'} :{}}>Episode</div>
            )}
            <div style={stylee == 'yes'? {color:'#e1e1e2'} :{}}>{data?.total_items_count}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default SeasonIistItem;