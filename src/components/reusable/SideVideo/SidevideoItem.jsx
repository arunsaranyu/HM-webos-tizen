import React, { useEffect, useState } from "react";
import placeholder16_9 from "../../../assets/images/placeholder16_9.png";
import {useFocusable} from "@noriginmedia/norigin-spatial-navigation"
import { useDispatch } from "react-redux";
import tag_premium from "../../../assets/images/tag_premium.svg"
// import { updategetRecommendation } from "../../../Redux/reducer/DetailsReducer.jsx";
import { useParams } from "react-router";
// import { updategetRecommendation } from "../../../Redux/reducer/DetailsReducer.jsx";
import seeall_img from "../../../assets/images/16_9_seeall.svg"
const SidevideoItem = (props) => {
 const dispatch=useDispatch()
 const {catalog_id ,geners}=useParams()
  const { data,onFocus,onEnterPress,count,updatesetcount, onArrowPress,index,from, renderDetails} = props;

  const { ref,focused}=useFocusable({onFocus, onArrowPress,onEnterPress})
  const imageOnError16x9 = (event) => {
    event.currentTarget.src = placeholder16_9;
  };
  const handleClick = () => {
    renderDetails(data,index)   
}


useEffect(()=>{
  
if(index==(12*count) && from=="recommanded"  && focused){
 updatesetcount()

  const recommandparam={
    catalog_id:catalog_id,
    geners:geners,
    count:count
  }

  //  dispatch(updategetRecommendation(recommandparam))
}
 },[focused])
  var release_date
  var formattedDate
  if(!!data){
    release_date=data.release_date_string
    if(release_date!=""){
     formattedDate = new Date(release_date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
    }
    else{
      formattedDate=""
    }
  }

  return (
    data.theme!=='seeall' ? (
    <div onClick={handleClick} 
      ref={ref} index={index}
      className={focused?"videocard-focus":"video-card1"}
    >

    {
      data?.access_control?.is_free == false ? <img id="premium-tag-seeall" src={tag_premium} alt="" /> : ""
    }
     
        {!!data.thumbnails &&
          (data.thumbnails.medium_16_9 ? (
            <img
              src={data.thumbnails.medium_16_9.url} alt="" loading="lazy"
              onError={imageOnError16x9}
            />
          ) : data.thumbnails.xl_image_16_9 ? (
            <img
              src={data.thumbnails.xl_image_16_9.url}
              alt="" loading="lazy" onError={imageOnError16x9}
            />
          ) : (
            <img src={placeholder16_9} alt="" loading="lazy" />
          ))}
      <div className="sidevideo-description1">
        <h1>{data.title}</h1>
        <h3>{formattedDate}</h3>
      </div>
    </div>
    ):(
      <div onClick={handleClick} 
      ref={ref} index={index}
      className={focused?"videocard-focus":"video-card1"}
    >
      {/* <img
        src={seeall_img} alt="" loading="lazy"
      />    */}
      <div className="sidevideo-description1">
        <h1 style={{paddingTop:'1.5rem',marginLeft:'70%'}}>See All</h1>
      </div>
    </div>
    )
  );
};

export default SidevideoItem;
